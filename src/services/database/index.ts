export { default as DatabaseConnection } from './connection';
export { BaseService } from './BaseService';
export { InsightSearchService } from './InsightSearchService';
export { TikTokCreatorService } from './TikTokCreatorService';
export { TikTokProductService } from './TikTokProductService';
export { KOLService } from './KOLService';
export { KOL2024Service, kol2024Service } from './KOL2024Service';
export { SelfMediaService } from './SelfMediaService';
export { TestingService, testingService } from './TestingService';
export { PrivateService, privateService } from './PrivateService';
export { QueryCache, Cacheable, CacheClear, cacheMiddleware, CacheMonitor } from './cache';
export * from './utils';

// 创建服务实例（单例模式）
import DatabaseConnection from './connection';
import { InsightSearchService } from './InsightSearchService';
import { TikTokCreatorService } from './TikTokCreatorService';
import { TikTokProductService } from './TikTokProductService';
import { KOLService } from './KOLService';
import { KOL2024Service } from './KOL2024Service';
import { SelfMediaService } from './SelfMediaService';
import { TestingService } from './TestingService';
import { PrivateService } from './PrivateService';

let insightSearchService: InsightSearchService | null = null;
let tikTokCreatorService: TikTokCreatorService | null = null;
let tikTokProductService: TikTokProductService | null = null;
let kolService: KOLService | null = null;
let kol2024Service: KOL2024Service | null = null;
let selfMediaService: SelfMediaService | null = null;
let testingService: TestingService | null = null;
let privateService: PrivateService | null = null;

export function getInsightSearchService(): InsightSearchService {
  if (!insightSearchService) {
    insightSearchService = new InsightSearchService();
  }
  return insightSearchService;
}

export function getTikTokCreatorService(): TikTokCreatorService {
  if (!tikTokCreatorService) {
    tikTokCreatorService = new TikTokCreatorService();
  }
  return tikTokCreatorService;
}

export function getTikTokProductService(): TikTokProductService {
  if (!tikTokProductService) {
    tikTokProductService = new TikTokProductService();
  }
  return tikTokProductService;
}

export function getKOLService(): KOLService {
  if (!kolService) {
    kolService = new KOLService();
  }
  return kolService;
}

export function getSelfMediaService(): SelfMediaService {
  if (!selfMediaService) {
    selfMediaService = new SelfMediaService();
  }
  return selfMediaService;
}

export function getKOL2024Service(): KOL2024Service {
  if (!kol2024Service) {
    kol2024Service = new KOL2024Service();
  }
  return kol2024Service;
}

export function getTestingService(): TestingService {
  if (!testingService) {
    testingService = new TestingService();
  }
  return testingService;
}

export function getPrivateService(): PrivateService {
  if (!privateService) {
    privateService = new PrivateService();
  }
  return privateService;
}

// 数据库服务管理器
export class DatabaseServiceManager {
  static insightSearch = getInsightSearchService();
  static tikTokCreator = getTikTokCreatorService();
  static tikTokProduct = getTikTokProductService();
  static kol = getKOLService();
  static kol2024 = getKOL2024Service();
  static selfMedia = getSelfMediaService();
  static testing = getTestingService();
  static private = getPrivateService();
  
  /**
   * 关闭所有数据库连接
   */
  static closeAll(): void {
    DatabaseConnection.getInstance().close();
  }
  
  /**
   * 获取所有服务的统计信息
   */
  static async getAllStats(): Promise<{
    insightSearch: any;
    tikTokCreator: any;
    tikTokProduct: any;
    kol: any;
    selfMedia: any;
  }> {
    const [insightSearch, tikTokCreator, tikTokProduct, kol, selfMedia] = await Promise.all([
      this.insightSearch.getCount(),
      this.tikTokCreator.getEcommerceStats(),
      this.tikTokProduct.getRegionStats(),
      this.kol.getOverallStats(),
      this.selfMedia.getOverallStats()
    ]);
    
    return {
      insightSearch,
      tikTokCreator,
      tikTokProduct,
      kol,
      selfMedia
    };
  }
}