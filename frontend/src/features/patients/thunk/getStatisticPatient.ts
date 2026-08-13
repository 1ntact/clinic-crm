import { getErrorMessage } from "@/features/errors/getError"
import { patientsService } from "@/services/patientService"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const getStatisticPatient = createAsyncThunk(
  "patient/statistics",
  async (_, thunkApi) => {
    try { return await patientsService.getStatisticPatient() }
    catch (e) {
      return thunkApi.rejectWithValue(getErrorMessage(e))
      
    }
  }

)