#!/bin/bash

# Vercel build script
echo "Starting Vercel build..."

# Create data directory if it doesn't exist
mkdir -p data

# Check if database exists
if [ ! -f "data/tribit.db" ]; then
  echo "Warning: Database file not found"
  # You could download it from a CDN or create a minimal version
  # For now, we'll create an empty file to prevent build errors
  touch data/tribit.db
fi

# Run the actual build
npm run build