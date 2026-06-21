#!/bin/bash

# ReelLife - AWS Bedrock Connection Test Wrapper
# This script helps test the connection using environment variables

echo "🧪 ReelLife AWS Bedrock Connection Test"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed!"
    echo ""
    echo "Please install Node.js first:"
    echo "  brew install node"
    echo ""
    echo "Then run this script again."
    exit 1
fi

# Check if AWS credentials are set
if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
    echo "⚠️  AWS credentials not found in environment variables"
    echo ""
    echo "Please export your AWS credentials:"
    echo ""
    echo "  export AWS_ACCESS_KEY_ID=\"AKIA...\""
    echo "  export AWS_SECRET_ACCESS_KEY=\"...\""
    echo "  export AWS_REGION=\"us-east-1\""
    echo ""
    echo "Optional (for bearer token):"
    echo "  export AWS_BEARER_TOKEN_BEDROCK=\"...\""
    echo ""
    echo "Then run this script again: ./test-connection.sh"
    exit 1
fi

# Navigate to server directory and install dependencies if needed
cd src/server

if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies first..."
    npm install
    echo ""
fi

# Run the test
echo "🚀 Running connection test..."
echo ""

node ../../test-bedrock-connection.js
