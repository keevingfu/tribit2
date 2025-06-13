/**
 * KOL 2024 API 路由示例
 * 展示如何在Next.js API路由中使用KOL2024Service
 */

import { NextRequest, NextResponse } from 'next/server';
import { kol2024Service } from '@/services/database/KOL2024Service';

/**
 * GET /api/kol2024
 * 获取KOL列表，支持搜索、筛选和分页
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // 获取查询参数
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const keyword = searchParams.get('keyword') || undefined;
    const platform = searchParams.get('platform') || undefined;
    const orderBy = searchParams.get('orderBy') as any || 'No.';
    const order = searchParams.get('order') as any || 'ASC';

    // 调用服务获取数据
    const result = await kol2024Service.getList({
      page,
      pageSize,
      keyword,
      platform,
      orderBy,
      order
    });

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: {
        page: result.page,
        pageSize: result.pageSize,
        total: result.total,
        totalPages: result.totalPages
      }
    });
  } catch (error) {
    console.error('获取KOL列表失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取KOL列表失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/kol2024/[id]
 * 获取单个KOL详情
 */
export async function getKOLById(id: number) {
  try {
    const kol = await kol2024Service.getById(id);
    
    if (!kol) {
      return NextResponse.json(
        {
          success: false,
          error: 'KOL不存在'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: kol
    });
  } catch (error) {
    console.error('获取KOL详情失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取KOL详情失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/kol2024/stats
 * 获取KOL统计数据
 */
export async function getKOLStats() {
  try {
    const [platformStats, totalCount, platforms] = await Promise.all([
      kol2024Service.getPlatformStats(),
      kol2024Service.getTotalCount(),
      kol2024Service.getPlatforms()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalCount,
        platforms,
        platformStats
      }
    });
  } catch (error) {
    console.error('获取KOL统计失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取KOL统计失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/kol2024/top
 * 获取热门KOL
 */
export async function getTopKOLs(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const platform = searchParams.get('platform') || undefined;

    const topKOLs = await kol2024Service.getTopPerformers(limit, platform);

    return NextResponse.json({
      success: true,
      data: topKOLs
    });
  } catch (error) {
    console.error('获取热门KOL失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取热门KOL失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/kol2024/search
 * 搜索KOL
 */
export async function searchKOLs(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get('keyword');
    
    if (!keyword) {
      return NextResponse.json(
        {
          success: false,
          error: '请提供搜索关键词'
        },
        { status: 400 }
      );
    }

    const limit = parseInt(searchParams.get('limit') || '50');
    const results = await kol2024Service.search(['kol_account', 'kol_post_url'], keyword, { limit });

    return NextResponse.json({
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    console.error('搜索KOL失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '搜索KOL失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/kol2024/suggestions
 * 获取账号名称建议（自动完成）
 */
export async function getAccountSuggestions(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const prefix = searchParams.get('prefix');
    
    if (!prefix) {
      return NextResponse.json(
        {
          success: false,
          error: '请提供搜索前缀'
        },
        { status: 400 }
      );
    }

    const limit = parseInt(searchParams.get('limit') || '10');
    const suggestions = await kol2024Service.getAccountSuggestions(prefix, limit);

    return NextResponse.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error('获取账号建议失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取账号建议失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/kol2024/batch
 * 批量获取KOL
 */
export async function batchGetKOLs(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: '请提供有效的ID数组'
        },
        { status: 400 }
      );
    }

    const kols = await kol2024Service.getByIds(ids);

    return NextResponse.json({
      success: true,
      data: kols,
      found: kols.length,
      requested: ids.length
    });
  } catch (error) {
    console.error('批量获取KOL失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '批量获取KOL失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/kol2024/export
 * 导出KOL数据
 */
export async function exportKOLData(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const platform = searchParams.get('platform') || undefined;
    const format = searchParams.get('format') || 'json';

    const data = await kol2024Service.exportData(platform);

    if (format === 'csv') {
      // CSV格式导出
      const csv = convertToCSV(data);
      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="kol_data_${Date.now()}.csv"`
        }
      });
    }

    // JSON格式导出
    return NextResponse.json({
      success: true,
      data,
      count: data.length,
      exportTime: new Date().toISOString()
    });
  } catch (error) {
    console.error('导出KOL数据失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '导出KOL数据失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

/**
 * 辅助函数：将数据转换为CSV格式
 */
function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');
  
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      // 处理包含逗号或换行的值
      if (typeof value === 'string' && (value.includes(',') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',');
  });

  return [csvHeaders, ...csvRows].join('\n');
}