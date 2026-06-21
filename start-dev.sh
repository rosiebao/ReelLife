#!/bin/bash

# ReelLife Development Mode Startup Script
# Uses config.json for AWS credentials

echo "🔧 Starting ReelLife API in DEVELOPMENT mode..."
echo ""

# Check if config.json exists
if [ ! -f "config.json" ]; then
    echo "❌ Error: config.json not found!"
    echo "Please create config.json with your AWS credentials."
    echo "See .env.example for template."
    exit 1
fi

# Navigate to server directory
cd src/server

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Set development environment
export NODE_ENV=development

# Start server
echo "🚀 Starting server..."
node server.js
