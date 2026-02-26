import React, { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { Button, ButtonTypes, ButtonWidths } from "tccd-ui";
import type { StudentUser, VolunteeringUser } from "@/shared/types";
import StudentInfoDisplay from "./StudentInfoDisplay";
import EditStudentInfoModal from "./EditStudentInfoModal";

type StudentLikeUser = StudentUser | VolunteeringUser;

interface StudentInfoTabProps {
  user: StudentLikeUser;
  isOwnProfile: boolean;
}

const StudentInfoTab: React.FC<StudentInfoTabProps> = ({
  user,
  isOwnProfile,
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [displayUser, setDisplayUser] = useState<StudentLikeUser>(user);
  
  useEffect(() => {
    setDisplayUser(user);
  }, [user]);

  
  return (
    <section className="p-4 sm:p-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-contrast">
            Student Information
          </h2>
          <p className="text-sm text-label">
            Review your primary profile information at a glance.
          </p>
        </div>
        <div className="flex gap-2">
          {isOwnProfile && (
            <Button
              buttonText="Edit info"
              buttonIcon={<FiEdit className="h-4 w-4" />}
              onClick={() => setIsEditOpen(true)}
              type={ButtonTypes.PRIMARY}
              width={ButtonWidths.FIT}
            />
          )} 
        </div>
      </header>

      <StudentInfoDisplay user={displayUser} />

      {isEditOpen && (
        <EditStudentInfoModal
          user={displayUser}
          onClose={() => setIsEditOpen(false)}
          onSave={(updatedUser) => {
            setDisplayUser(updatedUser);
            setIsEditOpen(false);
          }}
        />
      )}
    </section>
  );
};

export default StudentInfoTab;
