import Table from "@/shared/components/adminTables/Table";

interface RegistrationsListProps {
  registrations: {
    id: string;
    user?: { englishFullName?: string; email?: string; phoneNumber?: string };
    englishFullName?: string;
    email?: string;
    phoneNumber?: string;
    eventSlot?: { startTime: string; endTime: string };
    status: string;
    createdAt: string;
  }[];
}

export default function RegistrationsList({
  registrations,
}: RegistrationsListProps) {
  const columns = [
    {
      label: "Student Name",
      key: "studentName" as const,
      formatter: (_value: string, item: any) => {
        return item.user?.englishFullName || item.englishFullName || "N/A";
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
      label: "Time Slot",
      key: "timeSlot" as const,
      formatter: (_value: string, item: any) => {
        if (item.eventSlot?.startTime && item.eventSlot?.endTime) {
          return `${item.eventSlot.startTime} - ${item.eventSlot.endTime}`;
        }
        return "N/A";
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
            className={`px-2 py-1 rounded text-sm font-medium ${
              statusColors[value] || "bg-gray-100 text-gray-800"
            }`}
          >
            {value}
          </span>
        );
      },
    }
  ];

  const formattedData = registrations.map((reg) => ({
    studentName: reg.user?.englishFullName || "N/A",
    email: reg.user?.email || "N/A",
    phone: reg.user?.phoneNumber || "N/A",
    timeSlot: reg.eventSlot
      ? `${reg.eventSlot.startTime} - ${reg.eventSlot.endTime}`
      : "N/A",
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
