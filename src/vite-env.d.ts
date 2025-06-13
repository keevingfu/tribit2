/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_DB_PATH: string
  readonly VITE_YOUTUBE_API_KEY: string
  readonly VITE_TIKTOK_CLIENT_KEY: string
  readonly VITE_TIKTOK_CLIENT_SECRET: string
  readonly VITE_INSTAGRAM_CLIENT_ID: string
  readonly VITE_INSTAGRAM_CLIENT_SECRET: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_VIDEO_PREVIEW: string
  readonly VITE_ENABLE_BROWSER_AUTOMATION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}