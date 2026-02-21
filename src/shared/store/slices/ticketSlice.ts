import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Ticket } from "@/shared/types/profile";

export interface TicketState {
  selectedTicket: Ticket | null;
}

const initialState: TicketState = {
  selectedTicket: null,
};

const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {
    setSelectedTicket: (state, action: PayloadAction<Ticket>) => {
      state.selectedTicket = action.payload;
    },
    clearSelectedTicket: (state) => {
      state.selectedTicket = null;
    },
  },
});

export const { setSelectedTicket, clearSelectedTicket } = ticketSlice.actions;
export default ticketSlice.reducer;
