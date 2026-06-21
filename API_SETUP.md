# ReelLife API Setup Guide

Complete guide to set up the ReelLife interview feature with AWS Bedrock and Anthropic Claude.

## Quick Start (5 Minutes)

1. **Install Node.js** (if not already installed)
2. **Configure AWS credentials**
3. **Install dependencies**
4. **Start the server**
5. **Test the interview**

---

## Detailed Setup Instructions

### Step 1: AWS Bedrock Setup

#### 1.1 Create AWS Account
- Go to [aws.amazon.com](https://aws.amazon.com)
- Sign up or log in

#### 1.2 Enable Bedrock Model Access

1. Go to **AWS Console** → Search for "Bedrock"
2. Click **Model access** in the left sidebar
3. Click **Manage model access**
4. Find **Anthropic** section
5. Check the box for:
   - ✅ **Claude 3.5 Sonnet v2**
   - ✅ **Claude 3.5 Sonnet** (optional)
   - ✅ **Claude 3 Haiku** (optional, cheaper)
6. Click **Request model access**
7. Wait for status to change to **"Access granted"** (usually instant)

#### 1.3 Create IAM User for API Access

1. Go to **AWS Console** → **IAM** → **Users**
2. Click **Create user**
3. User name: `reellife-api`
4. Click **Next**
5. Select **Attach policies directly**
6. Click **Create policy** (opens new tab)
7. Paste this policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "BedrockInvokeModel",
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": [
        "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-5-sonnet*",
        "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-sonnet*",
        "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-haiku*"
      ]
    }
  ]
}
```

8. Name it: `BedrockInvokeModelPolicy`
9. Create policy
10. Go back to user creation tab
11. Refresh policies and search for `BedrockInvokeModelPolicy`
12. Select it and click **Next**
13. Click **Create user**

#### 1.4 Get Access Keys

1. Click on the created user
2. Go to **Security credentials** tab
3. Scroll to **Access keys**
4. Click **Create access key**
5. Select **Application running outside AWS**
6. Click **Next** → **Create access key**
7. **IMPORTANT:** Save both:
   - Access key ID (starts with AKIA...)
   - Secret access key (only shown once!)
8. Click **Download .csv file** (backup)

---

### Step 2: Install Backend Dependencies

```bash
# Navigate to server directory
cd /Users/rosie/Work/ReelLife/server

# Install Node.js packages
npm install
```

This installs:
- `express` - Web server
- `@aws-sdk/client-bedrock-runtime` - AWS Bedrock SDK
- `cors` - Cross-origin requests
- `body-parser` - Parse JSON requests

---

### Step 3: Configure Credentials

#### Option A: Using config.json (Development)

1. Open `/Users/rosie/Work/ReelLife/config.json`
2. Replace the credentials:

```json
{
  "aws": {
    "region": "us-east-1",
    "credentials": {
      "accessKeyId": "AKIA...",  // Your Access Key ID
      "secretAccessKey": "..."    // Your Secret Access Key
    }
  },
  "anthropic": {
    "modelId": "anthropic.claude-3-5-sonnet-20241022-v2:0",
    "maxTokens": 2048,
    "temperature": 0.7,
    "topP": 0.9
  },
  "server": {
    "port": 3000,
    "cors": {
      "origin": "http://localhost:8000",
      "credentials": true
    }
  }
}
```

#### Option B: Using Environment Variables (Production)

1. Create `.env` file in server directory:

```bash
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
ANTHROPIC_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0
PORT=3000
```

2. Update `server.js` to read from `.env` (already configured)

**Security Note:** Never commit `config.json` or `.env` to git!

---

### Step 4: Start the Servers

#### Terminal 1: Backend API Server

```bash
cd /Users/rosie/Work/ReelLife/server
npm start
```

You should see:
```
🚀 ReelLife API server running on http://localhost:3000
📍 AWS Region: us-east-1
🤖 Model: anthropic.claude-3-5-sonnet-20241022-v2:0
✅ Ready to conduct interviews with Claude!
```

#### Terminal 2: Frontend Web Server

```bash
cd /Users/rosie/Work/ReelLife/src
python3 -m http.server 8000
```

---

### Step 5: Test the Integration

#### Test 1: Health Check

```bash
curl http://localhost:3000/health
```

Expected:
```json
{"status":"ok","message":"ReelLife API is running"}
```

#### Test 2: Start Interview via API

```bash
curl -X POST http://localhost:3000/api/interview/start \
  -H "Content-Type: application/json" \
  -d '{"mode":"Life Period","userId":"test123"}'
```

Expected:
```json
{
  "success": true,
  "sessionId": "session_...",
  "question": "Let's begin by talking about this period..."
}
```

#### Test 3: Full Interview via Website

1. Open http://localhost:8000
2. Click "Create Account" or "Sign In"
3. Navigate to "Tell Your Story"
4. Select any interview mode
5. Click "Next: Start Interview"
6. You should see Claude asking you the first question!

---

## Usage Guide

### Starting an Interview

1. **Choose Mode**: Select from 5 interview types
2. **Upload Memories** (optional): Add photos, videos, documents
3. **Start Interview**: Click "Start Interview" button
4. **Answer Questions**: Speak or type responses
5. **Natural Flow**: Claude adapts questions based on your answers
6. **End When Ready**: Click "End" button
7. **View Story**: See your interview transformed into a narrative

### Interview Modes

| Mode | Best For | Example Questions |
|------|----------|-------------------|
| **Life Period** | Childhood, college years, career phase | "What was it like growing up in...?" |
| **Major Event** | Wedding, immigration, graduation | "How did you feel when...?" |
| **Journey** | Travel, personal growth | "What inspired you to take this journey?" |
| **Relationship** | Family, mentors, friends | "How did you first meet...?" |
| **Wisdom** | Life lessons, advice | "What would you tell your younger self?" |

---

## Troubleshooting

### ❌ "Failed to start interview"

**Cause:** Backend server not running or not accessible

**Solution:**
```bash
# Check if server is running
curl http://localhost:3000/health

# If not, start it
cd /Users/rosie/Work/ReelLife/server
npm start
```

---

### ❌ "Access Denied" from AWS

**Cause:** Invalid credentials or insufficient permissions

**Solution:**
1. Verify credentials in `config.json` are correct
2. Check IAM user has `bedrock:InvokeModel` permission
3. Test credentials with AWS CLI:
```bash
aws bedrock list-foundation-models --region us-east-1
```

---

### ❌ "Model not found"

**Cause:** Model not enabled in Bedrock

**Solution:**
1. Go to AWS Console → Bedrock → Model access
2. Enable "Anthropic Claude 3.5 Sonnet"
3. Wait for status: "Access granted"

---

### ❌ "CORS error"

**Cause:** Frontend and backend on different origins

**Solution:**
1. Make sure frontend is on `http://localhost:8000`
2. Make sure backend CORS is configured for that origin
3. Check `config.json`:
```json
"cors": {
  "origin": "http://localhost:8000"
}
```

---

### ❌ "Speech recognition not supported"

**Cause:** Browser doesn't support Web Speech API

**Solution:**
- Use Chrome or Edge (Safari has limited support)
- Or click the CC button to type responses manually

---

## Architecture

```
┌─────────────────┐
│   Browser       │
│  (Frontend)     │
│  localhost:8000 │
└────────┬────────┘
         │ HTTP
         │
         ▼
┌─────────────────┐
│  Express.js     │
│  (Backend API)  │
│  localhost:3000 │
└────────┬────────┘
         │ AWS SDK
         │
         ▼
┌─────────────────┐
│  AWS Bedrock    │
│  (Anthropic)    │
│  Claude AI      │
└─────────────────┘
```

### Data Flow

1. **User speaks** → Web Speech API transcribes
2. **Frontend sends** text to backend API
3. **Backend calls** AWS Bedrock with conversation history
4. **Claude generates** next question
5. **Backend returns** question to frontend
6. **Frontend displays** question and waits for answer
7. **Repeat** until interview ends
8. **Generate story** from full transcript

---

## API Reference

### Endpoints

#### `POST /api/interview/start`
Start new interview session

**Body:**
```json
{
  "mode": "Life Period",
  "userId": "user123"
}
```

#### `POST /api/interview/respond`
Send response, get next question

**Body:**
```json
{
  "sessionId": "session_xxx",
  "response": "I was born in 1980..."
}
```

#### `POST /api/interview/end`
End interview, generate story

**Body:**
```json
{
  "sessionId": "session_xxx"
}
```

---

## Cost Estimation

### AWS Bedrock Pricing

**Claude 3.5 Sonnet:**
- Input tokens: $3.00 per 1M tokens
- Output tokens: $15.00 per 1M tokens

**Typical Interview (10 minutes):**
- Input: ~2,500 tokens (your responses)
- Output: ~1,500 tokens (Claude's questions)
- **Cost: ~$0.03 per interview**

**Story Generation:**
- Input: ~3,000 tokens (transcript)
- Output: ~2,000 tokens (story)
- **Cost: ~$0.04 per story**

**Total: ~$0.07 per complete interview + story**

### Monthly Estimates

| Usage | Interviews/Month | Estimated Cost |
|-------|------------------|----------------|
| Light | 10 | $0.70 |
| Medium | 100 | $7.00 |
| Heavy | 1,000 | $70.00 |
| Platform | 10,000 | $700.00 |

---

## Production Checklist

Before deploying to production:

- [ ] Move credentials to environment variables
- [ ] Add user authentication
- [ ] Implement database for session persistence
- [ ] Add rate limiting
- [ ] Set up HTTPS
- [ ] Configure logging and monitoring
- [ ] Add error tracking (Sentry, etc.)
- [ ] Implement backup system
- [ ] Test under load
- [ ] Document API for users
- [ ] Set up CI/CD pipeline
- [ ] Configure auto-scaling
- [ ] Add health checks and alerts

---

## Next Steps

1. ✅ Set up AWS Bedrock access
2. ✅ Configure credentials
3. ✅ Start the servers
4. ✅ Test with your first interview
5. 🎯 Customize interview prompts
6. 🎯 Add more interview modes
7. 🎯 Implement user authentication
8. 🎯 Deploy to production

---

## Support

**Documentation:**
- [AWS Bedrock Docs](https://docs.aws.amazon.com/bedrock/)
- [Anthropic API Docs](https://docs.anthropic.com/)
- [Express.js Docs](https://expressjs.com/)

**Need Help?**
- Check server logs: `tail -f logs/server.log`
- Test API with Postman
- Review network tab in browser DevTools

---

**Your interview feature is now connected to Claude AI! 🎉**
