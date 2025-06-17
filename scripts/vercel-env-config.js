#!/usr/bin/env node

const { execSync } = require('child_process');

const TURSO_URL = 'libsql://tribit-prod-keevingfu.aws-us-west-2.turso.io';
const TURSO_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTAwNTYyNzksImlkIjoiYzY0ODFkYjEtNTlmNC00ZGY0LTg0NTAtNGRhM2I0YWE2MDM3IiwicmlkIjoiNWU3MDJjMzItZmYzOC00ODRjLTkxNTAtMjFjZmY2MGMyYzE2In0.FrMGP7X8apA_GQpJzNKnJrkLWz8gbaz5-u7wx34bebJg6JPio-27P77B81Mw2TN-bI8hBeDOfg2znVuzQVPiAA';

console.log('🚀 Configuring Vercel Environment Variables\n');

function runCommand(command, showOutput = true) {
  try {
    const output = execSync(command, { encoding: 'utf-8' });
    if (showOutput && output) console.log(output);
    return output;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return null;
  }
}

async function main() {
  // Check if logged in
  console.log('🔍 Checking Vercel login status...');
  const whoami = runCommand('vercel whoami', false);
  if (!whoami) {
    console.log('❌ Not logged in to Vercel');
    console.log('Please run: vercel login');
    process.exit(1);
  }
  console.log(`✅ Logged in as: ${whoami.trim()}\n`);

  // Link project if not already linked
  console.log('🔗 Checking project link...');
  const projectInfo = runCommand('vercel project ls', false);
  if (!projectInfo || !projectInfo.includes('tribit2')) {
    console.log('Linking to project...');
    runCommand('vercel link --yes');
  } else {
    console.log('✅ Project already linked\n');
  }

  // List current environment variables
  console.log('📋 Current environment variables:');
  runCommand('vercel env ls production');

  // Add environment variables
  console.log('\n📝 Adding Turso environment variables...\n');
  
  // Add TURSO_DATABASE_URL
  console.log('Adding TURSO_DATABASE_URL...');
  const addUrlCmd = `echo "${TURSO_URL}" | vercel env add TURSO_DATABASE_URL production --force`;
  runCommand(addUrlCmd);
  
  // Add TURSO_AUTH_TOKEN
  console.log('\nAdding TURSO_AUTH_TOKEN...');
  const addTokenCmd = `echo "${TURSO_TOKEN}" | vercel env add TURSO_AUTH_TOKEN production --force`;
  runCommand(addTokenCmd);

  // Pull environment variables to verify
  console.log('\n🔄 Pulling environment variables to verify...');
  runCommand('vercel env pull .env.production.local --environment=production --yes');

  console.log('\n✅ Environment variables configured successfully!');
  console.log('\n🚀 Next steps:');
  console.log('1. Deploy to production: vercel --prod');
  console.log('2. Or trigger deployment from Vercel dashboard');
  console.log('3. Verify at: https://tribit2.vercel.app/api/health');
}

// Run the script
main().catch(console.error);