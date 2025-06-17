#!/usr/bin/env node

console.log(`
🚀 Quick Vercel Deployment with Turso

To quickly deploy with Turso environment variables:

1. Manual Method (Recommended):
   - Go to: https://vercel.com/keevingfu/tribit2/settings/environment-variables
   - Add these variables for Production:
   
   TURSO_DATABASE_URL:
   libsql://tribit-prod-keevingfu.aws-us-west-2.turso.io
   
   TURSO_AUTH_TOKEN:
   eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTAwNTYyNzksImlkIjoiYzY0ODFkYjEtNTlmNC00ZGY0LTg0NTAtNGRhM2I0YWE2MDM3IiwicmlkIjoiNWU3MDJjMzItZmYzOC00ODRjLTkxNTAtMjFjZmY2MGMyYzE2In0.FrMGP7X8apA_GQpJzNKnJrkLWz8gbaz5-u7wx34bebJg6JPio-27P77B81Mw2TN-bI8hBeDOfg2znVuzQVPiAA
   
   - Click "Save" after each variable
   - Then redeploy from the Vercel dashboard

2. CLI Method:
   Run: ./scripts/setup-vercel-env.sh

3. Quick Redeploy (if env vars are already set):
   Run: npx vercel --prod

After deployment, verify at:
https://tribit2.vercel.app/api/health

Expected response should show:
{
  "database": {
    "type": "turso",
    "status": "connected"
  }
}
`);