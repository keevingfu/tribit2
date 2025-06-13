#!/bin/bash

# Vercel build script
echo "Starting Vercel build..."

# Create data directory if it doesn't exist
mkdir -p data

# Check if database exists
if [ ! -f "data/tribit.db" ]; then
  echo "Warning: Database file not found in build environment"
  echo "The application will run with limited functionality"
  # Create placeholder to prevent build errors
  touch data/tribit.db
fi

# Show build environment info
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

# Run the actual build
echo "Running Next.js build..."
npm run build