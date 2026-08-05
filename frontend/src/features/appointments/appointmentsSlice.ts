import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getAppointmentsDashboardThunk } from "./thunk/getAppointmentsDashboardThunk";
import type { CalendarQuery } from "./model/calendarQuery";
import { getAvailableTimeSlotsThunk } from "./thunk/getAvailableSlots";
import { getTreatmentsThunk } from "./thunk/getTreatments";

interface CalendarState {
  availableDays: string[];
  fullyBookedDays: string[];
  availableTime: string[];
  selectedDate: string | null;
  selectedSpecialization: string | null;
  selectedDoctor: string | null;
  selectedSlotsTime: null | string;
  selectedTreatment: null | string;
  query: CalendarQuery;
  loading: boolean;
}

interface AppointmentsState {
  treatments: [];
  selectedAppointment: null;
  calendar: CalendarState;
  statistic: [];
  loading: boolean;
}

const initialState: AppointmentsState = {
  selectedAppointment: null,
  treatments:[],
  statistic: [],
  loading: false,
  calendar: {
    availableDays: [],
    fullyBookedDays: [],
    availableTime: [],
    selectedDate: null,
    selectedDoctor: null,
    selectedSpecialization: null,
    selectedSlotsTime: null,
    selectedTreatment:null,
    query: {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    },

    loading: false,
  },
};
const appointmentsSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<Partial<CalendarQuery>>) {
      state.calendar.query = {
        ...state.calendar.query,
        ...action.payload,
      };
     
    },
    resetQuery(state) {
      state.calendar.query = initialState.calendar.query;
    },
    setSelectedAppointment(state, action) {
      state.selectedAppointment = action.payload;
    },
    setDate(state, action) {
      state.calendar.selectedDate = action.payload;
      
    },
    setSpecialization(state, action) {
      state.calendar.selectedSpecialization = action.payload;
      state.calendar.selectedDoctor = null;
      state.calendar.availableTime = [];
    },
    setDoctor(state, action) {
      state.calendar.selectedDoctor = action.payload;
     
    },
    setTime(state, action) {
      state.calendar.selectedSlotsTime = action.payload;
    },
    setTreatment(state, action) {
      state.calendar.selectedTreatment = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAppointmentsDashboardThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAppointmentsDashboardThunk.fulfilled, (state, action) => {
       

         state.calendar.availableDays = action.payload.calendar.availableDays;
  state.calendar.fullyBookedDays = action.payload.calendar.fullyBookedDays;

  state.statistic = action.payload.statistic;
  state.loading = false;
      })
      .addCase(getAppointmentsDashboardThunk.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getAvailableTimeSlotsThunk.pending, (state) => {
        state.calendar.loading = true;
      })
      .addCase(getAvailableTimeSlotsThunk.fulfilled, (state, action) => {
        state.calendar.availableTime = action.payload.slots;
        state.calendar.loading = false;
      })
      .addCase(getAvailableTimeSlotsThunk.rejected, (state) => {
        state.calendar.loading = false;
      })
      .addCase(getTreatmentsThunk.pending, state => {
        state.loading = true;
      }).addCase(getTreatmentsThunk.fulfilled, (state,action) => {
        state.treatments = action.payload
        console.log(action.payload)
      }).addCase(getTreatmentsThunk.rejected, (state) => {
      state.loading = false
    })
  },
});
export const {
  setTime,
  setQuery,
  resetQuery,
  setSpecialization,
  setSelectedAppointment,
  setDate,
  setDoctor,
  setTreatment
} = appointmentsSlice.actions;
export default appointmentsSlice.reducer;
