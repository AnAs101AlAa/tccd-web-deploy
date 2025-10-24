import { ErrorScreen, LoadingPage } from "tccd-ui";
import { useParams } from "react-router-dom";
import WithNavbar from "@/shared/components/hoc/WithNavbar";
import EventDetailsPageComponent from "../components/EventDetailsView";
import { useGetEventById } from "@/shared/queries/events";

const EventDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const eventId = id ?? "";
    const {
        data: event,
        error,
        isLoading,
    } = useGetEventById(eventId);

    const handleRegister = () => {
        if (!event) return;
        console.log("Register for event", event.id);
    };

    if (isLoading) {
        return (
            <LoadingPage />
        );
    }

    if (error || !event) {
        return (
            <ErrorScreen
                message="an error occurred while fetching the event details. Please try again and contact our team if the problem persists."
                title="Failed to load event details."
            />
        );
    }

    return (
        <WithNavbar>
            <div className="min-h-screen bg-gray-50 -mb-5 md:mb-0 md:py-10">
                <div className="mx-auto flex w-full md:w-2/3 lg:w-1/2 flex-col gap-6">
                    <EventDetailsPageComponent event={event} onRegister={handleRegister} />
                </div>
            </div>
        </WithNavbar>
    );
};

export default EventDetailsPage;
