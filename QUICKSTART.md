# ReelLife Interview - Quick Start Guide

## ⚡ Get AI Interviews Running in 5 Minutes

### Prerequisites
- AWS Account
- Node.js installed
- Your AWS credentials ready

---

## 🚀 Quick Setup

### 1. Enable AWS Bedrock (2 minutes)

```bash
# Go to AWS Console
1. Search for "Bedrock"
2. Click "Model access" → "Manage model access"
3. Check "Claude 3.5 Sonnet v2"
4. Click "Request model access"
5. Wait for "Access granted" status
```

### 2. Get AWS Credentials (2 minutes)

```bash
# Create IAM user with Bedrock access
1. AWS Console → IAM → Users → Create user
2. User name: reellife-api
3. Attach policy: Create inline policy with this JSON:

{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["bedrock:InvokeModel"],
    "Resource": "arn:aws:bedrock:*::foundation-model/anthropic.claude-*"
  }]
}

4. Create user → Security credentials → Create access key
5. Copy: Access Key ID and Secret Access Key
```

### 3. Configure ReelLife (1 minute)

```bash
# Edit config.json
cd /Users/rosie/Work/ReelLife
nano config.json

# Replace these values:
{
  "aws": {
    "region": "us-east-1",
    "credentials": {
      "accessKeyId": "AKIA...",        ← Your Access Key ID
      "secretAccessKey": "..."          ← Your Secret Key
    }
  },
  ...
}

# Save and exit (Ctrl+X, Y, Enter)
```

### 4. Install & Start (1 minute)

```bash
# Terminal 1: Start Backend
cd /Users/rosie/Work/ReelLife
npm install
npm start

# Terminal 2: Start Frontend  
cd /Users/rosie/Work/ReelLife/src
python3 -m http.server 8000
```

### 5. Test It! (1 minute)

```bash
# Open browser
http://localhost:8000

# Click: Sign In → Tell Your Story → Select Mode → Start Interview
# Claude will ask you the first question! 🎉
```

---

## ✅ Verify Setup

### Test 1: Health Check
```bash
curl http://localhost:3000/health
# Should return: {"status":"ok"}
```

### Test 2: API Test
```bash
curl -X POST http://localhost:3000/api/interview/start \
  -H "Content-Type: application/json" \
  -d '{"mode":"Life Period","userId":"test"}'
  
# Should return JSON with "success":true and a question
```

### Test 3: Full Interview
1. Go to http://localhost:8000
2. Navigate: Tell Your Story → Life Period → Upload (skip) → Start Interview
3. See Claude's first question
4. Click microphone or type response
5. Get next question from Claude

---

## 🎯 What You Get

### Interview Features
- ✅ Real-time AI conversation with Claude
- ✅ 5 specialized interview modes
- ✅ Voice recording or text input
- ✅ Automatic story generation
- ✅ Context-aware follow-up questions

### Interview Modes
1. **Life Period** - Childhood, college, career stages
2. **Major Event** - Wedding, graduation, immigration
3. **Journey** - Travel, personal growth experiences
4. **Relationship** - Important people in your life
5. **Wisdom** - Life lessons for future generations

---

## 💰 Cost

**Per Interview:**
- ~10 minute interview: $0.03
- Story generation: $0.04
- **Total: ~$0.07 per interview**

**Monthly:**
- 10 interviews: $0.70
- 100 interviews: $7.00
- 1,000 interviews: $70.00

---

## 🔧 Troubleshooting

### "Failed to start interview"
```bash
# Backend not running?
cd /Users/rosie/Work/ReelLife
npm start
```

### "Access Denied"
```bash
# Check credentials in config.json
# Verify IAM user has bedrock:InvokeModel permission
```

### "Model not found"
```bash
# Enable Claude in Bedrock:
# AWS Console → Bedrock → Model access → Enable Claude
```

### "CORS error"
```bash
# Check config.json has:
"cors": { "origin": "http://localhost:8000" }
```

---

## 📚 Full Documentation

- **Complete Setup:** See `API_SETUP.md`
- **Server Details:** See `server/README.md`
- **Development:** See `DEVELOPMENT.md`

---

## 🎓 Next Steps

1. ✅ Complete setup above
2. ✅ Test your first interview
3. 🎯 Customize interview prompts (`server/src/server.js`)
4. 🎯 Add user authentication
5. 🎯 Deploy to production
6. 🎯 Add more interview modes

---

## 📞 Quick Commands

```bash
# Start everything
cd /Users/rosie/Work/ReelLife && npm start &
cd /Users/rosie/Work/ReelLife/src && python3 -m http.server 8000

# Test API
curl http://localhost:3000/health

# View logs
tail -f server/logs/src/server.log

# Stop servers
# Press Ctrl+C in both terminal windows
```

---

**That's it! Your AI interview feature is ready! 🚀**

Start interviewing at: http://localhost:8000
