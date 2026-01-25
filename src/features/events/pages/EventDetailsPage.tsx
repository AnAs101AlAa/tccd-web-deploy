import { ErrorScreen, LoadingPage } from "tccd-ui";
import { useParams, useNavigate } from "react-router-dom";
import WithLayout from "@/shared/components/hoc/WithLayout";
import EventDetailsPageComponent from "../components/EventDetailsView";
import { useGetEventById } from "@/shared/queries/events";


const EventDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const eventId = id ?? "";
    const { data: event, error, isLoading } = useGetEventById(eventId);

    const handleRegister = () => {
        if (!event) return;
        navigate(`/events/register/${event.id}`);
    };

    if (isLoading) {
        return <LoadingPage />;
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
        <WithLayout>
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 -mb-5 md:mb-0 py-4 sm:py-6 md:py-10">
                <div className="mx-auto flex w-full px-0 sm:px-4 md:w-2/3 lg:w-1/2 flex-col gap-6">
                    <EventDetailsPageComponent
                        event={event}
                        onRegister={handleRegister}
                    />
                </div>
            </div>
        </WithLayout>
    );
};



export default EventDetailsPage;