import { useState } from "react";
import CardView from "@/shared/components/adminTables/CardView";
import type { User, UserStatus } from "@/shared/queries/admin/users/userTypes";
import {
  useApproveUser,
  useRejectUser,
  useBanUser,
  useUnbanUser,
} from "@/shared/queries/admin/users/userQueries";
import Table from "@/shared/components/adminTables/Table";
import toast from "react-hot-toast";
import { Button } from "tccd-ui";
import {
  MdPersonOff,
  MdPersonAddAlt1,
  MdCheckCircle,
  MdCancel,
} from "react-icons/md";

const UsersView = ({ users }: { users: User[] }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [pendingAction, setPendingAction] = useState<
    "ban" | "unban" | "approve" | "reject"
  >("ban");

  // Hooks called at top level — use .mutateAsync(userId) in handlers
  const approveUser = useApproveUser();
  const rejectUser = useRejectUser();
  const banUser = useBanUser();
  const unbanUser = useUnbanUser();

  const handleApproveUser = async (user: User) => {
    setIsSubmitting(true);
    setSelectedUserId(user.id);
    await toast
      .promise(approveUser.mutateAsync(user.id), {
        loading: `Approving ${user.englishName || user.arabicName || "user"}...`,
        success: "User approved successfully",
        error: (error) => `Failed to approve user: ${error.message}`,
      })
      .finally(() => setIsSubmitting(false));
  };

  const handleRejectUser = async (user: User) => {
    setIsSubmitting(true);
    setSelectedUserId(user.id);
    await toast
      .promise(rejectUser.mutateAsync(user.id), {
        loading: `Rejecting ${user.englishName || user.arabicName || "user"}...`,
        success: "User rejected successfully",
        error: (error) => `Failed to reject user: ${error.message}`,
      })
      .finally(() => setIsSubmitting(false));
  };

  const handleBanUser = async (user: User) => {
    setIsSubmitting(true);
    setSelectedUserId(user.id);
    await toast
      .promise(banUser.mutateAsync(user.id), {
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
      .promise(unbanUser.mutateAsync(user.id), {
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
            value === "Banned" || value === "Rejected"
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
        <div className="text-contrast w-1/3">{value || "N/A"}</div>
      ),
    },
    {
      label: "Status",
      key: "status" as keyof User,
      formatter: (value: UserStatus) => {
        return (
          <span
            className={`px-2.5 py-1 rounded-full text-xs border shadow-sm font-medium ${
              value === "Banned" || value === "Rejected"
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
        );
      },
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

  // Render action buttons based on user status:
  // Pending  → Approve + Reject
  // Approved → Ban
  // Banned   → Unban
  // Rejected → Approve
  const renderActions = (
    user: User,
    triggerAction: (id: string) => void,
    _index: number,
    _setItem: (item: User) => void,
  ) => {
    return (
      <>
        {/* Approve: shown for Pending & Rejected */}
        {(user.status === "Pending" || user.status === "Rejected") && (
          <Button
            buttonText="Approve"
            buttonIcon={<MdCheckCircle />}
            loading={
              isSubmitting &&
              user.id === selectedUserId &&
              pendingAction === "approve"
            }
            onClick={() => {
              setPendingAction("approve");
              triggerAction(user.id);
            }}
            type="primary"
          />
        )}
        {/* Reject: shown for Pending only */}
        {user.status === "Pending" && (
          <Button
            buttonText="Reject"
            buttonIcon={<MdCancel />}
            loading={
              isSubmitting &&
              user.id === selectedUserId &&
              pendingAction === "reject"
            }
            onClick={() => {
              setPendingAction("reject");
              triggerAction(user.id);
            }}
            type="danger"
          />
        )}
        {/* Ban: shown for Approved only */}
        {user.status === "Approved" && (
          <Button
            buttonText="Ban"
            buttonIcon={<MdPersonOff />}
            loading={
              isSubmitting &&
              user.id === selectedUserId &&
              pendingAction === "ban"
            }
            onClick={() => {
              setPendingAction("ban");
              triggerAction(user.id);
            }}
            type="danger"
          />
        )}
        {/* Unban: shown for Banned only */}
        {user.status === "Banned" && (
          <Button
            buttonText="Unban"
            buttonIcon={<MdPersonAddAlt1 />}
            loading={
              isSubmitting &&
              user.id === selectedUserId &&
              pendingAction === "unban"
            }
            onClick={() => {
              setPendingAction("unban");
              triggerAction(user.id);
            }}
            type="secondary"
          />
        )}
      </>
    );
  };

  const getModalText = () => {
    switch (pendingAction) {
      case "approve":
        return {
          title: "Confirm Approve",
          subtitle:
            "Are you sure you want to approve this user? An approval email will be sent.",
          confirmText: "Approve",
        };
      case "reject":
        return {
          title: "Confirm Reject",
          subtitle:
            "Are you sure you want to reject this user? A rejection email will be sent.",
          confirmText: "Reject",
        };
      case "ban":
        return {
          title: "Confirm Ban",
          subtitle: "Are you sure you want to ban this user?",
          confirmText: "Ban",
        };
      case "unban":
        return {
          title: "Confirm Unban",
          subtitle: "Are you sure you want to unban this user?",
          confirmText: "Unban",
        };
    }
  };

  const handleConfirmAction = async (user: User) => {
    switch (pendingAction) {
      case "approve":
        await handleApproveUser(user);
        break;
      case "reject":
        await handleRejectUser(user);
        break;
      case "ban":
        await handleBanUser(user);
        break;
      case "unban":
        await handleUnbanUser(user);
        break;
    }
  };

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <Table
        items={users}
        columns={columns}
        renderActions={renderActions}
        confirmationAction={handleConfirmAction}
        modalTitle={getModalText().title}
        modalSubTitle={getModalText().subtitle}
        modalConfirmText={getModalText().confirmText}
        isSubmitting={isSubmitting}
        emptyMessage="No users found"
      />

      {/* Mobile Card View */}
      <CardView
        items={users}
        titleKey="englishName"
        renderedFields={cardFields}
        renderButtons={renderActions}
        confirmationAction={handleConfirmAction}
        modalTitle={getModalText().title}
        modalSubTitle={getModalText().subtitle}
        modalConfirmText={getModalText().confirmText}
        isSubmitting={isSubmitting}
        emptyMessage="No users found"
      />
    </div>
  );
};

export default UsersView;
