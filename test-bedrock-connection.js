#!/usr/bin/env node

/**
 * ReelLife - AWS Bedrock Connection Validator
 * Tests connection to Claude Sonnet model using environment variables
 */

import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

// Colors for output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function banner() {
  log('\n' + '='.repeat(60), 'cyan');
  log('  AWS Bedrock Connection Validator', 'bright');
  log('  Testing Claude Sonnet Model Connection', 'cyan');
  log('='.repeat(60) + '\n', 'cyan');
}

async function validateEnvironment() {
  log('Step 1: Validating Environment Variables', 'blue');
  log('-'.repeat(60), 'blue');

  const required = [
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'AWS_REGION',
  ];

  const optional = [
    'AWS_BEARER_TOKEN_BEDROCK',
    'AWS_SESSION_TOKEN',
    'ANTHROPIC_MODEL_ID',
  ];

  let allPresent = true;

  // Check required variables
  for (const varName of required) {
    if (process.env[varName]) {
      log(`✅ ${varName}: Set`, 'green');
    } else {
      log(`❌ ${varName}: Missing`, 'red');
      allPresent = false;
    }
  }

  // Check optional variables
  for (const varName of optional) {
    if (process.env[varName]) {
      log(`✅ ${varName}: Set`, 'green');
    } else {
      log(`ℹ️  ${varName}: Not set (optional)`, 'yellow');
    }
  }

  console.log('');

  if (!allPresent) {
    log('❌ Missing required environment variables!', 'red');
    log('\nPlease set the following:', 'yellow');
    log('  export AWS_ACCESS_KEY_ID="your-access-key"', 'yellow');
    log('  export AWS_SECRET_ACCESS_KEY="your-secret-key"', 'yellow');
    log('  export AWS_REGION="us-east-1"', 'yellow');
    log('\nOptional (Bearer Token):', 'yellow');
    log('  export AWS_BEARER_TOKEN_BEDROCK="your-bearer-token"', 'yellow');
    log('  export ANTHROPIC_MODEL_ID="anthropic.claude-3-5-sonnet-20241022-v2:0"', 'yellow');
    process.exit(1);
  }

  return {
    region: process.env.AWS_REGION,
    modelId: process.env.ANTHROPIC_MODEL_ID || 'anthropic.claude-3-5-sonnet-20241022-v2:0',
    hasSessionToken: !!(process.env.AWS_BEARER_TOKEN_BEDROCK || process.env.AWS_SESSION_TOKEN),
  };
}

async function testConnection(config) {
  log('Step 2: Testing AWS Bedrock Connection', 'blue');
  log('-'.repeat(60), 'blue');

  log(`📍 Region: ${config.region}`, 'cyan');
  log(`🤖 Model: ${config.modelId}`, 'cyan');
  log(`🎫 Session Token: ${config.hasSessionToken ? 'Yes' : 'No'}`, 'cyan');
  console.log('');

  try {
    log('Initializing Bedrock client...', 'yellow');

    // Create client with credentials from environment
    const sessionToken = process.env.AWS_BEARER_TOKEN_BEDROCK || process.env.AWS_SESSION_TOKEN;
    const client = new BedrockRuntimeClient({
      region: config.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        ...(sessionToken && {
          sessionToken: sessionToken,
        }),
      },
    });

    log('✅ Bedrock client created', 'green');
    console.log('');

    log('Sending test request to Claude...', 'yellow');

    const startTime = Date.now();

    // Simple test prompt
    const requestBody = {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 100,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: 'Hello! Please respond with "Connection successful!" if you receive this message.',
        },
      ],
    };

    const command = new InvokeModelCommand({
      modelId: config.modelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(requestBody),
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    const duration = Date.now() - startTime;

    log('✅ Response received!', 'green');
    console.log('');

    // Display response
    log('Step 3: Response Details', 'blue');
    log('-'.repeat(60), 'blue');

    const responseText = responseBody.content[0].text;

    log(`📝 Claude's Response:`, 'cyan');
    log(`   "${responseText}"`, 'bright');
    console.log('');

    log(`⏱️  Response Time: ${duration}ms`, 'cyan');
    log(`📊 Stop Reason: ${responseBody.stop_reason}`, 'cyan');
    log(`🔢 Input Tokens: ${responseBody.usage.input_tokens}`, 'cyan');
    log(`🔢 Output Tokens: ${responseBody.usage.output_tokens}`, 'cyan');
    console.log('');

    // Calculate cost
    const inputCost = (responseBody.usage.input_tokens / 1_000_000) * 3.0;
    const outputCost = (responseBody.usage.output_tokens / 1_000_000) * 15.0;
    const totalCost = inputCost + outputCost;

    log(`💰 Cost for this test: $${totalCost.toFixed(6)}`, 'cyan');
    console.log('');

    return true;
  } catch (error) {
    log('❌ Connection failed!', 'red');
    console.log('');
    log('Error Details:', 'red');
    log(`  Type: ${error.name}`, 'red');
    log(`  Message: ${error.message}`, 'red');
    console.log('');

    // Provide specific guidance based on error
    if (error.name === 'AccessDeniedException') {
      log('💡 Troubleshooting:', 'yellow');
      log('  1. Check that your AWS credentials are correct', 'yellow');
      log('  2. Verify IAM user has bedrock:InvokeModel permission', 'yellow');
      log('  3. Ensure Bedrock model access is enabled in AWS Console', 'yellow');
    } else if (error.name === 'ResourceNotFoundException') {
      log('💡 Troubleshooting:', 'yellow');
      log('  1. Check that the model ID is correct', 'yellow');
      log('  2. Verify model is available in your region', 'yellow');
      log('  3. Enable model access in AWS Bedrock console', 'yellow');
    } else if (error.name === 'ValidationException') {
      log('💡 Troubleshooting:', 'yellow');
      log('  1. Check request format is correct', 'yellow');
      log('  2. Verify all required parameters are provided', 'yellow');
    } else if (error.name === 'ExpiredTokenException') {
      log('💡 Troubleshooting:', 'yellow');
      log('  1. Your session token has expired', 'yellow');
      log('  2. Get a new session token: aws sts get-session-token', 'yellow');
      log('  3. Export the new credentials', 'yellow');
    }

    console.log('');
    return false;
  }
}

async function displaySummary(success) {
  log('='.repeat(60), 'cyan');
  log('  Test Summary', 'bright');
  log('='.repeat(60), 'cyan');
  console.log('');

  if (success) {
    log('✅ SUCCESS! Connection to AWS Bedrock is working!', 'green');
    console.log('');
    log('Next steps:', 'green');
    log('  1. Your credentials are working correctly', 'green');
    log('  2. You can now start the ReelLife server', 'green');
    log('  3. Run: ./start-dev.sh', 'green');
  } else {
    log('❌ FAILED! Connection to AWS Bedrock is not working', 'red');
    console.log('');
    log('Next steps:', 'red');
    log('  1. Review the error message above', 'red');
    log('  2. Follow the troubleshooting steps', 'red');
    log('  3. Run this test again after fixing', 'red');
  }

  console.log('');
  log('='.repeat(60), 'cyan');
  console.log('');
}

// Main execution
async function main() {
  banner();

  try {
    // Validate environment variables
    const config = await validateEnvironment();

    // Test connection
    const success = await testConnection(config);

    // Display summary
    await displaySummary(success);

    process.exit(success ? 0 : 1);
  } catch (error) {
    log('❌ Unexpected error occurred!', 'red');
    console.error(error);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
