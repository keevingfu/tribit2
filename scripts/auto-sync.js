#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

class AutoSync {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.gitignorePath = path.join(this.projectRoot, '.gitignore');
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  execCommand(command, options = {}) {
    try {
      return execSync(command, { 
        cwd: this.projectRoot, 
        encoding: 'utf8',
        ...options 
      });
    } catch (error) {
      if (!options.ignoreError) {
        throw error;
      }
      return null;
    }
  }

  async prompt(question) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer.toLowerCase().trim());
      });
    });
  }

  checkGitStatus() {
    this.log('\n🔍 Checking Git Status...', 'cyan');
    
    const status = this.execCommand('git status --porcelain');
    if (!status.trim()) {
      this.log('✅ No changes to commit', 'green');
      return false;
    }

    this.log('📝 Changes detected:', 'yellow');
    console.log(status);
    return true;
  }

  runValidation() {
    this.log('\n🧪 Running Validation Checks...', 'cyan');
    
    const checks = [
      {
        name: 'Linting',
        command: 'npm run lint',
        emoji: '🔍'
      },
      {
        name: 'Type Checking',
        command: 'npm run type-check',
        emoji: '📝'
      },
      {
        name: 'Tests',
        command: 'npm run test -- --passWithNoTests',
        emoji: '🧪'
      }
    ];

    for (const check of checks) {
      try {
        this.log(`${check.emoji} Running ${check.name}...`, 'yellow');
        this.execCommand(check.command, { stdio: 'pipe' });
        this.log(`✅ ${check.name} passed`, 'green');
      } catch (error) {
        this.log(`❌ ${check.name} failed`, 'red');
        console.error(error.stdout || error.message);
        return false;
      }
    }

    return true;
  }

  stageChanges() {
    this.log('\n📦 Staging Changes...', 'cyan');
    
    // Add all changes except ignored files
    this.execCommand('git add -A');
    
    const staged = this.execCommand('git diff --cached --stat');
    if (staged.trim()) {
      this.log('✅ Changes staged successfully', 'green');
      console.log(staged);
      return true;
    }
    
    return false;
  }

  async createCommit() {
    this.log('\n💬 Creating Commit...', 'cyan');
    
    const defaultMessage = `chore: auto-sync updates at ${new Date().toISOString()}`;
    const commitMessage = await this.prompt(
      `Enter commit message (or press Enter for default):\n[${defaultMessage}]: `
    ) || defaultMessage;

    try {
      const commitCmd = `git commit -m "${commitMessage}\n\n🤖 Auto-synced by auto-sync.js"`;
      const result = this.execCommand(commitCmd);
      this.log('✅ Commit created successfully', 'green');
      console.log(result);
      return true;
    } catch (error) {
      this.log('❌ Commit failed', 'red');
      console.error(error.message);
      return false;
    }
  }

  pushToRemote() {
    this.log('\n🚀 Pushing to Remote Repository...', 'cyan');
    
    try {
      // Fetch latest changes first
      this.execCommand('git fetch origin');
      
      // Check if we need to pull
      const behind = this.execCommand('git rev-list --count HEAD..origin/main').trim();
      if (parseInt(behind) > 0) {
        this.log('⚠️  Remote has new changes. Pulling first...', 'yellow');
        this.execCommand('git pull origin main --rebase');
      }
      
      // Push to remote
      const result = this.execCommand('git push origin main');
      this.log('✅ Successfully pushed to remote repository', 'green');
      console.log(result || 'Push completed');
      return true;
    } catch (error) {
      this.log('❌ Push failed', 'red');
      console.error(error.message);
      return false;
    }
  }

  showSyncStatus() {
    this.log('\n📊 Sync Status Report', 'cyan');
    
    const localCommit = this.execCommand('git rev-parse HEAD').trim().substring(0, 7);
    const remoteCommit = this.execCommand('git rev-parse origin/main').trim().substring(0, 7);
    
    console.log(`Local:  ${localCommit}`);
    console.log(`Remote: ${remoteCommit}`);
    
    if (localCommit === remoteCommit) {
      this.log('✅ Local and remote are in sync!', 'green');
    } else {
      this.log('⚠️  Local and remote differ', 'yellow');
    }
  }

  async run(options = {}) {
    this.log('\n🔄 Auto-Sync Started', 'bright');
    this.log('=' .repeat(50), 'cyan');

    try {
      // Check if there are changes
      if (!this.checkGitStatus()) {
        this.showSyncStatus();
        return;
      }

      // Skip validation if --skip-validation flag is passed
      if (!options.skipValidation) {
        const validationPassed = this.runValidation();
        if (!validationPassed) {
          this.log('\n❌ Validation failed. Please fix errors before syncing.', 'red');
          process.exit(1);
        }
      }

      // Stage changes
      if (!this.stageChanges()) {
        this.log('⚠️  No changes to stage after gitignore filtering', 'yellow');
        return;
      }

      // Create commit
      if (!await this.createCommit()) {
        this.log('❌ Sync aborted due to commit failure', 'red');
        process.exit(1);
      }

      // Push to remote
      if (!this.pushToRemote()) {
        this.log('⚠️  Changes committed locally but not pushed to remote', 'yellow');
        this.log('   Run "git push origin main" manually when ready', 'yellow');
      }

      // Show final status
      this.showSyncStatus();
      
      this.log('\n✅ Auto-Sync Completed Successfully!', 'green');
      
    } catch (error) {
      this.log(`\n❌ Auto-Sync Failed: ${error.message}`, 'red');
      process.exit(1);
    }
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  skipValidation: args.includes('--skip-validation') || args.includes('-s')
};

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Auto-Sync Tool - Automatically sync local changes to remote repository

Usage: npm run sync [options]

Options:
  -s, --skip-validation    Skip validation checks (lint, type-check, test)
  -h, --help              Show this help message

Example:
  npm run sync                    # Run with all validations
  npm run sync -s                 # Skip validations for quick sync
`);
  process.exit(0);
}

// Run auto-sync
const autoSync = new AutoSync();
autoSync.run(options);