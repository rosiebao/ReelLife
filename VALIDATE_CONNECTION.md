# Validating AWS Bedrock Connection

Guide to test your AWS Bedrock connection before running ReelLife.

---

## 🎯 Purpose

The validation script helps you:
- ✅ Verify AWS credentials are correct
- ✅ Test connection to AWS Bedrock
- ✅ Confirm Claude Sonnet model access
- ✅ Check environment variables are set properly
- ✅ Diagnose connection issues

---

## 🚀 Quick Test

### Prerequisites

1. **Node.js installed** (if not, see [INSTALL_NODEJS.md](INSTALL_NODEJS.md))
2. **AWS credentials ready**

### Run the Test

```bash
# Navigate to project
cd /Users/rosie/Work/ReelLife

# Export your AWS credentials
export AWS_ACCESS_KEY_ID="AKIA..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_REGION="us-east-1"

# Optional: Session token
export AWS_SESSION_TOKEN="..."

# Run test
./test-connection.sh
```

---

## 📊 What the Test Does

### Step 1: Environment Check
Validates that all required environment variables are set:
- `AWS_ACCESS_KEY_ID` ✅
- `AWS_SECRET_ACCESS_KEY` ✅
- `AWS_REGION` ✅
- `AWS_SESSION_TOKEN` (optional)
- `ANTHROPIC_MODEL_ID` (optional, defaults to latest Sonnet)

### Step 2: Connection Test
- Creates AWS Bedrock client
- Sends test prompt to Claude
- Receives and displays response
- Measures response time

### Step 3: Results
- Shows Claude's response
- Displays token usage
- Calculates cost
- Reports success or failure

---

## ✅ Success Output

```
============================================================
  AWS Bedrock Connection Validator
  Testing Claude Sonnet Model Connection
============================================================

Step 1: Validating Environment Variables
------------------------------------------------------------
✅ AWS_ACCESS_KEY_ID: Set
✅ AWS_SECRET_ACCESS_KEY: Set
✅ AWS_REGION: Set
ℹ️  AWS_SESSION_TOKEN: Not set (optional)
ℹ️  ANTHROPIC_MODEL_ID: Not set (optional)

Step 2: Testing AWS Bedrock Connection
------------------------------------------------------------
📍 Region: us-east-1
🤖 Model: anthropic.claude-3-5-sonnet-20241022-v2:0
🎫 Session Token: No

Initializing Bedrock client...
✅ Bedrock client created

Sending test request to Claude...
✅ Response received!

Step 3: Response Details
------------------------------------------------------------
📝 Claude's Response:
   "Connection successful!"

⏱️  Response Time: 1234ms
📊 Stop Reason: end_turn
🔢 Input Tokens: 25
🔢 Output Tokens: 8

💰 Cost for this test: $0.000195

============================================================
  Test Summary
============================================================

✅ SUCCESS! Connection to AWS Bedrock is working!

Next steps:
  1. Your credentials are working correctly
  2. You can now start the ReelLife server
  3. Run: ./start-dev.sh

============================================================
```

---

## ❌ Common Errors

### 1. Missing Environment Variables

**Error:**
```
❌ AWS_ACCESS_KEY_ID: Missing
❌ AWS_SECRET_ACCESS_KEY: Missing
```

**Solution:**
```bash
export AWS_ACCESS_KEY_ID="AKIA..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_REGION="us-east-1"
```

---

### 2. AccessDeniedException

**Error:**
```
❌ Connection failed!
Type: AccessDeniedException
Message: User is not authorized to perform: bedrock:InvokeModel
```

**Solution:**
1. Check IAM user has `bedrock:InvokeModel` permission
2. Verify credentials are correct
3. Enable Bedrock model access in AWS Console

See [API_SETUP.md](API_SETUP.md) for IAM policy setup.

---

### 3. ResourceNotFoundException

**Error:**
```
❌ Connection failed!
Type: ResourceNotFoundException
Message: Could not find the specified model
```

**Solution:**
1. Enable model access in AWS Bedrock console
2. Go to AWS Console → Bedrock → Model access
3. Enable "Anthropic Claude 3.5 Sonnet"
4. Wait for "Access granted" status

---

### 4. ExpiredTokenException

**Error:**
```
❌ Connection failed!
Type: ExpiredTokenException
Message: The security token included in the request is expired
```

**Solution:**
```bash
# Get new session token
aws sts get-session-token

# Export new credentials
export AWS_ACCESS_KEY_ID="ASIA..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_SESSION_TOKEN="..."

# Run test again
./test-connection.sh
```

---

### 5. Node.js Not Found

**Error:**
```
❌ Error: Node.js is not installed!
```

**Solution:**
```bash
# Install Node.js
brew install node

# Verify
node --version

# Run test again
./test-connection.sh
```

See [INSTALL_NODEJS.md](INSTALL_NODEJS.md) for detailed instructions.

---

## 🔧 Advanced Usage

### Test with Specific Model

```bash
export ANTHROPIC_MODEL_ID="anthropic.claude-3-haiku-20240307-v1:0"
./test-connection.sh
```

### Test with Session Token

```bash
export AWS_SESSION_TOKEN="IQo..."
./test-connection.sh
```

### Run Direct (without wrapper)

```bash
# From project root
cd src/server
npm install  # if not done yet
node ../../test-bedrock-connection.js
```

---

## 📝 Test Script Details

### Files

- `test-connection.sh` - Wrapper script (checks Node.js, sets up env)
- `test-bedrock-connection.js` - Main test script (Node.js)

### What Gets Tested

1. ✅ Environment variables presence
2. ✅ AWS credentials validity
3. ✅ Bedrock API access
4. ✅ Model availability
5. ✅ Request/response flow
6. ✅ Token usage and costs

### What Doesn't Get Tested

- ⚠️ Full interview flow
- ⚠️ Story generation
- ⚠️ Frontend connection
- ⚠️ Multiple requests
- ⚠️ Error recovery

---

## 🎓 Troubleshooting Workflow

```
1. Run validation test
   ./test-connection.sh
   
   ↓ If failed
   
2. Check error type
   - Missing env vars → Export credentials
   - AccessDenied → Check IAM permissions
   - ResourceNotFound → Enable model access
   - ExpiredToken → Get new session token
   
   ↓ After fix
   
3. Run test again
   ./test-connection.sh
   
   ↓ If success
   
4. Start ReelLife server
   ./start-dev.sh
```

---

## 💰 Cost

Each validation test costs approximately **$0.0002** (~0.02 cents).

Safe to run multiple times for troubleshooting.

---

## 🔐 Security Note

The test script:
- ✅ Only reads environment variables
- ✅ Doesn't log credentials
- ✅ Doesn't save responses
- ✅ Sends minimal data to AWS
- ✅ Safe to run multiple times

---

## ✨ Example Sessions

### First Time Setup

```bash
# 1. Export credentials
export AWS_ACCESS_KEY_ID="AKIA..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_REGION="us-east-1"

# 2. Run test
./test-connection.sh
# ✅ SUCCESS!

# 3. Start server
./start-dev.sh
# Server starts successfully
```

### With Session Token

```bash
# 1. Get session token
aws sts get-session-token

# 2. Export all credentials
export AWS_ACCESS_KEY_ID="ASIA..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_SESSION_TOKEN="IQo..."
export AWS_REGION="us-east-1"

# 3. Run test
./test-connection.sh
# ✅ SUCCESS! (shows session token detected)

# 4. Start server
./start-dev.sh
# Server starts with session token
```

### Troubleshooting

```bash
# 1. First attempt fails
./test-connection.sh
# ❌ FAILED! AccessDeniedException

# 2. Check IAM permissions
# (Go to AWS Console and fix permissions)

# 3. Try again
./test-connection.sh
# ✅ SUCCESS!
```

---

## 📚 Related Documentation

- [API_SETUP.md](API_SETUP.md) - Full API setup guide
- [BEARER_TOKEN_GUIDE.md](BEARER_TOKEN_GUIDE.md) - Session token guide
- [DEPLOYMENT_MODES.md](DEPLOYMENT_MODES.md) - Dev/Prod modes
- [INSTALL_NODEJS.md](INSTALL_NODEJS.md) - Node.js installation
- [CLAUDE_MODELS.md](CLAUDE_MODELS.md) - Model information

---

## 🎯 Quick Reference

```bash
# Basic test
./test-connection.sh

# With session token
export AWS_SESSION_TOKEN="..."
./test-connection.sh

# Different model
export ANTHROPIC_MODEL_ID="anthropic.claude-3-haiku-20240307-v1:0"
./test-connection.sh

# View detailed errors
./test-connection.sh 2>&1 | tee test-log.txt
```

---

**Run the validation test before starting ReelLife to ensure everything is configured correctly!** ✅
