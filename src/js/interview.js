// ReelLife Interview Client
// Connects to backend API with AWS Bedrock (Anthropic Claude)

const API_BASE_URL = 'http://localhost:3000/api';

class InterviewClient {
  constructor() {
    this.sessionId = null;
    this.isRecording = false;
    this.conversationHistory = [];
    this.recognition = null;
    this.initSpeechRecognition();
  }

  // Initialize speech recognition (Web Speech API)
  initSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      // Update UI with transcript
      if (finalTranscript) {
        this.addUserMessage(finalTranscript.trim());
        this.sendResponse(finalTranscript.trim());
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };
  }

  // Start interview session
  async startInterview(mode) {
    try {
      const response = await fetch(`${API_BASE_URL}/interview/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: mode || 'Life Period',
          userId: 'user_' + Date.now(), // In production, use real user ID
        }),
      });

      const data = await response.json();

      if (data.success) {
        this.sessionId = data.sessionId;
        this.addAssistantMessage(data.question);
        console.log('✅ Interview started:', this.sessionId);
        return data.question;
      } else {
        throw new Error(data.error || 'Failed to start interview');
      }
    } catch (error) {
      console.error('Error starting interview:', error);
      this.showError('Failed to start interview. Please check if the server is running.');
      throw error;
    }
  }

  // Send user response and get next question
  async sendResponse(response) {
    if (!this.sessionId) {
      console.error('No active session');
      return;
    }

    try {
      // Show loading indicator
      this.showTypingIndicator();

      const apiResponse = await fetch(`${API_BASE_URL}/interview/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
          response: response,
        }),
      });

      const data = await apiResponse.json();

      // Hide loading indicator
      this.hideTypingIndicator();

      if (data.success) {
        this.addAssistantMessage(data.question);
        return data.question;
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending response:', error);
      this.hideTypingIndicator();
      this.showError('Failed to get next question. Please try again.');
      throw error;
    }
  }

  // End interview
  async endInterview() {
    if (!this.sessionId) {
      console.error('No active session');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/interview/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Interview ended');
        console.log('Story:', data.story);
        return data;
      } else {
        throw new Error(data.error || 'Failed to end interview');
      }
    } catch (error) {
      console.error('Error ending interview:', error);
      this.showError('Failed to end interview properly.');
      throw error;
    }
  }

  // Start/stop recording
  toggleRecording() {
    if (!this.recognition) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    if (this.isRecording) {
      this.recognition.stop();
      this.isRecording = false;
    } else {
      this.recognition.start();
      this.isRecording = true;
    }

    return this.isRecording;
  }

  // Add user message to chat
  addUserMessage(text) {
    const chatContainer = document.querySelector('.chat-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message answer';
    messageDiv.innerHTML = `
      <div class="message-bubble">${this.escapeHtml(text)}</div>
    `;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    this.conversationHistory.push({
      role: 'user',
      content: text,
    });
  }

  // Add assistant message to chat
  addAssistantMessage(text) {
    const chatContainer = document.querySelector('.chat-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message question';
    messageDiv.innerHTML = `
      <div class="message-bubble">${this.escapeHtml(text)}</div>
    `;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    this.conversationHistory.push({
      role: 'assistant',
      content: text,
    });
  }

  // Show typing indicator
  showTypingIndicator() {
    const chatContainer = document.querySelector('.chat-container');
    const indicator = document.createElement('div');
    indicator.className = 'message question typing-indicator';
    indicator.id = 'typingIndicator';
    indicator.innerHTML = `
      <div class="message-bubble">
        <div class="loading-indicator">
          <span class="loading-dots">
            <span class="loading-dot"></span>
            <span class="loading-dot"></span>
            <span class="loading-dot"></span>
          </span>
        </div>
      </div>
    `;
    chatContainer.appendChild(indicator);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  // Hide typing indicator
  hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
      indicator.remove();
    }
  }

  // Show error message
  showError(message) {
    const chatContainer = document.querySelector('.chat-container');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'message error';
    errorDiv.innerHTML = `
      <div class="message-bubble" style="background: #fee; color: #c00; border: 1px solid #fcc;">
        ⚠️ ${this.escapeHtml(message)}
      </div>
    `;
    chatContainer.appendChild(errorDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  // Escape HTML to prevent XSS
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Export for use in interview page
window.InterviewClient = InterviewClient;
