import { BaseService } from './BaseService';
import { KOLTribit, KOLYouTubeVideo, PaginatedResult } from '@/types/database';

export class KOLService {
  private tribitService: BaseService<KOLTribit>;
  private youtubeService: BaseService<KOLYouTubeVideo>;
  
  constructor() {
    this.tribitService = new BaseService<KOLTribit>('kol_tribit_total');
    this.youtubeService = new BaseService<KOLYouTubeVideo>('kol_ytb_video');
  }

  /**
   * 获取所有KOL账号
   */
  async getAllKOLAccounts(params?: {
    platform?: string;
    region?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResult<KOLTribit>> {
    const whereConditions: string[] = [];
    const queryParams: any[] = [];

    if (params?.platform) {
      whereConditions.push('Platform = ?');
      queryParams.push(params.platform);
    }

    if (params?.region) {
      whereConditions.push('Region = ?');
      queryParams.push(params.region);
    }

    const whereClause = whereConditions.length > 0 ? whereConditions.join(' AND ') : undefined;

    return this.tribitService.getPaginated(
      params?.page || 1,
      params?.pageSize || 20,
      whereClause,
      queryParams,
      '`No.` ASC'
    );
  }

  /**
   * 按平台获取KOL
   */
  async getKOLByPlatform(platform: string): Promise<KOLTribit[]> {
    return this.tribitService.query(
      'SELECT * FROM kol_tribit_total WHERE Platform = ? ORDER BY `No.`',
      [platform]
    );
  }

  /**
   * 按地区获取KOL
   */
  async getKOLByRegion(region: string): Promise<KOLTribit[]> {
    return this.tribitService.query(
      'SELECT * FROM kol_tribit_total WHERE Region = ? ORDER BY `No.`',
      [region]
    );
  }

  /**
   * 获取平台统计
   */
  async getPlatformStats(): Promise<Array<{ platform: string; count: number }>> {
    return this.tribitService.groupBy(
      'Platform',
      'Platform as platform, COUNT(*) as count',
      'Platform IS NOT NULL'
    );
  }

  /**
   * 获取地区统计
   */
  async getRegionStats(): Promise<Array<{ region: string; count: number }>> {
    return this.tribitService.groupBy(
      'Region',
      'Region as region, COUNT(*) as count',
      'Region IS NOT NULL'
    );
  }

  /**
   * 搜索KOL账号
   */
  async searchKOLAccounts(searchTerm: string): Promise<KOLTribit[]> {
    return this.tribitService.search(
      ['kol_account', 'kol_url'],
      searchTerm,
      { limit: 50 }
    );
  }

  /**
   * 获取YouTube视频列表
   */
  async getYouTubeVideos(params?: {
    channelName?: string;
    minViews?: number;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResult<KOLYouTubeVideo>> {
    const whereConditions: string[] = [];
    const queryParams: any[] = [];

    if (params?.channelName) {
      whereConditions.push('Youtuber LIKE ?');
      queryParams.push(`%${params.channelName}%`);
    }

    if (params?.minViews !== undefined) {
      whereConditions.push('"video views" >= ?');
      queryParams.push(params.minViews);
    }

    const whereClause = whereConditions.length > 0 ? whereConditions.join(' AND ') : undefined;

    return this.youtubeService.getPaginated(
      params?.page || 1,
      params?.pageSize || 20,
      whereClause,
      queryParams,
      '"video views" DESC'
    );
  }

  /**
   * 获取热门YouTube视频
   */
  async getTopYouTubeVideos(limit: number = 10): Promise<KOLYouTubeVideo[]> {
    return this.youtubeService.query(
      'SELECT * FROM kol_ytb_video WHERE "video views" IS NOT NULL ORDER BY "video views" DESC LIMIT ?',
      [limit]
    );
  }

  /**
   * 获取YouTube频道统计
   */
  async getYouTubeChannelStats(): Promise<Array<{
    channelName: string;
    videoCount: number;
    totalViews: number;
    avgViews: number;
    totalLikes: number;
    totalComments: number;
  }>> {
    return this.youtubeService.query(
      `SELECT 
        Youtuber as channelName,
        COUNT(*) as videoCount,
        SUM("video views") as totalViews,
        AVG("video views") as avgViews,
        0 as totalLikes,
        0 as totalComments
      FROM kol_ytb_video
      WHERE Youtuber IS NOT NULL
      GROUP BY Youtuber
      ORDER BY totalViews DESC`
    );
  }

  /**
   * 搜索YouTube视频
   */
  async searchYouTubeVideos(searchTerm: string): Promise<KOLYouTubeVideo[]> {
    return this.youtubeService.search(
      ['Title', 'Youtuber'],
      searchTerm,
      { limit: 50, orderBy: '"video views"', order: 'DESC' }
    );
  }

  /**
   * 获取KOL账号的YouTube视频
   */
  async getVideosByKOLAccount(kolAccount: string): Promise<KOLYouTubeVideo[]> {
    // 首先从kol_tribit_total获取KOL信息
    const kol = await this.tribitService.queryOne(
      'SELECT * FROM kol_tribit_total WHERE kol_account = ?',
      [kolAccount]
    );

    if (!kol) {
      return [];
    }

    // 根据KOL账号名搜索相关的YouTube视频
    return this.youtubeService.query(
      'SELECT * FROM kol_ytb_video WHERE Youtuber LIKE ? ORDER BY "video views" DESC',
      [`%${kolAccount}%`]
    );
  }

  /**
   * 获取特定地区的KOL数据（包括2024和India表）
   */
  async getRegionalKOLData(region: string): Promise<{
    total: KOLTribit[];
    regional: any[];
  }> {
    const total = await this.getKOLByRegion(region);
    
    let regional: any[] = [];
    if (region.toLowerCase() === 'india') {
      regional = await this.tribitService.query(
        'SELECT * FROM kol_tribit_india'
      );
    } else if (region === '2024') {
      regional = await this.tribitService.query(
        'SELECT * FROM kol_tribit_2024'
      );
    }

    return { total, regional };
  }

  /**
   * 获取综合统计数据
   */
  async getOverallStats(): Promise<{
    totalKOLs: number;
    totalPlatforms: number;
    totalRegions: number;
    totalYouTubeVideos: number;
    totalYouTubeViews: number;
  }> {
    const kolCount = await this.tribitService.getCount();
    const platforms = await this.getPlatformStats();
    const regions = await this.getRegionStats();
    const videoCount = await this.youtubeService.getCount();
    const totalViews = await this.youtubeService.aggregate('SUM', '"video views"');

    return {
      totalKOLs: kolCount,
      totalPlatforms: platforms.length,
      totalRegions: regions.length,
      totalYouTubeVideos: videoCount,
      totalYouTubeViews: totalViews || 0
    };
  }
}