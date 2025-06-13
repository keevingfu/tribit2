import { render, screen, waitFor } from '../utils/test-utils'
import { mockAuthState } from '../utils/mock-data'

// Example component for testing
function ExampleComponent() {
  return (
    <div>
      <h1>测试组件</h1>
      <p>这是一个示例测试组件</p>
    </div>
  )
}

describe('Example Test Suite', () => {
  it('should render the example component', () => {
    render(<ExampleComponent />)
    
    expect(screen.getByText('测试组件')).toBeInTheDocument()
    expect(screen.getByText('这是一个示例测试组件')).toBeInTheDocument()
  })

  it('should work with Redux state', () => {
    const { store } = render(<ExampleComponent />, {
      preloadedState: {
        auth: mockAuthState,
      },
    })

    const state = store.getState()
    expect(state.auth.isAuthenticated).toBe(true)
    expect(state.auth.user?.username).toBe('testuser')
  })

  it('should handle async operations', async () => {
    render(<ExampleComponent />)

    await waitFor(() => {
      expect(screen.getByText('测试组件')).toBeInTheDocument()
    })
  })
})