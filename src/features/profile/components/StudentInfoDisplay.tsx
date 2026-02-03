import React, { useMemo } from "react";
import type { ReactNode } from "react";
import type { StudentUser, VolunteeringUser } from "@/shared/types";
import InfoField from "@/shared/components/InfoField";
import {
  IoPersonOutline,
  IoMailOutline,
  IoCallOutline,
  IoSchoolOutline,
  IoBusinessOutline,
  IoCalendarOutline,
  IoStatsChartOutline,
  IoMaleFemaleOutline,
} from "react-icons/io5";

type StudentLikeUser = StudentUser | VolunteeringUser;

interface Detail<T = string | undefined | null> {
  label: string;
  value: T;
}

interface SecondaryDetail extends Detail<string | undefined> {
  render?: (value?: string) => ReactNode;
}

interface StudentInfoDisplayProps {
  user: StudentLikeUser;
}

const StudentInfoDisplay: React.FC<StudentInfoDisplayProps> = ({ user }) => {
  const primaryDetailsWithIcons = useMemo(
    () => [
      {
        label: "English Name",
        value: user.englishFullName,
        icon: IoPersonOutline,
      },
      {
        label: "Arabic Name",
        value: user.arabicFullName,
        icon: IoPersonOutline,
      },
      {
        label: "Email",
        value: user.email,
        icon: IoMailOutline,
        truncate: true,
      },
      { label: "Phone Number", value: user.phoneNumber, icon: IoCallOutline },
      { label: "Gender", value: user.gender, icon: IoMaleFemaleOutline },
      { label: "University", value: user.university, icon: IoSchoolOutline },
      { label: "Faculty", value: user.faculty, icon: IoSchoolOutline },
      { label: "Department", value: user.department, icon: IoBusinessOutline },
      {
        label: "Graduation Year",
        value: user.graduationYear,
        icon: IoCalendarOutline,
      },
      { label: "GPA", value: user.gpa, icon: IoStatsChartOutline },
    ],
    [user]
  );

  const secondaryDetails = useMemo<SecondaryDetail[]>(
    () => [
      {
        label: "LinkedIn",
        value: user.linkedin,
        render: (value?: string) => (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-primary hover:underline"
          >
            View profile
          </a>
        ),
      },
      {
        label: "Curriculum Vitae",
        value: user.cv,
        render: (value?: string) => (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-primary hover:underline"
          >
            View document
          </a>
        ),
      },
    ],
    [user]
  );

  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {primaryDetailsWithIcons
          .filter((detail) => detail.value)
          .map((detail) => (
            <InfoField
              key={detail.label}
              icon={detail.icon}
              label={detail.label}
              value={String(detail.value!)}
              truncate={detail.truncate}
            />
          ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4">
        {secondaryDetails
          .filter((detail) => detail.value)
          .map((detail) => (
            <div
              key={detail.label}
              className="rounded-lg border border-gray-200 bg-gray-50/50 px-4 py-3"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-label">
                {detail.label}
              </span>
              <div className="mt-1">
                {detail.render ? detail.render(detail.value) : detail.value}
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default StudentInfoDisplay;
