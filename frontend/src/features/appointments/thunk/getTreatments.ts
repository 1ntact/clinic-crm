import { getErrorMessage } from "@/features/errors/getError";
import { appointmentsService } from "@/services/appointmentsService";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getTreatmentsThunk = createAsyncThunk(
  'treatments',
  async (query:boolean, thunkApi) => {
    try {
      return await appointmentsService.getTreatments(query)
    }
    catch (e){
return thunkApi.rejectWithValue(getErrorMessage(e))
    }
  }
)