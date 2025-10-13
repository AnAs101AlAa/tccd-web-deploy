/**
 * Store Index
 * 
 * Central export point for all Redux store-related functionality.
 * This barrel file simplifies imports throughout the application.
 * 
 * USAGE:
 * import { store, persistor } from '@/shared/store';
 * import { useAppDispatch, useAppSelector } from '@/shared/store';
 * import { setUser, clearUser } from '@/shared/store';
 * import { selectCurrentUser } from '@/shared/store';
 * import { useCurrentUser, useUserActions } from '@/shared/store';
 * 
 * This provides a clean, organized import structure that scales well.
 */

// Core store exports
export { store, persistor } from './store';
export type { RootState, AppDispatch } from './store';

// Typed hooks
export { useAppDispatch, useAppSelector } from './hooks';

// All slice actions and reducers
export * from './slices';

// All selectors
export * from './selectors';

// Custom user hooks (convenience)
export * from '../queries/user/userHooks';

// Persist config (if needed for advanced usage)
export { persistConfig } from './persistConfig';
