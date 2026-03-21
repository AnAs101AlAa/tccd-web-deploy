import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Registration } from "@/shared/types/profile";
import AttendeeInfo from "./AttendeeInfo";
import TicketQRCode from "./TicketQRCode";
import { useGetEventQRCode, useDeleteRegistration } from "@/shared/queries/events/eventQueries";
import EVENT_TYPES from "@/constants/EventTypes";
import ConfirmActionModal from "@/shared/components/ConfirmActionModal";
import { Button, ButtonTypes } from "tccd-ui";
import {
  FaCalendar,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaTag,
  FaClipboardList,
} from "react-icons/fa";
import format from "@/shared/utils/dateFormater";
import { HTMLFormattedText } from "@/shared/components/HTMLFormattedText";

interface EventTicketCardProps {
  registration: Registration;
  userDetails: {
    englishFullName: string;
    arabicFullName: string;
    phoneNumber: string;
    email: string;
  };
}

const EventTicketCard: React.FC<EventTicketCardProps> = ({
  registration,
  userDetails,
}) => {
  const { event, eventSlot } = registration;

  // Room names as locations
  const roomNames = event.rooms?.map((room) => room.name).filter(Boolean);

  const {
    data: qrData,
    isLoading: isQRLoading,
  } = useGetEventQRCode(event.id, registration.status === "Approved");

  // Map backend event type value to human-readable label
  const eventTypeLabel =
    EVENT_TYPES.find((t) => t.value === event.type)?.label ?? event.type;

  const navigate = useNavigate();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { mutate: deleteRegistration, isPending: isDeleting } =
    useDeleteRegistration();

  const handleDeleteConfirm = () => {
    deleteRegistration(event.id, {
      onSuccess: () => {
        setIsConfirmOpen(false);
        navigate("/profile");
      },
    });
  };

  const statusStyles = {
    Approved: "bg-green-500/10 text-green-600 border-green-500",
    Pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500",
    Rejected: "bg-red-500/10 text-red-600 border-red-500",
    Cancelled: "bg-gray-400/10 text-gray-500 border-gray-400",
  };

  return (
    <>
      <div className="w-full max-w-4xl mx-auto bg-background rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 pt-6 sm:p-6 md:p-8">
          {/* Event Name — centered */}
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-contrast text-center mb-2 leading-tight">
            {event.name}
          </p>

          {/* Event Type + Status Badges */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold bg-primary/10 text-primary">
              <FaTag className="w-3 h-3" />
              {eventTypeLabel}
            </span>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border-2 ${statusStyles[registration.status] ?? ""
                }`}
            >
              {registration.status}
            </span>
          </div>

          {/* Divider below title/tags */}
          <hr className="border-gray-200 mb-3" />

          {/* Description */}
          {event.description && (
            <p className="text-sm sm:text-base text-contrast mb-6 leading-relaxed">
              <HTMLFormattedText content={event.description} />
            </p>
          )}

          {/* Event Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <InfoItem
              icon={<FaCalendar className="w-4 h-4 text-primary" />}
              label="Event Date"
              value={format(event.date, "stringed")}
            />

            {roomNames && roomNames.length > 0 && (
              <InfoItem
                icon={<FaMapMarkerAlt className="w-4 h-4 text-primary" />}
                label="Location"
                value={roomNames.join(", ")}
              />
            )}

            {eventSlot && (
              <InfoItem
                icon={<FaClock className="w-4 h-4 text-primary" />}
                label="Time Slot"
                value={`${format(eventSlot.startTime, "hourFull")} – ${format(eventSlot.endTime, "hourFull")}`}
              />
            )}

            <InfoItem
              icon={<FaUsers className="w-4 h-4 text-primary" />}
              label="Capacity"
              value={eventSlot.capacity.toString()}
            />

            <InfoItem
              icon={<FaClipboardList className="w-4 h-4 text-primary" />}
              label="Registered At"
              value={format(registration.registeredAt, "stringed")}
            />
          </div>

          {/* Rooms Section */}
          {event.rooms && event.rooms.length > 0 && (
            <>
              <div className="border-t-2 border-dashed border-gray-300 my-6" />
              <h2 className="text-lg sm:text-xl font-semibold text-secondary mb-3">
                Rooms
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                {event.rooms.map((room) => (
                  <div
                    key={room.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <FaMapMarkerAlt className="w-4 h-4 text-primary shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-contrast">
                        {room.name}
                      </p>
                      <p className="text-xs text-label">
                        Capacity: {room.capacity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* QR Code Section */}
          {registration.status === "Approved" && (
            <>
              <div className="border-t-2 border-dashed border-gray-300 my-6" />
              {isQRLoading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
                </div>
              ) : qrData?.base64Image ? (
                <TicketQRCode
                  qrCodeSrc={`data:image/png;base64,${qrData.base64Image}`}
                  eventTitle={event.name}
                />
              ) : (
                <p className="text-sm text-label text-center">QR code unavailable</p>
              )}
            </>
          )}

          <div className="border-t-2 border-dashed border-gray-300 my-6" />

          {/* Attendee Information */}
          <AttendeeInfo userDetails={userDetails} />

          {/* Cancel Registration */}
          {registration.status !== "Rejected" && registration.status !== "Cancelled" && (
            <>
              <div className="border-t-2 border-dashed border-gray-300 mt-6 mb-4" />
              <div className="flex justify-center">
                <Button
                  type={ButtonTypes.DANGER}
                  buttonText="Cancel Registration"
                  onClick={() => setIsConfirmOpen(true)}
                />
              </div>
            </>
          )}
        </div>
      </div>

    <ConfirmActionModal
      item={event.id}
      isOpen={isConfirmOpen}
      onClose={() => setIsConfirmOpen(false)}
      title="Cancel Registration"
      subtitle={`Are you sure you want to cancel your registration for "${event.name}"? This action cannot be undone.`}
      onSubmit={handleDeleteConfirm}
      isSubmitting={isDeleting}
      actionButtonText="Proceed"
    />
  </>
  );
};

/** Reusable info row */
const InfoItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
    <div className="mt-0.5 shrink-0">{icon}</div>
    <div>
      <p className="text-xs text-label">{label}</p>
      <p className="text-sm font-medium text-contrast">{value}</p>
    </div>
  </div>
);

export default EventTicketCard;
