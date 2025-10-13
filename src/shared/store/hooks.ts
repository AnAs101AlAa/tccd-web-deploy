import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";

/**
 * Typed Redux Hooks
 *
 * These hooks are pre-typed versions of useDispatch and useSelector.
 * They provide full TypeScript support without needing to manually type them
 * every time you use Redux in your components.
 *
 * BENEFITS:
 * - No need to type RootState/AppDispatch in every component
 * - Better autocomplete and type inference
 * - Centralized typing - update once, apply everywhere
 * - Follows official Redux Toolkit recommendations
 *
 * RECOMMENDED USAGE:
 * Import these hooks instead of the standard react-redux hooks.
 *
 * DON'T:
 * import { useDispatch, useSelector } from 'react-redux';
 * const dispatch = useDispatch<AppDispatch>();
 *
 * DO:
 * import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
 * const dispatch = useAppDispatch();
 */

/**
 * Typed useDispatch Hook
 *
 * Use this hook to dispatch actions with full TypeScript support.
 * It knows about all your actions and async thunks.
 *
 * @example
 * const dispatch = useAppDispatch();
 * dispatch(setUser(userData));
 * dispatch(loginUser({ email, password })); // If you have async thunks
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

/**
 * Typed useSelector Hook
 *
 * Use this hook to select state with full TypeScript support.
 * It knows the complete shape of your Redux state.
 *
 * @example
 * const user = useAppSelector((state) => state.user.currentUser);
 * const isLoading = useAppSelector((state) => state.user.isLoading);
 *
 * With inline selector:
 * const userEmail = useAppSelector((state) => state.user.currentUser?.email);
 */
export const useAppSelector = useSelector.withTypes<RootState>();
