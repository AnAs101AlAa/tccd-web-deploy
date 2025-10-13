import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/shared/store';

/**
 * Redux Provider Props
 */
interface ReduxProviderProps {
  /**
   * Child components to render within the provider
   */
  children: ReactNode;
  
  /**
   * Optional loading component to show during rehydration
   * If not provided, children will be rendered immediately after rehydration
   */
  loading?: ReactNode;
}

/**
 * Redux Provider Component
 * 
 * This component wraps your app with Redux Provider and PersistGate.
 * It handles:
 * - Redux store access for all child components
 * - State rehydration from localStorage on app load
 * - Optional loading state during rehydration
 * 
 * ARCHITECTURE NOTES:
 * - Integrates with React 19 (fully compatible)
 * - Uses redux-persist for automatic state persistence
 * - PersistGate delays rendering until persisted state is restored
 * - Prevents flash of unauthenticated state on reload
 * 
 * PERFORMANCE:
 * - Rehydration is fast (typically <100ms)
 * - loading prop allows for smooth UX during rehydration
 * - No unnecessary re-renders after initial mount
 * 
 * @example
 * // Basic usage
 * <ReduxProvider>
 *   <App />
 * </ReduxProvider>
 * 
 * @example
 * // With custom loading state
 * <ReduxProvider loading={<Spinner />}>
 *   <App />
 * </ReduxProvider>
 */
export function ReduxProvider({ children, loading = null }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={loading} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}

/**
 * INTEGRATION GUIDE:
 * 
 * Add this provider at the root of your application, typically in main.tsx:
 * 
 * import { ReduxProvider } from '@/shared/providers/ReduxProvider';
 * 
 * createRoot(document.getElementById('root')!).render(
 *   <StrictMode>
 *     <ReduxProvider>
 *       <App />
 *     </ReduxProvider>
 *   </StrictMode>
 * );
 * 
 * PROVIDER HIERARCHY:
 * When you have multiple providers, order matters. Recommended order:
 * 
 * <ReduxProvider>           // Redux state (highest level)
 *   <QueryClientProvider>   // React Query (if used)
 *     <BrowserRouter>       // Routing
 *       <ThemeProvider>     // Theme/UI
 *         <App />
 *       </ThemeProvider>
 *     </BrowserRouter>
 *   </QueryClientProvider>
 * </ReduxProvider>
 * 
 * TROUBLESHOOTING:
 * 
 * 1. If rehydration takes too long:
 *    - Check what you're persisting (reduce persisted state size)
 *    - Consider selective persistence in persistConfig.ts
 * 
 * 2. If you see a flash of default state:
 *    - Ensure loading prop is set during rehydration
 *    - Check PersistGate is wrapping your content
 * 
 * 3. If state isn't persisting:
 *    - Check browser localStorage (dev tools > Application)
 *    - Verify slice is whitelisted in persistConfig.ts
 *    - Ensure store actions are being dispatched correctly
 */

/**
 * ADVANCED USAGE:
 * 
 * For more control over the rehydration process, you can use the
 * onBeforeLift callback:
 * 
 * <PersistGate
 *   loading={loading}
 *   persistor={persistor}
 *   onBeforeLift={() => {
 *     // Called before rendering children
 *     // Useful for analytics, logging, or additional setup
 *     console.log('State rehydrated');
 *   }}
 * >
 *   {children}
 * </PersistGate>
 */
