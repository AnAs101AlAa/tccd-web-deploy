import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import WithLayout from "@/shared/components/hoc/WithLayout";
import EventTicketCard from "../components/EventTicketCard";
import { IoArrowBack } from "react-icons/io5";
import { useGetUserRegistration } from "@/shared/queries/user/userQueries";
import { useCurrentUser } from "@/shared/queries/user/userHooks";

const EventTicketPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = useCurrentUser();

  const {
    data: registration,
    isLoading,
    isError,
    refetch,
  } = useGetUserRegistration(id!);

  if (isLoading) {
    return (
      <WithLayout>
        <div className="min-h-screen bg-background-contrast flex items-center justify-center p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-contrast mx-auto mb-4"></div>
            <p className="text-lg text-secondary font-medium">
              Loading ticket...
            </p>
          </div>
        </div>
      </WithLayout>
    );
  }

  if (isError) {
    return (
      <WithLayout>
        <div className="min-h-screen bg-background-contrast flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-lg text-red-600 mb-4">Failed to load ticket</p>
            <button
              onClick={() => refetch()}
              className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </WithLayout>
    );
  }

  if (!registration) {
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
              onClick={() => navigate("/profile")}
              className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              Go to Profile
            </button>
          </div>
        </div>
      </WithLayout>
    );
  }

  const userDetails = {
    englishFullName:
      currentUser && "englishFullName" in currentUser
        ? currentUser.englishFullName
        : "",
    arabicFullName:
      currentUser && "arabicFullName" in currentUser
        ? currentUser.arabicFullName
        : "",
    phoneNumber:
      currentUser && "phoneNumber" in currentUser
        ? currentUser.phoneNumber
        : "",
    email: currentUser && "email" in currentUser ? currentUser.email : "",
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

          <EventTicketCard
            registration={registration}
            userDetails={userDetails}
          />
        </div>
      </div>
    </WithLayout>
  );
};

export default EventTicketPage;
