import React from "react";
import type { AnyUser } from "@/shared/types";
import {
    isBusinessRep,
    isCompany,
    isDR,
    isStudent,
    isTA,
    isVolunteer,
} from "@/shared/types";
import StudentInfoTab from "./StudentInfoTab";

interface InfoTabProps {
    user: AnyUser;
    isOwnProfile?: boolean;
}

const InfoTab: React.FC<InfoTabProps> = ({ user, isOwnProfile = false }) => {
    if (isStudent(user) || isVolunteer(user)) {
        return <StudentInfoTab user={user} isOwnProfile={isOwnProfile} />;
    }

    const comingSoonLabel = (() => {
        if (isCompany(user)) {
            return "Company profile details";
        }
        if (isBusinessRep(user)) {
            return "Business representative details";
        }
        if (isTA(user) || isDR(user)) {
            return "Faculty member details";
        }
        return "Profile details";
    })();

    return (
        <section className="p-4 sm:p-6">
            <header className="flex flex-col gap-1">
                <h2 className="text-lg sm:text-xl font-semibold text-contrast">
                    {comingSoonLabel}
                </h2>
                <p className="text-sm text-label">
                    We are preparing this section. Check back soon for more details.
                </p>
            </header>
            <div className="mt-8 rounded-lg border border-gray-200 bg-background p-6 text-center text-sm text-label">
                Additional information for this profile type will appear here.
            </div>
        </section>
    );
};

export default InfoTab;
