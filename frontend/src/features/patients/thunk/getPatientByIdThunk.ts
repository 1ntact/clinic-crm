import { getErrorMessage } from "@/features/errors/getError";
import { patientsService } from "@/services/patientService";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getPatientByIdThunk = createAsyncThunk(
  "patient/getById",
  async (id: number, thunkApi) => {
    try { return await patientsService.getPatientById(id) }
    catch (e) {
      return thunkApi.rejectWithValue(getErrorMessage(e))
      
    }
  }

)