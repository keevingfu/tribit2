#!/usr/bin/env node

/**
 * Script to help fix TURSO_AUTH_TOKEN format issue
 */

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// The correct token without any line breaks
const CORRECT_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTAwNTYyNzksImlkIjoiYzY0ODFkYjEtNTlmNC00ZGY0LTg0NTAtNGRhM2I0YWE2MDM3IiwicmlkIjoiNWU3MDJjMzItZmYzOC00ODRjLTkxNTAtMjFjZmY2MGMyYzE2In0.FrMGP7X8apA_GQpJzNKnJrkLWz8gbaz5-u7wx34bebJg6JPio-27P77B81Mw2TN-bI8hBeDOfg2znVuzQVPiAA';

console.log(`\n${colors.red}===========================================`);
console.log('TURSO_AUTH_TOKEN Format Issue Fix');
console.log(`===========================================${colors.reset}\n`);

console.log(`${colors.red}⚠️  Problem Identified:${colors.reset}`);
console.log('The TURSO_AUTH_TOKEN in Vercel contains line breaks.\n');

console.log(`${colors.yellow}Solution:${colors.reset}`);
console.log('1. Remove the existing token from Vercel');
console.log('2. Re-add it with the correct format\n');

console.log(`${colors.blue}Step 1: Remove the broken token${colors.reset}`);
console.log(`Run: ${colors.green}vercel env rm TURSO_AUTH_TOKEN${colors.reset}\n`);

console.log(`${colors.blue}Step 2: Re-add the token correctly${colors.reset}`);
console.log('Run these commands for each environment:\n');

console.log(`${colors.green}vercel env add TURSO_AUTH_TOKEN production${colors.reset}`);
console.log('When prompted, paste this token (COPY THE ENTIRE LINE BELOW):');
console.log(`${colors.yellow}${CORRECT_TOKEN}${colors.reset}\n`);

console.log(`${colors.green}vercel env add TURSO_AUTH_TOKEN preview${colors.reset}`);
console.log('Paste the same token again\n');

console.log(`${colors.green}vercel env add TURSO_AUTH_TOKEN development${colors.reset}`);
console.log('Paste the same token again\n');

console.log(`${colors.red}⚠️  CRITICAL: How to copy the token correctly:${colors.reset}`);
console.log('1. Triple-click the yellow line above to select the entire token');
console.log('2. Copy it (Cmd+C on Mac)');
console.log('3. When Vercel prompts for the value, paste it');
console.log('4. Press Enter immediately (don\'t add any extra characters)\n');

console.log(`${colors.blue}Step 3: Redeploy${colors.reset}`);
console.log(`${colors.green}vercel --prod --yes${colors.reset}\n`);

console.log(`${colors.blue}Alternative: Use Web UI${colors.reset}`);
console.log('1. Go to: https://vercel.com/keevingfus-projects/tribit/settings/environment-variables');
console.log('2. Find TURSO_AUTH_TOKEN and click the three dots menu');
console.log('3. Select "Edit"');
console.log('4. Clear the value field completely');
console.log('5. Paste this token (make sure it\'s one line):');
console.log(`\n${colors.yellow}${CORRECT_TOKEN}${colors.reset}\n`);
console.log('6. Save the changes');
console.log('7. Redeploy the project\n');

// Also save the token to a file for easy copying
const fs = require('fs');
const tokenFile = 'turso-token.txt';
fs.writeFileSync(tokenFile, CORRECT_TOKEN, 'utf8');
console.log(`${colors.green}✓ Token saved to ${tokenFile} for easy copying${colors.reset}\n`);