import { configureStore, type UnknownAction } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { persistConfig } from "./persistConfig";
import { userReducer } from "./slices";
import type { UserState } from "./slices/userSlice";

/**
 * Redux Store Configuration
 *
 * Configures the Redux store with:
 * - Persisted reducer for state rehydration
 * - Redux DevTools integration (automatically in development)
 * - Customized middleware for redux-persist compatibility
 *
 * MIDDLEWARE CONFIGURATION:
 * - Ignoring redux-persist actions from serializableCheck
 * - This prevents warnings about non-serializable values in persist actions
 * - All other Redux Toolkit middleware remains active (thunk, immutability check, etc.)
 */
export const store = configureStore({
  reducer: {
    user: persistReducer<UserState, UnknownAction>(persistConfig, userReducer),
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      /**
       * Serializable Check Configuration
       *
       * Redux Toolkit checks for non-serializable values by default.
       * Redux-persist actions contain non-serializable values (functions),
       * so we need to ignore them to prevent console warnings.
       *
       * IMPORTANT: This doesn't disable serialization checks for YOUR actions,
       * only for redux-persist's internal actions.
       */
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        /**
         * Optional: Ignore specific paths in state/actions
         * Uncomment if you need to store non-serializable values
         * (e.g., Date objects, functions, etc.)
         *
         * CAUTION: Use sparingly as it can make time-travel debugging harder
         */
        // ignoredPaths: ['user.lastUpdated'], // Example: ignore Date objects
      },

      /**
       * Immutability Check Configuration
       *
       * In production, you might want to disable this for performance:
       * immutableCheck: process.env.NODE_ENV === 'development',
       */
    }),

  /**
   * DevTools Configuration
   *
   * Redux DevTools are automatically enabled in development.
   * Customize behavior here if needed:
   */
  devTools: process.env.NODE_ENV !== "production",
});

/**
 * Persistor
 *
 * The persistor object manages persistence actions (rehydrate, flush, etc.).
 * Pass this to PersistGate in your app's root component.
 */
export const persistor = persistStore(store);

/**
 * TypeScript Types
 *
 * These types are used throughout the app for type-safe Redux usage.
 * Import them in your components and hooks.
 */

// Root state type - inferred from the store
export type RootState = ReturnType<typeof store.getState>;

// Dispatch type - includes thunk types if you use async actions
export type AppDispatch = typeof store.dispatch;

/**
 * USAGE IN COMPONENTS:
 *
 * import { useSelector, useDispatch } from 'react-redux';
 * import type { RootState, AppDispatch } from '@/shared/store/store';
 *
 * const dispatch = useDispatch<AppDispatch>();
 * const user = useSelector((state: RootState) => state.user.currentUser);
 *
 * OR use typed hooks (see hooks.ts):
 * import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
 */

/**
 * DEVELOPMENT HELPERS:
 *
 * Access store in browser console (for debugging):
 * - Add to window object in development mode only
 * - Useful for inspecting state without DevTools
 */
if (process.env.NODE_ENV === "development") {
  (
    window as { __store__?: typeof store; __persistor__?: typeof persistor }
  ).__store__ = store;
  (
    window as { __store__?: typeof store; __persistor__?: typeof persistor }
  ).__persistor__ = persistor;
}

/**
 * FUTURE ENHANCEMENTS:
 *
 * 1. Listener Middleware:
 *    - Add createListenerMiddleware for side effects
 *    - Better than redux-saga/redux-observable for most use cases
 *
 * 2. RTK Query:
 *    - If using RTK Query for API calls, add the API middleware here
 *    - Example: middleware: (gdm) => gdm().concat(apiSlice.middleware)
 *
 * 3. State Persistence Strategies:
 *    - Selective persistence per slice (see persistConfig.ts)
 *    - Encryption for sensitive data
 *    - Session storage vs local storage based on requirements
 *
 * 4. Performance Monitoring:
 *    - Add middleware to track action performance
 *    - Monitor store size and optimize as needed
 */
