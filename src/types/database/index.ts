// Insight Search 类型定义
export interface InsightSearch {
  id: number;
  file_source: string | null;
  modifier_type: string | null;
  modifier: string | null;
  suggestion: string | null;
  language: string | null;
  region: string | null;
  keyword: string | null;
  search_volume: number | null;
  cost_per_click: number | null;
}

// TikTok Creator 类型定义
export interface TikTokCreator {
  达人头像: string | null;
  达人名称: string | null;
  达人账号: string | null;
  达人主页链接: string | null;
  达人视频数: number | null;
  达人直播数: number | null;
  达人粉丝数: number | null;
  粉丝增长数: number | null;
  均播量: number | null;
  达人带货数: number | null;
  近30日销售额: number | null;
  近30日销量: number | null;
  视频GPM: number | null;
  直播GPM: number | null;
  MCN: number | null;
  达人类型: string | null;
}

// TikTok Product 类型定义
export interface TikTokProduct {
  商品名称: string | null;
  商品缩略图: string | null;
  商品链接: string | null;
  '国家、地区': string | null;
  商品价格最大值: number | null;
  商品价格最小值: number | null;
  商品星级: number | null;
  店铺商标链接: string | null;
  店铺链接: string | null;
  店铺名称: string | null;
  店铺销量: number | null;
  店铺商品数: number | null;
  '商品类目-en': string | null;
  '商品类目-zh': string | null;
  商品评论数: number | null;
  销量环比: number | null;
  带货达人数: number | null;
  上架时间: string | null;
  '运费（预设目的地为纽约）': string | null;
  销量: number | null;
  销售额: number | null;
  运营模式: string | null;
}

// KOL 类型定义
export interface KOLTribit {
  'No.': number | null;
  Region: string | null;
  Platform: string | null;
  kol_account: string | null;
  kol_url: string | null;
}

export interface KOLYouTubeVideo {
  video_id: string | null;
  video_title: string | null;
  video_url: string | null;
  channel_name: string | null;
  channel_url: string | null;
  views: number | null;
  likes: number | null;
  comments: number | null;
  published_date: string | null;
  [key: string]: any; // 用于处理其他可能的字段
}

// Self Media 类型定义
export interface SelfMediaInstagram {
  selfkoc_post_url: string | null;
  Likes: number | null;
  Comments: number | null;
  Views: string | null;
  selfkoc_post_date: string | null;
  selfkoc_account: string | null;
  selfkoc_video_id: string | null;
}

export interface SelfMediaYouTube {
  video_id: string | null;
  video_title: string | null;
  video_url: string | null;
  channel_name: string | null;
  views: number | null;
  likes: number | null;
  comments: number | null;
  published_date: string | null;
  [key: string]: any;
}

export interface SelfMediaTikTok {
  video_id: string | null;
  video_url: string | null;
  account_name: string | null;
  views: number | null;
  likes: number | null;
  comments: number | null;
  shares: number | null;
  posted_date: string | null;
  [key: string]: any;
}

export interface SelfMediaAccount {
  account_id: string | null;
  account_name: string | null;
  platform: string | null;
  followers: number | null;
  following: number | null;
  posts_count: number | null;
  engagement_rate: number | null;
  created_date: string | null;
  [key: string]: any;
}

// 查询参数类型
export interface QueryParams {
  limit?: number;
  offset?: number;
  orderBy?: string;
  order?: 'ASC' | 'DESC';
}

export interface SearchParams extends QueryParams {
  keyword?: string;
  region?: string;
  language?: string;
  dateFrom?: string;
  dateTo?: string;
}

// 分页结果类型
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Consumer Voice 类型定义
export interface ConsumerVoiceInsight {
  category: string;
  insights: string[];
  trending_keywords: string[];
  sentiment_score?: number;
  confidence: number;
}

export interface SearchIntentAnalysis {
  intent_type: 'informational' | 'navigational' | 'transactional' | 'commercial';
  keywords: string[];
  percentage: number;
}

export interface UserNeedAnalysis {
  need_category: string;
  frequency: number;
  related_keywords: string[];
  example_searches: string[];
}