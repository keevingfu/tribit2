/// <reference types="jest" />

declare global {
  namespace NodeJS {
    interface Global {
      TextEncoder: typeof TextEncoder
      TextDecoder: typeof TextDecoder
    }
  }
}

export {}