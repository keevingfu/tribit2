# Vercel Turso Configuration Guide

## Current Status
- ✅ Code is synced to GitHub
- ✅ Vercel auto-deployment is working
- ⚠️ Turso database is NOT configured (using in-memory SQLite)

## Step-by-Step Configuration

### Step 1: Login to Vercel CLI
```bash
vercel login
```
Choose your preferred login method (GitHub recommended).

### Step 2: Configure Environment Variables

#### Option A: Using the automated script (after login)
```bash
node scripts/vercel-env-config.js
```

#### Option B: Manual configuration
```bash
# Link project
vercel link --yes

# Add TURSO_DATABASE_URL
echo "libsql://tribit-prod-keevingfu.aws-us-west-2.turso.io" | vercel env add TURSO_DATABASE_URL production

# Add TURSO_AUTH_TOKEN
echo "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTAwNTYyNzksImlkIjoiYzY0ODFkYjEtNTlmNC00ZGY0LTg0NTAtNGRhM2I0YWE2MDM3IiwicmlkIjoiNWU3MDJjMzItZmYzOC00ODRjLTkxNTAtMjFjZmY2MGMyYzE2In0.FrMGP7X8apA_GQpJzNKnJrkLWz8gbaz5-u7wx34bebJg6JPio-27P77B81Mw2TN-bI8hBeDOfg2znVuzQVPiAA" | vercel env add TURSO_AUTH_TOKEN production
```

### Step 3: Deploy to Production
```bash
vercel --prod
```

### Step 4: Verify Deployment
```bash
node scripts/verify-vercel-turso.js
```

## Expected Results After Configuration

The health check should show:
```json
{
  "database": {
    "type": "turso",
    "status": "connected",
    "tursoUrl": "libsql://tribit-prod-keevingfu.aws-us-west-2.turso.io"
  },
  "environment": {
    "tursoConfigured": true
  }
}
```

## Troubleshooting

1. **Login Issues**
   - Make sure you're using the correct Vercel account
   - Try `vercel logout` then `vercel login` again

2. **Environment Variable Issues**
   - Use `vercel env ls production` to list current variables
   - Use `vercel env rm VARIABLE_NAME production` to remove if needed

3. **Deployment Issues**
   - Check logs at: https://vercel.com/keevingfu/tribit2
   - Use `vercel logs` to see recent deployment logs

## Quick Commands Summary
```bash
# Check login status
vercel whoami

# List environment variables
vercel env ls production

# Deploy to production
vercel --prod

# Check deployment status
node scripts/verify-vercel-turso.js
```