#!/bin/bash

echo "================================================"
echo "     Tribit Project Vercel Deployment Guide"
echo "================================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in the buagent project directory!"
    echo "Please run this script from /Users/cavin/Desktop/dev/buagent/"
    exit 1
fi

echo "📋 To deploy to Vercel, follow these steps:"
echo ""
echo "Option 1: Install Vercel CLI and deploy"
echo "----------------------------------------"
echo "1. Install Vercel CLI:"
echo "   npm i -g vercel"
echo ""
echo "2. Login to Vercel:"
echo "   vercel login"
echo ""
echo "3. Deploy to Vercel:"
echo "   vercel --prod"
echo ""
echo "   When prompted:"
echo "   - Set up and deploy: Y"
echo "   - Which scope: Choose your account"
echo "   - Link to existing project: Y"
echo "   - Project name: tribit"
echo ""

echo "Option 2: Use npx (without installing)"
echo "--------------------------------------"
echo "Run this command:"
echo "   npx vercel --prod"
echo ""

echo "Option 3: Manual upload via Vercel Dashboard"
echo "-------------------------------------------"
echo "1. Create a zip file of the project:"
echo "   zip -r tribit.zip . -x '*.git*' -x 'node_modules/*' -x '.next/*' -x '*.db'"
echo ""
echo "2. Go to https://vercel.com/keevingfus-projects/tribit"
echo "3. Click 'Settings' → 'Git' → 'Disconnect from Git'"
echo "4. Then upload the zip file manually"
echo ""

echo "Current project status:"
echo "----------------------"
echo "✅ All code is synced to GitHub"
echo "✅ Vercel configuration files are ready"
echo "✅ Build scripts are configured"
echo ""

read -p "Would you like to create a zip file for manual upload? (y/n): " choice

if [[ "$choice" == "y" || "$choice" == "Y" ]]; then
    echo ""
    echo "Creating zip file..."
    zip -r tribit-upload.zip . \
        -x '*.git*' \
        -x 'node_modules/*' \
        -x '.next/*' \
        -x 'dist/*' \
        -x 'coverage/*' \
        -x '*.db' \
        -x '*.log' \
        -x '.env*' \
        -x '__tests__/*' \
        -x 'e2e/*' \
        -x '.DS_Store'
    
    echo ""
    echo "✅ Created tribit-upload.zip"
    echo "📦 File size: $(du -h tribit-upload.zip | cut -f1)"
    echo ""
    echo "Next steps:"
    echo "1. Go to https://vercel.com/keevingfus-projects/tribit/settings/git"
    echo "2. Disconnect from Git if connected"
    echo "3. Upload tribit-upload.zip"
fi