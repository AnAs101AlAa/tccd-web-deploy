import React, { useEffect, useState } from "react";
import { FiEdit, FiPlus } from "react-icons/fi";
import { Button, ButtonTypes, ButtonWidths } from "tccd-ui";
import type { StudentUser, VolunteeringUser } from "@/shared/types";
import type Event from "@/shared/types/events";
import type { EventFormData } from "@/features/events/types/eventFormTypes";
import StudentInfoDisplay from "./StudentInfoDisplay";
import EditStudentInfoModal from "./EditStudentInfoModal";
import { AddEditEventModal } from "@/features/events/components";

type StudentLikeUser = StudentUser | VolunteeringUser;

interface StudentInfoTabProps {
  user: StudentLikeUser;
  isOwnProfile: boolean;
}

// Dummy event data for testing
const dummyEvent: Event = {
  id: "evt-123",
  title: "Annual Tech Conference 2024",
  description:
    "Join us for an exciting conference featuring the latest in technology, innovation, and networking opportunities. This event will showcase cutting-edge developments and provide valuable insights from industry leaders.",
  eventPoster:
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
  eventType: "Conference",
  media: [
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600",
    "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600",
    "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600",
  ],
  sponsors: [
    {
      id: "sp-1",
      companyName: "TechCorp Solutions",
      banner:
        "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400",
    },
    {
      id: "sp-2",
      companyName: "Innovation Labs",
      banner: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400",
    },
  ],
  date: "2024-12-15T14:00:00",
  location: "Grand Convention Center, Downtown",
  category: "Technology",
  capacity: 500,
  registeredCount: 342,
  attendeeCount: 0,
};

const StudentInfoTab: React.FC<StudentInfoTabProps> = ({
  user,
  isOwnProfile,
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [displayUser, setDisplayUser] = useState<StudentLikeUser>(user);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(
    undefined
  );

  useEffect(() => {
    setDisplayUser(user);
  }, [user]);

  const handleAddEvent = () => {
    setSelectedEvent(undefined);
    setIsEventModalOpen(true);
  };

  const handleEditEvent = () => {
    setSelectedEvent(dummyEvent);
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (eventFormData: EventFormData) => {
    console.log("Event form data saved:", eventFormData);
    console.log(
      "eventPoster type:",
      eventFormData.eventPoster instanceof File ? "File" : "String"
    );
    // Here you would send eventFormData to your backend API
    // The backend will receive a File object for eventPoster if it's new
    // or a string URL if it's existing
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
            buttonText="Add Event"
            buttonIcon={<FiPlus className="h-4 w-4" />}
            onClick={handleAddEvent}
            type={ButtonTypes.BASIC}
            width={ButtonWidths.FIT}
          />
          <Button
            buttonText="Edit Event"
            buttonIcon={<FiEdit className="h-4 w-4" />}
            onClick={handleEditEvent}
            type={ButtonTypes.SECONDARY}
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
