#!/bin/bash

# Test script for new-momega CLI

echo "🧪 Testing new-momega CLI..."

# Test help command
echo "📋 Testing help command..."
node dist/index.js --help

echo ""
echo "✅ CLI test complete!"
echo "🚀 To test creating a project:"
echo "   node dist/index.js test-project --yes"
