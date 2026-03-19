import Table from "@/shared/components/adminTables/Table";
import format from "@/shared/utils/dateFormater";
import type { User } from "@/shared/queries/admin/users/userTypes";

interface RegistrationsListProps {
  registrations: {
    status: string;
    registeredAt: string;
    user: User;
  }[];
}

export default function RegistrationsList({
  registrations,
}: RegistrationsListProps) {
  console.log("RegistrationsList rendered with registrations:", registrations);
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
          Cancelled: "bg-gray-100 text-gray-800",
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
    phone: reg.user?.phoneNumber || "N/A",
    ...reg,
  }));

  return (
    <Table
      items={formattedData}
      columns={columns}
      emptyMessage="No registrations found"
    />
  );
}
