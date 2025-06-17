# Vercel Environment Variables Setup

To enable Turso database connection in your Vercel deployment, you need to configure the following environment variables:

## Required Environment Variables

1. **TURSO_DATABASE_URL**
   - Your Turso database URL
   - Example: `libsql://tribit-keevingfu.turso.io`

2. **TURSO_AUTH_TOKEN**
   - Your Turso authentication token
   - Get it from: https://turso.tech/app/databases

## How to Configure in Vercel

### Option 1: Via Vercel Dashboard
1. Go to https://vercel.com/keevingfu/tribit2
2. Navigate to Settings → Environment Variables
3. Add the following variables:
   ```
   TURSO_DATABASE_URL=your_turso_database_url
   TURSO_AUTH_TOKEN=your_turso_auth_token
   ```
4. Click "Save" for each variable
5. Redeploy the application

### Option 2: Via Vercel CLI
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Link to your project
vercel link

# Add environment variables
vercel env add TURSO_DATABASE_URL production
vercel env add TURSO_AUTH_TOKEN production

# Redeploy
vercel --prod
```

### Option 3: Via .env.production.local (for local testing)
Create `.env.production.local` file:
```
TURSO_DATABASE_URL=your_turso_database_url
TURSO_AUTH_TOKEN=your_turso_auth_token
```

## Verify Configuration

After setting up environment variables and redeploying:

1. Check health endpoint:
   ```bash
   curl https://tribit2.vercel.app/api/health | jq
   ```

2. Expected response should show:
   ```json
   {
     "database": {
       "type": "turso",
       "status": "connected",
       "tursoUrl": "libsql://tribit-keevingfu.turso.io"
     },
     "environment": {
       "tursoConfigured": true
     }
   }
   ```

## Troubleshooting

If Turso is not connecting:
1. Verify environment variables are set correctly
2. Check Vercel function logs for errors
3. Ensure Turso database is accessible
4. Test connection locally first with the same credentials

## Security Notes

- Never commit environment variables to git
- Use Vercel's environment variable system for production
- Rotate auth tokens regularly
- Use different tokens for different environments