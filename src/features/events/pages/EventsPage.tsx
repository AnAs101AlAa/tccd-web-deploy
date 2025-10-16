import EventCard from "../components/EventCard";
import EventsHeader from "../components/EventsHeader";
import { upcomingEvents, pastEvents } from "../data/dummyEvents";
import WithNavbar from "@/shared/components/hoc/WithNavbar";

const EventsPage = () => {
  return (
    <WithNavbar>
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <EventsHeader
          title="Events"
          subtitle="Explore the catalogue of our latest and history of events on full display"
        />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          {/* Upcoming Events Section */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-contrast">
                Upcoming Events
              </h2>
              <span className="text-sm text-secondary bg-primary/10 px-4 py-2 rounded-full">
                {upcomingEvents.length} events
              </span>
            </div>

            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-secondary text-lg">
                  No upcoming events at the moment. Check back soon!
                </p>
              </div>
            )}
          </section>

          {/* Past Events Section */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-contrast">Past Events</h2>
              <span className="text-sm text-secondary bg-secondary/10 px-4 py-2 rounded-full">
                {pastEvents.length} events
              </span>
            </div>

            {pastEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-secondary text-lg">
                  No past events to display.
                </p>
              </div>
            )}
          </section>
        </main>
      </div>
    </WithNavbar>
  );
};

export default EventsPage;
