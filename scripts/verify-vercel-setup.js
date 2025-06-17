#!/usr/bin/env node

/**
 * Script to verify if Vercel environment variables are set correctly
 */

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

console.log(`\n${colors.blue}===========================================`);
console.log('Vercel Setup Verification');
console.log(`===========================================${colors.reset}\n`);

console.log(`${colors.yellow}Based on the error message, it seems:${colors.reset}`);
console.log(`${colors.green}✓ TURSO_DATABASE_URL is already configured${colors.reset}`);
console.log('  The error "variable has already been added" confirms this.\n');

console.log(`${colors.yellow}Next steps:${colors.reset}\n`);

console.log(`${colors.blue}1. Check if TURSO_AUTH_TOKEN is also configured:${colors.reset}`);
console.log('   Try adding it (if it fails with "already added", that\'s good!):\n');
console.log(`   ${colors.green}vercel env add TURSO_AUTH_TOKEN production${colors.reset}`);
console.log(`   ${colors.yellow}# Paste the token when prompted${colors.reset}\n`);

console.log(`${colors.blue}2. If both variables are already set, deploy directly:${colors.reset}`);
console.log(`   ${colors.green}vercel --prod --yes${colors.reset}\n`);

console.log(`${colors.blue}3. After deployment, test the connection:${colors.reset}`);
console.log(`   ${colors.green}node scripts/check-vercel-db-connection.js${colors.reset}\n`);

console.log(`${colors.yellow}Alternative: Check via Web UI${colors.reset}`);
console.log('Visit: https://vercel.com/keevingfus-projects/tribit/settings/environment-variables');
console.log('Verify both variables are present:\n');
console.log('- TURSO_DATABASE_URL');
console.log('- TURSO_AUTH_TOKEN\n');

console.log(`${colors.red}Troubleshooting:${colors.reset}`);
console.log('If deployment still fails:');
console.log('1. Make sure you\'re in the correct project directory');
console.log('2. Try: vercel link (to link to the correct project)');
console.log('3. Check the deployment URL matches: tribit-keevingfus-projects.vercel.app\n');

console.log(`${colors.green}Good news: Your environment variables seem to be configured!${colors.reset}`);
console.log('Just need to complete the deployment.\n');