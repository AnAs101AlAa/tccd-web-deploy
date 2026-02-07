import type { UserQueryParams } from "@/shared/queries/admin/users/userTypes";
import { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import { WithLayout } from "@/shared/components/hoc";
import UsersList from "../components/users/UsersList";
import { Pagination } from "@/shared/components/pagination";
import { ErrorScreen } from "tccd-ui";
import UsersFilter from "../components/users/UsersFilter";

export function UsersAdminPage() {
  const [queryParams, setQueryParams] = useState<UserQueryParams>({
    page: 1,
    count: 20,
  });
  const {
    studentUsers,
    volunteeringMemberUsers,
    isLoadingStudent,
    isLoadingVolunteeringMember,
    studentError,
    volunteeringMemberError,
    refetchStudent,
    refetchVolunteeringMember
  } = useUsers(queryParams);

  if (volunteeringMemberError && studentError) {
    return (
      <WithLayout>
        <ErrorScreen
          title="Failed to load Users"
          message={volunteeringMemberError?.message || studentError?.message}
        />
      </WithLayout>
    );
  }

  return (
    <WithLayout>
      <div className="w-full mx-auto space-y-4 md:space-y-6">
        <div className="bg-white rounded-2xl md:rounded-4xl shadow-lg md:shadow-xl p-4 sm:p-5 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 md:mb-5">
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary">
              User Management
            </h1>
          </div>
          <div className="mb-3">
            <UsersFilter
              searchParams={queryParams}
              onSearch={(params) => setQueryParams(params)}
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-secondary">
            Student Users
          </h2>
          {isLoadingStudent && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-contrast mx-auto mb-4"></div>
                <p className="text-lg text-secondary font-medium">
                  Loading students...
                </p>
              </div>
            </div>
          )}
          {studentError && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
              <div className="text-center">
                <p className="text-lg text-red-600 mb-4">
                  Failed to load students
                </p>
                <button
                  onClick={() => refetchStudent()}
                  className="px-4 py-2 bg-contrast text-white rounded-lg hover:bg-contrast/90"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
          {studentUsers && (
            <>
              <UsersList users={studentUsers.items} />
              <div className="mt-4 md:mt-6">
                <Pagination
                  currentPage={queryParams.page}
                  totalPages={Math.ceil(
                    studentUsers.totalCount / queryParams.count,
                  )}
                  onPageChange={(page) => {
                    setQueryParams((prev) => ({ ...prev, page }));
                  }}
                />
              </div>
            </>
          )}
          <h2 className="text-2xl sm:text-3xl font-bold text-secondary">
            Volunteering Members
          </h2>
          {isLoadingVolunteeringMember && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-contrast mx-auto mb-4"></div>
                <p className="text-lg text-secondary font-medium">
                  Loading volunteering members...
                </p>
              </div>
            </div>
          )}
          {volunteeringMemberError && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
              <div className="text-center">
                <p className="text-lg text-red-600 mb-4">
                  Failed to load volunteering members
                </p>
                <button
                  onClick={() => refetchVolunteeringMember()}
                  className="px-4 py-2 bg-contrast text-white rounded-lg hover:bg-contrast/90"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
          {volunteeringMemberUsers && (
            <>
              <UsersList users={volunteeringMemberUsers.items} />
              <div className="mt-4 md:mt-6">
                <Pagination
                  currentPage={queryParams.page}
                  totalPages={Math.ceil(
                    volunteeringMemberUsers.totalCount / queryParams.count,
                  )}
                  onPageChange={(page) => {
                    setQueryParams((prev) => ({ ...prev, page }));
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </WithLayout>
  );
}
