#!/bin/bash

echo "================================================"
echo "     Vercel Deployment for Tribit Project"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Not in the buagent project directory!${NC}"
    echo "Please run this script from /Users/cavin/Desktop/dev/buagent/"
    exit 1
fi

echo -e "${GREEN}✅ Project directory confirmed${NC}"
echo ""

# Function to run vercel commands
deploy_with_vercel() {
    echo -e "${YELLOW}Starting Vercel deployment...${NC}"
    echo ""
    
    # Try using npx first
    echo "Using npx to run Vercel CLI..."
    echo "This may take a moment if it's the first time..."
    echo ""
    
    # Deploy to Vercel
    npx vercel --prod
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅ Deployment successful!${NC}"
        echo "Your project should now be live at https://tribit.vercel.app"
    else
        echo ""
        echo -e "${RED}❌ Deployment failed${NC}"
        echo ""
        echo "Alternative methods:"
        echo "1. Install Vercel CLI locally: npm install vercel"
        echo "2. Then run: ./node_modules/.bin/vercel --prod"
        echo ""
        echo "Or use the Vercel Dashboard:"
        echo "1. Go to https://vercel.com/import"
        echo "2. Import from: https://github.com/keevingfu/tribit2"
    fi
}

# Main execution
echo "This script will deploy your project to Vercel."
echo "Make sure you have:"
echo "  ✓ A Vercel account"
echo "  ✓ Internet connection"
echo ""

read -p "Continue with deployment? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    deploy_with_vercel
else
    echo "Deployment cancelled."
fi