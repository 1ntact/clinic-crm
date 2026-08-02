import { createSlice } from "@reduxjs/toolkit";
import { getAppointmentsDashboardThunk } from "./thunk/getAppointmentsDashboardThunk";

interface AppointmentsState {
  calendar;
  statistic;
  loading: boolean;
}
const initialState: AppointmentsState = {
  calendar: [],
  statistic: [],
  loading: false,
};

const appointmentsSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAppointmentsDashboardThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAppointmentsDashboardThunk.fulfilled, (state, action) => {
        state.calendar = action.payload.calendar;
        state.statistic = action.payload.statistic;
        state.loading = false;
        console.log(action.payload)
      })
      .addCase(getAppointmentsDashboardThunk.rejected, (state) => {
        state.loading = false;
      });
  },
});
export default appointmentsSlice.reducer;
