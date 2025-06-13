import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Card from '../Card';

describe('Card Component', () => {
  it('should render children content', () => {
    render(
      <Card>
        <p>Test content</p>
      </Card>
    );
    
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should render title and subtitle', () => {
    render(
      <Card title="Card Title" subtitle="Card Subtitle">
        <p>Content</p>
      </Card>
    );
    
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Subtitle')).toBeInTheDocument();
  });

  it('should render header actions', () => {
    render(
      <Card 
        title="Card with Actions"
        headerActions={<button>Action</button>}
      >
        <p>Content</p>
      </Card>
    );
    
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('should render footer content', () => {
    render(
      <Card footer={<div>Footer content</div>}>
        <p>Body content</p>
      </Card>
    );
    
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('should apply different padding sizes', () => {
    const { rerender } = render(
      <Card padding="sm">
        <p>Content</p>
      </Card>
    );
    
    let card = screen.getByText('Content').parentElement;
    expect(card?.className).toContain('p-4');
    
    rerender(
      <Card padding="lg">
        <p>Content</p>
      </Card>
    );
    
    card = screen.getByText('Content').parentElement;
    expect(card?.className).toContain('p-8');
  });

  it('should apply different shadow sizes', () => {
    const { rerender } = render(
      <Card shadow="md">
        <p>Content</p>
      </Card>
    );
    
    let card = screen.getByText('Content').closest('.bg-white');
    expect(card?.className).toContain('shadow-md');
    
    rerender(
      <Card shadow="xl">
        <p>Content</p>
      </Card>
    );
    
    card = screen.getByText('Content').closest('.bg-white');
    expect(card?.className).toContain('shadow-xl');
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();
    render(
      <Card onClick={handleClick}>
        <p>Clickable card</p>
      </Card>
    );
    
    const card = screen.getByText('Clickable card').closest('.bg-white');
    if (card) {
      fireEvent.click(card);
      expect(handleClick).toHaveBeenCalledTimes(1);
    }
  });

  it('should apply hoverable styles', () => {
    render(
      <Card hoverable={true}>
        <p>Hoverable card</p>
      </Card>
    );
    
    const card = screen.getByText('Hoverable card').closest('.bg-white');
    expect(card?.className).toContain('hover:shadow-lg');
    expect(card?.className).toContain('transition-shadow');
  });

  it('should apply bordered styles', () => {
    const { rerender } = render(
      <Card bordered={true}>
        <p>Bordered card</p>
      </Card>
    );
    
    let card = screen.getByText('Bordered card').closest('.bg-white');
    expect(card?.className).toContain('border');
    expect(card?.className).toContain('border-gray-200');
    
    rerender(
      <Card bordered={false}>
        <p>No border card</p>
      </Card>
    );
    
    card = screen.getByText('No border card').closest('.bg-white');
    expect(card?.className).not.toContain('border-gray-200');
  });

  it('should apply custom className', () => {
    render(
      <Card className="custom-class">
        <p>Custom styled card</p>
      </Card>
    );
    
    const card = screen.getByText('Custom styled card').closest('.bg-white');
    expect(card?.className).toContain('custom-class');
  });

  it('should render complex card structure', () => {
    render(
      <Card
        title="Complex Card"
        subtitle="With all features"
        headerActions={
          <div>
            <button>Edit</button>
            <button>Delete</button>
          </div>
        }
        footer={
          <div className="flex justify-between">
            <span>Status: Active</span>
            <button>View Details</button>
          </div>
        }
        padding="lg"
        shadow="lg"
        hoverable
      >
        <div>
          <p>Main content goes here</p>
          <ul>
            <li>Feature 1</li>
            <li>Feature 2</li>
          </ul>
        </div>
      </Card>
    );
    
    // Check all elements are rendered
    expect(screen.getByText('Complex Card')).toBeInTheDocument();
    expect(screen.getByText('With all features')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    expect(screen.getByText('Main content goes here')).toBeInTheDocument();
    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    expect(screen.getByText('Status: Active')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'View Details' })).toBeInTheDocument();
  });
});