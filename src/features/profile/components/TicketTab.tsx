import {
  TicketFilterTabs,
  type Ticket,
  type TicketStatus,
} from "@/shared/types/profile";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import TicketCard from "./TicketCard";
import CategoryFilter from "@/shared/components/filters/CategoryFilter";
import Pagination from "@/shared/components/pagination/Pagination";
import { useGetUserRegistrations } from "@/shared/queries/user/userQueries";
import type { RegistrationQueryParams } from "@/shared/queries/user/userApi";
import GenericGrid from "@/shared/components/GenericGrid";

export default function TicketTab() {
  // New thing that we could standardize across all tabs
  // this way refreshes will still keep page number
  // better user experience
  const [searchParams, setSearchParams] = useSearchParams();

  // desktop >=1024px -> 10, tablet >=640px -> 6, mobile <640px -> 5
  // change them as you like really, but they are used again below
  // update there as well
  const [ticketsPerPage, setTicketsPerPage] = useState<number>(() => {
    const windowWidth = window.innerWidth;
    if (windowWidth >= 1024) return 10;
    if (windowWidth >= 640) return 6;
    return 5;
  });

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      // right here when you want to update tickets per page
      const newVal = windowWidth >= 1024 ? 10 : windowWidth >= 640 ? 6 : 5;
      setTicketsPerPage((prev) => (prev === newVal ? prev : newVal));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [apiParams, setApiParams] = useState<RegistrationQueryParams>(() => {
    const page = parseInt(searchParams.get("page") || "1", 10);
    const status = searchParams.get("status") || undefined;
    return {
      page,
      count: ticketsPerPage,
      status: status as TicketStatus | undefined,
    };
  });

  const {
    data: tickets,
    isLoading,
    isError,
    refetch: refetchRegistrations,
  } = useGetUserRegistrations(apiParams);

  useEffect(() => {
    setApiParams((prev) => {
      if (prev.count === ticketsPerPage) return prev;
      return { ...prev, count: ticketsPerPage, page: 1 };
    });
  }, [ticketsPerPage]);

  useEffect(() => {
    const queryParams = new URLSearchParams();
    if (apiParams.page != null) queryParams.set("page", String(apiParams.page));
    if (apiParams.status) queryParams.set("status", String(apiParams.status));
    setSearchParams(queryParams);
  }, [apiParams, setSearchParams]);

  const currentFilter = apiParams.status ?? "All";

  function changePage(newPageNumber: number) {
    setApiParams((prev) => ({ ...prev, page: newPageNumber }));
  }

  function filterTickets(filter: string) {
    setApiParams((prev) => ({
      ...prev,
      page: 1,
      status: filter === "All" ? undefined : (filter as TicketStatus),
    }));
  }
  return (
    <div className="mb-7 sm:mb-0 p-1 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-contrast">
        Tickets
      </h2>
      <p className="text-sm text-label mb-4">
        All your ongoing and past bookings listed in one place.
      </p>
      <CategoryFilter
        categories={TicketFilterTabs.filter((tab) => tab !== "All").map(
          (tab) => ({
            value: tab,
            label: tab,
          }),
        )}
        selectedCategory={currentFilter}
        onCategoryChange={filterTickets}
      />
      {isLoading && (
        <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-contrast mx-auto mb-4"></div>
            <p className="text-lg text-secondary font-medium">
              Loading tickets...
            </p>
          </div>
        </div>
      )}
      {isError && (
        <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
          <div className="text-center">
            <p className="text-lg text-red-600 mb-4">Failed to load tickets</p>
            <button
              onClick={() => refetchRegistrations()}
              className="px-4 py-2 bg-contrast text-white rounded-lg hover:bg-contrast/90"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      {tickets && (
        <>
          <GenericGrid
            items={tickets.items}
            emptyMessage="You haven't registered for any events yet. Explore our events and book your spot!"
            renderCard={(ticket: Ticket) => <TicketCard ticket={ticket} />}
            gridCols="grid-cols-1 md:grid-cols-2"
            getKey={(ticket: Ticket) => ticket.eventSlotId}
          />

          <Pagination
            currentPage={apiParams.page ?? 1}
            totalPages={tickets.totalPages}
            onPageChange={changePage}
          />
        </>
      )}
    </div>
  );
}
