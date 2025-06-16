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

async function verifyKOLDashboardFix() {
  console.log('=== 验证 KOL Dashboard 图表修复 ===\n');
  
  try {
    // 1. 检查平台分布 API
    console.log('1. 平台分布数据:');
    const platformData = await fetchJSON('http://localhost:3000/api/kol/total/distribution?type=platform');
    
    if (platformData.success) {
      console.log('   ✓ API 响应成功');
      console.log('   ✓ 数据条数:', platformData.data.length);
      
      // 检查数据格式
      const hasCorrectFormat = platformData.data.every(item => 
        item.hasOwnProperty('platform') && 
        item.hasOwnProperty('count') && 
        item.hasOwnProperty('source')
      );
      
      if (hasCorrectFormat) {
        console.log('   ✓ 数据格式正确 (所有记录都有 platform, count, source 字段)');
        
        // 聚合平台数据
        const platformAgg = {};
        platformData.data.forEach(item => {
          platformAgg[item.platform] = (platformAgg[item.platform] || 0) + item.count;
        });
        
        console.log('   ✓ 平台汇总:');
        Object.entries(platformAgg).forEach(([platform, count]) => {
          console.log(`     - ${platform}: ${count}`);
        });
      } else {
        console.log('   ✗ 数据格式错误');
        console.log('   示例数据:', JSON.stringify(platformData.data[0], null, 2));
      }
    }
    
    // 2. 检查地区分布 API
    console.log('\n2. 地区分布数据:');
    const regionData = await fetchJSON('http://localhost:3000/api/kol/total/distribution?type=region');
    
    if (regionData.success) {
      console.log('   ✓ API 响应成功');
      console.log('   ✓ 数据条数:', regionData.data.length);
      
      // 显示前5个地区
      console.log('   ✓ Top 5 地区:');
      regionData.data.slice(0, 5).forEach((item, i) => {
        console.log(`     ${i + 1}. ${item.Region}: ${item.count}`);
      });
    }
    
    // 3. 检查统计数据 API
    console.log('\n3. 统计数据:');
    const statsData = await fetchJSON('http://localhost:3000/api/kol/total/statistics');
    
    if (statsData.success) {
      console.log('   ✓ 总 KOL 数:', statsData.data.total_kols);
      console.log('   ✓ 2024 KOL 数:', statsData.data.kols_2024);
      console.log('   ✓ 印度 KOL 数:', statsData.data.india_kols);
      console.log('   ✓ 平台数:', statsData.data.platforms);
    }
    
    // 4. 检查视频数据 API
    console.log('\n4. 视频预览数据:');
    const videoData = await fetchJSON('http://localhost:3000/api/kol/total/videos?limit=5');
    
    if (videoData.success) {
      console.log('   ✓ 视频数:', videoData.data.length);
      if (videoData.data.length > 0) {
        console.log('   ✓ 示例视频:');
        console.log(`     - 账号: ${videoData.data[0].kol_account}`);
        console.log(`     - 平台: ${videoData.data[0].platform}`);
        console.log(`     - URL: ${videoData.data[0].url.substring(0, 50)}...`);
      }
    }
    
    console.log('\n=== 修复验证完成 ===');
    console.log('\n访问 http://localhost:3000/kol/dashboard 查看更新后的图表:');
    console.log('- Platform Distribution (平台分布) - 柱状图');
    console.log('- Region Distribution (地区分布) - 饼图');
    console.log('- Data Sources Overview (数据源概览) - 折线图');
    
  } catch (error) {
    console.error('验证失败:', error.message);
  }
}

verifyKOLDashboardFix();