#!/bin/bash

# ReelLife Production Mode Startup Script
# Uses IAM Role for AWS credentials (EC2, ECS, Lambda, etc.)

echo "🚀 Starting ReelLife API in PRODUCTION mode..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed!"
    echo ""
    echo "Please install Node.js (v18 or higher):"
    echo ""
    echo "📦 Installation options:"
    echo ""
    echo "  For production servers:"
    echo "    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -"
    echo "    sudo apt-get install -y nodejs"
    echo ""
    echo "  Or visit: https://nodejs.org/"
    echo ""
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not available!"
    echo "npm should be installed with Node.js"
    exit 1
fi

# Display Node.js version
NODE_VERSION=$(node --version)
echo "✅ Node.js version: $NODE_VERSION"

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
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

# Set production environment
export NODE_ENV=production

# Optional: Set other environment variables
# export AWS_REGION=us-east-1
# export ANTHROPIC_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0
# export PORT=3000

# Start server
echo ""
echo "🚀 Starting server with IAM Role credentials..."
echo "📍 URL: http://localhost:3000"
echo "📍 Press Ctrl+C to stop"
echo ""
node server.js
