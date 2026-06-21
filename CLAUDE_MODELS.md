# Claude Models on AWS Bedrock

Reference guide for Claude models available on AWS Bedrock for ReelLife.

---

## 🎯 Current Model

ReelLife is currently configured to use:

**`anthropic.claude-3-5-sonnet-20241022-v2:0`**

This is **Claude 3.5 Sonnet v2** - the latest and most capable Sonnet model.

---

## 📊 Available Claude Models on Bedrock

### Claude 3.5 Family (Latest)

| Model | Model ID | Best For | Speed | Cost |
|-------|----------|----------|-------|------|
| **Claude 3.5 Sonnet v2** ✅ | `anthropic.claude-3-5-sonnet-20241022-v2:0` | Most tasks, best balance | Fast | $$ |
| Claude 3.5 Sonnet v1 | `anthropic.claude-3-5-sonnet-20240620-v1:0` | Previous version | Fast | $$ |

### Claude 3 Family

| Model | Model ID | Best For | Speed | Cost |
|-------|----------|----------|-------|------|
| Claude 3 Opus | `anthropic.claude-3-opus-20240229-v1:0` | Complex tasks, highest quality | Slower | $$$$ |
| Claude 3 Sonnet | `anthropic.claude-3-sonnet-20240229-v1:0` | Balanced performance | Medium | $$ |
| Claude 3 Haiku | `anthropic.claude-3-haiku-20240307-v1:0` | Fast, simple tasks | Fastest | $ |

---

## 💰 Pricing (AWS Bedrock)

### Claude 3.5 Sonnet v2 (Current)
- **Input**: $3.00 per 1M tokens
- **Output**: $15.00 per 1M tokens

### Other Models
| Model | Input | Output |
|-------|-------|--------|
| Claude 3.5 Sonnet v1 | $3.00 | $15.00 |
| Claude 3 Opus | $15.00 | $75.00 |
| Claude 3 Sonnet | $3.00 | $15.00 |
| Claude 3 Haiku | $0.25 | $1.25 |

*Prices per 1M tokens as of 2024*

---

## 🔄 How to Change Models

### Method 1: Edit config.json

```json
{
  "anthropic": {
    "modelId": "anthropic.claude-3-5-sonnet-20241022-v2:0"
  }
}
```

### Method 2: Environment Variable

```bash
export ANTHROPIC_MODEL_ID="anthropic.claude-3-5-sonnet-20241022-v2:0"
```

### Method 3: Update Default in server.js

Edit `src/server/server.js` to change the default model.

---

## 🎯 Model Recommendations

### For ReelLife Interviews (Current Use)

**✅ Claude 3.5 Sonnet v2** (Recommended)
- Perfect balance of quality and cost
- Excellent for conversational interviews
- Fast response times
- Good context understanding
- **Currently configured**

### Alternative Options

**Claude 3 Haiku** (Budget-friendly)
- Use if: Costs are a concern
- Pros: 10x cheaper, very fast
- Cons: Less nuanced responses
- Change to: `anthropic.claude-3-haiku-20240307-v1:0`

**Claude 3 Opus** (Premium)
- Use if: Highest quality needed
- Pros: Most capable, best reasoning
- Cons: 5x more expensive, slower
- Change to: `anthropic.claude-3-opus-20240229-v1:0`

---

## 📈 Model Capabilities

### Claude 3.5 Sonnet v2 (Current)

**Strengths:**
- ✅ 200K token context window
- ✅ Excellent at following instructions
- ✅ Strong reasoning and analysis
- ✅ Natural conversational style
- ✅ Good at empathy and interviews
- ✅ Reliable and consistent

**Performance:**
- Context: 200,000 tokens
- Output: Up to 8,192 tokens
- Speed: ~40-60 tokens/second

**Perfect For:**
- ✅ Interview conversations
- ✅ Story generation
- ✅ Question formulation
- ✅ Transcript summarization
- ✅ Narrative writing

---

## 🔍 Model Comparison for Interviews

| Aspect | Haiku | Sonnet v2 ✅ | Opus |
|--------|-------|-------------|------|
| **Interview Quality** | Good | Excellent | Best |
| **Empathy** | Basic | Strong | Exceptional |
| **Follow-up Questions** | Simple | Thoughtful | Deep |
| **Story Generation** | Short | Detailed | Rich |
| **Speed** | Very Fast | Fast | Medium |
| **Cost per Interview** | $0.01 | $0.07 | $0.35 |

**Verdict:** Sonnet v2 is optimal for ReelLife interviews.

---

## ⚙️ Model-Specific Settings

### Recommended Settings by Model

**Claude 3.5 Sonnet v2** (Current)
```json
{
  "modelId": "anthropic.claude-3-5-sonnet-20241022-v2:0",
  "maxTokens": 2048,
  "temperature": 0.7,
  "topP": 0.9
}
```

**Claude 3 Haiku** (Fast & Cheap)
```json
{
  "modelId": "anthropic.claude-3-haiku-20240307-v1:0",
  "maxTokens": 1024,
  "temperature": 0.8,
  "topP": 0.95
}
```

**Claude 3 Opus** (Premium)
```json
{
  "modelId": "anthropic.claude-3-opus-20240229-v1:0",
  "maxTokens": 4096,
  "temperature": 0.6,
  "topP": 0.85
}
```

---

## 🧪 Testing Different Models

### Quick Test

1. Edit `config.json`:
```json
"modelId": "anthropic.claude-3-haiku-20240307-v1:0"
```

2. Restart server:
```bash
./start-dev.sh
```

3. Test interview at http://localhost:8000

4. Compare results and costs

### A/B Testing

Run interviews with different models and compare:
- Question quality
- Response naturalness
- Story generation quality
- Cost per interview

---

## 🔐 Model Access on Bedrock

### Enable Model Access

1. AWS Console → Bedrock → Model access
2. Request access to models you want to use
3. Wait for "Access granted" status

### Required Models for ReelLife

**Minimum:**
- ✅ Claude 3.5 Sonnet v2

**Optional (for testing):**
- Claude 3 Haiku (cheaper alternative)
- Claude 3 Opus (premium alternative)

---

## 📊 Cost Estimation by Model

### 100 Interviews per Month

Typical interview: ~3,000 input + 1,000 output tokens

| Model | Input Cost | Output Cost | Total/Interview | Total/Month |
|-------|------------|-------------|-----------------|-------------|
| **Haiku** | $0.0008 | $0.0013 | **$0.0021** | **$0.21** |
| **Sonnet v2** ✅ | $0.009 | $0.015 | **$0.024** | **$2.40** |
| **Opus** | $0.045 | $0.075 | **$0.12** | **$12.00** |

**Recommendation:** Sonnet v2 offers best value for quality.

---

## 🚀 Future Models

AWS Bedrock typically adds new Claude models 1-2 weeks after Anthropic announces them.

To check for new models:
```bash
aws bedrock list-foundation-models \
  --by-provider anthropic \
  --region us-east-1 \
  --query 'modelSummaries[*].[modelId,modelName]' \
  --output table
```

---

## 📝 Updating to Newer Models

When a new model is released:

1. **Check availability:**
```bash
aws bedrock list-foundation-models --by-provider anthropic
```

2. **Request access:**
- AWS Console → Bedrock → Model access
- Enable the new model

3. **Update config.json:**
```json
"modelId": "anthropic.claude-NEW-MODEL-ID"
```

4. **Test thoroughly:**
- Run test interviews
- Compare quality with previous model
- Check costs

5. **Update documentation:**
- Update this file
- Update API_SETUP.md
- Update DEVELOPMENT.md

---

## ✅ Current Status

**ReelLife Configuration:**
- Model: Claude 3.5 Sonnet v2 ✅
- Status: Latest available
- Performance: Excellent
- Cost: Reasonable
- Action: None needed

**Your config.json is already using the latest and best model!**

---

## 🔗 Resources

**Official Documentation:**
- [AWS Bedrock Models](https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html)
- [Anthropic Model Comparison](https://docs.anthropic.com/claude/docs/models-overview)
- [Claude 3.5 Sonnet Announcement](https://www.anthropic.com/claude)

**Pricing:**
- [AWS Bedrock Pricing](https://aws.amazon.com/bedrock/pricing/)

---

**Your ReelLife installation is using the latest Claude model!** 🎉
