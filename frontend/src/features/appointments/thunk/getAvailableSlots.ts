import { getErrorMessage } from "@/features/errors/getError";
import { appointmentsService } from "@/services/appointmentsService";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAvailableTimeSlotsThunk = createAsyncThunk(
  'dashboards/available',
  async (query, thunkApi) => {
    try {
    
      return await appointmentsService.getAvailableAppointmentsTime(query)
    }
    catch (e){
      return thunkApi.rejectWithValue(getErrorMessage(e))
    }
  }
)