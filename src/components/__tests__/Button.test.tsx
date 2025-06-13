import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('should render with text', () => {
    render(<Button>点击我</Button>)
    expect(screen.getByText('点击我')).toBeInTheDocument()
  })

  it('should handle click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>点击按钮</Button>)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should apply variant classes', () => {
    render(<Button variant="default">Default Button</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toHaveClass('bg-primary')
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toBeDisabled()
  })

  it('should apply size classes', () => {
    const { rerender } = render(<Button size="sm">Small Button</Button>)
    let button = screen.getByRole('button')
    expect(button).toHaveClass('h-9', 'px-3')
    
    rerender(<Button size="lg">Large Button</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('h-11', 'px-8')
  })
})