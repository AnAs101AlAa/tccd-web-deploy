import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import {
  setUser,
  updateUser,
  clearUser,
  setLoading,
  setError,
  clearError,
} from '@/shared/store/slices';
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectUserRole,
  selectUserLoading,
  selectUserError,
  selectIsStudent,
  selectIsBusinessRep,
  selectIsAdmin,
  selectIsTA,
  selectIsDR,
} from '@/shared/store/selectors';
import type { AnyUser } from '@/shared/types/users';

/**
 * Custom Redux Hooks for User Domain
 * 
 * These hooks provide convenient access to user state and actions
 * without needing to use useAppSelector and useAppDispatch directly.
 * 
 * BENEFITS:
 * - Cleaner component code
 * - Consistent API across components
 * - Easy to test and mock
 * - Encapsulates Redux implementation details
 * 
 * USAGE:
 * Instead of:
 *   const dispatch = useAppDispatch();
 *   const user = useAppSelector(selectCurrentUser);
 *   dispatch(setUser(userData));
 * 
 * Use:
 *   const user = useCurrentUser();
 *   const { login } = useUserActions();
 *   login(userData);
 */

/**
 * Hook to get the current user
 * @returns Current user or null if not authenticated
 */
export const useCurrentUser = () => {
  return useAppSelector(selectCurrentUser);
};

/**
 * Hook to check if user is authenticated
 * @returns true if user is logged in
 */
export const useIsAuthenticated = () => {
  return useAppSelector(selectIsAuthenticated);
};

/**
 * Hook to get the current user's role
 * @returns User role or undefined
 */
export const useUserRole = () => {
  return useAppSelector(selectUserRole);
};

/**
 * Hook to get user loading state
 * @returns true if user operation is in progress
 */
export const useUserLoading = () => {
  return useAppSelector(selectUserLoading);
};

/**
 * Hook to get user error
 * @returns Error message or null
 */
export const useUserError = () => {
  return useAppSelector(selectUserError);
};

/**
 * Hook to check if current user is a student
 * @returns true if user is a student
 */
export const useIsStudent = () => {
  return useAppSelector(selectIsStudent);
};

/**
 * Hook to check if current user is a business rep
 * @returns true if user is a business rep
 */
export const useIsBusinessRep = () => {
  return useAppSelector(selectIsBusinessRep);
};

/**
 * Hook to check if current user is an admin
 * @returns true if user is an admin
 */
export const useIsAdmin = () => {
  return useAppSelector(selectIsAdmin);
};

/**
 * Hook to check if current user is a TA
 * @returns true if user is a TA
 */
export const useIsTA = () => {
  return useAppSelector(selectIsTA);
};

/**
 * Hook to check if current user is a DR
 * @returns true if user is a DR
 */
export const useIsDR = () => {
  return useAppSelector(selectIsDR);
};

/**
 * Hook to get user-related actions
 * 
 * Returns an object with functions to manipulate user state.
 * This encapsulates the dispatch calls and provides a clean API.
 * 
 * @returns Object with user action functions
 * 
 * @example
 * const { login, logout, update } = useUserActions();
 * 
 * // Login
 * login(userData);
 * 
 * // Logout
 * logout();
 * 
 * // Update profile
 * update({ phoneNumber: '+201234567890' });
 */
export const useUserActions = () => {
  const dispatch = useAppDispatch();

  return {
    /**
     * Login user (set user data and mark as authenticated)
     * @param user - User data to set
     */
    login: (user: AnyUser) => {
      dispatch(setUser(user));
    },

    /**
     * Logout user (clear user data and authentication)
     */
    logout: () => {
      dispatch(clearUser());
    },

    /**
     * Update user profile (partial update)
     * @param updates - Partial user data to update
     */
    update: (updates: Partial<AnyUser>) => {
      dispatch(updateUser(updates));
    },

    /**
     * Set loading state
     * @param loading - Loading state
     */
    setLoading: (loading: boolean) => {
      dispatch(setLoading(loading));
    },

    /**
     * Set error message
     * @param error - Error message
     */
    setError: (error: string) => {
      dispatch(setError(error));
    },

    /**
     * Clear error message
     */
    clearError: () => {
      dispatch(clearError());
    },
  };
};

/**
 * Hook for complete user state
 * 
 * Returns an object with all user state and actions.
 * Useful when you need everything in one place.
 * 
 * @returns Object with user state and actions
 * 
 * @example
 * const {
 *   user,
 *   isAuthenticated,
 *   isLoading,
 *   error,
 *   role,
 *   isStudent,
 *   actions
 * } = useUser();
 * 
 * if (isLoading) return <Spinner />;
 * if (error) return <Error message={error} />;
 * if (!isAuthenticated) return <Login onLogin={actions.login} />;
 * 
 * return <Profile user={user} onUpdate={actions.update} />;
 */
export const useUser = () => {
  const user = useCurrentUser();
  const isAuthenticated = useIsAuthenticated();
  const role = useUserRole();
  const isLoading = useUserLoading();
  const error = useUserError();
  const isStudent = useIsStudent();
  const isBusinessRep = useIsBusinessRep();
  const isAdmin = useIsAdmin();
  const isTA = useIsTA();
  const isDR = useIsDR();
  const actions = useUserActions();

  return {
    user,
    isAuthenticated,
    role,
    isLoading,
    error,
    isStudent,
    isBusinessRep,
    isAdmin,
    isTA,
    isDR,
    actions,
  };
};

/**
 * USAGE EXAMPLES:
 * 
 * 1. Simple component needing just user data:
 * 
 * function UserGreeting() {
 *   const user = useCurrentUser();
 *   if (!user) return null;
 *   return <h1>Welcome, {user.englishFullName}!</h1>;
 * }
 * 
 * 2. Component needing authentication check:
 * 
 * function ProtectedContent() {
 *   const isAuthenticated = useIsAuthenticated();
 *   if (!isAuthenticated) {
 *     return <Navigate to="/login" />;
 *   }
 *   return <SensitiveData />;
 * }
 * 
 * 3. Component needing user actions:
 * 
 * function LoginForm() {
 *   const { login, setLoading, setError } = useUserActions();
 *   
 *   const handleSubmit = async (credentials) => {
 *     try {
 *       setLoading(true);
 *       const user = await loginApi(credentials);
 *       login(user);
 *     } catch (error) {
 *       setError(error.message);
 *     } finally {
 *       setLoading(false);
 *     }
 *   };
 *   
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 * 
 * 4. Component needing everything:
 * 
 * function Dashboard() {
 *   const {
 *     user,
 *     isAuthenticated,
 *     isLoading,
 *     error,
 *     isStudent,
 *     actions
 *   } = useUser();
 *   
 *   if (isLoading) return <Spinner />;
 *   if (error) return <ErrorMessage message={error} onDismiss={actions.clearError} />;
 *   if (!isAuthenticated) return <Navigate to="/login" />;
 *   
 *   return (
 *     <div>
 *       <UserProfile user={user!} onUpdate={actions.update} />
 *       {isStudent && <StudentDashboard user={user!} />}
 *       <button onClick={actions.logout}>Logout</button>
 *     </div>
 *   );
 * }
 * 
 * 5. Role-based rendering:
 * 
 * function FeatureAccess() {
 *   const isAdmin = useIsAdmin();
 *   const isStudent = useIsStudent();
 *   
 *   return (
 *     <div>
 *       {isAdmin && <AdminPanel />}
 *       {isStudent && <StudentResources />}
 *     </div>
 *   );
 * }
 */

/**
 * TESTING NOTES:
 * 
 * These hooks are easy to test with custom providers:
 * 
 * import { renderHook } from '@testing-library/react';
 * import { Provider } from 'react-redux';
 * import { store } from '@/shared/store';
 * 
 * test('useCurrentUser returns user data', () => {
 *   const wrapper = ({ children }) => (
 *     <Provider store={store}>{children}</Provider>
 *   );
 *   
 *   const { result } = renderHook(() => useCurrentUser(), { wrapper });
 *   expect(result.current).toBeDefined();
 * });
 */
