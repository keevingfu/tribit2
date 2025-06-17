# Vercel Turso Deployment Steps

## ⚠️ Prerequisites
You must complete `vercel login` first. The login process:
1. Run `vercel login` in terminal
2. Choose login method (GitHub recommended)
3. Complete browser authorization
4. Return to terminal

## ✅ After Login, Run These Commands

Copy and paste each command one by one:

### 1. Link Project
```bash
vercel link --yes
```

### 2. Add Database URL
```bash
echo "libsql://tribit-prod-keevingfu.aws-us-west-2.turso.io" | vercel env add TURSO_DATABASE_URL production
```

### 3. Add Auth Token
```bash
echo "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTAwNTYyNzksImlkIjoiYzY0ODFkYjEtNTlmNC00ZGY0LTg0NTAtNGRhM2I0YWE2MDM3IiwicmlkIjoiNWU3MDJjMzItZmYzOC00ODRjLTkxNTAtMjFjZmY2MGMyYzE2In0.FrMGP7X8apA_GQpJzNKnJrkLWz8gbaz5-u7wx34bebJg6JPio-27P77B81Mw2TN-bI8hBeDOfg2znVuzQVPiAA" | vercel env add TURSO_AUTH_TOKEN production
```

### 4. Verify Environment Variables
```bash
vercel env ls production
```

### 5. Deploy to Production
```bash
vercel --prod --yes
```

### 6. Verify Deployment (after 30 seconds)
```bash
node scripts/verify-vercel-turso.js
```

## 🔍 Expected Results

After successful deployment, the health check should show:
```json
{
  "database": {
    "type": "turso",
    "status": "connected"
  }
}
```

## 📍 Access Your App
- Homepage: https://tribit2.vercel.app
- KOL Overview: https://tribit2.vercel.app/kol/overview
- Health Check: https://tribit2.vercel.app/api/health