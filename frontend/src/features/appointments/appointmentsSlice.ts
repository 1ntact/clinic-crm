import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getAppointmentsDashboardThunk } from "./thunk/getAppointmentsDashboardThunk";
import type { CalendarQuery } from "./model/calendarQuery";
import { getAvailableTimeSlotsThunk } from "./thunk/getAvailableSlots";
import { getTreatmentsThunk } from "./thunk/getTreatments";
import { createAppointmentThunk } from "./thunk/createAppointmentThunk";
import { getAppointmentsThunk } from "./thunk/getAppointmentsThunk";
import type { Appointment } from "@/types/appointment";
import type { AppointmentsQuery } from "./model/appointmentQuery";
import type { Doctor } from "@/types/doctor";

interface CalendarState {
  fullyBookedTimeCount: number;
  availableTimeCount: number;
  availableDays: string[];
  fullyBookedDays: string[];
  availableTime: string[];
  selectedDate: string | null;
  selectedSpecialization: string | null;
  selectedDoctor: Doctor | null;
  selectedSlotsTime: null | string;
  selectedTreatment: null | string;
  query: CalendarQuery;
  loading: boolean;
}

interface AppointmentsState {
   appointmentsQuery: AppointmentsQuery;
  treatments: [];
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  calendar: CalendarState;
  statistic: [];
  loading: boolean;
}

const initialState: AppointmentsState = {
  appointmentsQuery: {
  doctorId: null,
  patientId: null,
  appointmentStatus: null,
  dateFrom: null,
  dateTo: null,
  
  
},
  selectedAppointment: null,
  appointments: [],
  treatments: [],
  statistic: [],
  loading: false,
  calendar: {
    availableDays: [],
    fullyBookedDays: [],
    availableTime: [],
    fullyBookedTimeCount: 0,
    availableTimeCount:0,
    selectedDate: null,
    selectedDoctor: null,
    selectedSpecialization: null,
    selectedSlotsTime: null,
    selectedTreatment: null,
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
     setAppointmentsQuery(state, action: PayloadAction<Partial<AppointmentsQuery>>) {
      state.appointmentsQuery = {
        ...state.appointmentsQuery,
        ...action.payload,
      };
    },
    resetAppointmentsQuery(state) {
      state.appointmentsQuery = initialState.appointmentsQuery;
    },

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
      console.log("calendar data",action.payload)
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
       console.log("calendar time",action.payload)
    },
    setTreatment(state, action) {
      state.calendar.selectedTreatment = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAppointmentsDashboardThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAppointmentsDashboardThunk.fulfilled, (state, action) => {
        state.calendar.availableDays = action.payload.calendar.availableDays;
        state.calendar.fullyBookedDays =
          action.payload.calendar.fullyBookedDays;
        state.statistic = action.payload.statistic;
        state.loading = false;
        console.log("забукані дні",action.payload)
      })
      .addCase(getAppointmentsDashboardThunk.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getAvailableTimeSlotsThunk.pending, (state) => {
        state.calendar.loading = true;
      })
      .addCase(getAvailableTimeSlotsThunk.fulfilled, (state, action) => {
         state.calendar.availableTimeCount = action.payload.availableCount;
        state.calendar.fullyBookedTimeCount = action.payload.bookedCount;
        state.calendar.availableTime = action.payload.slots;
        state.calendar.loading = false;
      })
      .addCase(getAvailableTimeSlotsThunk.rejected, (state) => {
        state.calendar.loading = false;
      })
      .addCase(getTreatmentsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTreatmentsThunk.fulfilled, (state, action) => {
        state.treatments = action.payload;
      })
      .addCase(getTreatmentsThunk.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createAppointmentThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAppointmentThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createAppointmentThunk.rejected, (staet) => {
        staet.loading = false;
      })
      .addCase(getAppointmentsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAppointmentsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
        console.log(action.payload);
      })
      .addCase(getAppointmentsThunk.rejected, (state) => {
        state.loading = false;
      });
  },
});
export const {
  setAppointmentsQuery,
  resetAppointmentsQuery,
  setTime,
  setQuery,
  resetQuery,
  setSpecialization,
  setSelectedAppointment,
  setDate,
  setDoctor,
  setTreatment,
} = appointmentsSlice.actions;
export default appointmentsSlice.reducer;
