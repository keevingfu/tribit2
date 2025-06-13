/**
 * 数据库服务使用示例
 */

import {
  DatabaseServiceManager,
  getInsightSearchService,
  getTikTokCreatorService,
  getTikTokProductService,
  getKOLService,
  InsightSearchService,
  getSelfMediaService,
  QueryCache,
  Cacheable
} from './index';

// ========================================
// 1. InsightSearch 服务示例
// ========================================
async function insightSearchExamples() {
  const service = getInsightSearchService();

  // 搜索关键词
  const searchResults = await service.searchByKeyword('marketing', {
    region: 'US',
    language: 'en',
    limit: 10,
    orderBy: 'search_volume'
  });
  console.log('Search results:', searchResults);

  // 获取热门搜索
  const topSearches = await service.getTopSearches(20, 'US', 'en');
  console.log('Top searches:', topSearches);

  // 按地区统计
  const regionStats = await service.getSearchVolumeByRegion();
  console.log('Region stats:', regionStats);

  // 高级搜索
  const advancedResults = await service.advancedSearch({
    keywords: ['marketing', 'digital'],
    regions: ['US', 'UK'],
    minVolume: 1000,
    maxCPC: 5.0,
    page: 1,
    pageSize: 20
  });
  console.log('Advanced search:', advancedResults);
}

// ========================================
// 2. TikTok Creator 服务示例
// ========================================
async function tikTokCreatorExamples() {
  const service = getTikTokCreatorService();

  // 获取顶级创作者
  const topCreators = await service.getTopCreatorsByFollowers(10);
  console.log('Top creators by followers:', topCreators);

  // 按销售额排序
  const topBySales = await service.getTopCreatorsBySales(10);
  console.log('Top creators by sales:', topBySales);

  // 搜索创作者
  const searchResults = await service.searchCreators({
    name: 'fashion',
    minFollowers: 10000,
    minSales: 1000,
    page: 1,
    pageSize: 20
  });
  console.log('Creator search results:', searchResults);

  // 获取增长最快的创作者
  const fastestGrowing = await service.getFastestGrowingCreators(10);
  console.log('Fastest growing creators:', fastestGrowing);

  // 获取综合表现最好的创作者
  const topPerformers = await service.getTopPerformers(10);
  console.log('Top performers:', topPerformers);
}

// ========================================
// 3. TikTok Product 服务示例
// ========================================
async function tikTokProductExamples() {
  const service = getTikTokProductService();

  // 获取热销产品
  const topProducts = await service.getTopSellingProducts(10);
  console.log('Top selling products:', topProducts);

  // 搜索产品
  const searchResults = await service.searchProducts({
    name: 'beauty',
    category: 'cosmetics',
    minPrice: 10,
    maxPrice: 100,
    minRating: 4.0,
    page: 1,
    pageSize: 20
  });
  console.log('Product search results:', searchResults);

  // 获取价格分布
  const priceDistribution = await service.getPriceDistribution();
  console.log('Price distribution:', priceDistribution);

  // 获取类目统计
  const categoryStats = await service.getCategoryStats();
  console.log('Category stats:', categoryStats);

  // 获取新品
  const newProducts = await service.getNewProducts(7, 20);
  console.log('New products (last 7 days):', newProducts);

  // 获取高增长产品
  const highGrowthProducts = await service.getHighGrowthProducts(100, 10);
  console.log('High growth products:', highGrowthProducts);
}

// ========================================
// 4. KOL 服务示例
// ========================================
async function kolServiceExamples() {
  const service = getKOLService();

  // 获取所有KOL账号
  const allKOLs = await service.getAllKOLAccounts({
    platform: 'YouTube',
    region: 'US',
    page: 1,
    pageSize: 20
  });
  console.log('All KOLs:', allKOLs);

  // 获取YouTube视频
  const youtubeVideos = await service.getYouTubeVideos({
    minViews: 100000,
    page: 1,
    pageSize: 10
  });
  console.log('YouTube videos:', youtubeVideos);

  // 获取热门YouTube视频
  const topVideos = await service.getTopYouTubeVideos(10);
  console.log('Top YouTube videos:', topVideos);

  // 获取频道统计
  const channelStats = await service.getYouTubeChannelStats();
  console.log('Channel stats:', channelStats);

  // 获取综合统计
  const overallStats = await service.getOverallStats();
  console.log('Overall KOL stats:', overallStats);
}

// ========================================
// 5. Self Media 服务示例
// ========================================
async function selfMediaExamples() {
  const service = getSelfMediaService();

  // 获取Instagram帖子
  const instagramPosts = await service.getInstagramPosts({
    minLikes: 1000,
    page: 1,
    pageSize: 20
  });
  console.log('Instagram posts:', instagramPosts);

  // 获取YouTube视频
  const youtubeVideos = await service.getYouTubeVideos({
    minViews: 10000,
    page: 1,
    pageSize: 20
  });
  console.log('YouTube videos:', youtubeVideos);

  // 跨平台搜索
  const crossPlatformSearch = await service.searchAcrossPlatforms('fashion');
  console.log('Cross-platform search:', crossPlatformSearch);

  // 获取账号内容
  const accountContent = await service.getAccountContent('example_account');
  console.log('Account content:', accountContent);

  // 获取平台对比
  const platformComparison = await service.getPlatformComparison();
  console.log('Platform comparison:', platformComparison);
}

// ========================================
// 6. 缓存使用示例
// ========================================
async function cacheExamples() {
  const cache = QueryCache.getInstance();
  const service = getInsightSearchService();

  // 使用缓存包装查询
  const cachedResult = await cache.wrap(
    'insight_search',
    'searchByKeyword',
    ['marketing', { limit: 10 }],
    () => service.searchByKeyword('marketing', { limit: 10 }),
    60000 // 缓存1分钟
  );
  console.log('Cached result:', cachedResult);

  // 获取缓存统计
  const stats = cache.getStats();
  console.log('Cache stats:', stats);

  // 清除特定表的缓存
  cache.clearTable('insight_search');
}

// ========================================
// 7. 使用装饰器的服务类示例
// ========================================
// Note: Decorator example commented out due to TypeScript configuration
// class CachedInsightSearchService extends InsightSearchService {
//   @Cacheable('insight_search', 300000) // 缓存5分钟
//   async getTopSearchesCached(limit: number = 10): Promise<any[]> {
//     return super.getTopSearches(limit);
//   }
// }

// ========================================
// 8. 综合统计示例
// ========================================
async function overallStatsExample() {
  const allStats = await DatabaseServiceManager.getAllStats();
  console.log('All database stats:', allStats);
}

// ========================================
// 运行示例
// ========================================
async function runExamples() {
  try {
    console.log('=== Running Database Service Examples ===');
    
    // 运行各个示例
    await insightSearchExamples();
    await tikTokCreatorExamples();
    await tikTokProductExamples();
    await kolServiceExamples();
    await selfMediaExamples();
    await cacheExamples();
    await overallStatsExample();
    
    console.log('=== Examples completed successfully ===');
  } catch (error) {
    console.error('Error running examples:', error);
  } finally {
    // 关闭数据库连接
    DatabaseServiceManager.closeAll();
  }
}

// 如果直接运行此文件
if (require.main === module) {
  runExamples();
}

export {
  insightSearchExamples,
  tikTokCreatorExamples,
  tikTokProductExamples,
  kolServiceExamples,
  selfMediaExamples,
  cacheExamples,
  overallStatsExample
};