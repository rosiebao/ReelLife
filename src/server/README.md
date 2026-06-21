# ReelLife Interview API

Backend API server that connects the ReelLife interview feature to Anthropic's Claude AI via AWS Bedrock.

## Features

- 🤖 **AI-Powered Interviews**: Claude conducts thoughtful, empathetic interviews
- 📝 **Story Generation**: Automatically transforms interviews into narrative stories
- 🎤 **Real-time Conversation**: Maintains context throughout the interview
- 🔒 **Secure**: Uses AWS credentials for authenticated API access
- 💾 **Session Management**: Tracks multiple concurrent interviews

## Prerequisites

Before running this server, you need:

1. **Node.js** (v18 or higher)
2. **AWS Account** with Bedrock access
3. **Anthropic Claude Model** enabled in AWS Bedrock
4. **AWS Credentials** with appropriate permissions

## AWS Bedrock Setup

### 1. Enable Model Access

1. Go to AWS Console → Bedrock → Model Access
2. Request access to: **Anthropic Claude 3.5 Sonnet**
3. Wait for approval (usually instant for Claude models)

### 2. Create IAM User

Create an IAM user with these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": "arn:aws:bedrock:*::foundation-model/anthropic.claude-*"
    }
  ]
}
```

### 3. Get Credentials

1. Create access keys for the IAM user
2. Save the **Access Key ID** and **Secret Access Key**

## Installation

1. **Navigate to server directory:**
   ```bash
   cd /Users/rosie/Work/ReelLife/src/server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure AWS credentials:**

   Edit `/Users/rosie/Work/ReelLife/config.json`:

   ```json
   {
     "aws": {
       "region": "us-east-1",
       "credentials": {
         "accessKeyId": "YOUR_AWS_ACCESS_KEY_ID",
         "secretAccessKey": "YOUR_AWS_SECRET_ACCESS_KEY"
       }
     },
     ...
   }
   ```

   **Important:** Keep this file secure! Add it to `.gitignore`.

4. **Verify configuration:**
   ```bash
   node -e "const c = require('../config.json'); console.log('Region:', c.aws.region, '✓')"
   ```

## Deployment Modes

ReelLife supports **two deployment modes**:

| Mode | Credentials | Command | Best For |
|------|-------------|---------|----------|
| **Development** | config.json | `npm run dev` | Local development |
| **Production** | IAM Role | `npm run prod` | AWS deployment (EC2, ECS, Lambda) |

See [DEPLOYMENT_MODES.md](../DEPLOYMENT_MODES.md) for complete guide.

## Usage

### Start the Server

**Development mode** (uses config.json):
```bash
npm run dev
# or
./start-dev.sh
```

**Production mode** (uses IAM Role):
```bash
npm run prod
# or
./start-prod.sh
```

**Quick start** (auto-detects mode):
```bash
npm start
```

You should see:
```
🚀 ReelLife API server running on http://localhost:3000
📍 AWS Region: us-east-1
🤖 Model: anthropic.claude-3-5-sonnet-20241022-v2:0
✅ Ready to conduct interviews with Claude!
```

### Test the Server

**Health check:**
```bash
curl http://localhost:3000/health
```

**Start an interview:**
```bash
curl -X POST http://localhost:3000/api/interview/start \
  -H "Content-Type: application/json" \
  -d '{"mode": "Life Period", "userId": "test_user"}'
```

## API Endpoints

### `POST /api/interview/start`

Start a new interview session.

**Request:**
```json
{
  "mode": "Life Period",
  "userId": "user123"
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "session_1234567890_abc123",
  "question": "Let's begin by talking about this period of your life. Can you tell me when this was and what was happening in your life at that time?"
}
```

### `POST /api/interview/respond`

Send user response and get next question.

**Request:**
```json
{
  "sessionId": "session_1234567890_abc123",
  "response": "It was in 1998, when I first moved to Seattle..."
}
```

**Response:**
```json
{
  "success": true,
  "question": "What made you decide to move to Seattle? Was this something you had been planning for a long time?",
  "conversationLength": 3
}
```

### `POST /api/interview/end`

End interview and generate story.

**Request:**
```json
{
  "sessionId": "session_1234567890_abc123"
}
```

**Response:**
```json
{
  "success": true,
  "transcript": [...],
  "story": "I arrived in Seattle on a rainy March day in 1998...",
  "duration": 324
}
```

## Interview Modes

The API supports 5 different interview modes:

1. **Life Period** - Memories from a specific stage of life
2. **Major Event** - Important events or milestones
3. **Journey** - Meaningful journeys or experiences
4. **Relationship** - Stories about important people
5. **Wisdom** - Life lessons and advice for future generations

Each mode uses a specialized system prompt to guide Claude's interview style.

## Configuration Options

Edit `config.json` to customize:

```json
{
  "aws": {
    "region": "us-east-1"  // AWS region with Bedrock access
  },
  "anthropic": {
    "modelId": "anthropic.claude-3-5-sonnet-20241022-v2:0",  // Model version
    "maxTokens": 2048,      // Max response length
    "temperature": 0.7,     // Creativity (0-1)
    "topP": 0.9            // Nucleus sampling
  },
  "server": {
    "port": 3000,          // Server port
    "cors": {
      "origin": "http://localhost:8000",  // Frontend URL
      "credentials": true
    }
  }
}
```

## Available Models

You can use any Anthropic Claude model available in Bedrock:

- `anthropic.claude-3-5-sonnet-20241022-v2:0` (Recommended - Latest)
- `anthropic.claude-3-5-sonnet-20240620-v1:0`
- `anthropic.claude-3-sonnet-20240229-v1:0`
- `anthropic.claude-3-haiku-20240307-v1:0` (Faster, cheaper)
- `anthropic.claude-3-opus-20240229-v1:0` (Most capable)

## Troubleshooting

### "Access denied" errors

**Problem:** AWS credentials don't have Bedrock permissions

**Solution:**
1. Check IAM user has `bedrock:InvokeModel` permission
2. Verify credentials are correct in `config.json`
3. Ensure you're using the right AWS region

### "Model not found" errors

**Problem:** Model not enabled in your AWS account

**Solution:**
1. Go to AWS Console → Bedrock → Model Access
2. Enable Anthropic Claude models
3. Wait for approval status to change to "Access granted"

### Connection refused

**Problem:** Server not running

**Solution:**
```bash
cd /Users/rosie/Work/ReelLife/src/server
npm start
```

### CORS errors

**Problem:** Frontend can't connect to API

**Solution:**
Make sure `config.json` has correct CORS origin:
```json
"cors": {
  "origin": "http://localhost:8000"
}
```

## Development

### Project Structure

```
server/
├── package.json      # Dependencies
├── server.js         # Main API server
└── README.md        # This file
```

### Add New Features

The server is designed to be easily extensible:

- Add new endpoints in `server.js`
- Modify system prompts for different interview styles
- Implement additional AI features (summarization, translation, etc.)
- Add database integration for persistent storage

### Testing

Test individual endpoints with curl:

```bash
# Start interview
SESSION=$(curl -s -X POST http://localhost:3000/api/interview/start \
  -H "Content-Type: application/json" \
  -d '{"mode":"Life Period","userId":"test"}' | jq -r '.sessionId')

# Send response
curl -X POST http://localhost:3000/api/interview/respond \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\":\"$SESSION\",\"response\":\"I was born in 1980...\"}"
```

## Security Best Practices

1. **Never commit credentials** to git
2. **Use environment variables** in production
3. **Rotate AWS keys** regularly
4. **Implement rate limiting** for production
5. **Add authentication** for user-specific interviews
6. **Use HTTPS** in production

## Production Deployment

For production deployment:

1. Use environment variables instead of `config.json`
2. Add authentication middleware
3. Implement database for session persistence
4. Set up logging and monitoring
5. Use a process manager (PM2, systemd)
6. Configure reverse proxy (nginx)
7. Enable HTTPS

## Cost Estimation

AWS Bedrock pricing for Claude (as of 2024):

**Claude 3.5 Sonnet:**
- Input: $3 per 1M tokens
- Output: $15 per 1M tokens

**Typical Interview:**
- ~3,000 input tokens (conversation)
- ~1,000 output tokens (questions)
- Cost: ~$0.024 per interview

Story generation adds ~$0.06-0.10 per story.

## Support

For issues:
1. Check the [AWS Bedrock documentation](https://docs.aws.amazon.com/bedrock/)
2. Review [Anthropic Claude API docs](https://docs.anthropic.com/)
3. Check server logs: `tail -f logs/src/server.log`

## License

Same as parent project.
