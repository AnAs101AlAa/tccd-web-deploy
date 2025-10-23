import { Button } from "tccd-ui";
import { useNavigate, useParams } from "react-router-dom";
import WithNavbar from "@/shared/components/hoc/WithNavbar";
import EventDetailsPageComponent from "../components/EventDetailsView";
import { useGetEventById } from "@/shared/queries/events";

const EventDetailsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const eventId = id ?? "";
    const {
        data: event,
        isLoading,
        error,
        refetch,
    } = useGetEventById(eventId);

    const handleRegister = () => {
        if (!event) return;
        console.log("Register for event", event.id);
    };

    if (!id) {
        return (
            <WithNavbar>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <p className="text-lg font-semibold text-gray-700">Event not found</p>
                        <Button
                            buttonText="Back to events"
                            type="secondary"
                            width="small"
                            onClick={() => navigate("/events")}
                        />
                    </div>
                </div>
            </WithNavbar>
        );
    }

    if (isLoading) {
        return (
            <WithNavbar>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center space-y-3">
                        <div className="mx-auto h-12 w-12 rounded-full border-4 border-secondary/40 border-t-secondary animate-spin" />
                        <p className="text-gray-600">Loading event details...</p>
                    </div>
                </div>
            </WithNavbar>
        );
    }

    if (error || !event) {
        return (
            <WithNavbar>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center space-y-5">
                        <p className="text-lg font-semibold text-red-600">Unable to load event details.</p>
                        <div className="flex items-center justify-center gap-3">
                            <Button
                                buttonText="Retry"
                                type="primary"
                                width="small"
                                onClick={() => refetch()}
                            />
                            <Button
                                buttonText="Back to events"
                                type="secondary"
                                width="small"
                                onClick={() => navigate("/events")}
                            />
                        </div>
                    </div>
                </div>
            </WithNavbar>
        );
    }

    return (
        <WithNavbar>
            <div className="min-h-screen bg-gray-50 py-10">
                <div className="mx-auto flex w-[96%] max-w-6xl flex-col gap-6">
                    <EventDetailsPageComponent event={event} onRegister={handleRegister} />
                </div>
            </div>
        </WithNavbar>
    );
};

export default EventDetailsPage;
