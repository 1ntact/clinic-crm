import { getErrorMessage } from "@/features/errors/getError";
import { appointmentsService } from "@/services/appointmentsService";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAppointmentsDashboardThunk = createAsyncThunk(
  "dashboards",
  async (_, thunkApi) => {
    try {
      return await appointmentsService.getAppointmentsDashboard();
    } catch (e) {
      return thunkApi.rejectWithValue(getErrorMessage(e));
    }
  },
);
