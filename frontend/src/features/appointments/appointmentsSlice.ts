import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getAppointmentsDashboardThunk } from "./thunk/getAppointmentsDashboardThunk";
import type { CalendarQuery } from "./model/calendarQuery";
import { getAvailableTimeSlotsThunk } from "./thunk/getAvailableSlots";

interface CalendarState {
  availableDays: string[];
  fullyBookedDays: string[];
  availableTime: string[];
  selectedDate: string | null;
  selectedSpecialization: string | null;
  selectedDoctorId: string | null;
  selectedSlotsTime: null | string;
  query: CalendarQuery;
  loading: boolean;
}

interface AppointmentsState {
  selectedAppointment:  null;
  calendar: CalendarState;
  statistic:[]
  loading: boolean;
}

const initialState: AppointmentsState = {
  selectedAppointment: null,
  statistic:[],
loading:false,
  calendar: {
    availableDays: [],
    fullyBookedDays: [],
    availableTime:[],
    selectedDate: null,
    selectedDoctorId: null,
    selectedSpecialization: null,
    selectedSlotsTime:null,
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
    setQuery(state, action:PayloadAction<Partial<CalendarQuery>>) {
      state.calendar.query = {
        ...state.calendar.query,
        ...action.payload,
      } 
    },
    resetQuery(state) {
            state.calendar.query = initialState.calendar.query;
    },
     setSelectedAppointment(state, action) {
          state.selectedAppointment = action.payload;
    },
    setDate(state, action) {
       state.calendar.selectedDate = action.payload
    },
    setSpecialization(state, action) {
      state.calendar.selectedSpecialization = action.payload
      state.calendar.selectedDoctorId = null
      state.calendar.availableTime = []
    }, setDoctor(state, action) {
      state.calendar.selectedDoctorId = action.payload
      
    },
    setTime(state, action) {
      state.calendar.selectedSlotsTime = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAppointmentsDashboardThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAppointmentsDashboardThunk.fulfilled, (state, action) => {
  state.calendar = {
    ...state.calendar,
    ...action.payload.calendar,
  };

  state.statistic = action.payload.statistic;
  state.loading = false;
})
      .addCase(getAppointmentsDashboardThunk.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getAvailableTimeSlotsThunk.pending, state => {
      state.calendar.loading = true
      })
      .addCase(getAvailableTimeSlotsThunk.fulfilled, (state, action) => {
        state.calendar.availableTime = action.payload.slots
        state.calendar.loading = false
      })
      .addCase(getAvailableTimeSlotsThunk.rejected, (state) => {
      
        state.calendar.loading = false
    })
  },
});
export const {setTime,setQuery,resetQuery,setSpecialization ,setSelectedAppointment,setDate, setDoctor}= appointmentsSlice.actions
export default appointmentsSlice.reducer;
