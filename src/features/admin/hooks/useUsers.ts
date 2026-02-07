import { useGetUsers } from "@/shared/queries/admin/users/userQueries";
import type { UserQueryParams } from "@/shared/queries/admin/users/userTypes";

/**
 * Custom hook to fetch student and volunteering member users
 * Returns loading states, error states, and user data
 */
export const useUsers = (params?: UserQueryParams) => {
  // Fetch student users
  const {
    data: studentUsers,
    isLoading: isLoadingStudent,
    error: studentError,
    refetch: refetchStudent,
  } = useGetUsers({
    ...params,
    Role: "Student",
  } as UserQueryParams);

  // Fetch volunteering member users
  const {
    data: volunteeringMemberUsers,
    isLoading: isLoadingVolunteeringMember,
    error: volunteeringMemberError,
    refetch: refetchVolunteeringMember,
  } = useGetUsers({
    ...params,
    Role: "VolunteeringMember",
  } as UserQueryParams);

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
