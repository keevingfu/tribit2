#!/usr/bin/env node

/**
 * Interactive script to setup Vercel environment variables for Turso
 */

const { execSync } = require('child_process');

const TURSO_URL = 'libsql://tribit-prod-keevingfu.aws-us-west-2.turso.io';
const TURSO_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTAwNTYyNzksImlkIjoiYzY0ODFkYjEtNTlmNC00ZGY0LTg0NTAtNGRhM2I0YWE2MDM3IiwicmlkIjoiNWU3MDJjMzItZmYzOC00ODRjLTkxNTAtMjFjZmY2MGMyYzE2In0.FrMGP7X8apA_GQpJzNKnJrkLWz8gbaz5-u7wx34bebJg6JPio-27P77B81Mw2TN-bI8hBeDOfg2znVuzQVPiAA';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

console.log(`\n${colors.blue}===========================================`);
console.log('Vercel Turso Setup Script');
console.log(`===========================================${colors.reset}\n`);

// Check if logged in
try {
  execSync('vercel whoami', { stdio: 'pipe' });
  console.log(`${colors.green}✓ Already logged in to Vercel${colors.reset}\n`);
} catch (error) {
  console.log(`${colors.yellow}⚠ Not logged in to Vercel${colors.reset}`);
  console.log(`Please run: ${colors.blue}vercel login${colors.reset}\n`);
  console.log('After logging in, run this script again.\n');
  process.exit(1);
}

console.log(`${colors.blue}Option 1: Manual Setup (Recommended)${colors.reset}`);
console.log('1. Visit: https://vercel.com/keevingfus-projects/tribit/settings/environment-variables');
console.log('2. Add these environment variables:\n');

console.log(`${colors.yellow}TURSO_DATABASE_URL${colors.reset}`);
console.log(`Value: ${colors.green}${TURSO_URL}${colors.reset}`);
console.log('Environments: ✅ Production, ✅ Preview, ✅ Development\n');

console.log(`${colors.yellow}TURSO_AUTH_TOKEN${colors.reset}`);
console.log(`Value: ${colors.green}${TURSO_TOKEN}${colors.reset}`);
console.log('Environments: ✅ Production, ✅ Preview, ✅ Development\n');

console.log(`${colors.red}⚠️  Important: Copy the token as a single line without line breaks!${colors.reset}\n`);

console.log(`${colors.blue}Option 2: Command Line Setup${colors.reset}`);
console.log('Run these commands one by one:\n');

const commands = [
  `vercel env add TURSO_DATABASE_URL production`,
  `# Paste: ${TURSO_URL}`,
  '',
  `vercel env add TURSO_DATABASE_URL preview`,
  `# Paste: ${TURSO_URL}`,
  '',
  `vercel env add TURSO_DATABASE_URL development`,
  `# Paste: ${TURSO_URL}`,
  '',
  `vercel env add TURSO_AUTH_TOKEN production`,
  `# Paste: ${TURSO_TOKEN}`,
  '',
  `vercel env add TURSO_AUTH_TOKEN preview`,
  `# Paste: ${TURSO_TOKEN}`,
  '',
  `vercel env add TURSO_AUTH_TOKEN development`,
  `# Paste: ${TURSO_TOKEN}`
];

commands.forEach(cmd => {
  if (cmd.startsWith('#')) {
    console.log(`  ${colors.yellow}${cmd}${colors.reset}`);
  } else if (cmd) {
    console.log(`  ${colors.green}${cmd}${colors.reset}`);
  } else {
    console.log('');
  }
});

console.log(`\n${colors.blue}After adding environment variables:${colors.reset}`);
console.log(`1. Deploy: ${colors.green}vercel --prod --yes${colors.reset}`);
console.log(`2. Verify: ${colors.green}node scripts/check-vercel-db-connection.js${colors.reset}\n`);

console.log(`${colors.blue}Quick Copy Commands:${colors.reset}`);
console.log(`\n${colors.yellow}TURSO_DATABASE_URL:${colors.reset}`);
console.log(TURSO_URL);
console.log(`\n${colors.yellow}TURSO_AUTH_TOKEN:${colors.reset}`);
console.log(TURSO_TOKEN);
console.log('');