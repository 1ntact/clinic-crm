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
import type { AvailableTimeSlot } from "./model/avalibleTimeSlots";
import type { Treatment } from "@/types/treatment";

interface CalendarState {
  fullyBookedTimeCount: number;
  availableTimeCount: number;
  availableDays: number[];
  fullyBookedDays: number[];
  availableTime: AvailableTimeSlot[];
  selectedDate: string | null;
  selectedSpecialization: string | null;
  selectedDoctor: Doctor | null;
  selectedSlotsTime: null | string;
  selectedTreatment: null | string;
  query: CalendarQuery;
  calendarLoading: boolean;
}

interface AppointmentsState {
  appointmentsQuery: AppointmentsQuery;

  appointments: Appointment[];
  selectedAppointment: Appointment | null;

  page: number;
  pageSize: number;
  pages: number;
  total: number;

  treatments: Treatment[];
  statistic: string[];

  calendar: CalendarState;

  appointmentsLoading: boolean;
}

const initialState: AppointmentsState = {
  appointmentsQuery: {
    search: "",
    doctorId: null,
    patientId: null,
    appointmentStatus: null,
    dateFrom: null,
    dateTo: null,
    page: 1,
    pageSize: 5,
  },

  appointments: [],
  selectedAppointment: null,

  page: 1,
  pageSize: 5,
  pages: 0,
  total: 0,

  treatments: [],
  statistic: [],

  appointmentsLoading: false,

  calendar: {
    availableDays: [],
    fullyBookedDays: [],
    availableTime: [],
    fullyBookedTimeCount: 0,
    availableTimeCount: 0,

    selectedDate: null,
    selectedDoctor: null,
    selectedSpecialization: null,
    selectedSlotsTime: null,
    selectedTreatment: null,

    query: {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    },

    calendarLoading: false,
  },
};

const appointmentsSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    setAppointmentsQuery(
      state,
      action: PayloadAction<Partial<AppointmentsQuery>>,
    ) {
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
      console.log("calendar data", action.payload);
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
      console.log("calendar time", action.payload);
    },
    setTreatment(state, action) {
      state.calendar.selectedTreatment = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAppointmentsDashboardThunk.pending, (state) => {
        state.calendar.calendarLoading = true;
      })
      .addCase(getAppointmentsDashboardThunk.fulfilled, (state, action) => {
        state.calendar.availableDays = action.payload.calendar.availableDays;
        state.calendar.fullyBookedDays =
          action.payload.calendar.fullyBookedDays;
        state.statistic = action.payload.statistic;
        state.calendar.calendarLoading = false;
        console.log("забукані дні", action.payload);
      })
      .addCase(getAppointmentsDashboardThunk.rejected, (state) => {
        state.calendar.calendarLoading = false;
      })
      .addCase(getAvailableTimeSlotsThunk.pending, (state) => {
        state.calendar.calendarLoading = true;
      })
      .addCase(getAvailableTimeSlotsThunk.fulfilled, (state, action) => {
        state.calendar.availableTimeCount = action.payload.availableCount;
        state.calendar.fullyBookedTimeCount = action.payload.bookedCount;
        state.calendar.availableTime = action.payload.slots;
        state.calendar.calendarLoading = false;
      })
      .addCase(getAvailableTimeSlotsThunk.rejected, (state) => {
        state.calendar.calendarLoading = false;
      })
      .addCase(getTreatmentsThunk.pending, () => {
     
      })
      .addCase(getTreatmentsThunk.fulfilled, (state, action) => {
        state.treatments = action.payload;
      })
      .addCase(getTreatmentsThunk.rejected, () => {
       
      })
      .addCase(createAppointmentThunk.pending, (state) => {
        state.appointmentsLoading = true;
      })
      .addCase(createAppointmentThunk.fulfilled, (state) => {
        state.appointmentsLoading = false;
      })
      .addCase(createAppointmentThunk.rejected, (staet) => {
        staet.appointmentsLoading = false;
      })
      .addCase(getAppointmentsThunk.pending, (state) => {
        state.appointmentsLoading = true;
      })
      .addCase(getAppointmentsThunk.fulfilled, (state, action) => {
        state.appointmentsLoading = false;
        state.appointments = action.payload.items;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
        state.pages = action.payload.pages;
        state.total = action.payload.total;

        console.log("current information", action.payload);
      })
      .addCase(getAppointmentsThunk.rejected, (state) => {
        state.appointmentsLoading = false;
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
