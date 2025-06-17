#!/bin/bash

echo "🚀 Vercel Turso Auto-Configuration and Deployment Script"
echo "======================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Environment variables
TURSO_URL="libsql://tribit-prod-keevingfu.aws-us-west-2.turso.io"
TURSO_TOKEN="eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTAwNTYyNzksImlkIjoiYzY0ODFkYjEtNTlmNC00ZGY0LTg0NTAtNGRhM2I0YWE2MDM3IiwicmlkIjoiNWU3MDJjMzItZmYzOC00ODRjLTkxNTAtMjFjZmY2MGMyYzE2In0.FrMGP7X8apA_GQpJzNKnJrkLWz8gbaz5-u7wx34bebJg6JPio-27P77B81Mw2TN-bI8hBeDOfg2znVuzQVPiAA"

# Step 1: Check login status
echo -e "${YELLOW}Step 1: Checking Vercel login status...${NC}"
if vercel whoami > /dev/null 2>&1; then
    USER=$(vercel whoami 2>/dev/null)
    echo -e "${GREEN}✅ Logged in as: $USER${NC}"
else
    echo -e "${RED}❌ Not logged in. Please run 'vercel login' first${NC}"
    exit 1
fi

# Step 2: Link project
echo -e "\n${YELLOW}Step 2: Linking project...${NC}"
if [ -d ".vercel" ]; then
    echo -e "${GREEN}✅ Project already linked${NC}"
else
    echo "Linking to Vercel project..."
    vercel link --yes
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Project linked successfully${NC}"
    else
        echo -e "${RED}❌ Failed to link project${NC}"
        exit 1
    fi
fi

# Step 3: List current environment variables
echo -e "\n${YELLOW}Step 3: Current environment variables:${NC}"
vercel env ls production

# Step 4: Add environment variables
echo -e "\n${YELLOW}Step 4: Adding Turso environment variables...${NC}"

# Remove existing variables if they exist
echo "Removing existing variables (if any)..."
vercel env rm TURSO_DATABASE_URL production 2>/dev/null
vercel env rm TURSO_AUTH_TOKEN production 2>/dev/null

# Add TURSO_DATABASE_URL
echo -e "\nAdding TURSO_DATABASE_URL..."
echo "$TURSO_URL" | vercel env add TURSO_DATABASE_URL production
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ TURSO_DATABASE_URL added${NC}"
else
    echo -e "${RED}❌ Failed to add TURSO_DATABASE_URL${NC}"
    exit 1
fi

# Add TURSO_AUTH_TOKEN
echo -e "\nAdding TURSO_AUTH_TOKEN..."
echo "$TURSO_TOKEN" | vercel env add TURSO_AUTH_TOKEN production
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ TURSO_AUTH_TOKEN added${NC}"
else
    echo -e "${RED}❌ Failed to add TURSO_AUTH_TOKEN${NC}"
    exit 1
fi

# Step 5: Verify environment variables
echo -e "\n${YELLOW}Step 5: Verifying environment variables...${NC}"
vercel env ls production | grep -E "(TURSO_DATABASE_URL|TURSO_AUTH_TOKEN)"

# Step 6: Deploy to production
echo -e "\n${YELLOW}Step 6: Deploying to production...${NC}"
echo "This may take 1-2 minutes..."
vercel --prod --yes

if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}✅ Deployment completed successfully!${NC}"
    
    echo -e "\n${YELLOW}Step 7: Verifying deployment...${NC}"
    sleep 10  # Wait for deployment to be fully ready
    
    # Run verification
    node scripts/verify-vercel-turso.js
    
    echo -e "\n${GREEN}🎉 All done! Your application is now using Turso database.${NC}"
    echo -e "\n📍 Access your application at:"
    echo -e "   - Homepage: https://tribit2.vercel.app"
    echo -e "   - KOL Overview: https://tribit2.vercel.app/kol/overview"
    echo -e "   - Health Check: https://tribit2.vercel.app/api/health"
else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi