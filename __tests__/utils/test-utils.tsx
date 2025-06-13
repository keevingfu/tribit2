import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore, PreloadedState } from '@reduxjs/toolkit'
import { RootState, AppStore } from '@/store'
import authReducer from '@/store/slices/authSlice'
import uiReducer from '@/store/slices/uiSlice'
import { insightApi } from '@/store/api/insightApi'
import { kolApi } from '@/store/api/kolApi'
import { testingApi } from '@/store/api/testingApi'
import { adsApi } from '@/store/api/adsApi'
import { privateApi } from '@/store/api/privateApi'

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>
  store?: AppStore
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = configureStore({
      reducer: {
        auth: authReducer,
        ui: uiReducer,
        [insightApi.reducerPath]: insightApi.reducer,
        [kolApi.reducerPath]: kolApi.reducer,
        [testingApi.reducerPath]: testingApi.reducer,
        [adsApi.reducerPath]: adsApi.reducer,
        [privateApi.reducerPath]: privateApi.reducer,
      },
      preloadedState,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
          },
        }).concat(
          insightApi.middleware,
          kolApi.middleware,
          testingApi.middleware,
          adsApi.middleware,
          privateApi.middleware
        ),
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}

// Re-export everything
export * from '@testing-library/react'
export { renderWithProviders as render }