import type { UserQueryParams } from "@/shared/queries/admin/users/userTypes";
import { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import { WithLayout } from "@/shared/components/hoc";
import UsersList from "../components/users/UsersList";
import { Pagination } from "@/shared/components/pagination";
import { ErrorScreen } from "tccd-ui";
import UsersFilter from "../components/users/UsersFilter";

export default function UsersAdminPage() {
  const [userQueryParams, setUserQueryParams] = useState<UserQueryParams>({
    page: 1,
    count: 20,
  });
  const [volunteerQueryParams, setVolunteerQueryParams] = useState<UserQueryParams>({
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
  } = useUsers({ userQueryParams, volunteerQueryParams });

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
      <div className="py-4 md:py-8 px-4 md:px-8">
        <div className="mb-4">
          <h1 className="text-[28px] md:text-[32px] lg:text-[34px] font-bold text-contrast">
            Users
          </h1>
          <p className="text-inactive-tab-text text-[15px] md:text-[16px] lg:text-[18px]">
            Manage all registered users, including students and volunteering members, manage account access and view user details and member profiles.
          </p>
        </div>

        <section
          id="all-users-section"
          className="rounded-xl mb-4 md:mb-6 border border-contrast/10 bg-background/60 p-4 sm:p-5 lg:p-6 shadow-sm"
        >
          <div className="flex flex-col gap-3">
            <div>
              <h2 className="text-[22px] md:text-[23px] lg:text-[24px] font-bold text-secondary">
                General Users
              </h2>
              <p className="text-[14px] md:text-[15px] lg:text-[16px] text-inactive-tab-text">
                View and manage all registered users.
              </p>
            </div>
            <UsersFilter
              searchParams={userQueryParams}
              onSearch={(params) => setUserQueryParams(params)}
            />
            <hr className="border-t border-gray-400/60 -mt-2 mb-3 shadow-lg" />
          </div>
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
                  currentPage={userQueryParams.page}
                  totalPages={Math.ceil(
                    studentUsers.totalCount / userQueryParams.count,
                  )}
                  onPageChange={(page) => {
                    setUserQueryParams((prev) => ({ ...prev, page }));
                  }}
                />
              </div>
            </>
          )}
        </section>
        
        <section
          id="volunteering-section"
          className="rounded-xl mb-4 md:mb-6 border border-contrast/10 bg-background/60 p-4 sm:p-5 lg:p-6 shadow-sm"
        >
          <div className="flex flex-col gap-3">
            <div>
              <h2 className="text-[22px] md:text-[23px] lg:text-[24px] font-bold text-secondary">
                Volunteering Members
              </h2>
              <p className="text-[14px] md:text-[15px] lg:text-[16px] text-inactive-tab-text">
                View and manage all volunteering members.
              </p>
            </div>
            <UsersFilter
              searchParams={volunteerQueryParams}
              onSearch={(params) => setVolunteerQueryParams(params)}
            />
            <hr className="border-t border-gray-400/60 -mt-2 mb-3 shadow-lg" />
          </div>
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
                  currentPage={volunteerQueryParams.page}
                  totalPages={Math.ceil(
                    volunteeringMemberUsers.totalCount / volunteerQueryParams.count,
                  )}
                  onPageChange={(page) => {
                    setVolunteerQueryParams((prev) => ({ ...prev, page }));
                  }}
                />
              </div>
            </>
          )}
        </section>
      </div>
    </WithLayout>
  );
}
