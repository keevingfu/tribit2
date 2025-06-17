#!/bin/bash

echo "🚀 Starting Vercel Turso Auto-Configuration and Deployment"
echo "========================================================="
echo ""

# Step 1: Verify login
echo "1️⃣ Verifying Vercel login..."
if vercel whoami > /dev/null 2>&1; then
    USER=$(vercel whoami 2>&1 | tail -n 1)
    echo "✅ Logged in as: $USER"
else
    echo "❌ Not logged in. Please run 'vercel login' first"
    exit 1
fi

# Step 2: Link project
echo ""
echo "2️⃣ Linking Vercel project..."
vercel link --yes

# Step 3: Add environment variables
echo ""
echo "3️⃣ Adding Turso environment variables..."
echo "libsql://tribit-prod-keevingfu.aws-us-west-2.turso.io" | vercel env add TURSO_DATABASE_URL production --force
echo "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTAwNTYyNzksImlkIjoiYzY0ODFkYjEtNTlmNC00ZGY0LTg0NTAtNGRhM2I0YWE2MDM3IiwicmlkIjoiNWU3MDJjMzItZmYzOC00ODRjLTkxNTAtMjFjZmY2MGMyYzE2In0.FrMGP7X8apA_GQpJzNKnJrkLWz8gbaz5-u7wx34bebJg6JPio-27P77B81Mw2TN-bI8hBeDOfg2znVuzQVPiAA" | vercel env add TURSO_AUTH_TOKEN production --force

# Step 4: List environment variables
echo ""
echo "4️⃣ Confirming environment variables..."
vercel env ls production

# Step 5: Deploy
echo ""
echo "5️⃣ Deploying to production..."
echo "This will take 1-2 minutes..."
vercel --prod --yes

echo ""
echo "✅ Deployment complete!"
echo ""
echo "6️⃣ Waiting 15 seconds for deployment to be ready..."
sleep 15

# Step 6: Verify
echo ""
echo "7️⃣ Verifying deployment..."
node scripts/verify-vercel-turso.js

echo ""
echo "🎉 All done! Your application is now live with Turso database."
echo ""
echo "📍 Access your application:"
echo "   🏠 Homepage: https://tribit2.vercel.app"
echo "   👥 KOL Overview: https://tribit2.vercel.app/kol/overview"
echo "   🔍 Health Check: https://tribit2.vercel.app/api/health"