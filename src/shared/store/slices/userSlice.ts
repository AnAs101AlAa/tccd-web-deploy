import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AnyUser } from "@/shared/types/users";

/**
 * User State Interface
 *
 * This interface defines the shape of the user-related state in Redux.
 * It's designed to be scalable and accommodate future additions like:
 * - User preferences
 * - Session data
 */
export interface UserState {
  /**
   * Currently authenticated user data
   * null indicates no user is logged in
   */
  currentUser: AnyUser | null;

  /**
   * Loading state for user-related operations
   * Useful for showing spinners during login/logout/profile updates
   */
  isLoading: boolean;

  /**
   * Error message from user operations
   * null when no error exists
   */
  error: string | null;

  /**
   * Flag indicating if the user is authenticated
   * Separated from currentUser for explicit auth checks
   */
  isAuthenticated: boolean;

  /**
   * Timestamp of last user data update
   * Useful for cache invalidation and sync logic
   */
  lastUpdated: number | null;
}

/**
 * Initial state for the user slice
 * All values start in a "clean slate" configuration
 */
const initialState: UserState = {
  currentUser: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  lastUpdated: Date.now(),
};

/**
 * User Slice
 */
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    /**
     * Set the current user after login
     */
    setUser: (
      state,
      action: PayloadAction<AnyUser>,
    ) => {
      console.log("Setting user in store:", action.payload);
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      state.lastUpdated = Date.now();
    },

    /**
     * Update specific fields of the current user
     * Useful for profile updates without replacing entire user object
     * Uses Partial<AnyUser> to allow updating any subset of fields
     */
    updateUser: (state, action: PayloadAction<Partial<AnyUser>>) => {
      if (state.currentUser) {
        // Use Object.assign to properly merge updates while maintaining type safety
        Object.assign(state.currentUser, action.payload);
        state.lastUpdated = Date.now();
      }
    },

    /**
     * Clear user data (typically on logout)
     * Resets to initial state while preserving loading flag
     */
    clearUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = null;
      state.lastUpdated = null;
    },

    /**
     * Set loading state for async operations
     * Clears any existing errors when loading starts
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },

    /**
     * Set error state for user operations
     * Automatically stops loading when error is set
     */
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    /**
     * Clear error state
     * Useful for dismissing error messages in UI
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Reset the entire user state to initial values
     * Use with caution - typically for complete app resets
     */
    resetUserState: () => initialState,
  },
});

// Export actions for use in components and thunks
export const {
  setUser,
  updateUser,
  clearUser,
  setLoading,
  setError,
  clearError,
  resetUserState,
} = userSlice.actions;

// Export reducer to be included in store configuration
export default userSlice.reducer;
