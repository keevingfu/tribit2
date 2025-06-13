# Tribit Content Marketing Platform - 项目目录结构

```
buagent/
├── package.json                    # 项目配置文件
├── tsconfig.json                   # TypeScript配置
├── tailwind.config.js              # Tailwind CSS配置
├── vite.config.ts                  # Vite构建配置
├── .gitignore                      # Git忽略文件
├── .env                            # 环境变量配置
├── .env.example                    # 环境变量示例
├── README.md                       # 项目说明文档
├── CLAUDE.md                       # Claude AI指南
├── PROJECT_GUIDE.md                # 项目功能指南
│
├── public/                         # 静态资源目录
│   ├── favicon.ico
│   ├── logo.png
│   └── assets/
│       ├── images/
│       └── icons/
│
├── src/                            # 源代码目录
│   ├── main.tsx                    # 应用入口文件
│   ├── App.tsx                     # 根组件
│   ├── App.css                     # 全局样式
│   ├── index.css                   # Tailwind CSS入口
│   │
│   ├── types/                      # TypeScript类型定义
│   │   ├── index.ts
│   │   ├── insight.ts              # 内容洞察类型
│   │   ├── testing.ts              # 内容测试类型
│   │   ├── kol.ts                  # KOL相关类型
│   │   ├── ads.ts                  # 广告相关类型
│   │   └── private.ts              # 私域相关类型
│   │
│   ├── utils/                      # 工具函数
│   │   ├── index.ts
│   │   ├── format.ts               # 格式化工具
│   │   ├── validation.ts           # 数据验证
│   │   ├── api.ts                  # API请求工具
│   │   └── constants.ts            # 常量定义
│   │
│   ├── hooks/                      # React自定义Hooks
│   │   ├── useAuth.ts
│   │   ├── useData.ts
│   │   ├── useChart.ts
│   │   └── useTable.ts
│   │
│   ├── services/                   # 服务层（API调用）
│   │   ├── api.ts                  # API基础配置
│   │   ├── insight.service.ts      # 内容洞察服务
│   │   ├── testing.service.ts      # 内容测试服务
│   │   ├── kol.service.ts          # KOL服务
│   │   ├── ads.service.ts          # 广告服务
│   │   └── private.service.ts      # 私域服务
│   │
│   ├── store/                      # 状态管理
│   │   ├── index.ts
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── insightSlice.ts
│   │   │   ├── testingSlice.ts
│   │   │   ├── kolSlice.ts
│   │   │   ├── adsSlice.ts
│   │   │   └── privateSlice.ts
│   │   └── hooks.ts
│   │
│   ├── components/                 # 组件目录
│   │   ├── common/                 # 通用组件
│   │   │   ├── Layout/
│   │   │   │   ├── Layout.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Footer.tsx
│   │   │   ├── Chart/
│   │   │   │   ├── LineChart.tsx
│   │   │   │   ├── BarChart.tsx
│   │   │   │   ├── PieChart.tsx
│   │   │   │   └── ChartWrapper.tsx
│   │   │   ├── Table/
│   │   │   │   ├── DataTable.tsx
│   │   │   │   ├── TableFilter.tsx
│   │   │   │   └── TablePagination.tsx
│   │   │   ├── Form/
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Select.tsx
│   │   │   │   ├── DatePicker.tsx
│   │   │   │   └── FormWrapper.tsx
│   │   │   └── UI/
│   │   │       ├── Button.tsx
│   │   │       ├── Card.tsx
│   │   │       ├── Modal.tsx
│   │   │       ├── Loading.tsx
│   │   │       └── Toast.tsx
│   │   │
│   │   ├── insight/                # 内容洞察组件
│   │   │   ├── ConsumerVoice/
│   │   │   │   ├── ConsumerVoiceAnalysis.tsx
│   │   │   │   ├── VoiceChart.tsx
│   │   │   │   └── VoiceTable.tsx
│   │   │   ├── SearchInsights/
│   │   │   │   ├── SearchInsights.tsx
│   │   │   │   ├── SearchTrends.tsx
│   │   │   │   └── KeywordAnalysis.tsx
│   │   │   ├── ViralAnalysis/
│   │   │   │   ├── ViralFactorAnalysis.tsx
│   │   │   │   ├── ViralMetrics.tsx
│   │   │   │   └── ViralChart.tsx
│   │   │   └── VideoInsights/
│   │   │       ├── ViralVideoInsights.tsx
│   │   │       ├── VideoList.tsx
│   │   │       └── VideoPreview.tsx
│   │   │
│   │   ├── testing/                # 内容测试组件
│   │   │   ├── Ideation/
│   │   │   │   ├── ContentIdeation.tsx
│   │   │   │   ├── IdeaGenerator.tsx
│   │   │   │   └── IdeaList.tsx
│   │   │   ├── TestExecution/
│   │   │   │   ├── TestingDashboard.tsx
│   │   │   │   ├── ABTestSetup.tsx
│   │   │   │   └── TestMonitor.tsx
│   │   │   ├── Performance/
│   │   │   │   ├── PerformanceAnalysis.tsx
│   │   │   │   ├── MetricsDisplay.tsx
│   │   │   │   └── ComparisonChart.tsx
│   │   │   └── Refinement/
│   │   │       ├── ContentRefinement.tsx
│   │   │       ├── IterationTracker.tsx
│   │   │       └── OptimizationSuggestions.tsx
│   │   │
│   │   ├── kol/                    # KOL内容组件
│   │   │   ├── Dashboard/
│   │   │   │   ├── KOLDashboard.tsx
│   │   │   │   ├── KOLMetrics.tsx
│   │   │   │   └── KOLList.tsx
│   │   │   ├── Overview/
│   │   │   │   ├── KOLOverview.tsx
│   │   │   │   ├── ProfileCard.tsx
│   │   │   │   └── PerformanceChart.tsx
│   │   │   ├── Reach/
│   │   │   │   ├── ReachAnalysis.tsx
│   │   │   │   ├── AudienceMap.tsx
│   │   │   │   └── EngagementMetrics.tsx
│   │   │   └── Conversion/
│   │   │       ├── ConversionAnalysis.tsx
│   │   │       ├── RevenueChart.tsx
│   │   │       └── ROICalculator.tsx
│   │   │
│   │   ├── ads/                    # 广告内容组件
│   │   │   ├── Distribution/
│   │   │   │   ├── AdDistribution.tsx
│   │   │   │   ├── ChannelStrategy.tsx
│   │   │   │   └── BudgetAllocation.tsx
│   │   │   ├── Audience/
│   │   │   │   ├── AudienceInsights.tsx
│   │   │   │   ├── BehaviorAnalysis.tsx
│   │   │   │   └── TargetingSetup.tsx
│   │   │   ├── Optimization/
│   │   │   │   ├── ContentOptimization.tsx
│   │   │   │   ├── CreativeAnalysis.tsx
│   │   │   │   └── ABTestResults.tsx
│   │   │   └── Tracking/
│   │   │       ├── PerformanceTracking.tsx
│   │   │       ├── ConversionFunnel.tsx
│   │   │       └── ROIReport.tsx
│   │   │
│   │   └── private/                # 私域内容组件
│   │       ├── EDM/
│   │       │   ├── EDMAnalytics.tsx
│   │       │   ├── EmailPerformance.tsx
│   │       │   └── SubscriberAnalysis.tsx
│   │       ├── LinkedIn/
│   │       │   ├── LinkedInAnalytics.tsx
│   │       │   ├── PostPerformance.tsx
│   │       │   └── NetworkGrowth.tsx
│   │       ├── OfflineStores/
│   │       │   ├── StoreAnalytics.tsx
│   │       │   ├── FootTraffic.tsx
│   │       │   └── SalesConversion.tsx
│   │       ├── Shopify/
│   │       │   ├── ShopifyAnalytics.tsx
│   │       │   ├── ProductPerformance.tsx
│   │       │   └── CustomerBehavior.tsx
│   │       └── WhatsApp/
│   │           ├── WhatsAppAnalytics.tsx
│   │           ├── MessageMetrics.tsx
│   │           └── CampaignTracking.tsx
│   │
│   ├── pages/                      # 页面组件（路由）
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── insight/
│   │   │   ├── index.tsx
│   │   │   ├── ConsumerVoice.tsx
│   │   │   ├── SearchInsights.tsx
│   │   │   ├── ViralAnalysis.tsx
│   │   │   └── VideoInsights.tsx
│   │   ├── testing/
│   │   │   ├── index.tsx
│   │   │   ├── Ideation.tsx
│   │   │   ├── Execution.tsx
│   │   │   ├── Performance.tsx
│   │   │   └── Refinement.tsx
│   │   ├── kol/
│   │   │   ├── index.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Overview.tsx
│   │   │   ├── Reach.tsx
│   │   │   └── Conversion.tsx
│   │   ├── ads/
│   │   │   ├── index.tsx
│   │   │   ├── Distribution.tsx
│   │   │   ├── Audience.tsx
│   │   │   ├── Optimization.tsx
│   │   │   └── Tracking.tsx
│   │   └── private/
│   │       ├── index.tsx
│   │       ├── EDM.tsx
│   │       ├── LinkedIn.tsx
│   │       ├── OfflineStores.tsx
│   │       ├── Shopify.tsx
│   │       └── WhatsApp.tsx
│   │
│   └── routes/                     # 路由配置
│       └── index.tsx
│
├── server/                         # 后端服务（如果需要）
│   ├── index.js
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── utils/
│
├── data/                           # 数据文件目录（已存在）
│   ├── csv/
│   ├── excel/
│   └── tribit.db
│
└── tests/                          # 测试文件
    ├── unit/
    ├── integration/
    └── e2e/
```

## 文件命名规范

1. **组件文件**: 使用PascalCase（如 `ConsumerVoice.tsx`）
2. **工具函数**: 使用camelCase（如 `formatData.ts`）
3. **常量文件**: 使用UPPER_SNAKE_CASE（如 `API_CONSTANTS.ts`）
4. **样式文件**: 与组件同名（如 `ConsumerVoice.css`）

## 主要功能模块文件

### 1. Content Insight（内容洞察）
- ConsumerVoiceAnalysis.tsx
- SearchInsights.tsx
- ViralFactorAnalysis.tsx
- ViralVideoInsights.tsx

### 2. Content Testing（内容测试）
- ContentIdeation.tsx
- TestingDashboard.tsx
- PerformanceAnalysis.tsx
- ContentRefinement.tsx

### 3. Content for KOL（KOL内容）
- KOLDashboard.tsx
- KOLOverview.tsx
- ReachAnalysis.tsx
- ConversionAnalysis.tsx

### 4. Content for Ads（广告内容）
- AdDistribution.tsx
- AudienceInsights.tsx
- ContentOptimization.tsx
- PerformanceTracking.tsx

### 5. Content for Private（私域内容）
- EDMAnalytics.tsx
- LinkedInAnalytics.tsx
- StoreAnalytics.tsx
- ShopifyAnalytics.tsx
- WhatsAppAnalytics.tsx