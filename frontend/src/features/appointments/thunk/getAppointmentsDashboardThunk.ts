import { getErrorMessage } from "@/features/errors/getError";
import { appointmentsService } from "@/services/appointmentsService";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { CalendarQuery } from "../model/calendarQuery";

export const getAppointmentsDashboardThunk = createAsyncThunk(
  "dashboards",
  async (query:CalendarQuery, thunkApi) => {
    try {
      console.log(query, 'what a ttttt')
      return await appointmentsService.getAppointmentsDashboard(query);
    } catch (e) {
      return thunkApi.rejectWithValue(getErrorMessage(e));
    }
  },
);
