# Vercel Web Console Configuration Guide

Since you're already logged into the Vercel web console, let's configure the environment variables there.

## Step 1: Navigate to Environment Variables

Go to: https://vercel.com/keevingfus-projects/tribit2/settings/environment-variables

## Step 2: Add Environment Variables

Click "Add Variable" and add the following:

### Variable 1: TURSO_DATABASE_URL
- **Key**: `TURSO_DATABASE_URL`
- **Value**: 
```
libsql://tribit-prod-keevingfu.aws-us-west-2.turso.io
```
- **Environment**: ✅ Production
- Click "Save"

### Variable 2: TURSO_AUTH_TOKEN
- **Key**: `TURSO_AUTH_TOKEN`
- **Value**: 
```
eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTAwNTYyNzksImlkIjoiYzY0ODFkYjEtNTlmNC00ZGY0LTg0NTAtNGRhM2I0YWE2MDM3IiwicmlkIjoiNWU3MDJjMzItZmYzOC00ODRjLTkxNTAtMjFjZmY2MGMyYzE2In0.FrMGP7X8apA_GQpJzNKnJrkLWz8gbaz5-u7wx34bebJg6JPio-27P77B81Mw2TN-bI8hBeDOfg2znVuzQVPiAA
```
- **Environment**: ✅ Production
- Click "Save"

## Step 3: Redeploy

After adding both variables:

1. Go to: https://vercel.com/keevingfus-projects/tribit2
2. Click on the latest deployment
3. Click the "..." menu (three dots)
4. Select "Redeploy"
5. Click "Redeploy" in the confirmation dialog

## Step 4: Monitor Deployment

Watch the deployment progress. It should take 1-2 minutes.

## Step 5: Verify

Once deployed, check these URLs:

1. Health Check: https://tribit2.vercel.app/api/health
   - Should show `"type": "turso"` and `"status": "connected"`

2. KOL Data: https://tribit2.vercel.app/api/kol/total?page=1&pageSize=5
   - Should return actual KOL data

3. Statistics: https://tribit2.vercel.app/api/kol/total/statistics
   - Should show total_kols: 189

## Quick Test Links

- 🏠 Homepage: https://tribit2.vercel.app
- 🔍 Health Check: https://tribit2.vercel.app/api/health
- 👥 KOL Overview: https://tribit2.vercel.app/kol/overview
- 📊 Insights: https://tribit2.vercel.app/insight/search