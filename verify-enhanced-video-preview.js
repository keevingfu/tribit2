const http = require('http');

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function verifyEnhancedVideoPreview() {
  console.log('=== 验证 KOL Dashboard 视频预览优化 ===\n');
  
  try {
    // 1. 检查页面是否可访问
    console.log('1. 页面访问检查:');
    const pageCheck = await new Promise((resolve) => {
      http.get('http://localhost:3000/kol/dashboard', (res) => {
        resolve(res.statusCode);
      }).on('error', () => resolve(null));
    });
    
    if (pageCheck === 200) {
      console.log('   ✓ KOL Dashboard 页面正常访问');
    } else {
      console.log('   ✗ 页面无法访问');
      return;
    }
    
    // 2. 检查视频数据 API
    console.log('\n2. 视频数据检查:');
    const videoData = await fetchJSON('http://localhost:3000/api/kol/total/videos?limit=15');
    
    if (videoData.success && videoData.data.length > 0) {
      console.log(`   ✓ 获取到 ${videoData.data.length} 个视频数据`);
      
      // 统计各平台视频
      const platforms = {};
      videoData.data.forEach(video => {
        platforms[video.platform] = (platforms[video.platform] || 0) + 1;
      });
      
      console.log('   ✓ 平台分布:');
      Object.entries(platforms).forEach(([platform, count]) => {
        console.log(`     - ${platform}: ${count} 个视频`);
      });
      
      // 显示示例视频
      console.log('\n   ✓ 示例视频:');
      const sampleVideo = videoData.data[0];
      console.log(`     - 账号: ${sampleVideo.kol_account}`);
      console.log(`     - 平台: ${sampleVideo.platform}`);
      console.log(`     - URL: ${sampleVideo.url.substring(0, 60)}...`);
    }
    
    console.log('\n=== 优化功能特性 ===\n');
    console.log('✨ 新增功能:');
    console.log('   1. 卡片式布局 - 美观的视频卡片展示');
    console.log('   2. 悬停效果 - 鼠标悬停时显示播放按钮');
    console.log('   3. 平台标识 - 清晰的平台图标和颜色区分');
    console.log('   4. 创作者信息 - 显示账号名和粉丝数');
    console.log('   5. 视频统计 - 观看量、点赞数、评论数');
    console.log('   6. 模态框预览 - 点击视频打开大屏预览');
    console.log('   7. 全屏模式 - 支持全屏观看');
    console.log('   8. 静音控制 - YouTube视频静音/取消静音');
    console.log('   9. 外链支持 - TikTok/Instagram跳转原平台');
    console.log('   10. 响应式设计 - 自适应不同屏幕尺寸');
    
    console.log('\n🎯 用户体验优化:');
    console.log('   - 平滑的过渡动画');
    console.log('   - 加载状态指示器');
    console.log('   - 优雅的错误处理');
    console.log('   - 键盘快捷键支持 (ESC关闭)');
    console.log('   - 懒加载图片优化性能');
    
    console.log('\n=== 访问指南 ===');
    console.log('\n1. 打开 http://localhost:3000/kol/dashboard');
    console.log('2. 如果视频预览区域未显示，点击 "Show Video Preview" 按钮');
    console.log('3. 查看优化后的视频卡片布局');
    console.log('4. 鼠标悬停在视频卡片上查看播放按钮效果');
    console.log('5. 点击任意视频卡片打开模态框预览');
    console.log('6. 在模态框中测试全屏、静音等功能');
    console.log('7. 对于TikTok/Instagram视频，点击外链按钮跳转');
    
  } catch (error) {
    console.error('验证失败:', error.message);
  }
}

verifyEnhancedVideoPreview();