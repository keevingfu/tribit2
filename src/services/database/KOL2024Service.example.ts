/**
 * KOL2024Service 使用示例
 * 这个文件演示了如何使用 KOL2024Service 的各种方法
 */

import { kol2024Service } from './KOL2024Service';

// 示例1: 获取分页的KOL列表
async function getKOLListExample() {
  try {
    // 获取第一页数据，每页20条
    const result = await kol2024Service.getList({
      page: 1,
      pageSize: 20,
      orderBy: 'No.',
      order: 'ASC'
    });

    console.log('总记录数:', result.total);
    console.log('当前页:', result.page);
    console.log('总页数:', result.totalPages);
    console.log('数据:', result.data);
  } catch (error) {
    console.error('获取KOL列表失败:', error);
  }
}

// 示例2: 搜索KOL
async function searchKOLExample() {
  try {
    // 搜索包含 "Tech" 的KOL
    const result = await kol2024Service.getList({
      keyword: 'Tech',
      page: 1,
      pageSize: 10
    });

    console.log('搜索结果数量:', result.total);
    console.log('搜索结果:', result.data);
  } catch (error) {
    console.error('搜索KOL失败:', error);
  }
}

// 示例3: 按平台筛选
async function getByPlatformExample() {
  try {
    // 获取YouTube平台的KOL
    const youtubeKOLs = await kol2024Service.getByPlatform('youtube', 10);
    console.log('YouTube KOL数量:', youtubeKOLs.length);
    console.log('YouTube KOLs:', youtubeKOLs);

    // 获取平台统计
    const platformStats = await kol2024Service.getPlatformStats();
    console.log('平台统计:', platformStats);
  } catch (error) {
    console.error('按平台获取KOL失败:', error);
  }
}

// 示例4: 获取热门KOL
async function getTopPerformersExample() {
  try {
    // 获取前10个KOL（按序号）
    const topKOLs = await kol2024Service.getTopPerformers(10);
    console.log('热门KOL:', topKOLs);

    // 获取YouTube平台的前5个KOL
    const topYouTubeKOLs = await kol2024Service.getTopPerformers(5, 'youtube');
    console.log('YouTube热门KOL:', topYouTubeKOLs);
  } catch (error) {
    console.error('获取热门KOL失败:', error);
  }
}

// 示例5: 根据ID获取单个KOL
async function getByIdExample() {
  try {
    const kol = await kol2024Service.getById(1);
    if (kol) {
      console.log('KOL详情:', kol);
      console.log('账号名称:', kol.kol_account);
      console.log('平台:', kol.platform);
      console.log('链接:', kol.kol_post_url);
    } else {
      console.log('未找到指定的KOL');
    }
  } catch (error) {
    console.error('获取KOL详情失败:', error);
  }
}

// 示例6: 批量操作
async function batchOperationsExample() {
  try {
    // 批量获取多个KOL
    const ids = [1, 2, 3, 4, 5];
    const kols = await kol2024Service.getByIds(ids);
    console.log('批量获取结果:', kols);

    // 检查账号是否存在
    const exists = await kol2024Service.checkAccountExists('Mr LazyTech');
    console.log('账号是否存在:', exists);
  } catch (error) {
    console.error('批量操作失败:', error);
  }
}

// 示例7: 获取统计信息
async function getStatisticsExample() {
  try {
    // 获取总数
    const totalCount = await kol2024Service.getTotalCount();
    console.log('KOL总数:', totalCount);

    // 获取YouTube平台的KOL数量
    const youtubeCount = await kol2024Service.getTotalCount('youtube');
    console.log('YouTube KOL数量:', youtubeCount);

    // 获取所有平台列表
    const platforms = await kol2024Service.getPlatforms();
    console.log('所有平台:', platforms);
  } catch (error) {
    console.error('获取统计信息失败:', error);
  }
}

// 示例8: 自动完成功能
async function autoCompleteExample() {
  try {
    // 获取以 "Tech" 开头的账号建议
    const suggestions = await kol2024Service.getAccountSuggestions('Tech', 5);
    console.log('账号建议:', suggestions);
  } catch (error) {
    console.error('获取账号建议失败:', error);
  }
}

// 示例9: 导出数据
async function exportDataExample() {
  try {
    // 导出所有数据
    const allData = await kol2024Service.exportData();
    console.log('导出数据总数:', allData.length);

    // 导出特定平台数据
    const youtubeData = await kol2024Service.exportData('youtube');
    console.log('YouTube数据总数:', youtubeData.length);
  } catch (error) {
    console.error('导出数据失败:', error);
  }
}

// 示例10: 错误处理
async function errorHandlingExample() {
  try {
    // 尝试获取不存在的ID
    const kol = await kol2024Service.getById(999999);
    if (!kol) {
      console.log('KOL不存在');
    }

    // 使用无效的参数
    const result = await kol2024Service.getList({
      page: -1, // 无效的页码
      pageSize: 0 // 无效的页面大小
    });
  } catch (error) {
    console.error('错误处理示例:', error);
  }
}

// 导出所有示例函数
export {
  getKOLListExample,
  searchKOLExample,
  getByPlatformExample,
  getTopPerformersExample,
  getByIdExample,
  batchOperationsExample,
  getStatisticsExample,
  autoCompleteExample,
  exportDataExample,
  errorHandlingExample
};