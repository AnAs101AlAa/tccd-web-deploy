import React, { useMemo } from "react";
import type { ReactNode } from "react";
import type { StudentUser, VolunteeringUser } from "@/shared/types";

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
    const primaryDetails = useMemo<Detail<string | undefined>[]>(
        () => [
            { label: "English Name", value: user.englishFullName },
            { label: "Arabic Name", value: user.arabicFullName },
            { label: "Email", value: user.email },
            { label: "Phone Number", value: user.phoneNumber },
            { label: "Gender", value: user.gender },
            { label: "University", value: user.university },
            { label: "Faculty", value: user.faculty },
            { label: "Department", value: user.department },
            { label: "Graduation Year", value: user.graduationYear },
            { label: "GPA", value: user.gpa },
        ],
        [user],
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
            {
                label: "Experience",
                value: user.experience,
                render: (value?: string) => (
                    <span className="text-sm text-contrast leading-relaxed">{value}</span>
                ),
            },
        ],
        [user],
    );

    return (
        <>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {primaryDetails
                    .filter((detail) => detail.value)
                    .map((detail) => (
                        <div
                            key={detail.label}
                            className="rounded-xl border border-gray-200 bg-background px-3 md:px-4 py-1 md:py-3 text-[12px] md:text-[13px] lg:text-[14px]"
                        >
                            <span className="font-semibold uppercase tracking-wide text-label">
                                {detail.label}
                            </span>
                            <p className="mt-1 text-contrast break-words">
                                {detail.value}
                            </p>
                        </div>
                    ))}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4">
                {secondaryDetails
                    .filter((detail) => detail.value)
                    .map((detail) => (
                        <div
                            key={detail.label}
                            className="rounded-lg border border-gray-200 bg-background px-4 py-3"
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
