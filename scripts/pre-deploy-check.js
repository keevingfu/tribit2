#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Running pre-deployment checks...\n');

let hasErrors = false;

// 1. Check if build works
console.log('📦 Testing build...');
try {
  execSync('npm run build', { stdio: 'pipe' });
  console.log('✅ Build successful\n');
} catch (error) {
  console.error('❌ Build failed! Fix build errors before deploying.\n');
  hasErrors = true;
}

// 2. Check environment files
console.log('🔐 Checking environment setup...');
const envExample = '.env.example';
const envLocal = '.env.local';

if (!fs.existsSync(envLocal)) {
  console.warn('⚠️  No .env.local file found. Make sure environment variables are set in Vercel.\n');
} else {
  console.log('✅ Environment file exists\n');
}

// 3. Check git status
console.log('📋 Checking git status...');
try {
  const status = execSync('git status --porcelain').toString();
  if (status.trim()) {
    console.warn('⚠️  You have uncommitted changes:\n');
    console.log(status);
    console.log('Consider committing these changes before deploying.\n');
  } else {
    console.log('✅ Working directory is clean\n');
  }
} catch (error) {
  console.error('❌ Git status check failed\n');
}

// 4. Check if on main branch
try {
  const branch = execSync('git branch --show-current').toString().trim();
  if (branch !== 'main') {
    console.warn(`⚠️  You are on branch '${branch}', not 'main'.\n`);
    console.log('Production deployments should typically be from the main branch.\n');
  } else {
    console.log('✅ On main branch\n');
  }
} catch (error) {
  console.error('❌ Branch check failed\n');
}

// 5. Check Vercel configuration
console.log('⚙️  Checking Vercel configuration...');
if (!fs.existsSync('vercel.json')) {
  console.error('❌ vercel.json not found!\n');
  hasErrors = true;
} else {
  console.log('✅ vercel.json exists\n');
}

// Summary
console.log('='.repeat(50));
if (hasErrors) {
  console.error('\n❌ Pre-deployment checks failed. Please fix the issues above.\n');
  process.exit(1);
} else {
  console.log('\n✅ All checks passed! Ready to deploy.\n');
  console.log('To deploy to production, run:');
  console.log('  npm run deploy\n');
  console.log('To create a preview deployment, run:');
  console.log('  npm run deploy:preview\n');
}