#!/usr/bin/env node

const http = require('http');
const { exec } = require('child_process');
const os = require('os');

console.log('🔍 诊断连接问题...\n');

// 1. 检查系统信息
console.log('📊 系统信息:');
console.log(`  操作系统: ${os.platform()} ${os.release()}`);
console.log(`  Node版本: ${process.version}`);
console.log(`  当前用户: ${os.userInfo().username}\n`);

// 2. 检查localhost解析
console.log('🌐 检查localhost解析:');
exec('ping -c 1 localhost', (error, stdout, stderr) => {
  if (error) {
    console.log('  ❌ localhost无法解析');
  } else {
    const match = stdout.match(/(\d+\.\d+\.\d+\.\d+)/);
    if (match) {
      console.log(`  ✅ localhost解析为: ${match[1]}`);
    }
  }
  
  // 3. 检查端口
  console.log('\n🔌 检查3000端口:');
  exec('lsof -i :3000', (error, stdout, stderr) => {
    if (stdout) {
      console.log('  ✅ 端口3000正在使用:');
      console.log(stdout);
    } else {
      console.log('  ❌ 端口3000未被使用');
    }
    
    // 4. 尝试连接
    console.log('\n🔗 尝试连接到服务器:');
    
    // 测试不同的地址
    const addresses = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://[::1]:3000',
      'http://0.0.0.0:3000'
    ];
    
    let completed = 0;
    addresses.forEach(url => {
      http.get(url, { timeout: 2000 }, (res) => {
        console.log(`  ✅ ${url} - 响应代码: ${res.statusCode}`);
        completed++;
        checkComplete();
      }).on('error', (err) => {
        console.log(`  ❌ ${url} - 错误: ${err.message}`);
        completed++;
        checkComplete();
      });
    });
    
    function checkComplete() {
      if (completed === addresses.length) {
        // 5. 防火墙建议
        console.log('\n🛡️ 可能的解决方案:');
        console.log('  1. 尝试使用 http://127.0.0.1:3000 代替 localhost');
        console.log('  2. 检查防火墙设置是否阻止了连接');
        console.log('  3. 尝试关闭VPN或代理');
        console.log('  4. 重启应用: 先按Ctrl+C停止，然后运行 npm run dev');
        console.log('  5. 使用其他端口: PORT=3001 npm run dev');
        
        // 检查hosts文件
        console.log('\n📄 检查hosts文件:');
        exec('cat /etc/hosts | grep localhost', (error, stdout) => {
          if (stdout) {
            console.log(stdout);
          } else {
            console.log('  ⚠️  hosts文件中没有localhost配置');
          }
        });
      }
    }
  });
});