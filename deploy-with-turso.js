#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const TURSO_URL = 'libsql://tribit-prod-keevingfu.aws-us-west-2.turso.io';
const TURSO_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTAwNTYyNzksImlkIjoiYzY0ODFkYjEtNTlmNC00ZGY0LTg0NTAtNGRhM2I0YWE2MDM3IiwicmlkIjoiNWU3MDJjMzItZmYzOC00ODRjLTkxNTAtMjFjZmY2MGMyYzE2In0.FrMGP7X8apA_GQpJzNKnJrkLWz8gbaz5-u7wx34bebJg6JPio-27P77B81Mw2TN-bI8hBeDOfg2znVuzQVPiAA';

console.log('🚀 Vercel Deployment with Turso Configuration\n');

function runCommand(cmd, silent = false) {
  try {
    const output = execSync(cmd, { encoding: 'utf-8', stdio: silent ? 'pipe' : 'inherit' });
    return output;
  } catch (error) {
    return null;
  }
}

async function deploy() {
  // Step 1: Check if logged in
  console.log('Checking Vercel login status...');
  const loginCheck = runCommand('vercel whoami', true);
  
  if (!loginCheck) {
    console.log('\n⚠️  You need to login to Vercel first.');
    console.log('\n📝 Please run the following command in your terminal:');
    console.log('\n   vercel login\n');
    console.log('After logging in, run this script again.');
    process.exit(1);
  }

  console.log('✅ Logged in to Vercel\n');

  // Step 2: Provide deployment options
  console.log('Choose deployment method:\n');
  console.log('1. Deploy with environment variables (recommended)');
  console.log('2. Deploy without environment variables (will use in-memory database)');
  console.log('3. Exit\n');

  rl.question('Enter your choice (1-3): ', (answer) => {
    switch(answer) {
      case '1':
        deployWithEnv();
        break;
      case '2':
        deployWithoutEnv();
        break;
      default:
        console.log('Exiting...');
        rl.close();
        process.exit(0);
    }
  });
}

function deployWithEnv() {
  console.log('\n📝 To deploy with Turso, you need to:');
  console.log('\n1. First, add environment variables manually:');
  console.log('   vercel env add TURSO_DATABASE_URL production');
  console.log('   (paste: ' + TURSO_URL + ')');
  console.log('\n   vercel env add TURSO_AUTH_TOKEN production');
  console.log('   (paste the token when prompted)');
  console.log('\n2. Then deploy:');
  console.log('   vercel --prod\n');
  
  console.log('Or use this one-liner after setting up env vars:');
  console.log('vercel --prod --yes\n');
  
  rl.close();
}

function deployWithoutEnv() {
  console.log('\nDeploying without Turso (using in-memory database)...');
  runCommand('vercel --prod --yes');
  console.log('\n✅ Deployed! But using in-memory database.');
  console.log('To use Turso, add environment variables in Vercel dashboard.');
  rl.close();
}

// Run the deployment
deploy();