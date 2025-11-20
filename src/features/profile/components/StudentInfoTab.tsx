import React, { useEffect, useState } from "react";
import { FiEdit, FiPlus } from "react-icons/fi";
import { Button, ButtonTypes, ButtonWidths } from "tccd-ui";
import type { StudentUser, VolunteeringUser } from "@/shared/types";
import type Event from "@/shared/types/events";
import StudentInfoDisplay from "./StudentInfoDisplay";
import EditStudentInfoModal from "./EditStudentInfoModal";
import { AddEditEventModal } from "@/features/events/components";

type StudentLikeUser = StudentUser | VolunteeringUser;

interface StudentInfoTabProps {
    user: StudentLikeUser;
    isOwnProfile: boolean;
}

const StudentInfoTab: React.FC<StudentInfoTabProps> = ({ user, isOwnProfile }) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [displayUser, setDisplayUser] = useState<StudentLikeUser>(user);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(undefined);

    useEffect(() => {
        setDisplayUser(user);
    }, [user]);

    const handleAddEvent = () => {
        setSelectedEvent(undefined);
        setIsEventModalOpen(true);
    };

    const handleSaveEvent = (event: Event) => {
        console.log("Event saved:", event);
        setIsEventModalOpen(false);
    };

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
                    <Button
                        buttonText="Test Event Modal"
                        buttonIcon={<FiPlus className="h-4 w-4" />}
                        onClick={handleAddEvent}
                        type={ButtonTypes.BASIC}
                        width={ButtonWidths.FIT}
                    />
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

            {isEventModalOpen && (
                <AddEditEventModal
                    event={selectedEvent}
                    onClose={() => setIsEventModalOpen(false)}
                    onSave={handleSaveEvent}
                />
            )}
        </section>
    );
};

export default StudentInfoTab;
