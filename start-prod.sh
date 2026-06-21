#!/bin/bash

# ReelLife Production Mode Startup Script
# Uses IAM Role for AWS credentials (EC2, ECS, Lambda, etc.)

echo "🚀 Starting ReelLife API in PRODUCTION mode..."
echo ""

# Check if running on AWS with IAM role
if [ -z "$AWS_EXECUTION_ENV" ] && [ ! -f "/var/run/secrets/eks.amazonaws.com/serviceaccount/token" ]; then
    echo "⚠️  Warning: Not running in AWS environment"
    echo "IAM Role credentials may not be available"
    echo ""
fi

# Navigate to server directory
cd src/server

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Set production environment
export NODE_ENV=production

# Optional: Set other environment variables
# export AWS_REGION=us-east-1
# export ANTHROPIC_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0
# export PORT=3000

# Start server
echo "🚀 Starting server with IAM Role credentials..."
node server.js
