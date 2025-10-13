import storage from "redux-persist/lib/storage";
import type { PersistConfig } from "redux-persist";
import { createMigrate } from "redux-persist";
import type { UserState } from "./slices/userSlice";

/**
 * Redux Persist Configuration
 *
 * This configuration determines how Redux state is persisted to localStorage.
 *
 * PERFORMANCE CONSIDERATIONS:
 * - Only persisting essential data (user info, not loading states or errors)
 * - Using whitelist approach for explicit control over persisted slices
 * - Blacklisting transient state that shouldn't survive page reloads
 *
 * STORAGE STRATEGY:
 * - Using localStorage for web (can be changed to sessionStorage if needed)
 * - State is automatically rehydrated on app startup
 *
 * SECURITY NOTES:
 * - Do NOT persist sensitive data like passwords or raw tokens
 * - If persisting auth tokens, consider encryption or secure storage
 * - Review what you're persisting periodically as requirements change
 */

/**
 * User slice persist config
 * Applied to the user reducer specifically
 * This avoids circular dependencies and provides fine-grained control
 */

/**
 * Migration functions for handling version changes
 * This ensures old stored data is properly transformed to new structure
 */
const migrations = {
  // Migration to version 4 - Reset to use new mock admin user
  4: () => {
    // Return undefined to force using initialState from userSlice
    return undefined;
  },
};

export const persistConfig: PersistConfig<UserState> = {
  key: "user",
  version: 4, // Increment version to force state reset
  storage,
  migrate: createMigrate(migrations, { debug: true }),

  /**
   * Whitelist: Only persist these fields from UserState
   * We exclude transient state (loading, error) that shouldn't survive reloads
   */
  whitelist: ["currentUser", "isAuthenticated", "lastUpdated"],

  /**
   * Throttle: Debounce persist writes (milliseconds)
   * Prevents excessive localStorage writes on rapid state changes
   * Improves performance with frequent updates
   */
  throttle: 1000,

  /**
   * Serialize: Custom serialization check config
   * Redux Toolkit uses serializableCheck middleware
   * We need to ignore redux-persist actions
   */
  // Note: This is handled in store middleware config
};

/**
 * Nested Persist Config (Advanced)
 *
 * For fine-grained control over specific slice persistence,
 * you can create nested persist configs:
 *
 * Example - Persist only specific fields from user slice:
 *
 * export const userPersistConfig: PersistConfig<UserState> = {
 *   key: 'user',
 *   storage,
 *   whitelist: ['currentUser', 'isAuthenticated'], // Don't persist loading/error
 * };
 *
 * Then in store.ts, use persistReducer on individual slices:
 * user: persistReducer(userPersistConfig, userReducer),
 */

/**
 * Migration Configuration (for version updates)
 *
 * When you change your state shape, use migrations to handle old stored data:
 *
 * export const migrations = {
 *   // Migrate from version 0 to 1
 *   1: (state: any) => {
 *     return {
 *       ...state,
 *       user: {
 *         ...state.user,
 *         newField: 'defaultValue', // Add new field with default
 *       },
 *     };
 *   },
 *   // Add more migrations as your state evolves
 * };
 *
 * Then in persistConfig:
 * migrate: createMigrate(migrations, { debug: false }),
 */

/**
 * TROUBLESHOOTING:
 *
 * If you encounter persistence issues:
 * 1. Clear localStorage: localStorage.removeItem('persist:root')
 * 2. Increment version number in persistConfig
 * 3. Add debug: true to persistConfig during development
 * 4. Check browser dev tools > Application > Local Storage
 */
