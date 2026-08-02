import { getErrorMessage } from "@/features/errors/getError";
import { patientsService } from "@/services/patientService";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllPatientThunk = createAsyncThunk(
  "patients",
  async (query, thunkApi) => {
    try {
      return await patientsService.getAllPatients(query)
    }
    catch (e) {
      return thunkApi.rejectWithValue(getErrorMessage(e))
    }
  }
)