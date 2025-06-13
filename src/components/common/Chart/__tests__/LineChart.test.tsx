import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import LineChart from '../LineChart';
import * as echarts from 'echarts';

// Mock ECharts
jest.mock('echarts', () => ({
  init: jest.fn(() => ({
    setOption: jest.fn(),
    resize: jest.fn(),
    dispose: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
  })),
  use: jest.fn(),
}));

describe('LineChart Component', () => {
  const mockData = {
    xAxis: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    series: [
      {
        name: 'Sales',
        data: [120, 200, 150, 80, 70, 110],
      },
      {
        name: 'Revenue',
        data: [100, 180, 130, 60, 50, 90],
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the chart container', () => {
    const { container } = render(<LineChart data={mockData} />);
    
    const chartContainer = container.querySelector('div[style*="height"]');
    expect(chartContainer).toBeInTheDocument();
    expect(chartContainer).toHaveStyle({ height: '400px' });
  });

  it('should initialize ECharts with correct options', async () => {
    render(<LineChart data={mockData} />);
    
    await waitFor(() => {
      expect(echarts.init).toHaveBeenCalled();
    });
    
    const mockChart = (echarts.init as jest.Mock).mock.results[0].value;
    expect(mockChart.setOption).toHaveBeenCalledWith(
      expect.objectContaining({
        xAxis: expect.objectContaining({
          data: mockData.xAxis,
        }),
        series: expect.arrayContaining([
          expect.objectContaining({
            name: 'Sales',
            type: 'line',
            data: mockData.series[0].data,
          }),
          expect.objectContaining({
            name: 'Revenue',
            type: 'line',
            data: mockData.series[1].data,
          }),
        ]),
      })
    );
  });

  it('should render with custom title', () => {
    render(<LineChart data={mockData} title="Monthly Sales Chart" />);
    
    const mockChart = (echarts.init as jest.Mock).mock.results[0].value;
    expect(mockChart.setOption).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.objectContaining({
          text: 'Monthly Sales Chart',
        }),
      })
    );
  });

  it('should apply custom height', () => {
    render(<LineChart data={mockData} height={500} />);
    
    const chartContainer = screen.getByTestId('line-chart');
    expect(chartContainer.style.height).toBe('500px');
  });

  it('should show loading state', () => {
    render(<LineChart data={mockData} loading={true} />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should handle empty data gracefully', () => {
    const emptyData = {
      xAxis: [],
      series: [],
    };
    
    render(<LineChart data={emptyData} />);
    
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('should dispose chart on unmount', () => {
    const { unmount } = render(<LineChart data={mockData} />);
    
    const mockChart = (echarts.init as jest.Mock).mock.results[0].value;
    
    unmount();
    
    expect(mockChart.dispose).toHaveBeenCalled();
  });

  it('should resize chart on window resize', async () => {
    render(<LineChart data={mockData} />);
    
    const mockChart = (echarts.init as jest.Mock).mock.results[0].value;
    
    // Simulate window resize
    global.dispatchEvent(new Event('resize'));
    
    await waitFor(() => {
      expect(mockChart.resize).toHaveBeenCalled();
    });
  });

  it('should update chart when data changes', async () => {
    const { rerender } = render(<LineChart data={mockData} />);
    
    const newData = {
      xAxis: ['Jul', 'Aug', 'Sep'],
      series: [
        {
          name: 'Sales',
          data: [130, 140, 160],
        },
      ],
    };
    
    rerender(<LineChart data={newData} />);
    
    const mockChart = (echarts.init as jest.Mock).mock.results[0].value;
    
    await waitFor(() => {
      expect(mockChart.setOption).toHaveBeenCalledWith(
        expect.objectContaining({
          xAxis: expect.objectContaining({
            data: newData.xAxis,
          }),
        })
      );
    });
  });

  it('should apply custom colors to series', () => {
    const colors = ['#FF6B6B', '#4ECDC4'];
    render(<LineChart data={mockData} colors={colors} />);
    
    const mockChart = (echarts.init as jest.Mock).mock.results[0].value;
    expect(mockChart.setOption).toHaveBeenCalledWith(
      expect.objectContaining({
        color: colors,
      })
    );
  });

  it('should enable grid lines when specified', () => {
    render(<LineChart data={mockData} showGrid={true} />);
    
    const mockChart = (echarts.init as jest.Mock).mock.results[0].value;
    expect(mockChart.setOption).toHaveBeenCalledWith(
      expect.objectContaining({
        grid: expect.objectContaining({
          show: true,
        }),
      })
    );
  });

  it('should handle click events on data points', () => {
    const handleClick = jest.fn();
    render(<LineChart data={mockData} onDataClick={handleClick} />);
    
    const mockChart = (echarts.init as jest.Mock).mock.results[0].value;
    
    // Verify click event listener was added
    expect(mockChart.on).toHaveBeenCalledWith('click', expect.any(Function));
  });
});