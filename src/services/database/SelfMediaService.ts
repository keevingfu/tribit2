import { BaseService } from './BaseService';
import { 
  SelfMediaInstagram, 
  SelfMediaYouTube, 
  SelfMediaTikTok, 
  SelfMediaAccount,
  PaginatedResult 
} from '@/types/database';

export class SelfMediaService {
  private instagramService: BaseService<SelfMediaInstagram>;
  private youtubeService: BaseService<SelfMediaYouTube>;
  private tiktokService: BaseService<SelfMediaTikTok>;
  private accountService: BaseService<SelfMediaAccount>;

  constructor() {
    this.instagramService = new BaseService<SelfMediaInstagram>('selfkoc_ins');
    this.youtubeService = new BaseService<SelfMediaYouTube>('selfkoc_ytb');
    this.tiktokService = new BaseService<SelfMediaTikTok>('selkoc_tk');
    this.accountService = new BaseService<SelfMediaAccount>('selkoc_account');
  }

  /**
   * Instagram相关方法
   */
  async getInstagramPosts(params?: {
    account?: string;
    minLikes?: number;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResult<SelfMediaInstagram>> {
    const whereConditions: string[] = [];
    const queryParams: any[] = [];

    if (params?.account) {
      whereConditions.push('selfkoc_account LIKE ?');
      queryParams.push(`%${params.account}%`);
    }

    if (params?.minLikes !== undefined) {
      whereConditions.push('Likes >= ?');
      queryParams.push(params.minLikes);
    }

    if (params?.dateFrom) {
      whereConditions.push('selfkoc_post_date >= ?');
      queryParams.push(params.dateFrom);
    }

    if (params?.dateTo) {
      whereConditions.push('selfkoc_post_date <= ?');
      queryParams.push(params.dateTo);
    }

    const whereClause = whereConditions.length > 0 ? whereConditions.join(' AND ') : undefined;

    return this.instagramService.getPaginated(
      params?.page || 1,
      params?.pageSize || 20,
      whereClause,
      queryParams,
      'Likes DESC'
    );
  }

  /**
   * 获取Instagram热门帖子
   */
  async getTopInstagramPosts(limit: number = 10): Promise<SelfMediaInstagram[]> {
    return this.instagramService.query(
      'SELECT * FROM selfkoc_ins WHERE Likes IS NOT NULL ORDER BY Likes DESC LIMIT ?',
      [limit]
    );
  }

  /**
   * YouTube相关方法
   */
  async getYouTubeVideos(params?: {
    channelName?: string;
    minViews?: number;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResult<SelfMediaYouTube>> {
    const whereConditions: string[] = [];
    const queryParams: any[] = [];

    if (params?.channelName) {
      whereConditions.push('channel_name LIKE ?');
      queryParams.push(`%${params.channelName}%`);
    }

    if (params?.minViews !== undefined) {
      whereConditions.push('views >= ?');
      queryParams.push(params.minViews);
    }

    if (params?.dateFrom) {
      whereConditions.push('published_date >= ?');
      queryParams.push(params.dateFrom);
    }

    if (params?.dateTo) {
      whereConditions.push('published_date <= ?');
      queryParams.push(params.dateTo);
    }

    const whereClause = whereConditions.length > 0 ? whereConditions.join(' AND ') : undefined;

    return this.youtubeService.getPaginated(
      params?.page || 1,
      params?.pageSize || 20,
      whereClause,
      queryParams,
      'views DESC'
    );
  }

  /**
   * 获取YouTube热门视频
   */
  async getTopYouTubeVideos(limit: number = 10): Promise<SelfMediaYouTube[]> {
    return this.youtubeService.query(
      'SELECT * FROM selfkoc_ytb WHERE views IS NOT NULL ORDER BY views DESC LIMIT ?',
      [limit]
    );
  }

  /**
   * TikTok相关方法
   */
  async getTikTokVideos(params?: {
    accountName?: string;
    minViews?: number;
    minLikes?: number;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResult<SelfMediaTikTok>> {
    const whereConditions: string[] = [];
    const queryParams: any[] = [];

    if (params?.accountName) {
      whereConditions.push('account_name LIKE ?');
      queryParams.push(`%${params.accountName}%`);
    }

    if (params?.minViews !== undefined) {
      whereConditions.push('views >= ?');
      queryParams.push(params.minViews);
    }

    if (params?.minLikes !== undefined) {
      whereConditions.push('likes >= ?');
      queryParams.push(params.minLikes);
    }

    const whereClause = whereConditions.length > 0 ? whereConditions.join(' AND ') : undefined;

    return this.tiktokService.getPaginated(
      params?.page || 1,
      params?.pageSize || 20,
      whereClause,
      queryParams,
      'views DESC'
    );
  }

  /**
   * 获取TikTok热门视频
   */
  async getTopTikTokVideos(limit: number = 10): Promise<SelfMediaTikTok[]> {
    return this.tiktokService.query(
      'SELECT * FROM selkoc_tk WHERE views IS NOT NULL ORDER BY views DESC LIMIT ?',
      [limit]
    );
  }

  /**
   * 账号相关方法
   */
  async getAccounts(params?: {
    platform?: string;
    minFollowers?: number;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResult<SelfMediaAccount>> {
    const whereConditions: string[] = [];
    const queryParams: any[] = [];

    if (params?.platform) {
      whereConditions.push('platform = ?');
      queryParams.push(params.platform);
    }

    if (params?.minFollowers !== undefined) {
      whereConditions.push('followers >= ?');
      queryParams.push(params.minFollowers);
    }

    const whereClause = whereConditions.length > 0 ? whereConditions.join(' AND ') : undefined;

    return this.accountService.getPaginated(
      params?.page || 1,
      params?.pageSize || 20,
      whereClause,
      queryParams,
      'followers DESC'
    );
  }

  /**
   * 获取顶级账号
   */
  async getTopAccounts(limit: number = 10): Promise<SelfMediaAccount[]> {
    return this.accountService.query(
      'SELECT * FROM selkoc_account WHERE followers IS NOT NULL ORDER BY followers DESC LIMIT ?',
      [limit]
    );
  }

  /**
   * 跨平台搜索
   */
  async searchAcrossPlatforms(searchTerm: string): Promise<{
    instagram: SelfMediaInstagram[];
    youtube: SelfMediaYouTube[];
    tiktok: SelfMediaTikTok[];
  }> {
    const [instagram, youtube, tiktok] = await Promise.all([
      this.instagramService.search(['selfkoc_account'], searchTerm, { limit: 10 }),
      this.youtubeService.search(['channel_name', 'video_title'], searchTerm, { limit: 10 }),
      this.tiktokService.search(['account_name'], searchTerm, { limit: 10 })
    ]);

    return { instagram, youtube, tiktok };
  }

  /**
   * 获取账号的所有内容
   */
  async getAccountContent(accountName: string): Promise<{
    instagram: SelfMediaInstagram[];
    youtube: SelfMediaYouTube[];
    tiktok: SelfMediaTikTok[];
    accountInfo: SelfMediaAccount | undefined;
  }> {
    const [instagram, youtube, tiktok, accountInfo] = await Promise.all([
      this.instagramService.query(
        'SELECT * FROM selfkoc_ins WHERE selfkoc_account LIKE ? ORDER BY selfkoc_post_date DESC',
        [`%${accountName}%`]
      ),
      this.youtubeService.query(
        'SELECT * FROM selfkoc_ytb WHERE channel_name LIKE ? ORDER BY published_date DESC',
        [`%${accountName}%`]
      ),
      this.tiktokService.query(
        'SELECT * FROM selkoc_tk WHERE account_name LIKE ? ORDER BY posted_date DESC',
        [`%${accountName}%`]
      ),
      this.accountService.queryOne(
        'SELECT * FROM selkoc_account WHERE account_name LIKE ?',
        [`%${accountName}%`]
      )
    ]);

    return { instagram, youtube, tiktok, accountInfo: accountInfo || undefined };
  }

  /**
   * 获取综合统计
   */
  async getOverallStats(): Promise<{
    totalInstagramPosts: number;
    totalYouTubeVideos: number;
    totalTikTokVideos: number;
    totalAccounts: number;
    avgInstagramLikes: number;
    avgYouTubeViews: number;
    avgTikTokViews: number;
  }> {
    const [
      instagramCount,
      youtubeCount,
      tiktokCount,
      accountCount,
      avgInstagramLikes,
      avgYouTubeViews,
      avgTikTokViews
    ] = await Promise.all([
      this.instagramService.getCount(),
      this.youtubeService.getCount(),
      this.tiktokService.getCount(),
      this.accountService.getCount(),
      this.instagramService.aggregate('AVG', 'Likes'),
      this.youtubeService.aggregate('AVG', 'views'),
      this.tiktokService.aggregate('AVG', 'views')
    ]);

    return {
      totalInstagramPosts: instagramCount,
      totalYouTubeVideos: youtubeCount,
      totalTikTokVideos: tiktokCount,
      totalAccounts: accountCount,
      avgInstagramLikes: avgInstagramLikes || 0,
      avgYouTubeViews: avgYouTubeViews || 0,
      avgTikTokViews: avgTikTokViews || 0
    };
  }

  /**
   * 获取平台对比数据
   */
  async getPlatformComparison(): Promise<Array<{
    platform: string;
    contentCount: number;
    avgEngagement: number;
    topAccount: string;
  }>> {
    type PlatformStat = {
      platform: string;
      contentCount: number;
      avgEngagement: number;
      topAccount: string;
    };

    const [instagramStats, youtubeStats, tiktokStats] = await Promise.all([
      this.instagramService.query<PlatformStat>(
        `SELECT 
          'Instagram' as platform,
          COUNT(*) as contentCount,
          AVG(Likes + Comments) as avgEngagement,
          (SELECT selfkoc_account FROM selfkoc_ins ORDER BY Likes DESC LIMIT 1) as topAccount
        FROM selfkoc_ins`
      ),
      this.youtubeService.query<PlatformStat>(
        `SELECT 
          'YouTube' as platform,
          COUNT(*) as contentCount,
          AVG(views) as avgEngagement,
          (SELECT channel_name FROM selfkoc_ytb ORDER BY views DESC LIMIT 1) as topAccount
        FROM selfkoc_ytb`
      ),
      this.tiktokService.query<PlatformStat>(
        `SELECT 
          'TikTok' as platform,
          COUNT(*) as contentCount,
          AVG(views) as avgEngagement,
          (SELECT account_name FROM selkoc_tk ORDER BY views DESC LIMIT 1) as topAccount
        FROM selkoc_tk`
      )
    ]);

    return [...instagramStats, ...youtubeStats, ...tiktokStats];
  }
}