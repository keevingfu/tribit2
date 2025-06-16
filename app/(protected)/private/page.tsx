'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  useGetChannelStatsQuery,
  useGetEDMCampaignsQuery,
  useGetLinkedInMetricsQuery,
  useGetShopifyAnalyticsQuery,
  useGetCustomerLifecycleQuery,
  useGetEmailTrendsQuery,
  useGetConversionFunnelQuery
} from '@/store/api/privateApi';
import { 
  Mail, 
  Linkedin, 
  ShoppingCart, 
  MessageCircle,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Download,
  Filter,
  Calendar,
  BarChart3,
  PieChart,
  Target,
  Zap
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { format } from 'date-fns';

// Dynamic imports for charts
const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export default function PrivatePage() {
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<string>(
    format(new Date(new Date().setMonth(new Date().getMonth() - 1)), 'yyyy-MM-dd')
  );
  const [dateTo, setDateTo] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // API Queries
  const { data: channelStats, isLoading: loadingStats } = useGetChannelStatsQuery();
  const { data: edmCampaigns, isLoading: loadingEDM } = useGetEDMCampaignsQuery({
    page: currentPage,
    limit: pageSize,
    dateFrom,
    dateTo
  });
  const { data: linkedInMetrics, isLoading: loadingLinkedIn } = useGetLinkedInMetricsQuery({
    page: currentPage,
    limit: pageSize,
    dateFrom,
    dateTo
  });
  const { data: shopifyAnalytics, isLoading: loadingShopify } = useGetShopifyAnalyticsQuery({
    page: currentPage,
    limit: pageSize,
    dateFrom,
    dateTo
  });
  const { data: customerLifecycle } = useGetCustomerLifecycleQuery({});
  const { data: emailTrends } = useGetEmailTrendsQuery({ days: 30 });
  const { data: funnelData } = useGetConversionFunnelQuery();

  // Channel icons mapping
  const channelIcons = {
    EDM: Mail,
    LinkedIn: Linkedin,
    Shopify: ShoppingCart,
    WeChat: MessageCircle
  };

  // Email performance chart options
  const emailTrendsOptions = useMemo(() => {
    if (!emailTrends?.data) return {};

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' }
      },
      legend: {
        data: ['Sent', 'Opens', 'Clicks', 'Conversions'],
        bottom: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: emailTrends.data.map(item => item.date)
      },
      yAxis: [
        {
          type: 'value',
          name: 'Count',
          position: 'left'
        }
      ],
      series: [
        {
          name: 'Sent',
          type: 'line',
          data: emailTrends.data.map(item => item.sent),
          smooth: true,
          itemStyle: { color: '#3b82f6' }
        },
        {
          name: 'Opens',
          type: 'line',
          data: emailTrends.data.map(item => item.opens),
          smooth: true,
          itemStyle: { color: '#10b981' }
        },
        {
          name: 'Clicks',
          type: 'line',
          data: emailTrends.data.map(item => item.clicks),
          smooth: true,
          itemStyle: { color: '#f59e0b' }
        },
        {
          name: 'Conversions',
          type: 'line',
          data: emailTrends.data.map(item => item.conversions),
          smooth: true,
          itemStyle: { color: '#ef4444' }
        }
      ]
    };
  }, [emailTrends]);

  // Conversion funnel chart options
  const funnelChartOptions = useMemo(() => {
    if (!funnelData?.data) return {};

    return {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      series: [
        {
          name: 'Conversion Funnel',
          type: 'funnel',
          left: '10%',
          width: '80%',
          label: {
            formatter: '{b}: {c}'
          },
          data: funnelData.data.map(item => ({
            value: item.percentage,
            name: `${item.stage} (${item.value.toLocaleString()})`
          }))
        }
      ]
    };
  }, [funnelData]);

  // Customer lifecycle chart options
  const lifecycleChartOptions = useMemo(() => {
    if (!customerLifecycle?.data) return {};

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      legend: {
        data: ['New', 'Active', 'At Risk', 'Churned'],
        bottom: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: customerLifecycle.data.map(item => item.customer_segment)
      },
      yAxis: {
        type: 'value',
        name: 'Customers'
      },
      series: [
        {
          name: 'New',
          type: 'bar',
          stack: 'total',
          data: customerLifecycle.data.map(item => item.new_customers),
          itemStyle: { color: '#10b981' }
        },
        {
          name: 'Active',
          type: 'bar',
          stack: 'total',
          data: customerLifecycle.data.map(item => item.active_customers),
          itemStyle: { color: '#3b82f6' }
        },
        {
          name: 'At Risk',
          type: 'bar',
          stack: 'total',
          data: customerLifecycle.data.map(item => item.at_risk_customers),
          itemStyle: { color: '#f59e0b' }
        },
        {
          name: 'Churned',
          type: 'bar',
          stack: 'total',
          data: customerLifecycle.data.map(item => item.churned_customers),
          itemStyle: { color: '#ef4444' }
        }
      ]
    };
  }, [customerLifecycle]);

  // Channel performance chart
  const channelPerformanceOptions = useMemo(() => {
    if (!channelStats?.data) return {};

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      legend: {
        data: ['Reach', 'Engagement', 'Conversions'],
        bottom: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: channelStats.data.map(item => item.channel)
      },
      yAxis: {
        type: 'value',
        name: 'Count'
      },
      series: [
        {
          name: 'Reach',
          type: 'bar',
          data: channelStats.data.map(item => item.total_reach),
          itemStyle: { color: '#3b82f6' }
        },
        {
          name: 'Engagement',
          type: 'bar',
          data: channelStats.data.map(item => item.total_engagement),
          itemStyle: { color: '#10b981' }
        },
        {
          name: 'Conversions',
          type: 'bar',
          data: channelStats.data.map(item => item.total_conversions),
          itemStyle: { color: '#f59e0b' }
        }
      ]
    };
  }, [channelStats]);

  const handleExport = () => {
    // Export functionality would be implemented here
    console.log('Exporting private domain data...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Content for Private</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive analytics for your private marketing channels
          </p>
        </div>
        <Button onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Channels</SelectItem>
                  <SelectItem value="edm">EDM</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="shopify">Shopify</SelectItem>
                  <SelectItem value="wechat">WeChat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 items-center">
              <Input 
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-[150px]"
              />
              <span className="text-muted-foreground">to</span>
              <Input 
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-[150px]"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Channel Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {channelStats?.data.map((channel) => {
          const Icon = channelIcons[channel.channel as keyof typeof channelIcons] || Activity;
          return (
            <Card key={channel.channel}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {channel.channel}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <div className="text-2xl font-bold">
                    ${(channel.total_revenue / 1000).toFixed(1)}K
                  </div>
                  <p className="text-xs text-muted-foreground">Total Revenue</p>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500">
                    +{channel.growth_rate}% growth
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Reach</span>
                    <span>{channel.total_reach.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Conversions</span>
                    <span>{channel.total_conversions.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="edm">EDM</TabsTrigger>
          <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
          <TabsTrigger value="shopify">Shopify</TabsTrigger>
          <TabsTrigger value="lifecycle">Customer Lifecycle</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Channel Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Channel Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ReactECharts 
                    option={channelPerformanceOptions} 
                    style={{ height: '100%' }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Conversion Funnel */}
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ReactECharts 
                    option={funnelChartOptions} 
                    style={{ height: '100%' }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Email Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Email Campaign Trends (30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ReactECharts 
                  option={emailTrendsOptions} 
                  style={{ height: '100%' }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* EDM Tab */}
        <TabsContent value="edm" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {edmCampaigns?.data.map((campaign: any) => (
                  <div key={campaign.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{campaign.campaign_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Sent on {campaign.sent_date}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {campaign.total_sent.toLocaleString()} sent
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Open Rate</div>
                        <div className="flex items-center gap-2">
                          <Progress value={campaign.open_rate} className="flex-1" />
                          <span className="text-sm font-medium">{campaign.open_rate}%</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Click Rate</div>
                        <div className="flex items-center gap-2">
                          <Progress value={campaign.click_rate} className="flex-1" />
                          <span className="text-sm font-medium">{campaign.click_rate}%</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Conversion Rate</div>
                        <div className="flex items-center gap-2">
                          <Progress value={campaign.conversion_rate} className="flex-1" />
                          <span className="text-sm font-medium">{campaign.conversion_rate}%</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Revenue</div>
                        <div className="text-lg font-semibold">
                          ${campaign.revenue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* LinkedIn Tab */}
        <TabsContent value="linkedin" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>LinkedIn Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {linkedInMetrics?.data.map((post: any) => (
                  <div key={post.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant={post.post_type === 'video' ? 'default' : 'secondary'}>
                          {post.post_type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {post.post_date}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">{post.impressions.toLocaleString()}</span>
                        <span className="text-muted-foreground"> impressions</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold">{post.likes}</div>
                        <div className="text-xs text-muted-foreground">Likes</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{post.comments}</div>
                        <div className="text-xs text-muted-foreground">Comments</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{post.shares}</div>
                        <div className="text-xs text-muted-foreground">Shares</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{post.engagement_rate}%</div>
                        <div className="text-xs text-muted-foreground">Engagement</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {post.follower_count.toLocaleString()} followers 
                        <span className="text-green-500 ml-1">(+{post.follower_growth})</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shopify Tab */}
        <TabsContent value="shopify" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shopify Store Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shopifyAnalytics?.data.map((day: any) => (
                  <div key={day.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{day.store_name}</h3>
                        <p className="text-sm text-muted-foreground">{day.date}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">${day.revenue.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Revenue</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Sessions</span>
                        </div>
                        <div className="text-lg font-semibold">{day.sessions.toLocaleString()}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Add to Cart</span>
                        </div>
                        <div className="text-lg font-semibold">{day.add_to_carts}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Conversion</span>
                        </div>
                        <div className="text-lg font-semibold">{day.conversion_rate}%</div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">AOV</span>
                        </div>
                        <div className="text-lg font-semibold">${day.average_order_value}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customer Lifecycle Tab */}
        <TabsContent value="lifecycle" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Lifecycle Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ReactECharts 
                  option={lifecycleChartOptions} 
                  style={{ height: '100%' }}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {customerLifecycle?.data.map((segment) => (
              <Card key={segment.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{segment.customer_segment}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Customers</span>
                    <span className="font-semibold">{segment.total_customers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Retention Rate</span>
                    <Badge variant={segment.retention_rate > 90 ? 'default' : 'secondary'}>
                      {segment.retention_rate}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Lifetime Value</span>
                    <span className="font-semibold">${segment.lifetime_value}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {(selectedChannel === 'edm' || selectedChannel === 'linkedin' || selectedChannel === 'shopify') && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {currentPage}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={
              (selectedChannel === 'edm' && (!edmCampaigns?.pagination.totalPages || currentPage >= edmCampaigns.pagination.totalPages)) ||
              (selectedChannel === 'linkedin' && (!linkedInMetrics?.pagination.totalPages || currentPage >= linkedInMetrics.pagination.totalPages)) ||
              (selectedChannel === 'shopify' && (!shopifyAnalytics?.pagination.totalPages || currentPage >= shopifyAnalytics.pagination.totalPages))
            }
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}