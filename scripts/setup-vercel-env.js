#!/usr/bin/env node

/**
 * Script to help setup Vercel environment variables for Turso database
 * Usage: node scripts/setup-vercel-env.js
 */

console.log('\n===========================================');
console.log('Vercel Environment Variables Setup Guide');
console.log('===========================================\n');

console.log('You need to add the following environment variables in Vercel:\n');

console.log('1. TURSO_DATABASE_URL');
console.log('   Example: libsql://tribit-prod-keevingfu.aws-us-west-2.turso.io');
console.log('   Note: This should NOT include any authentication token\n');

console.log('2. TURSO_AUTH_TOKEN');
console.log('   Example: eyJhbGciOiJFZERTQS...(long token)');
console.log('   ⚠️  IMPORTANT: Make sure the token does NOT contain any line breaks!');
console.log('   ⚠️  Copy the token carefully without any whitespace or newlines\n');

console.log('To add these variables:');
console.log('1. Go to: https://vercel.com/keevingfus-projects/tribit/settings/environment-variables');
console.log('2. Click "Add Variable"');
console.log('3. Add each variable with the correct value');
console.log('4. Make sure to select "Production", "Preview", and "Development" environments');
console.log('5. Click "Save"\n');

console.log('Common issues to avoid:');
console.log('- ❌ Token with line breaks (causes "invalid header value" error)');
console.log('- ❌ Token with extra spaces');
console.log('- ❌ Token wrapped in quotes');
console.log('- ✅ Token should be a single line with no spaces or quotes\n');

console.log('After adding the variables:');
console.log('1. Redeploy your project: vercel --prod --yes');
console.log('2. Check connection: node scripts/check-vercel-db-connection.js\n');

console.log('To get your Turso credentials:');
console.log('1. Install Turso CLI: curl -sSfL https://get.tur.so/install.sh | bash');
console.log('2. Login: turso auth login');
console.log('3. List databases: turso db list');
console.log('4. Get URL: turso db show <database-name>');
console.log('5. Get token: turso db tokens create <database-name>\n');

console.log('Testing locally with Turso:');
console.log('export TURSO_DATABASE_URL="your-database-url"');
console.log('export TURSO_AUTH_TOKEN="your-auth-token"');
console.log('USE_TURSO=true npm run dev\n');