import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ComponentName } from './ComponentName';

// Mock any modules if needed
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: { id: '1', name: 'Test User' }, isAuthenticated: true }),
}));

describe('ComponentName', () => {
  // Test fixtures and mocks
  const mockOnClick = jest.fn();
  const mockOnChange = jest.fn();

  const defaultProps = {
    title: 'Test Title',
    onClick: mockOnClick,
    onChange: mockOnChange,
  };

  // Helper function to render component with all providers
  const renderComponent = (props = {}, storeState = {}) => {
    const store = configureStore({
      reducer: {
        // Add your reducers here
      },
      preloadedState: storeState,
    });

    return render(
      <Provider store={store}>
        <ComponentName {...defaultProps} {...props} />
      </Provider>
    );
  };

  // Setup and cleanup
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with default props', () => {
      renderComponent();
      
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeEnabled();
    });

    it('should render in disabled state', () => {
      renderComponent({ disabled: true });
      
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should render loading state', () => {
      renderComponent({ loading: true });
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
    });

    it('should render error state', () => {
      renderComponent({ error: 'Something went wrong' });
      
      expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
    });
  });

  describe('User Interactions', () => {
    it('should handle click events', async () => {
      const user = userEvent.setup();
      renderComponent();
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
      expect(mockOnClick).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should handle keyboard navigation', async () => {
      const user = userEvent.setup();
      renderComponent();
      
      const button = screen.getByRole('button');
      button.focus();
      
      await user.keyboard('{Enter}');
      expect(mockOnClick).toHaveBeenCalledTimes(1);
      
      await user.keyboard(' ');
      expect(mockOnClick).toHaveBeenCalledTimes(2);
    });

    it('should handle form input changes', async () => {
      const user = userEvent.setup();
      renderComponent();
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'New Value');
      
      expect(mockOnChange).toHaveBeenCalledTimes(9); // Called for each character
      expect(input).toHaveValue('New Value');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      renderComponent();
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label');
      expect(button).toHaveAttribute('aria-describedby');
    });

    it('should announce loading state to screen readers', () => {
      renderComponent({ loading: true });
      
      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    });

    it('should be keyboard navigable', () => {
      renderComponent();
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Props and State', () => {
    it('should update when props change', () => {
      const { rerender } = renderComponent();
      
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      
      rerender(
        <Provider store={configureStore({ reducer: {} })}>
          <ComponentName {...defaultProps} title="Updated Title" />
        </Provider>
      );
      
      expect(screen.getByText('Updated Title')).toBeInTheDocument();
    });

    it('should handle conditional rendering based on props', () => {
      renderComponent({ showOptionalContent: true });
      
      expect(screen.getByTestId('optional-content')).toBeInTheDocument();
      
      renderComponent({ showOptionalContent: false });
      
      expect(screen.queryByTestId('optional-content')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty data gracefully', () => {
      renderComponent({ data: [] });
      
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('should handle null/undefined props', () => {
      renderComponent({ title: undefined });
      
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
    });

    it('should prevent multiple rapid clicks', async () => {
      const user = userEvent.setup();
      renderComponent();
      
      const button = screen.getByRole('button');
      
      // Rapid clicks
      await user.tripleClick(button);
      
      // Should only be called once if debounced
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Async Operations', () => {
    it('should handle async data loading', async () => {
      renderComponent({ loadDataOnMount: true });
      
      // Initially shows loading
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });
      
      // Data should be displayed
      expect(screen.getByTestId('data-content')).toBeInTheDocument();
    });

    it('should handle async operation errors', async () => {
      renderComponent({ loadDataOnMount: true, shouldFail: true });
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Failed to load data');
      });
    });
  });

  describe('Integration with Redux', () => {
    it('should dispatch actions correctly', async () => {
      const user = userEvent.setup();
      const storeState = {
        someSlice: { value: 'initial' },
      };
      
      renderComponent({}, storeState);
      
      const button = screen.getByTestId('dispatch-button');
      await user.click(button);
      
      // Verify the action was dispatched
      // This would need actual Redux setup to test properly
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      const renderSpy = jest.fn();
      
      // Mock React.memo or component render
      const MemoizedComponent = React.memo(() => {
        renderSpy();
        return <ComponentName {...defaultProps} />;
      });
      
      const { rerender } = render(<MemoizedComponent />);
      
      expect(renderSpy).toHaveBeenCalledTimes(1);
      
      // Re-render with same props
      rerender(<MemoizedComponent />);
      
      // Should not render again due to memoization
      expect(renderSpy).toHaveBeenCalledTimes(1);
    });
  });
});