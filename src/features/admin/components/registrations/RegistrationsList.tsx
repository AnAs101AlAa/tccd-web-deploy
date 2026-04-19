import Table from "@/shared/components/adminTables/Table";
import format from "@/shared/utils/dateFormater";
import type { User } from "@/shared/queries/admin/users/userTypes";
import { useChangeRegistrationStatus } from "@/shared/queries/admin/events/eventsQueries";
import toast from "react-hot-toast";
import { Button } from "tccd-ui";
import { FaCheck } from "react-icons/fa";
import { FaX } from "react-icons/fa6";

interface RegistrationsListProps {
  registrations: {
    status: string;
    registeredAt: string;
    user: User;
  }[];
  slotId?: string;
  eventId: string;
}

export default function RegistrationsList({
  registrations,
  eventId,
  slotId,
}: RegistrationsListProps) {
  const changeStatusMutation = useChangeRegistrationStatus();

  const hasPending = registrations.some((reg) => reg.status === "Pending");
  const showActions = !!slotId && hasPending;

  const handleChangeStatus = async (userId: string, newStatus: string) => {
    try {
      await changeStatusMutation.mutateAsync({ eventId, slotId: slotId || "", userId, newStatus });
      toast.success("Registration status updated successfully");
    } catch {
      toast.error("Failed to update registration status");
    }
  };

  const columns = [
    {
      label: "Student Name",
      key: "studentName" as const,
      formatter: (_value: string, item: any) => {
        return item.user?.englishName || "N/A";
      },
    },
    {
      label: "Email",
      key: "email" as const,
      formatter: (_value: string, item: any) => {
        return item.user?.email || item.email || "N/A";
      },
    },
    {
      label: "University",
      key: "university" as const,
      formatter: (_value: string, item: any) => {
        return item.user?.studentProfile?.university || "N/A";
      },
    },
    {
      label: "Department",
      key: "department" as const,
      formatter: (_value: string, item: any) => {
        return item.user?.studentProfile?.department || "N/A";
      },
    },
    {
      label: "GraduationYear",
      key: "graduationYear" as const,
      formatter: (_value: string, item: any) => {
        return item.user?.studentProfile?.graduationYear || "N/A";
      },
    },
    {
      label: "Phone",
      key: "phone" as const,
      formatter: (_value: string, item: any) => {
        return item.user?.phoneNumber || item.phoneNumber || "N/A";
      },
    },
    {
      label: "Status",
      key: "status" as const,
      formatter: (value: string) => {
        const statusColors: Record<string, string> = {
          Pending: "bg-yellow-100 text-yellow-800",
          Approved: "bg-green-100 text-green-800",
          Rejected: "bg-red-100 text-red-800",
          Scanned: "bg-blue-100 text-blue-800",
          Cancelled: "bg-gray-10q0 text-gray-800",
        };
        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 shadow-sm border rounded-full text-xs font-medium ${
              statusColors[value] || "bg-gray-100 text-gray-800"
            }`}
          >
            {value}
          </span>
        );
      },
    },
    {
      label: "Registered At",
      key: "registeredAt" as const,
      formatter: (value: string) => {
        return format(value, "stringed");
      },
    },
  ];

  const formattedData = registrations.map((reg) => ({
    studentName: reg.user?.englishName || "N/A",
    email: reg.user?.email || "N/A",
    university: reg.user?.studentProfile?.university || "N/A",
    department: reg.user?.studentProfile?.department || "N/A",
    graduationYear: reg.user?.studentProfile?.graduationYear || "N/A",
    phone: reg.user?.phoneNumber || "N/A",
    ...reg,
  }));

  return (
    <>
      {/* Desktop View - Using Table Component */}
      <Table
        items={formattedData}
        columns={columns}
        renderActions={!showActions ? undefined : (item) => {
          if (item.status !== "Pending") return null;
          return (
            <>
              <Button
                type="primary"
                buttonIcon={<FaCheck className="size-3" />}
                buttonText="Approve"
                onClick={() => handleChangeStatus(item.user.id, "Approved")}
              />
              <Button
                type="danger"
                buttonIcon={<FaX className="size-3" />}
                buttonText="Reject"
                onClick={() => handleChangeStatus(item.user.id, "Rejected")}
              />
            </>
          );
        }}
        emptyMessage="No registrations found"
      />

      {/* Mobile View - Compact Table */}
      <div className="lg:hidden overflow-x-auto">
        {registrations && registrations.length > 0 ? (
          <table className="w-full border border-gray-200 text-xs">
            <thead className="bg-contrast/5">
              <tr>
                <th className="whitespace-nowrap px-2 py-2 text-left text-xs font-semibold text-inactive-tab-text">
                  Name
                </th>
                <th className="whitespace-nowrap px-2 py-2 text-left text-xs font-semibold text-inactive-tab-text">
                  Email
                </th>
                <th className="whitespace-nowrap px-2 py-2 text-left text-xs font-semibold text-inactive-tab-text">
                  University
                </th>
                <th className="whitespace-nowrap px-2 py-2 text-left text-xs font-semibold text-inactive-tab-text">
                  Department
                </th>
                <th className="whitespace-nowrap px-2 py-2 text-left text-xs font-semibold text-inactive-tab-text">
                  GraduationYear
                </th>
                <th className="whitespace-nowrap px-2 py-2 text-left text-xs font-semibold text-inactive-tab-text">
                  Status
                </th>
                {showActions && (
                  <th className="whitespace-nowrap px-2 py-2 text-left text-xs font-semibold text-inactive-tab-text">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {formattedData.map((item, index) => {
                const statusColors: Record<string, string> = {
                  Pending: "bg-yellow-100 text-yellow-800",
                  Approved: "bg-green-100 text-green-800",
                  Rejected: "bg-red-100 text-red-800",
                  Cancelled: "bg-gray-100 text-gray-800",
                };
                return (
                  <tr
                    key={`table-row-registration-${item.studentName}-${index}`}
                    className="hover:bg-muted-primary/5 transition-colors"
                  >
                    <td className="px-2 py-2">
                      <div className="text-xs font-medium text-contrast truncate">
                        {item.studentName}
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <div className="text-xs font-medium text-contrast truncate">
                        {item.email}
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <div className="text-xs font-medium text-contrast truncate">
                        {item.university}
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <div className="text-xs font-medium text-contrast truncate">
                        {item.department}
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <div className="text-xs font-medium text-contrast truncate">
                        {item.graduationYear}
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 shadow-sm border rounded-full text-xs font-medium ${
                          statusColors[item.status] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    {showActions && (
                      <td className="px-2 py-2">
                        {item.status === "Pending" && (
                          <div className="flex items-center gap-2">
                            <Button
                              type="primary"
                              buttonIcon={<FaCheck className="size-3" />}
                              buttonText="Approve"
                              onClick={() => handleChangeStatus(item.user.id, "Approved")}
                            />
                            <Button
                              type="danger"
                              buttonIcon={<FaX className="size-3" />}
                              buttonText="Reject"
                              onClick={() => handleChangeStatus(item.user.id, "Rejected")}
                            />
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-4">
            <p className="text-xs font-medium text-dashboard-description">
              No registrations found
            </p>
          </div>
        )}
      </div>
    </>
  );
}
