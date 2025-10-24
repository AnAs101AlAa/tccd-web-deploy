import { TicketFilterTabs, type Ticket } from "@/shared/types/profile";
import { mockTickets } from "../mocks/mockTickets";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "tccd-ui";
import TicketCard from "./TicketCard";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
export default function TicketTab() {
  const ticketsPerPage = 5; //We can adjust this as much as we want, really
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(searchParams.get("page") || "1", 10)
  );
  const [currentFilter, setCurrentFilter] = useState<string>("All");
  //Extra useState for holding filtered tickets, to be removed when integrating with backend
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(mockTickets);
  const [currentTickets, setCurrentTickets] = useState<Ticket[]>(
    filteredTickets.slice(
      currentPage * ticketsPerPage,
      (currentPage + 1) * ticketsPerPage
    )
  ); //Should be empty, then set after an API call
  function changePage(newPageNumber: number) {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("page", newPageNumber.toString());
    setSearchParams(newSearchParams);
    setCurrentPage(newPageNumber);
    setCurrentTickets(
      filteredTickets.slice(
        (currentPage - 1) * ticketsPerPage,
        currentPage * ticketsPerPage > filteredTickets.length
          ? currentPage * ticketsPerPage
          : filteredTickets.length
      )
    ); //To be replaced with an API call asking for next page
  }
  function filterTickets(filter: string) {
    //This should be a different API call with a filter parameter, but for now we filter the mock tickets
    setCurrentFilter(filter);
    setFilteredTickets(
      mockTickets.filter((ticket) =>
        filter === "All" ? true : ticket.status === filter
      )
    );
    setCurrentTickets(
      filteredTickets.slice(
        (currentPage - 1) * ticketsPerPage,
        currentPage * ticketsPerPage > filteredTickets.length
          ? currentPage * ticketsPerPage
          : filteredTickets.length
      )
    );
  }
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-secondary">Tickets</h1>
      <div className="flex flex-row p-2">
        {TicketFilterTabs.map((filter) => (
          <Button
            buttonText={filter}
            onClick={() => filterTickets(filter)}
            type={currentFilter == filter ? "primary" : "basic"}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4">
        {currentTickets.map((ticket) => (
          <TicketCard ticket={ticket} />
        ))}
      </div>
      <button
        onClick={() => changePage(currentPage - 1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:translate-x-0 bg-white hover:bg-background-contrast rounded-full p-2 shadow-lg transition-colors duration-300 z-10"
        aria-label="Previous post"
      >
        <LuChevronLeft className="w-6 h-6 text-contrast" />
      </button>

      <button
        onClick={() => changePage(currentPage + 1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:-translate-x-0 bg-white hover:bg-background-contrast rounded-full p-2 shadow-lg transition-colors duration-300 z-10"
        aria-label="Next post"
      >
        <LuChevronRight className="w-6 h-6 text-contrast" />
      </button>

      <div className="flex items-center justify-center gap-3 mt-6">
        <span className="text-sm font-medium text-contrast">
          {currentPage} / {filteredTickets.length / ticketsPerPage}
        </span>
      </div>

      <div className="flex items-center justify-center gap-2 mt-3">
        {Array.from(
          { length: Math.ceil(filteredTickets.length / ticketsPerPage) },
          (_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => changePage(page)}
                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  page === currentPage
                    ? "bg-secondary"
                    : "bg-background-contrast hover:bg-contrast"
                }`}
                aria-label={`Go to page ${page}`}
              />
            );
          }
        )}
      </div>
    </div>
  );
}
