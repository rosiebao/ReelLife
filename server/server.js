import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load configuration
const configPath = path.join(__dirname, '../config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

// Initialize Express app
const app = express();
const PORT = config.server.port || 3000;

// Middleware
app.use(cors(config.server.cors));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize AWS Bedrock client
const bedrockClient = new BedrockRuntimeClient({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.credentials.accessKeyId,
    secretAccessKey: config.aws.credentials.secretAccessKey,
  },
});

// Store active interview sessions (in production, use a database)
const interviewSessions = new Map();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'ReelLife API is running' });
});

// Start a new interview session
app.post('/api/interview/start', async (req, res) => {
  try {
    const { mode, userId } = req.body;

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create system prompt based on interview mode
    const systemPrompts = {
      'Life Period': 'You are a compassionate interviewer helping someone document memories from a specific period of their life. Ask thoughtful, open-ended questions that encourage detailed storytelling. Focus on emotions, sensory details, and significant moments.',
      'Major Event': 'You are conducting an oral history interview about a major life event. Ask questions that help the person explore the before, during, and after of this event, including how it changed them.',
      'Journey': 'You are interviewing someone about a meaningful journey or experience. Ask about their motivations, challenges faced, people encountered, and what they learned along the way.',
      'Relationship': 'You are helping someone preserve memories of an important relationship. Ask about how they met, memorable moments together, what they learned from this person, and the lasting impact.',
      'Wisdom': 'You are conducting a legacy interview focused on life lessons and wisdom. Ask about key learnings, advice for future generations, values that guided them, and what they hope others will remember.',
    };

    const systemPrompt = systemPrompts[mode] || systemPrompts['Life Period'];

    // Initialize session
    const session = {
      id: sessionId,
      mode,
      userId,
      systemPrompt,
      conversationHistory: [],
      created: new Date().toISOString(),
    };

    interviewSessions.set(sessionId, session);

    // Generate first question
    const firstQuestion = await generateQuestion(sessionId, null);

    res.json({
      success: true,
      sessionId,
      question: firstQuestion,
    });
  } catch (error) {
    console.error('Error starting interview:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start interview',
      message: error.message,
    });
  }
});

// Send user response and get next question
app.post('/api/interview/respond', async (req, res) => {
  try {
    const { sessionId, response } = req.body;

    if (!interviewSessions.has(sessionId)) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
      });
    }

    const session = interviewSessions.get(sessionId);

    // Add user response to history
    session.conversationHistory.push({
      role: 'user',
      content: response,
      timestamp: new Date().toISOString(),
    });

    // Generate next question
    const nextQuestion = await generateQuestion(sessionId, response);

    res.json({
      success: true,
      question: nextQuestion,
      conversationLength: session.conversationHistory.length,
    });
  } catch (error) {
    console.error('Error processing response:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process response',
      message: error.message,
    });
  }
});

// End interview and get transcript
app.post('/api/interview/end', async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!interviewSessions.has(sessionId)) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
      });
    }

    const session = interviewSessions.get(sessionId);

    // Generate story from conversation
    const story = await generateStory(session);

    res.json({
      success: true,
      transcript: session.conversationHistory,
      story,
      duration: calculateDuration(session),
    });

    // Clean up session
    interviewSessions.delete(sessionId);
  } catch (error) {
    console.error('Error ending interview:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to end interview',
      message: error.message,
    });
  }
});

// Generate question using Claude
async function generateQuestion(sessionId, userResponse) {
  const session = interviewSessions.get(sessionId);

  // Build conversation for Claude
  const messages = [];

  // Add conversation history
  session.conversationHistory.forEach(entry => {
    messages.push({
      role: entry.role === 'assistant' ? 'assistant' : 'user',
      content: entry.content,
    });
  });

  // Add instruction for next question
  if (session.conversationHistory.length === 0) {
    messages.push({
      role: 'user',
      content: 'Please ask me the first question to begin my story.',
    });
  } else {
    messages.push({
      role: 'user',
      content: 'Based on my previous response, what would you like to know next?',
    });
  }

  // Prepare request for Bedrock
  const requestBody = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: config.anthropic.maxTokens,
    temperature: config.anthropic.temperature,
    top_p: config.anthropic.topP,
    system: session.systemPrompt,
    messages: messages,
  };

  const command = new InvokeModelCommand({
    modelId: config.anthropic.modelId,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(requestBody),
  });

  const response = await bedrockClient.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));

  const question = responseBody.content[0].text;

  // Store assistant's question in history
  session.conversationHistory.push({
    role: 'assistant',
    content: question,
    timestamp: new Date().toISOString(),
  });

  return question;
}

// Generate story from conversation
async function generateStory(session) {
  // Create a summary prompt
  const transcript = session.conversationHistory
    .map(entry => `${entry.role === 'assistant' ? 'Interviewer' : 'Storyteller'}: ${entry.content}`)
    .join('\n\n');

  const messages = [
    {
      role: 'user',
      content: `Please transform the following interview transcript into a compelling first-person narrative story. Maintain the emotional tone, include vivid details, and organize it into coherent paragraphs. The story should read like a personal memoir chapter.\n\nTranscript:\n${transcript}\n\nPlease write the story now:`,
    },
  ];

  const requestBody = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 4096,
    temperature: 0.7,
    system: 'You are a skilled memoir writer who transforms interview transcripts into beautiful, flowing first-person narratives. You preserve the authentic voice and emotions while crafting a compelling story.',
    messages: messages,
  };

  const command = new InvokeModelCommand({
    modelId: config.anthropic.modelId,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(requestBody),
  });

  const response = await bedrockClient.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));

  return responseBody.content[0].text;
}

// Calculate interview duration
function calculateDuration(session) {
  if (session.conversationHistory.length === 0) return 0;

  const start = new Date(session.created);
  const end = new Date();
  const durationMs = end - start;

  return Math.floor(durationMs / 1000); // Return seconds
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ReelLife API server running on http://localhost:${PORT}`);
  console.log(`📍 AWS Region: ${config.aws.region}`);
  console.log(`🤖 Model: ${config.anthropic.modelId}`);
  console.log(`✅ Ready to conduct interviews with Claude!`);
});
