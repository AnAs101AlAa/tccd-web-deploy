import { useState } from "react";
import CardView from "@/shared/components/adminTables/CardView";
import type {
  User,
  UserStatus,
  UserRole,
  StudentProfile,
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
          <div className="flex items-center gap-2">
            {user?.profileImage && (
              <img
                src={user.profileImage}
                alt={value || ""}
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <div>
              <div>{value || user?.arabicName || "N/A"}</div>
              {user?.arabicName && value && (
                <div className="text-xs text-text-muted-foreground">
                  {user.arabicName}
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      label: "Role",
      key: "role" as keyof User,
      formatter: (value: UserRole | undefined) => value || "N/A",
    },
    {
      label: "Profile Type",
      key: "id" as keyof User,
      formatter: (_: any, user?: User) => getProfileInfo(user!).type,
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
          className={`px-2 py-1 rounded text-xs font-medium ${
            value === "Banned"
              ? "bg-red-100 text-red-800"
              : value === "Approved"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
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
      label: "Role",
      key: "role" as keyof User,
      formatter: (value: UserRole | undefined) => value || "N/A",
    },
    {
      label: "Gender",
      key: "gender" as keyof User,
    },
    {
      label: "Status",
      key: "status" as keyof User,
      formatter: (value: UserStatus) => {
        const statusStyles: Record<UserStatus, string> = {
          Pending: "bg-yellow-100 text-yellow-800",
          Approved: "bg-green-100 text-green-800",
          Rejected: "bg-orange-100 text-orange-800",
          Banned: "bg-red-100 text-red-800",
        };
        return (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${statusStyles[value]}`}
          >
            {value}
          </span>
        );
      },
    },
    {
      label: "Profile Type",
      key: "id" as keyof User,
      formatter: (_: any, user?: User) => getProfileInfo(user!).type,
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
    // Conditionally show student-specific fields
    {
      label: "LinkedIn",
      key: "studentProfile" as keyof User,
      formatter: (profile: StudentProfile) => {
        if (!profile?.linkedIn) return null;
        return (
          <a
            href={profile.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View Profile
          </a>
        );
      },
    },
    {
      label: "GitHub",
      key: "studentProfile" as keyof User,
      formatter: (profile: StudentProfile) => {
        if (!profile?.github) return null;
        return (
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View Profile
          </a>
        );
      },
    },
    {
      label: "Committee",
      key: "studentProfile" as keyof User,
      formatter: (profile: StudentProfile) => {
        if (!profile?.volunteeringProfile) return null;
        return `${profile.volunteeringProfile.committeeAffiliation} - ${profile.volunteeringProfile.committePosition}`;
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
