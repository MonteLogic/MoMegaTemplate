#!/bin/bash

# Build script for new-momega CLI

echo "🔨 Building new-momega CLI..."

# Clean dist directory
rm -rf dist

# Build TypeScript
echo "📦 Compiling TypeScript..."
npx tsc

# Make the CLI executable
chmod +x dist/index.js

echo "✅ Build complete!"
echo "🚀 You can now test the CLI with:"
echo "   node dist/index.js --help"
echo "   node dist/index.js my-test-app"
