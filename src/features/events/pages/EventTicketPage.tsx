import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import WithLayout from "@/shared/components/hoc/WithLayout";
import EventTicketCard from "../components/EventTicketCard";
import { IoArrowBack } from "react-icons/io5";

const EventTicketPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!ticket) {
    return (
      <WithLayout>
        <div className="min-h-screen bg-background-contrast flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-contrast mb-4">
              Ticket Not Found
            </h1>
            <p className="text-label mb-6">
              The ticket you're looking for doesn't exist.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </WithLayout>
    );
  }

  const userDetails = {
    englishFullName:
      "englishFullName" in mockUser ? mockUser.englishFullName : "N/A",
    arabicFullName:
      "arabicFullName" in mockUser ? mockUser.arabicFullName : "N/A",
    phoneNumber: "phoneNumber" in mockUser ? mockUser.phoneNumber : "N/A",
    email: "email" in mockUser ? mockUser.email : "N/A",
  };

  return (
    <WithLayout>
      <div className="min-h-screen bg-background-contrast py-4 sm:py-6 md:py-8">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-6 group"
          >
            <IoArrowBack className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Tickets</span>
          </button>

          <EventTicketCard ticket={ticket} userDetails={userDetails} />
        </div>
      </div>
    </WithLayout>
  );
};

export default EventTicketPage;
