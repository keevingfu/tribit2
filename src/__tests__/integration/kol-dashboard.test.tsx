import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '@/store';
import KOLDashboard from '@/components/kol/Dashboard/KOLDashboard';
import { server } from '@/tests/mocks/server';
import { rest } from 'msw';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
    toString: () => '',
  }),
}));

// Mock ECharts
jest.mock('echarts-for-react', () => ({
  __esModule: true,
  default: ({ option }: any) => (
    <div data-testid="mock-chart" data-option={JSON.stringify(option)}>
      Mock Chart
    </div>
  ),
}));

describe('KOL Dashboard Integration', () => {
  const mockKOLData = {
    data: [
      {
        id: '1',
        name: 'Test Influencer 1',
        platform: 'youtube',
        follower_count: 1000000,
        engagement_rate: 5.5,
        posts_count: 150,
        avg_views: 50000,
        category: 'Beauty',
      },
      {
        id: '2',
        name: 'Test Influencer 2',
        platform: 'instagram',
        follower_count: 500000,
        engagement_rate: 7.2,
        posts_count: 300,
        avg_views: 25000,
        category: 'Tech',
      },
    ],
    pagination: {
      page: 1,
      limit: 10,
      total: 2,
      totalPages: 1,
    },
  };

  const mockStatistics = {
    total_kols: 156,
    avg_followers: 750000,
    avg_engagement: 6.3,
    total_posts: 45000,
    platforms: {
      youtube: 50,
      instagram: 60,
      tiktok: 46,
    },
  };

  const renderDashboard = () => {
    return render(
      <Provider store={store}>
        <KOLDashboard />
      </Provider>
    );
  };

  beforeEach(() => {
    // Reset handlers to default
    server.resetHandlers();
  });

  describe('Initial Load', () => {
    it('should display loading state initially', () => {
      renderDashboard();
      
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should load and display KOL data', async () => {
      server.use(
        rest.get('/api/kol', (req, res, ctx) => {
          return res(ctx.json(mockKOLData));
        }),
        rest.get('/api/kol/statistics', (req, res, ctx) => {
          return res(ctx.json(mockStatistics));
        })
      );

      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText('Test Influencer 1')).toBeInTheDocument();
        expect(screen.getByText('Test Influencer 2')).toBeInTheDocument();
      });

      // Check statistics
      expect(screen.getByText('156')).toBeInTheDocument(); // Total KOLs
      expect(screen.getByText('750K')).toBeInTheDocument(); // Avg followers
      expect(screen.getByText('6.3%')).toBeInTheDocument(); // Avg engagement
    });

    it('should handle API errors gracefully', async () => {
      server.use(
        rest.get('/api/kol', (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ error: 'Internal server error' }));
        })
      );

      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText(/error loading data/i)).toBeInTheDocument();
      });

      // Should show retry button
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
  });

  describe('Search and Filters', () => {
    it('should search KOLs by name', async () => {
      const user = userEvent.setup();
      
      server.use(
        rest.get('/api/kol', (req, res, ctx) => {
          const search = req.url.searchParams.get('search');
          if (search === 'Beauty') {
            return res(ctx.json({
              data: [mockKOLData.data[0]],
              pagination: { ...mockKOLData.pagination, total: 1 },
            }));
          }
          return res(ctx.json(mockKOLData));
        })
      );

      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText('Test Influencer 1')).toBeInTheDocument();
      });

      // Search for "Beauty"
      const searchInput = screen.getByPlaceholderText(/search kol/i);
      await user.type(searchInput, 'Beauty');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByText('Test Influencer 1')).toBeInTheDocument();
        expect(screen.queryByText('Test Influencer 2')).not.toBeInTheDocument();
      });
    });

    it('should filter by platform', async () => {
      const user = userEvent.setup();
      
      server.use(
        rest.get('/api/kol', (req, res, ctx) => {
          const platform = req.url.searchParams.get('platform');
          if (platform === 'youtube') {
            return res(ctx.json({
              data: [mockKOLData.data[0]],
              pagination: { ...mockKOLData.pagination, total: 1 },
            }));
          }
          return res(ctx.json(mockKOLData));
        })
      );

      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText('Test Influencer 1')).toBeInTheDocument();
      });

      // Filter by YouTube
      const platformFilter = screen.getByRole('combobox', { name: /platform/i });
      await user.selectOptions(platformFilter, 'youtube');

      await waitFor(() => {
        expect(screen.getByText('Test Influencer 1')).toBeInTheDocument();
        expect(screen.queryByText('Test Influencer 2')).not.toBeInTheDocument();
      });
    });

    it('should filter by engagement rate range', async () => {
      const user = userEvent.setup();
      
      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText('Test Influencer 1')).toBeInTheDocument();
      });

      // Set engagement rate filter
      const minEngagement = screen.getByLabelText(/min engagement/i);
      const maxEngagement = screen.getByLabelText(/max engagement/i);
      
      await user.clear(minEngagement);
      await user.type(minEngagement, '6');
      await user.clear(maxEngagement);
      await user.type(maxEngagement, '8');
      
      const applyButton = screen.getByRole('button', { name: /apply/i });
      await user.click(applyButton);

      await waitFor(() => {
        expect(screen.queryByText('Test Influencer 1')).not.toBeInTheDocument();
        expect(screen.getByText('Test Influencer 2')).toBeInTheDocument();
      });
    });
  });

  describe('Data Interactions', () => {
    it('should navigate to KOL detail page on row click', async () => {
      const user = userEvent.setup();
      const mockPush = jest.fn();
      
      jest.mocked(require('next/navigation').useRouter).mockReturnValue({
        push: mockPush,
        replace: jest.fn(),
        prefetch: jest.fn(),
        back: jest.fn(),
      });

      server.use(
        rest.get('/api/kol', (req, res, ctx) => {
          return res(ctx.json(mockKOLData));
        })
      );

      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText('Test Influencer 1')).toBeInTheDocument();
      });

      // Click on the first KOL row
      const firstRow = screen.getByText('Test Influencer 1').closest('tr');
      await user.click(firstRow!);

      expect(mockPush).toHaveBeenCalledWith('/kol/1');
    });

    it('should handle pagination', async () => {
      const user = userEvent.setup();
      
      server.use(
        rest.get('/api/kol', (req, res, ctx) => {
          const page = req.url.searchParams.get('page');
          if (page === '2') {
            return res(ctx.json({
              data: [
                {
                  id: '3',
                  name: 'Test Influencer 3',
                  platform: 'tiktok',
                  follower_count: 200000,
                  engagement_rate: 8.5,
                  posts_count: 100,
                  avg_views: 15000,
                  category: 'Fashion',
                },
              ],
              pagination: {
                page: 2,
                limit: 10,
                total: 11,
                totalPages: 2,
              },
            }));
          }
          return res(ctx.json({
            ...mockKOLData,
            pagination: {
              ...mockKOLData.pagination,
              total: 11,
              totalPages: 2,
            },
          }));
        })
      );

      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText('Test Influencer 1')).toBeInTheDocument();
      });

      // Click next page
      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.queryByText('Test Influencer 1')).not.toBeInTheDocument();
        expect(screen.getByText('Test Influencer 3')).toBeInTheDocument();
      });
    });

    it('should export data as CSV', async () => {
      const user = userEvent.setup();
      
      server.use(
        rest.get('/api/kol', (req, res, ctx) => {
          return res(ctx.json(mockKOLData));
        }),
        rest.post('/api/kol/export', (req, res, ctx) => {
          return res(
            ctx.set('Content-Type', 'text/csv'),
            ctx.set('Content-Disposition', 'attachment; filename="kol-export.csv"'),
            ctx.body('id,name,platform,followers\n1,Test Influencer 1,youtube,1000000')
          );
        })
      );

      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText('Test Influencer 1')).toBeInTheDocument();
      });

      // Mock download
      const mockLink = document.createElement('a');
      const clickSpy = jest.spyOn(mockLink, 'click');
      jest.spyOn(document, 'createElement').mockReturnValue(mockLink);

      // Click export button
      const exportButton = screen.getByRole('button', { name: /export/i });
      await user.click(exportButton);

      await waitFor(() => {
        expect(clickSpy).toHaveBeenCalled();
        expect(mockLink.download).toBe('kol-export.csv');
      });
    });
  });

  describe('Chart Visualizations', () => {
    it('should display platform distribution chart', async () => {
      server.use(
        rest.get('/api/kol', (req, res, ctx) => {
          return res(ctx.json(mockKOLData));
        }),
        rest.get('/api/kol/statistics', (req, res, ctx) => {
          return res(ctx.json(mockStatistics));
        })
      );

      renderDashboard();

      await waitFor(() => {
        const charts = screen.getAllByTestId('mock-chart');
        expect(charts.length).toBeGreaterThan(0);
        
        // Find platform distribution chart
        const platformChart = charts.find(chart => {
          const option = JSON.parse(chart.getAttribute('data-option') || '{}');
          return option.series?.[0]?.type === 'pie';
        });
        
        expect(platformChart).toBeInTheDocument();
        
        const chartData = JSON.parse(platformChart!.getAttribute('data-option') || '{}');
        expect(chartData.series[0].data).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ name: 'youtube', value: 50 }),
            expect.objectContaining({ name: 'instagram', value: 60 }),
            expect.objectContaining({ name: 'tiktok', value: 46 }),
          ])
        );
      });
    });

    it('should update charts when filters change', async () => {
      const user = userEvent.setup();
      
      server.use(
        rest.get('/api/kol', (req, res, ctx) => {
          return res(ctx.json(mockKOLData));
        }),
        rest.get('/api/kol/statistics', (req, res, ctx) => {
          const platform = req.url.searchParams.get('platform');
          if (platform === 'youtube') {
            return res(ctx.json({
              ...mockStatistics,
              total_kols: 50,
              platforms: { youtube: 50 },
            }));
          }
          return res(ctx.json(mockStatistics));
        })
      );

      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText('156')).toBeInTheDocument(); // Total KOLs
      });

      // Filter by YouTube
      const platformFilter = screen.getByRole('combobox', { name: /platform/i });
      await user.selectOptions(platformFilter, 'youtube');

      await waitFor(() => {
        expect(screen.getByText('50')).toBeInTheDocument(); // Updated total
      });
    });
  });

  describe('Real-time Updates', () => {
    it('should refresh data periodically', async () => {
      jest.useFakeTimers();
      
      let callCount = 0;
      server.use(
        rest.get('/api/kol', (req, res, ctx) => {
          callCount++;
          return res(ctx.json(mockKOLData));
        })
      );

      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText('Test Influencer 1')).toBeInTheDocument();
      });

      expect(callCount).toBe(1);

      // Fast forward 5 minutes
      jest.advanceTimersByTime(5 * 60 * 1000);

      await waitFor(() => {
        expect(callCount).toBe(2);
      });

      jest.useRealTimers();
    });

    it('should show notification for new KOLs', async () => {
      server.use(
        rest.get('/api/kol', (req, res, ctx) => {
          return res(ctx.json(mockKOLData));
        }),
        rest.get('/api/kol/new', (req, res, ctx) => {
          return res(ctx.json({
            count: 3,
            message: '3 new KOLs added since your last visit',
          }));
        })
      );

      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText(/3 new KOLs added/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Recovery', () => {
    it('should recover from network errors', async () => {
      const user = userEvent.setup();
      let shouldFail = true;
      
      server.use(
        rest.get('/api/kol', (req, res, ctx) => {
          if (shouldFail) {
            shouldFail = false;
            return res(ctx.status(500), ctx.json({ error: 'Server error' }));
          }
          return res(ctx.json(mockKOLData));
        })
      );

      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText(/error loading data/i)).toBeInTheDocument();
      });

      // Click retry
      const retryButton = screen.getByRole('button', { name: /retry/i });
      await user.click(retryButton);

      await waitFor(() => {
        expect(screen.getByText('Test Influencer 1')).toBeInTheDocument();
      });
    });
  });
});