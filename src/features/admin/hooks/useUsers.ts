import { useGetUsers } from "@/shared/queries/admin/users/userQueries";
import type { UserQueryParams } from "@/shared/queries/admin/users/userTypes";

type UseUsersParams = {
  userQueryParams: UserQueryParams;
  volunteerQueryParams: UserQueryParams;
};

/**
 * Custom hook to fetch student and volunteering member users
 * Returns loading states, error states, and user data
 */
export const useUsers = (params?: UserQueryParams | UseUsersParams) => {
  // Support separate params for users and volunteers
  let userParams: UserQueryParams;
  let volunteerParams: UserQueryParams;
  if (params && 'userQueryParams' in params && 'volunteerQueryParams' in params) {
    userParams = params.userQueryParams;
    volunteerParams = params.volunteerQueryParams;
  } else {
    userParams = params as UserQueryParams;
    volunteerParams = params as UserQueryParams;
  }

  // Fetch student users
  const {
    data: studentUsers,
    isLoading: isLoadingStudent,
    error: studentError,
    refetch: refetchStudent,
  } = useGetUsers({
    ...userParams,
    Role: "Student",
  });

  // Fetch volunteering member users
  const {
    data: volunteeringMemberUsers,
    isLoading: isLoadingVolunteeringMember,
    error: volunteeringMemberError,
    refetch: refetchVolunteeringMember,
  } = useGetUsers({
    ...volunteerParams,
    Role: "VolunteeringMember",
  });

  // Combined loading state
  const isLoading = isLoadingStudent || isLoadingVolunteeringMember;

  // Combined error state
  const error = studentError || volunteeringMemberError;

  // Refetch both
  const refetchAll = () => {
    refetchStudent();
    refetchVolunteeringMember();
  };

  return {
    // Data
    studentUsers: studentUsers,
    volunteeringMemberUsers: volunteeringMemberUsers,

    // Loading states
    isLoading,
    isLoadingStudent,
    isLoadingVolunteeringMember,

    // Error states
    error,
    studentError,
    volunteeringMemberError,

    // Actions
    refetchAll,
    refetchStudent,
    refetchVolunteeringMember,
  };
};
