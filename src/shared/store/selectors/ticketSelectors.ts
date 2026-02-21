import type { RootState } from "../store";

export const selectSelectedTicket = (state: RootState) =>
  state.ticket.selectedTicket;
