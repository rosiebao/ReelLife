# AWS Bedrock Bearer Token Guide

Complete guide for using AWS session tokens (bearer tokens) with ReelLife.

⚠️ **SECURITY WARNING**: Never commit bearer tokens or session tokens to git!

---

## 📋 What Are Bearer Tokens?

Bearer tokens (AWS Session Tokens) are **temporary security credentials** that provide access to AWS services.

### Types of Credentials

| Type | Duration | Use Case | Security |
|------|----------|----------|----------|
| **Permanent Keys** | Forever | IAM users, development | ⚠️ Medium risk |
| **Session Tokens** | 1-36 hours | Temporary access, STS | ✅ Lower risk |
| **IAM Roles** | Auto-rotating | Production (EC2, ECS) | ✅ Best security |

---

## 🎯 Why Use Bearer Tokens?

### Benefits
- ✅ **Temporary** - Expire automatically (1-36 hours)
- ✅ **More secure** - Can't be used after expiration
- ✅ **Auditable** - Better CloudTrail logging
- ✅ **AssumeRole** - Cross-account access
- ✅ **MFA support** - Can require MFA

### When to Use
- 🎯 Testing with temporary credentials
- 🎯 Cross-account access (AssumeRole)
- 🎯 MFA-protected access
- 🎯 Short-term contractor access
- 🎯 CI/CD pipelines

---

## 🔧 Setup Methods

### Method 1: Environment Variables (Recommended)

```bash
# Set environment variables
export AWS_ACCESS_KEY_ID="ASIA..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_SESSION_TOKEN="IQo..."  # The bearer token

# Alternative name (same effect):
# export AWS_BEDROCK_TOKEN="IQo..."

# Start server
cd /Users/rosie/Work/ReelLife
npm run dev
```

**Pros:**
- ✅ Not stored in files
- ✅ Easy to rotate
- ✅ Works across multiple projects

**Cons:**
- ⚠️ Need to re-export when terminal closes
- ⚠️ Need to refresh when token expires

---

### Method 2: config.json (Not Recommended)

```json
{
  "aws": {
    "region": "us-east-1",
    "credentials": {
      "accessKeyId": "ASIA...",
      "secretAccessKey": "...",
      "sessionToken": "IQo..."
    }
  },
  ...
}
```

**⚠️ WARNING**: 
- config.json is in .gitignore, but easy to accidentally commit
- Use environment variables instead!

---

### Method 3: AWS CLI Credentials File

```bash
# Edit ~/.aws/credentials
[default]
aws_access_key_id = ASIA...
aws_secret_access_key = ...
aws_session_token = IQo...

# Server will automatically use these
cd /Users/rosie/Work/ReelLife
npm run dev
```

---

## 🔑 Getting Bearer Tokens

### Option 1: AWS STS (Security Token Service)

```bash
# Get temporary credentials (1 hour)
aws sts get-session-token

# Response:
{
  "Credentials": {
    "AccessKeyId": "ASIA...",
    "SecretAccessKey": "...",
    "SessionToken": "IQo...",
    "Expiration": "2024-01-15T12:00:00Z"
  }
}
```

**Export as environment variables:**
```bash
export AWS_ACCESS_KEY_ID="ASIA..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_SESSION_TOKEN="IQo..."
```

---

### Option 2: AWS STS with MFA

```bash
# Get temporary credentials with MFA (12 hours)
aws sts get-session-token \
  --serial-number arn:aws:iam::123456789012:mfa/username \
  --token-code 123456 \
  --duration-seconds 43200

# Export the returned credentials
export AWS_ACCESS_KEY_ID="ASIA..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_SESSION_TOKEN="IQo..."
```

---

### Option 3: AssumeRole (Cross-Account)

```bash
# Assume a role in another account
aws sts assume-role \
  --role-arn arn:aws:iam::987654321098:role/BedrockAccessRole \
  --role-session-name reellife-session

# Response includes temporary credentials
{
  "Credentials": {
    "AccessKeyId": "ASIA...",
    "SecretAccessKey": "...",
    "SessionToken": "IQo...",
    "Expiration": "2024-01-15T12:00:00Z"
  }
}
```

**Export:**
```bash
export AWS_ACCESS_KEY_ID="ASIA..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_SESSION_TOKEN="IQo..."
```

---

### Option 4: Using AWS Vault

[AWS Vault](https://github.com/99designs/aws-vault) is a tool for securely managing AWS credentials.

```bash
# Install aws-vault
brew install --cask aws-vault

# Store credentials
aws-vault add reellife

# Run server with temporary credentials
aws-vault exec reellife -- npm run dev

# The session token is automatically set!
```

---

## 🚀 Usage Examples

### Quick Start with Bearer Token

```bash
# 1. Get temporary credentials
aws sts get-session-token

# 2. Export credentials (replace with actual values)
export AWS_ACCESS_KEY_ID="ASIA..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_SESSION_TOKEN="IQo..."

# 3. Verify they're set
echo $AWS_SESSION_TOKEN

# 4. Start ReelLife server
cd /Users/rosie/Work/ReelLife
npm run dev

# 5. You should see:
# 🎫 Using AWS session token from environment variables
```

---

### Script for Easy Setup

Create `set-bearer-token.sh`:

```bash
#!/bin/bash

# Get STS temporary credentials
echo "Getting temporary AWS credentials..."
CREDS=$(aws sts get-session-token --output json)

# Extract values
export AWS_ACCESS_KEY_ID=$(echo $CREDS | jq -r '.Credentials.AccessKeyId')
export AWS_SECRET_ACCESS_KEY=$(echo $CREDS | jq -r '.Credentials.SecretAccessKey')
export AWS_SESSION_TOKEN=$(echo $CREDS | jq -r '.Credentials.SessionToken')

echo "✅ Credentials set!"
echo "Access Key: $AWS_ACCESS_KEY_ID"
echo "Expires: $(echo $CREDS | jq -r '.Credentials.Expiration')"

# Start server
cd /Users/rosie/Work/ReelLife
npm run dev
```

**Usage:**
```bash
chmod +x set-bearer-token.sh
source set-bearer-token.sh  # Must use 'source' to export vars
```

---

## 🔄 Credential Priority

The server checks credentials in this order:

1. **Environment: Session Token**
   - `AWS_SESSION_TOKEN` or `AWS_BEDROCK_TOKEN`
   - Plus `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`

2. **config.json: Session Token**
   - `credentials.sessionToken`
   - Plus `accessKeyId` and `secretAccessKey`

3. **config.json: Static Keys**
   - `accessKeyId` and `secretAccessKey` only

4. **Environment: Static Keys**
   - `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`

5. **AWS CLI Credentials**
   - `~/.aws/credentials`

6. **Production: IAM Role**
   - EC2 instance profile, ECS task role, etc.

---

## ⏰ Token Expiration

### Check Expiration

```bash
# Decode session token to see expiration
aws sts decode-authorization-message \
  --encoded-message $AWS_SESSION_TOKEN
```

### Handle Expiration

**Symptoms:**
- `ExpiredToken` errors
- `The security token included in the request is expired`

**Solution:**
```bash
# 1. Get new token
aws sts get-session-token

# 2. Export new credentials
export AWS_ACCESS_KEY_ID="ASIA..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_SESSION_TOKEN="IQo..."

# 3. Restart server
# (No code changes needed - server uses current env vars)
```

---

## 🔒 Security Best Practices

### DO ✅
- ✅ Use environment variables
- ✅ Use short expiration times (1-12 hours)
- ✅ Rotate regularly
- ✅ Use MFA when possible
- ✅ Verify .gitignore includes tokens
- ✅ Clear terminal history after entering tokens
- ✅ Use aws-vault or similar tools

### DON'T ❌
- ❌ Commit tokens to git
- ❌ Share tokens between team members
- ❌ Store tokens in plain text files
- ❌ Use tokens beyond their expiration
- ❌ Echo tokens to logs or console
- ❌ Email or Slack token values
- ❌ Reuse expired tokens

---

## 🛡️ .gitignore Protection

The following files are **automatically ignored** (never committed):

```
# From .gitignore
.env
.env.local
config.json
config.local.json
*.token
*.credentials
*bearer*token*
```

**Verify protection:**
```bash
# Check if config.json would be committed
git status config.json
# Should show: nothing to commit

# If it shows as new file, add to .gitignore!
```

---

## 🧪 Testing Bearer Token Setup

### Test 1: Verify Token is Set

```bash
# Check environment variable
echo $AWS_SESSION_TOKEN

# Should output something like:
# IQoJb3JpZ2luX2VjEPv//////////wEaCXVzLWVhc3QtMSJHMEUCIQDp...
```

### Test 2: Test AWS Access

```bash
# Test with AWS CLI
aws sts get-caller-identity

# Should return your identity
{
  "UserId": "AIDAI...",
  "Account": "123456789012",
  "Arn": "arn:aws:iam::123456789012:user/username"
}
```

### Test 3: Test Bedrock Access

```bash
# List Bedrock models
aws bedrock list-foundation-models --region us-east-1

# Should list available models including Claude
```

### Test 4: Test ReelLife Server

```bash
# Start server
cd /Users/rosie/Work/ReelLife
npm run dev

# Look for this line:
# 🎫 Using AWS session token from environment variables

# Test API
curl http://localhost:3000/api/info

# Should return server info without errors
```

---

## 🔧 Troubleshooting

### "ExpiredToken" Error

**Cause:** Session token expired

**Solution:**
```bash
# Get fresh token
aws sts get-session-token

# Export new credentials
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_SESSION_TOKEN="..."

# Restart server
```

---

### "InvalidClientTokenId" Error

**Cause:** Access key doesn't match session token

**Solution:**
```bash
# All three must be from the same STS call
# Get new credentials together
CREDS=$(aws sts get-session-token)

# Export all three together
export AWS_ACCESS_KEY_ID=$(echo $CREDS | jq -r '.Credentials.AccessKeyId')
export AWS_SECRET_ACCESS_KEY=$(echo $CREDS | jq -r '.Credentials.SecretAccessKey')
export AWS_SESSION_TOKEN=$(echo $CREDS | jq -r '.Credentials.SessionToken')
```

---

### "SignatureDoesNotMatch" Error

**Cause:** Secret key doesn't match access key or token

**Solution:**
```bash
# Clear all AWS environment variables
unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY
unset AWS_SESSION_TOKEN

# Get fresh credentials and export together
```

---

### Token Not Being Used

**Check:**
```bash
# 1. Verify token is set
echo $AWS_SESSION_TOKEN

# 2. Check server logs
# Should see: 🎫 Using AWS session token

# 3. Verify NODE_ENV
echo $NODE_ENV
# Should be: development (not production)
```

---

## 📚 Additional Resources

**AWS Documentation:**
- [AWS STS](https://docs.aws.amazon.com/STS/latest/APIReference/welcome.html)
- [Temporary Security Credentials](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html)
- [Using MFA with AWS CLI](https://aws.amazon.com/premiumsupport/knowledge-center/authenticate-mfa-cli/)

**Tools:**
- [aws-vault](https://github.com/99designs/aws-vault) - Secure credential management
- [granted](https://www.granted.dev/) - Easy AWS credential switching
- [leapp](https://www.leapp.cloud/) - GUI for AWS credentials

---

## 🎓 Quick Reference

```bash
# Get temporary credentials
aws sts get-session-token

# Export credentials
export AWS_ACCESS_KEY_ID="ASIA..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_SESSION_TOKEN="IQo..."

# Start server
cd /Users/rosie/Work/ReelLife
npm run dev

# Expected output:
# 🎫 Using AWS session token from environment variables

# Test API
curl http://localhost:3000/health
```

---

**Bearer tokens are now fully supported!** 🎉  
**Remember: Never commit tokens to git!** 🔒
