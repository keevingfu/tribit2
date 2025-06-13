/**
 * InsightService 使用示例
 * 展示如何使用各个Insight子服务的功能
 */

import insightService from './insight.service';

// 1. 搜索洞察示例
async function searchInsightExamples() {
  console.log('=== 搜索洞察示例 ===');
  
  // 获取热门搜索词
  const topSearches = await insightService.search.getTopSearches(10, 'US', 'en');
  console.log('热门搜索词:', topSearches);

  // 搜索特定关键词
  const searchResults = await insightService.search.searchByKeyword('phone', {
    region: 'US',
    language: 'en',
    limit: 20,
    orderBy: 'search_volume',
    order: 'DESC'
  });
  console.log('搜索结果:', searchResults);

  // 按地区统计搜索量
  const volumeByRegion = await insightService.search.getSearchVolumeByRegion();
  console.log('地区搜索量统计:', volumeByRegion);

  // 获取CPC区间的关键词
  const cpcKeywords = await insightService.search.getKeywordsByCPCRange(1, 5, 10);
  console.log('CPC 1-5美元的关键词:', cpcKeywords);

  // 高级搜索
  const advancedResults = await insightService.search.advancedSearch({
    keywords: ['phone', 'mobile'],
    regions: ['US', 'UK'],
    minVolume: 1000,
    maxVolume: 100000,
    minCPC: 0.5,
    maxCPC: 10,
    page: 1,
    pageSize: 20
  });
  console.log('高级搜索结果:', advancedResults);
}

// 2. 视频创作者洞察示例
async function videoCreatorExamples() {
  console.log('=== 视频创作者洞察示例 ===');

  // 获取粉丝数最多的创作者
  const topCreators = await insightService.videoCreator.getTopCreatorsByFollowers(10);
  console.log('粉丝最多的创作者:', topCreators);

  // 获取销售额最高的创作者
  const topSalesCreators = await insightService.videoCreator.getTopCreatorsBySales(10);
  console.log('销售额最高的创作者:', topSalesCreators);

  // 获取高增长创作者
  const growthCreators = await insightService.videoCreator.getHighGrowthCreators(10);
  console.log('高增长创作者:', growthCreators);

  // 创作者类型统计
  const creatorTypes = await insightService.videoCreator.getCreatorTypeStats();
  console.log('创作者类型分布:', creatorTypes);

  // 搜索创作者
  const creatorSearch = await insightService.videoCreator.searchCreators('美妆', {
    limit: 10,
    orderBy: '达人粉丝数',
    order: 'DESC'
  });
  console.log('美妆创作者搜索结果:', creatorSearch);
}

// 3. 视频产品洞察示例
async function videoProductExamples() {
  console.log('=== 视频产品洞察示例 ===');

  // 获取销量最高的产品
  const topProducts = await insightService.videoProduct.getTopProductsBySales(10);
  console.log('销量最高的产品:', topProducts);

  // 按地区统计产品
  const productsByRegion = await insightService.videoProduct.getProductStatsByRegion();
  console.log('地区产品统计:', productsByRegion);

  // 按类目统计产品
  const productsByCategory = await insightService.videoProduct.getProductStatsByCategory('zh');
  console.log('类目产品统计:', productsByCategory);

  // 获取高评分产品
  const highRatedProducts = await insightService.videoProduct.getHighRatedProducts(4.5, 10);
  console.log('高评分产品:', highRatedProducts);

  // 价格区间分析
  const priceAnalysis = await insightService.videoProduct.getPriceRangeAnalysis();
  console.log('价格区间分析:', priceAnalysis);

  // 搜索产品
  const productSearch = await insightService.videoProduct.searchProducts('手机壳', {
    region: '美国',
    limit: 10
  });
  console.log('产品搜索结果:', productSearch);
}

// 4. 消费者之声洞察示例
async function consumerVoiceExamples() {
  console.log('=== 消费者之声洞察示例 ===');

  // 获取消费者需求分析
  const consumerNeeds = await insightService.consumerVoice.getConsumerNeeds('US', 'en');
  console.log('消费者需求:', consumerNeeds);

  // 分析搜索意图
  const searchIntent = await insightService.consumerVoice.analyzeSearchIntent('US');
  console.log('搜索意图分析:', searchIntent);

  // 获取热门话题
  const trendingTopics = await insightService.consumerVoice.getTrendingTopics(10);
  console.log('热门话题:', trendingTopics);

  // 获取消费者洞察
  const insights = await insightService.consumerVoice.getConsumerInsights({
    region: 'US',
    language: 'en'
  });
  console.log('消费者洞察:', insights);

  // 价格敏感度分析
  const priceSensitivity = await insightService.consumerVoice.getPriceSensitivityAnalysis();
  console.log('价格敏感度:', priceSensitivity);

  // 地域偏好分析
  const regionalPreferences = await insightService.consumerVoice.getRegionalPreferences();
  console.log('地域偏好:', regionalPreferences);

  // 竞争分析
  const competitive = await insightService.consumerVoice.getCompetitiveInsights('iphone');
  console.log('竞争洞察:', competitive);
}

// 5. 综合功能示例
async function integratedExamples() {
  console.log('=== 综合功能示例 ===');

  // 获取仪表板统计
  const dashboardStats = await insightService.getDashboardStats();
  console.log('仪表板统计:', dashboardStats);

  // 全局搜索
  const globalSearch = await insightService.globalSearch('手机', {
    includeSearch: true,
    includeCreators: true,
    includeProducts: true,
    limit: 5
  });
  console.log('全局搜索结果:', globalSearch);

  // 获取市场趋势
  const marketTrends = await insightService.getMarketTrends({
    region: 'US',
    timeRange: 'month'
  });
  console.log('市场趋势:', marketTrends);

  // 竞争分析报告
  const competitiveReport = await insightService.getCompetitiveAnalysis('smartphone', 'US');
  console.log('竞争分析报告:', competitiveReport);

  // 生成自定义报告
  const searchReport = await insightService.generateInsightReport({
    type: 'search',
    filters: {
      region: 'US',
      limit: 50
    },
    metrics: ['volume', 'keywords', 'cpc']
  });
  console.log('搜索报告:', searchReport);

  const creatorReport = await insightService.generateInsightReport({
    type: 'creator',
    metrics: ['followers', 'sales', 'growth', 'types']
  });
  console.log('创作者报告:', creatorReport);
}

// 运行示例
async function runExamples() {
  try {
    // 取消注释以运行特定示例
    // await searchInsightExamples();
    // await videoCreatorExamples();
    // await videoProductExamples();
    // await consumerVoiceExamples();
    // await integratedExamples();
  } catch (error) {
    console.error('示例运行错误:', error);
  }
}

// 导出示例函数供测试使用
export {
  searchInsightExamples,
  videoCreatorExamples,
  videoProductExamples,
  consumerVoiceExamples,
  integratedExamples,
  runExamples
};