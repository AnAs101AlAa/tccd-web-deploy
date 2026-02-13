import { Pagination } from "@/shared/components/pagination";
import UpperHeader from "@/shared/components/mainpages/UpperHeader";
import WithLayout from "@/shared/components/hoc/WithLayout";
import GenericGrid from "@/shared/components/GenericGrid";
import EventGalleryCard from "../components/EventGalleryCard";
import { useGallery } from "../hooks";
import type Event from "@/shared/types/events";
import EventsFilter from "@/features/events/components/EventsFilter";
import { useState } from "react";
import type { EventQueryParams } from "@/shared/types/events";
import toast from "react-hot-toast";
import GALLERY_HEADER_IMAGE from "@/assets/galleryHeader.jpeg";

const GalleryPage = () => {
  const [queryParams, setQueryParams] = useState<EventQueryParams>({
    PageNumber: 1,
    PageSize: 12,
    OrderBy: "Date",
    Descending: true,
  });

  const handleApplyFilters = (stagingParams: EventQueryParams) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const start = stagingParams.StartDate
      ? new Date(stagingParams.StartDate)
      : null;

    if (start && start > now) {
      toast.error(
        "Start date cannot be in the future",
      );
      return;
    }

    setQueryParams(stagingParams);
  };

  const {
    galleryItems: apiGalleryEvents,
    isLoading,
    error,
    refetch,
  } = useGallery(queryParams);
  
  if (error) {
    return (
      <WithLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-red-600 mb-4">Failed to load gallery</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-contrast text-white rounded-lg hover:bg-contrast/90"
            >
              Retry
            </button>
          </div>
        </div>
      </WithLayout>
    );
  }

  return (
    <WithLayout>
      <div className="min-h-screen bg-gray-50">
        <UpperHeader
          image={GALLERY_HEADER_IMAGE}
          title="Gallery"
          subtitle="Dive into the collection of our brightest moments shaped by our community."
        />

        <main className="w-full xl:w-[80%] xl:mx-auto px-6 py-5">
          <section className="mb-16">
            <div className="mb-6">
              <EventsFilter
                searchParams={queryParams}
                onSearch={(params) => handleApplyFilters(params)}
              />
            </div>
            {isLoading && (
              <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-contrast mx-auto mb-4"></div>
                  <p className="text-lg text-secondary font-medium">
                    Loading events...
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
                <div className="text-center">
                  <p className="text-lg text-red-600 mb-4">
                    Failed to load events
                  </p>
                  <button
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-contrast text-white rounded-lg hover:bg-contrast/90"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {apiGalleryEvents && (
              <>
                <GenericGrid
                  items={apiGalleryEvents.items}
                  emptyMessage="No gallery items at the moment. Check back soon!"
                  renderCard={(item: Event) => <EventGalleryCard {...item} />}
                  gridCols="grid-cols-1 md:grid-cols-2 2xl:grid-cols-3"
                  getKey={(item: Event) => item.id}
                />

                <Pagination
                  currentPage={apiGalleryEvents.pageIndex}
                  totalPages={apiGalleryEvents.totalPages}
                  onPageChange={(page: number) => {
                    setQueryParams((prev) => ({
                      ...prev,
                      PageNumber: page,
                    }));
                  }}
                />
              </>
            )}
          </section>
        </main>
      </div>
    </WithLayout>
  );
};

export default GalleryPage;
