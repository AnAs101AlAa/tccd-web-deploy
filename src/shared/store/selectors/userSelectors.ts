import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import {
  isStudent,
  isBusinessRep,
  isTA,
  isDR,
  isAdmin,
} from "@/shared/types/users";

export const selectUserState = (state: RootState) => state.user;
export const selectCurrentUser = (state: RootState) => state.user.currentUser;
export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;
export const selectUserLoading = (state: RootState) => state.user.isLoading;
export const selectUserError = (state: RootState) => state.user.error;

/**
 * Select user's role
 * Returns undefined if no user is logged in
 */
export const selectUserRole = createSelector(
  [selectCurrentUser],
  (user) => user?.role
);

/**
 * Select user's full name (English)
 * Returns empty string if no user
 */
export const selectUserFullName = createSelector(
  [selectCurrentUser],
  (user) => user?.englishFullName || ""
);

/**
 * Select user's email
 */
export const selectUserEmail = createSelector(
  [selectCurrentUser],
  (user) => user?.email
);

/**
 * Select user's profile image URL
 */
export const selectUserProfileImage = createSelector(
  [selectCurrentUser],
  (user) => user?.profileImage
);

/**
 * Check if user has a specific role
 * Returns false if no user or role doesn't match
 */
export const selectIsUserRole = (role: string) =>
  createSelector([selectCurrentUser], (user) => user?.role === role);

/**
 * Type-safe role selectors
 * These return true/false and narrow the type when used with type guards
 */
export const selectIsStudent = createSelector(
  [selectCurrentUser],
  (user) => user !== null && isStudent(user)
);

export const selectIsBusinessRep = createSelector(
  [selectCurrentUser],
  (user) => user !== null && isBusinessRep(user)
);

export const selectIsTA = createSelector(
  [selectCurrentUser],
  (user) => user !== null && isTA(user)
);

export const selectIsDR = createSelector(
  [selectCurrentUser],
  (user) => user !== null && isDR(user)
);

export const selectIsAdmin = createSelector(
  [selectCurrentUser],
  (user) => user !== null && isAdmin(user)
);

/**
 * Select student-specific data
 * Returns undefined if user is not a student
 */
export const selectStudentData = createSelector([selectCurrentUser], (user) => {
  if (user && isStudent(user)) {
    return {
      gpa: user.gpa,
      graduationYear: user.graduationYear,
      department: user.department,
      faculty: user.faculty,
      university: user.university,
      committeeAffiliation: user.committeeAffiliation,
      position: user.position,
    };
  }
  return undefined;
});

/**
 * Select business rep-specific data
 * Returns undefined if user is not a business rep
 */
export const selectBusinessRepData = createSelector(
  [selectCurrentUser],
  (user) => {
    if (user && isBusinessRep(user)) {
      return {
        companyId: user.companyId,
        position: user.position,
        company: user.company,
      };
    }
    return undefined;
  }
);

/**
 * Select if user has committee affiliation
 * Useful for conditional UI rendering
 */
export const selectHasCommitteeAffiliation = createSelector(
  [selectCurrentUser],
  (user) => {
    if (user && isStudent(user)) {
      return user.committeeAffiliation !== undefined;
    }
    if (user && isAdmin(user)) {
      return user.volunteering?.committeeAffiliation !== undefined;
    }
    return false;
  }
);

/**
 * Select user's status
 */
export const selectUserStatus = createSelector(
  [selectCurrentUser],
  (user) => user?.status
);

/**
 * Check if user is approved
 */
export const selectIsUserApproved = createSelector(
  [selectUserStatus],
  (status) => status === "Approved"
);

/**
 * Check if user is pending
 */
export const selectIsUserPending = createSelector(
  [selectUserStatus],
  (status) => status === "Pending"
);

/**
 * Select user's last active timestamp
 */
export const selectUserLastActive = createSelector(
  [selectCurrentUser],
  (user) => user?.lastActive
);

/**
 * Select if state has error
 */
export const selectHasError = createSelector(
  [selectUserError],
  (error) => error !== null
);
