import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toBeVisible(): R
      toBeDisabled(): R
      toHaveClass(className: string): R
      toHaveStyle(style: Record<string, any>): R
      toHaveTextContent(text: string | RegExp): R
      toHaveAttribute(attr: string, value?: string): R
      toBeChecked(): R
      toHaveValue(value: string | number | string[]): R
      toContainElement(element: HTMLElement | null): R
      toBeEmptyDOMElement(): R
      toHaveFocus(): R
      toBeRequired(): R
      toBeValid(): R
      toBeInvalid(): R
    }
  }
}

export {}