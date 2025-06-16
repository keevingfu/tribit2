#!/usr/bin/env node

const https = require('https');
const { execSync } = require('child_process');

class DeploymentMonitor {
  constructor() {
    this.projectName = 'tribit2';
    this.vercelToken = process.env.VERCEL_TOKEN;
    this.githubToken = process.env.GITHUB_TOKEN;
  }

  log(message, type = 'info') {
    const icons = {
      info: '📝',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      deploy: '🚀'
    };
    
    console.log(`[${new Date().toISOString()}] ${icons[type]} ${message}`);
  }

  async getLatestDeployment() {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.vercel.com',
        path: `/v6/deployments?projectId=${process.env.VERCEL_PROJECT_ID}&limit=1`,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.vercelToken}`
        }
      };

      https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            resolve(result.deployments[0]);
          } catch (error) {
            reject(error);
          }
        });
      }).on('error', reject).end();
    });
  }

  async checkDeploymentStatus(deploymentId) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.vercel.com',
        path: `/v13/deployments/${deploymentId}`,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.vercelToken}`
        }
      };

      https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const deployment = JSON.parse(data);
            resolve(deployment);
          } catch (error) {
            reject(error);
          }
        });
      }).on('error', reject).end();
    });
  }

  getGitStatus() {
    try {
      const localCommit = execSync('git rev-parse HEAD').toString().trim();
      const remoteCommit = execSync('git rev-parse origin/main').toString().trim();
      const behind = execSync('git rev-list --count HEAD..origin/main').toString().trim();
      
      return {
        localCommit: localCommit.substring(0, 7),
        remoteCommit: remoteCommit.substring(0, 7),
        isInSync: localCommit === remoteCommit,
        commitsBehind: parseInt(behind)
      };
    } catch (error) {
      this.log('Failed to get git status', 'error');
      return null;
    }
  }

  async monitor() {
    this.log('Starting Vercel Deployment Monitor', 'deploy');
    this.log('=' .repeat(50));

    try {
      // Check Git status
      const gitStatus = this.getGitStatus();
      if (gitStatus) {
        this.log(`Local commit: ${gitStatus.localCommit}`);
        this.log(`Remote commit: ${gitStatus.remoteCommit}`);
        
        if (!gitStatus.isInSync) {
          this.log(`Local is ${gitStatus.commitsBehind} commits behind remote`, 'warning');
        }
      }

      // Get latest deployment
      this.log('\nFetching latest deployment...', 'info');
      const latestDeployment = await this.getLatestDeployment();
      
      if (!latestDeployment) {
        this.log('No deployments found', 'warning');
        return;
      }

      // Display deployment info
      this.log('\nLatest Deployment:', 'deploy');
      console.log(`  ID: ${latestDeployment.id}`);
      console.log(`  URL: ${latestDeployment.url}`);
      console.log(`  State: ${latestDeployment.state}`);
      console.log(`  Created: ${new Date(latestDeployment.created).toLocaleString()}`);
      
      if (latestDeployment.meta?.githubCommitSha) {
        console.log(`  Commit: ${latestDeployment.meta.githubCommitSha.substring(0, 7)}`);
        console.log(`  Branch: ${latestDeployment.meta.githubCommitRef || 'unknown'}`);
      }

      // Check if deployment matches current commit
      if (gitStatus && latestDeployment.meta?.githubCommitSha) {
        const deployedCommit = latestDeployment.meta.githubCommitSha;
        if (gitStatus.localCommit === deployedCommit.substring(0, 7)) {
          this.log('\n✅ Deployed version matches local commit', 'success');
        } else if (gitStatus.remoteCommit === deployedCommit.substring(0, 7)) {
          this.log('\n✅ Deployed version matches remote commit', 'success');
        } else {
          this.log('\n⚠️  Deployed version does not match current commits', 'warning');
          this.log('  A new deployment may be needed', 'warning');
        }
      }

      // Check deployment status
      if (latestDeployment.state === 'READY') {
        this.log('\n✅ Deployment is ready and serving traffic', 'success');
      } else if (latestDeployment.state === 'ERROR') {
        this.log('\n❌ Deployment failed', 'error');
      } else {
        this.log(`\n⏳ Deployment state: ${latestDeployment.state}`, 'info');
      }

    } catch (error) {
      this.log(`Monitor error: ${error.message}`, 'error');
    }
  }

  async watchDeployments(interval = 60000) {
    this.log('Starting continuous deployment monitoring', 'deploy');
    this.log(`Checking every ${interval / 1000} seconds\n`);

    // Initial check
    await this.monitor();

    // Set up interval
    setInterval(async () => {
      console.log('\n' + '=' .repeat(50));
      await this.monitor();
    }, interval);

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      this.log('\n\nStopping deployment monitor...', 'info');
      process.exit(0);
    });
  }
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Vercel Deployment Monitor

Usage: node deployment-monitor.js [options]

Options:
  -w, --watch          Watch deployments continuously
  -i, --interval <ms>  Check interval in milliseconds (default: 60000)
  -h, --help          Show this help message

Environment Variables:
  VERCEL_TOKEN        Required: Your Vercel API token
  VERCEL_PROJECT_ID   Required: Your Vercel project ID
  GITHUB_TOKEN        Optional: For enhanced GitHub integration

Examples:
  node deployment-monitor.js              # Single check
  node deployment-monitor.js --watch      # Continuous monitoring
  node deployment-monitor.js -w -i 30000  # Check every 30 seconds
`);
  process.exit(0);
}

// Check required environment variables
if (!process.env.VERCEL_TOKEN || !process.env.VERCEL_PROJECT_ID) {
  console.error('❌ Missing required environment variables:');
  console.error('   VERCEL_TOKEN and VERCEL_PROJECT_ID must be set');
  console.error('\nExample:');
  console.error('   export VERCEL_TOKEN=your_token_here');
  console.error('   export VERCEL_PROJECT_ID=your_project_id_here');
  process.exit(1);
}

// Run monitor
const monitor = new DeploymentMonitor();

if (args.includes('--watch') || args.includes('-w')) {
  const intervalIndex = args.findIndex(arg => arg === '--interval' || arg === '-i');
  const interval = intervalIndex !== -1 ? parseInt(args[intervalIndex + 1]) : 60000;
  monitor.watchDeployments(interval);
} else {
  monitor.monitor().then(() => process.exit(0));
}