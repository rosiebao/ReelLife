# ReelLife Deployment Modes

The ReelLife API supports two deployment modes with different authentication strategies.

---

## 📋 Overview

| Mode | Credentials | Best For | Setup Time |
|------|-------------|----------|------------|
| **Development** | config.json | Local dev, testing | 5 minutes |
| **Production** | IAM Role | EC2, ECS, Lambda | 10 minutes |

---

## 🔧 Mode 1: Development (Local)

**Uses static credentials stored in `config.json`**

### When to Use
- ✅ Local development on your machine
- ✅ Testing and debugging
- ✅ Quick prototyping
- ✅ Team members without AWS infrastructure

### Setup

#### 1. Create `config.json`
```json
{
  "aws": {
    "region": "us-east-1",
    "credentials": {
      "accessKeyId": "AKIA...",
      "secretAccessKey": "..."
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

#### 2. Start Server

**Option A: npm script**
```bash
cd /Users/rosie/Work/ReelLife
npm run dev
```

**Option B: Bash script**
```bash
cd /Users/rosie/Work/ReelLife
./start-dev.sh
```

**Option C: Manual**
```bash
cd /Users/rosie/Work/ReelLife
NODE_ENV=development node server.js
```

### Output
```
🌍 Environment: development
📦 Mode: Development (config.json)
✅ Loaded config.json
🔑 Using credentials from config.json (development mode)
✅ AWS Bedrock client initialized

============================================================
🚀 ReelLife API Server Started
============================================================
📍 URL: http://localhost:3000
🌍 Environment: development
📦 Mode: Development (config.json)
📍 AWS Region: us-east-1
🤖 Model: anthropic.claude-3-5-sonnet-20241022-v2:0
🔒 Auth: Static Credentials
============================================================
✅ Ready to conduct interviews with Claude!
============================================================
```

### Security Notes
- ⚠️ **NEVER commit `config.json` to git** (already in `.gitignore`)
- ✅ Keep credentials secure
- ✅ Rotate keys regularly
- ✅ Use separate dev/prod keys

---

## 🚀 Mode 2: Production (IAM Role)

**Uses IAM Role attached to AWS resource (no static credentials)**

### When to Use
- ✅ Production deployments
- ✅ EC2 instances
- ✅ ECS/Fargate containers
- ✅ Lambda functions
- ✅ EKS pods
- ✅ Any AWS service with IAM role support

### Benefits
- 🔒 **More secure** - No credentials in files
- 🔄 **Auto-rotating** - AWS manages credential rotation
- 🎯 **Least privilege** - Precise permission control
- 📊 **Better auditing** - CloudTrail logs all access
- 🚫 **No credential leaks** - Nothing to commit by accident

### Setup

#### 1. Create IAM Role

**For EC2:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

**For ECS:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

#### 2. Attach Bedrock Policy

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
        "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-5-sonnet*",
        "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-sonnet*",
        "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-haiku*"
      ]
    }
  ]
}
```

#### 3. Attach Role to Resource

**EC2:**
```bash
# Create instance profile
aws iam create-instance-profile --instance-profile-name ReelLifeInstanceProfile

# Add role to profile
aws iam add-role-to-instance-profile \
  --instance-profile-name ReelLifeInstanceProfile \
  --role-name ReelLifeBedrockRole

# Attach to EC2 instance
aws ec2 associate-iam-instance-profile \
  --instance-id i-1234567890abcdef0 \
  --iam-instance-profile Name=ReelLifeInstanceProfile
```

**ECS:**
```json
{
  "taskRoleArn": "arn:aws:iam::123456789012:role/ReelLifeBedrockRole",
  "executionRoleArn": "arn:aws:iam::123456789012:role/ecsTaskExecutionRole",
  ...
}
```

#### 4. Create `config.production.json` (No Credentials!)

```json
{
  "aws": {
    "region": "us-east-1"
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
      "origin": "https://your-domain.com",
      "credentials": true
    }
  }
}
```

#### 5. Start Server

**Option A: npm script**
```bash
npm run prod
```

**Option B: Bash script**
```bash
./start-prod.sh
```

**Option C: Manual**
```bash
NODE_ENV=production node server.js
```

### Output
```
🌍 Environment: production
📦 Mode: Production (IAM Role)
⚙️  Using environment variables
🔐 Using IAM Role credentials (production mode)
✅ AWS Bedrock client initialized

============================================================
🚀 ReelLife API Server Started
============================================================
📍 URL: http://localhost:3000
🌍 Environment: production
📦 Mode: Production (IAM Role)
📍 AWS Region: us-east-1
🤖 Model: anthropic.claude-3-5-sonnet-20241022-v2:0
🔒 Auth: IAM Role
============================================================
✅ Ready to conduct interviews with Claude!
============================================================
```

---

## 🔄 Mode Detection Logic

The server automatically detects which mode to use:

```javascript
// 1. Check NODE_ENV
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// 2. Production: Use IAM Role
if (IS_PRODUCTION) {
  // Credentials automatically loaded from instance metadata
  // Works with: EC2, ECS, Lambda, EKS
}

// 3. Development: Try multiple sources
else {
  // Try config.json first
  if (config.aws.credentials.accessKeyId) {
    // Use credentials from config.json
  }
  // Try environment variables
  else if (process.env.AWS_ACCESS_KEY_ID) {
    // Use credentials from env vars
  }
  // Try AWS CLI credentials
  else {
    // Use ~/.aws/credentials
  }
}
```

---

## 📊 Comparison

### Development Mode

**Pros:**
- ✅ Easy setup
- ✅ Works anywhere
- ✅ Fast iteration
- ✅ Good for testing

**Cons:**
- ⚠️ Credentials in files
- ⚠️ Manual rotation
- ⚠️ Risk of leaking keys
- ⚠️ Less auditing

### Production Mode

**Pros:**
- ✅ No credentials in code
- ✅ Auto-rotation
- ✅ Better security
- ✅ AWS best practices
- ✅ CloudTrail logging

**Cons:**
- ⚠️ Requires AWS infrastructure
- ⚠️ More setup steps
- ⚠️ Can't run locally (easily)

---

## 🎯 Deployment Examples

### EC2 Instance

```bash
# 1. SSH into EC2
ssh ec2-user@your-instance

# 2. Clone repo
git clone https://github.com/rosiebao/ReelLife.git
cd ReelLife/src/server

# 3. Install dependencies
npm install

# 4. Create production config (no credentials!)
cat > ../config.json << EOF
{
  "aws": {"region": "us-east-1"},
  "anthropic": {
    "modelId": "anthropic.claude-3-5-sonnet-20241022-v2:0",
    "maxTokens": 2048,
    "temperature": 0.7,
    "topP": 0.9
  },
  "server": {
    "port": 3000,
    "cors": {"origin": "https://your-domain.com"}
  }
}
EOF

# 5. Start in production mode
npm run prod
```

### ECS/Fargate

**Dockerfile:**
```dockerfile
FROM node:18

WORKDIR /app

COPY server/package*.json ./
RUN npm install

COPY server/ ./
COPY config.production.json ./config.json

ENV NODE_ENV=production

CMD ["node", "server.js"]
```

**Task Definition:**
```json
{
  "family": "reellife-api",
  "taskRoleArn": "arn:aws:iam::ACCOUNT:role/ReelLifeBedrockRole",
  "containerDefinitions": [{
    "name": "reellife-api",
    "image": "your-registry/reellife-api:latest",
    "portMappings": [{"containerPort": 3000}],
    "environment": [
      {"name": "NODE_ENV", "value": "production"},
      {"name": "AWS_REGION", "value": "us-east-1"}
    ]
  }]
}
```

### Lambda Function

```javascript
// lambda-handler.js
import serverlessExpress from '@vendia/src/serverless-express';
import app from './src/server.js';

export const handler = serverlessExpress({ app });
```

**Deploy:**
```bash
# Package
npm install
zip -r function.zip .

# Deploy
aws lambda update-function-code \
  --function-name ReelLifeAPI \
  --zip-file fileb://function.zip

# Set role
aws lambda update-function-configuration \
  --function-name ReelLifeAPI \
  --role arn:aws:iam::ACCOUNT:role/ReelLifeBedrockRole \
  --environment Variables={NODE_ENV=production}
```

---

## 🔍 Testing Modes

### Test Development Mode
```bash
# Start dev server
NODE_ENV=development node server.js

# Check mode
curl http://localhost:3000/api/info

# Expected:
{
  "environment": "development",
  "mode": "development (config.json)",
  "region": "us-east-1",
  "model": "anthropic.claude-3-5-sonnet-20241022-v2:0"
}
```

### Test Production Mode
```bash
# Start prod server
NODE_ENV=production node server.js

# Check mode
curl http://localhost:3000/api/info

# Expected:
{
  "environment": "production",
  "mode": "production (IAM Role)",
  "region": "us-east-1",
  "model": "anthropic.claude-3-5-sonnet-20241022-v2:0"
}
```

---

## 🔒 Security Best Practices

### Development
1. ✅ Add `config.json` to `.gitignore`
2. ✅ Never commit credentials
3. ✅ Use separate dev AWS account
4. ✅ Rotate keys every 90 days
5. ✅ Use read-only keys when possible

### Production
1. ✅ Always use IAM roles
2. ✅ Follow principle of least privilege
3. ✅ Enable CloudTrail logging
4. ✅ Monitor API usage
5. ✅ Set up alerts for anomalies
6. ✅ Use VPC endpoints for Bedrock
7. ✅ Enable encryption in transit

---

## 📈 Monitoring

### Check Current Mode
```bash
curl http://localhost:3000/api/info
```

### CloudWatch Logs (Production)
```bash
# View logs
aws logs tail /aws/reellife-api --follow

# Search for mode
aws logs filter-log-events \
  --log-group-name /aws/reellife-api \
  --filter-pattern "Mode:"
```

### Health Check
```bash
curl http://localhost:3000/health
```

---

## 🎓 Quick Reference

| Task | Development | Production |
|------|-------------|------------|
| **Start** | `npm run dev` | `npm run prod` |
| **Config File** | `config.json` | `config.production.json` |
| **Credentials** | In config file | From IAM role |
| **Environment** | `NODE_ENV=development` | `NODE_ENV=production` |
| **Best For** | Local testing | AWS deployment |

---

## ❓ FAQ

**Q: Can I use production mode locally?**  
A: Yes, if you have AWS CLI configured with credentials. The server will fall back to `~/.aws/credentials`.

**Q: What if both config.json has credentials AND I'm in production mode?**  
A: Production mode ignores config.json credentials and uses IAM role.

**Q: How do I switch between modes?**  
A: Set `NODE_ENV` environment variable: `development` or `production`.

**Q: Do I need both config files?**  
A: No. You can use one config file and the mode is determined by `NODE_ENV`.

**Q: What's the default mode?**  
A: Development mode (if `NODE_ENV` is not set).

---

## 📞 Support

**Issues?**
- Check `NODE_ENV` is set correctly
- Verify IAM role is attached (production)
- Check AWS region matches Bedrock availability
- Review CloudWatch logs
- Test credentials with AWS CLI

**Still stuck?**
- See `API_SETUP.md` for detailed setup
- Check `server/README.md` for troubleshooting
- Review AWS Bedrock documentation

---

**Both modes are now fully configured and ready to use!** 🎉
