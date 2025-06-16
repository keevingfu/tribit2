const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function checkSyncStatus() {
  console.log('🔍 Checking Project Synchronization Status\n');
  console.log('Repository: https://github.com/keevingfu/tribit2.git');
  console.log('=' .repeat(60) + '\n');

  try {
    // 1. Git Status
    console.log('1. GIT STATUS\n');
    const gitStatus = execSync('git status --porcelain').toString();
    if (gitStatus.trim() === '') {
      console.log('   ✅ Working directory is clean');
    } else {
      console.log('   ⚠️  Uncommitted changes found:');
      console.log(gitStatus);
    }

    // 2. Branch Information
    console.log('\n2. BRANCH INFORMATION\n');
    const currentBranch = execSync('git branch --show-current').toString().trim();
    const remoteBranch = execSync('git rev-parse --abbrev-ref --symbolic-full-name @{u}').toString().trim();
    console.log(`   Current branch: ${currentBranch}`);
    console.log(`   Tracking: ${remoteBranch}`);

    // 3. Sync Status
    console.log('\n3. SYNCHRONIZATION STATUS\n');
    execSync('git fetch origin', { stdio: 'ignore' });
    
    const localCommit = execSync('git rev-parse HEAD').toString().trim();
    const remoteCommit = execSync('git rev-parse origin/main').toString().trim();
    
    if (localCommit === remoteCommit) {
      console.log('   ✅ Local and remote are in sync');
      console.log(`   Latest commit: ${localCommit.substring(0, 7)}`);
    } else {
      const behind = execSync('git rev-list --count HEAD..origin/main').toString().trim();
      const ahead = execSync('git rev-list --count origin/main..HEAD').toString().trim();
      
      if (parseInt(behind) > 0) {
        console.log(`   ⚠️  Local is ${behind} commits behind remote`);
      }
      if (parseInt(ahead) > 0) {
        console.log(`   ⚠️  Local is ${ahead} commits ahead of remote`);
      }
    }

    // 4. Recent Commits
    console.log('\n4. RECENT COMMITS\n');
    const recentCommits = execSync('git log --oneline -5').toString();
    console.log(recentCommits);

    // 5. File Statistics
    console.log('5. PROJECT STATISTICS\n');
    
    const sourceFiles = execSync('find . -type f \\( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \\) -not -path "./node_modules/*" -not -path "./.next/*" | wc -l').toString().trim();
    const totalFiles = execSync('git ls-files | wc -l').toString().trim();
    
    console.log(`   Total tracked files: ${totalFiles}`);
    console.log(`   Source files (TS/JS): ${sourceFiles}`);

    // 6. Important Files Check
    console.log('\n6. IMPORTANT FILES CHECK\n');
    const importantFiles = [
      'package.json',
      'package-lock.json',
      'tsconfig.json',
      'next.config.js',
      'CLAUDE.md',
      'README.md',
      '.env.local',
      'vercel.json',
      'data/tribit.db'
    ];

    importantFiles.forEach(file => {
      const exists = fs.existsSync(path.join(process.cwd(), file));
      const tracked = file !== '.env.local' && file !== 'data/tribit.db'; // These should not be tracked
      
      if (exists) {
        if (tracked) {
          try {
            execSync(`git ls-files --error-unmatch ${file}`, { stdio: 'ignore' });
            console.log(`   ✅ ${file} - exists and tracked`);
          } catch {
            console.log(`   ⚠️  ${file} - exists but NOT tracked`);
          }
        } else {
          console.log(`   ✅ ${file} - exists (intentionally not tracked)`);
        }
      } else {
        console.log(`   ❌ ${file} - missing`);
      }
    });

    // 7. Summary
    console.log('\n' + '=' .repeat(60));
    console.log('📊 SUMMARY\n');
    
    if (gitStatus.trim() === '' && localCommit === remoteCommit) {
      console.log('✅ All code is fully synchronized with GitHub!');
      console.log('✅ No uncommitted changes');
      console.log('✅ Local and remote are identical');
    } else {
      console.log('⚠️  Action needed to fully synchronize');
    }

  } catch (error) {
    console.error('❌ Error checking sync status:', error.message);
  }
}

// Run the check
checkSyncStatus();