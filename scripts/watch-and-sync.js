#!/usr/bin/env node

const chokidar = require('chokidar');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const debounce = require('lodash.debounce');

class FileWatcher {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.pendingChanges = new Set();
    this.isProcessing = false;
    
    // Paths to watch
    this.watchPaths = [
      'src/**/*',
      'app/**/*',
      'public/**/*',
      'styles/**/*',
      'scripts/**/*.js',
      'package.json',
      'tsconfig.json',
      'next.config.js',
      'tailwind.config.js',
      'CLAUDE.md',
      'README.md'
    ];

    // Paths to ignore
    this.ignorePaths = [
      'node_modules/**',
      '.next/**',
      '.git/**',
      'dist/**',
      'build/**',
      '*.log',
      '.DS_Store',
      '.env*',
      '*.lock'
    ];

    // Debounced sync function (wait 5 seconds after last change)
    this.debouncedSync = debounce(this.syncChanges.bind(this), 5000);
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const icons = {
      info: '📝',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      sync: '🔄'
    };
    
    console.log(`[${timestamp}] ${icons[type] || '📌'} ${message}`);
  }

  execCommand(command, options = {}) {
    try {
      return execSync(command, { 
        cwd: this.projectRoot, 
        encoding: 'utf8',
        stdio: 'pipe',
        ...options 
      });
    } catch (error) {
      if (!options.ignoreError) {
        this.log(`Command failed: ${command}`, 'error');
        this.log(error.message, 'error');
      }
      return null;
    }
  }

  async syncChanges() {
    if (this.isProcessing || this.pendingChanges.size === 0) {
      return;
    }

    this.isProcessing = true;
    const changes = Array.from(this.pendingChanges);
    this.pendingChanges.clear();

    this.log(`Syncing ${changes.length} changed files...`, 'sync');

    try {
      // Check git status
      const status = this.execCommand('git status --porcelain');
      if (!status || !status.trim()) {
        this.log('No changes to sync', 'info');
        this.isProcessing = false;
        return;
      }

      // Stage changes
      this.execCommand('git add -A');

      // Create commit message
      const fileCount = changes.length;
      const fileList = changes.slice(0, 5).join(', ');
      const extraFiles = fileCount > 5 ? ` and ${fileCount - 5} more` : '';
      const commitMessage = `chore: auto-sync ${fileCount} files (${fileList}${extraFiles})`;

      // Commit changes
      const commitCmd = `git commit -m "${commitMessage}" -m "🤖 Auto-synced by file watcher"`;
      const commitResult = this.execCommand(commitCmd, { ignoreError: true });
      
      if (!commitResult) {
        this.log('No changes to commit', 'info');
        this.isProcessing = false;
        return;
      }

      this.log('Changes committed successfully', 'success');

      // Push to remote
      this.log('Pushing to remote repository...', 'sync');
      const pushResult = this.execCommand('git push origin main', { ignoreError: true });
      
      if (pushResult) {
        this.log('Successfully pushed to remote repository', 'success');
      } else {
        this.log('Failed to push to remote. Changes saved locally.', 'warning');
        this.log('Run "git push origin main" manually when ready', 'warning');
      }

    } catch (error) {
      this.log(`Sync failed: ${error.message}`, 'error');
    } finally {
      this.isProcessing = false;
    }
  }

  handleFileChange(eventType, filePath) {
    const relativePath = path.relative(this.projectRoot, filePath);
    
    // Skip if file is in node_modules or other ignored paths
    if (this.ignorePaths.some(pattern => relativePath.includes(pattern.replace('/**', '')))) {
      return;
    }

    this.log(`${eventType}: ${relativePath}`, 'info');
    this.pendingChanges.add(relativePath);
    this.debouncedSync();
  }

  start() {
    this.log('🚀 File watcher started', 'success');
    this.log('Watching for changes in:', 'info');
    this.watchPaths.forEach(p => console.log(`  - ${p}`));
    
    // Initialize watcher
    const watcher = chokidar.watch(this.watchPaths, {
      cwd: this.projectRoot,
      ignored: this.ignorePaths,
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 1000,
        pollInterval: 100
      }
    });

    // Watch events
    watcher
      .on('add', (path) => this.handleFileChange('Added', path))
      .on('change', (path) => this.handleFileChange('Modified', path))
      .on('unlink', (path) => this.handleFileChange('Deleted', path))
      .on('error', (error) => this.log(`Watcher error: ${error}`, 'error'));

    // Handle process termination
    process.on('SIGINT', () => {
      this.log('\n👋 Stopping file watcher...', 'info');
      watcher.close();
      
      if (this.pendingChanges.size > 0) {
        this.log(`${this.pendingChanges.size} changes pending. Run "npm run sync" to sync them.`, 'warning');
      }
      
      process.exit(0);
    });

    this.log('\nPress Ctrl+C to stop watching', 'info');
  }
}

// Check if chokidar is installed
try {
  require.resolve('chokidar');
  require.resolve('lodash.debounce');
} catch (error) {
  console.error('❌ Required dependencies not installed.');
  console.log('Run: npm install --save-dev chokidar lodash.debounce');
  process.exit(1);
}

// Start the watcher
const watcher = new FileWatcher();
watcher.start();