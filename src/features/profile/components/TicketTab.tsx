import { TicketFilterTabs, type Ticket } from "@/shared/types/profile";
import { mockTickets } from "../mocks/mockTickets";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import TicketCard from "./TicketCard";
import CategoryFilter from "@/shared/components/filters/CategoryFilter";
import Pagination from "@/shared/components/pagination/Pagination";
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
    <div className="mb-7 sm:mb-0">
      <h1 className="text-2xl sm:text-3xl font-bold text-secondary mb-4 ">
        Tickets
      </h1>
      <CategoryFilter
        categories={TicketFilterTabs.filter((tab) => tab !== "All").map(
          (tab) => ({
            value: tab,
            label: tab,
          })
        )}
        selectedCategory={currentFilter}
        onCategoryChange={filterTickets}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentTickets.map((ticket) => (
          <TicketCard ticket={ticket} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredTickets.length / ticketsPerPage)}
        onPageChange={changePage}
      />
    </div>
  );
}
