import { useState } from "react";
import CardView from "@/shared/components/adminTables/CardView";
import type {
  User,
  UserStatus,
} from "@/shared/queries/admin/users/userTypes";
import {
  useBanUser,
  useUnbanUser,
} from "@/shared/queries/admin/users/userQueries";
import Table from "@/shared/components/adminTables/Table";
import toast from "react-hot-toast";
import { Button } from "tccd-ui";
import { MdPersonOff, MdPersonAddAlt1 } from "react-icons/md";

const UsersView = ({ users }: { users: User[] }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const handleBanUser = async (user: User) => {
    setIsSubmitting(true);
    setSelectedUserId(user.id);
    await toast
      .promise(useBanUser(user.id).mutateAsync(), {
        loading: `Banning ${user.englishName || user.arabicName || "user"}...`,
        success: "User banned successfully",
        error: (error) => `Failed to ban user: ${error.message}`,
      })
      .finally(() => setIsSubmitting(false));
  };

  const handleUnbanUser = async (user: User) => {
    setIsSubmitting(true);
    setSelectedUserId(user.id);
    await toast
      .promise(useUnbanUser(user.id).mutateAsync(), {
        loading: `Unbanning ${user.englishName || user.arabicName || "user"}...`,
        success: "User unbanned successfully",
        error: (error) => `Failed to unban user: ${error.message}`,
      })
      .finally(() => setIsSubmitting(false));
  };

  const getProfileInfo = (user: User) => {
    if (user.studentProfile) {
      return {
        type: "Student",
        details: `${user.studentProfile.university || "N/A"} - ${user.studentProfile.department || "N/A"}`,
        extra: `GPA: ${user.studentProfile.gpa || "N/A"} | Grad: ${user.studentProfile.graduationYear || "N/A"}`,
      };
    }
    if (user.businessRepProfile) {
      return {
        type: "Business Rep",
        details: `${user.businessRepProfile.companyName || "N/A"}`,
        extra: user.businessRepProfile.position || "N/A",
      };
    }
    if (user.facultyMemberProfile) {
      return {
        type: "Faculty",
        details: `${user.facultyMemberProfile.universityName || "N/A"}`,
        extra: `${user.facultyMemberProfile.facultyName || "N/A"} - ${user.facultyMemberProfile.department || "N/A"}`,
      };
    }
    return { type: "N/A", details: "N/A", extra: "N/A" };
  };

  // Table columns configuration
  const columns = [
    {
      label: "Name",
      key: "englishName" as keyof User,
      width: "w-1/6",
      formatter: (value: string | undefined, user?: User) => {
        return (
          <div className="text-contrast">
            <div>{value || user?.arabicName || "N/A"}</div>
            {user?.arabicName && value && (
              <div className="text-sm text-text-muted-foreground">
                {user.arabicName}
              </div>
            )}
          </div>
        );
      },
    },
    {
      label: "Email",
      key: "email" as keyof User,
      formatter: (value: string | undefined) => value || "N/A",
    },
    {
      label: "Phone Number",
      key: "phoneNumber" as keyof User,
      formatter: (value: string | undefined) => value || "N/A",
    },
    {
      label: "Details",
      key: "id" as keyof User,
      width: "w-1/4",
      formatter: (_: any, user?: User) => {
        const info = getProfileInfo(user!);
        return (
          <div>
            <div>{info.details}</div>
            <div className="text-xs text-text-muted-foreground">
              {info.extra}
            </div>
          </div>
        );
      },
    },
    {
      label: "Gender",
      key: "gender" as keyof User,
    },
    {
      label: "Status",
      key: "status" as keyof User,
      formatter: (value: UserStatus) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs border shadow-sm font-medium ${
            (value === "Banned" || value === "Rejected")
              ? "bg-red-500/10 text-red-700 border-red-500"
              : value === "Approved"
              ? "bg-green-500/10 text-green-600 border-green-500"
              : value === "Pending"
              ? "bg-blue-500/10 text-blue-700 border-blue-500"
              : "bg-gray-500/10 text-gray-700 border-gray-500"
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  // Card view fields
  const cardFields = [
    {
      label: "Email",
      key: "email" as keyof User,
      formatter: (value: string | undefined) => value || "N/A",
    },
    {
      label: "Phone Number",
      key: "phoneNumber" as keyof User,
      formatter: (value: string | undefined) => value || "N/A",
    },
    {
      label: "Gender",
      key: "gender" as keyof User,
      formatter: (value: string | undefined) => (
        <div className="text-contrast w-1/3">
          {value || "N/A"}
        </div>
      ),
    },
    {
      label: "Status",
      key: "status" as keyof User,
      formatter: (value: UserStatus) => {
        return (
        <span
          className={`px-2.5 py-1 rounded-full text-xs border shadow-sm font-medium ${
            (value === "Banned" || value === "Rejected")
              ? "bg-red-500/10 text-red-700 border-red-500"
              : value === "Approved"
              ? "bg-green-500/10 text-green-600 border-green-500"
              : value === "Pending"
              ? "bg-blue-500/10 text-blue-700 border-blue-500"
              : "bg-gray-500/10 text-gray-700 border-gray-500"
          }`}
        >
          {value}
        </span>
      )},
    },
    {
      label: "Details",
      key: "id" as keyof User,
      fullWidth: true,
      formatter: (_: any, user?: User) => {
        const info = getProfileInfo(user!);
        return (
          <div>
            <div>{info.details}</div>
            <div className="text-sm text-text-muted-foreground mt-1">
              {info.extra}
            </div>
          </div>
        );
      },
    },
  ];

  // Render action buttons
  const renderActions = (
    user: User,
    triggerAction: (id: string) => void,
    _index: number,
    _setItem: (item: User) => void,
  ) => {
    return (
      <>
        {user.status !== "Banned" ? (
          <Button
            buttonText="Ban"
            buttonIcon={<MdPersonOff />}
            loading={isSubmitting && user.id === selectedUserId}
            onClick={() => triggerAction(user.id)}
            type="danger"
          />
        ) : (
          <Button
            buttonText="Unban"
            buttonIcon={<MdPersonAddAlt1 />}
            loading={isSubmitting && user.id === selectedUserId}
            onClick={() => triggerAction(user.id)}
            type="secondary"
          />
        )}
      </>
    );
  };

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <Table
        items={users}
        columns={columns}
        renderActions={renderActions}
        confirmationAction={(user) => {
          if (user.status === "Banned") {
            handleUnbanUser(user);
          } else {
            handleBanUser(user);
          }
        }}
        modalTitle="Confirm Action"
        modalSubTitle={"Are you sure you want to do this ?"}
        isSubmitting={isSubmitting}
        emptyMessage="No users found"
      />

      {/* Mobile Card View */}
      <CardView
        items={users}
        titleKey="englishName"
        renderedFields={cardFields}
        renderButtons={renderActions}
        confirmationAction={(user) => {
          if (user.status === "Banned") {
            handleUnbanUser(user);
          } else {
            handleBanUser(user);
          }
        }}
        modalTitle="Confirm Action"
        modalSubTitle="Are you sure you want to do this ?"
        isSubmitting={isSubmitting}
        emptyMessage="No users found"
      />
    </div>
  );
};

export default UsersView;
