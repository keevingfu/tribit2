import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

// Import slices
import authReducer from './slices/authSlice';
import insightReducer from './slices/insightSlice';
import kolReducer from './slices/kolSlice';
import uiReducer from './slices/uiSlice';
import testingReducer from './slices/testingSlice';
import adsReducer from './slices/adsSlice';
import privateReducer from './slices/privateSlice';

// Import API services
import { insightApi } from './api/insightApi';
import { kolApi } from './api/kolApi';
import { testingApi } from './api/testingApi';
import { adsApi } from './api/adsApi';
import { privateApi } from './api/privateApi';

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'ui'], // Only persist auth and ui state
};

// Root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  insight: insightReducer,
  kol: kolReducer,
  ui: uiReducer,
  testing: testingReducer,
  ads: adsReducer,
  private: privateReducer,
  // API reducers
  [insightApi.reducerPath]: insightApi.reducer,
  [kolApi.reducerPath]: kolApi.reducer,
  [testingApi.reducerPath]: testingApi.reducer,
  [adsApi.reducerPath]: adsApi.reducer,
  [privateApi.reducerPath]: privateApi.reducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    })
      .concat(insightApi.middleware)
      .concat(kolApi.middleware)
      .concat(testingApi.middleware)
      .concat(adsApi.middleware)
      .concat(privateApi.middleware),
});

export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;