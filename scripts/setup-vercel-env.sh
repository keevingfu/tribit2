#!/bin/bash

echo "🚀 Setting up Vercel Environment Variables for Turso"
echo "=================================================="

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing..."
    npm i -g vercel
fi

# Environment variables
TURSO_URL="libsql://tribit-prod-keevingfu.aws-us-west-2.turso.io"
TURSO_TOKEN="eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTAwNTYyNzksImlkIjoiYzY0ODFkYjEtNTlmNC00ZGY0LTg0NTAtNGRhM2I0YWE2MDM3IiwicmlkIjoiNWU3MDJjMzItZmYzOC00ODRjLTkxNTAtMjFjZmY2MGMyYzE2In0.FrMGP7X8apA_GQpJzNKnJrkLWz8gbaz5-u7wx34bebJg6JPio-27P77B81Mw2TN-bI8hBeDOfg2znVuzQVPiAA"

echo ""
echo "📝 This script will add the following environment variables to Vercel:"
echo "   - TURSO_DATABASE_URL"
echo "   - TURSO_AUTH_TOKEN"
echo ""
echo "Press Enter to continue or Ctrl+C to cancel..."
read

# Link to Vercel project if not already linked
echo "🔗 Linking to Vercel project..."
vercel link --yes

# Add environment variables
echo ""
echo "📌 Adding TURSO_DATABASE_URL..."
echo "$TURSO_URL" | vercel env add TURSO_DATABASE_URL production

echo ""
echo "📌 Adding TURSO_AUTH_TOKEN..."
echo "$TURSO_TOKEN" | vercel env add TURSO_AUTH_TOKEN production

echo ""
echo "✅ Environment variables added successfully!"
echo ""
echo "🚀 Triggering a new deployment..."
vercel --prod

echo ""
echo "✨ Setup complete! Your Vercel deployment should now connect to Turso."
echo "📍 Check deployment status at: https://vercel.com/keevingfu/tribit2"
echo "🔍 Verify connection at: https://tribit2.vercel.app/api/health"