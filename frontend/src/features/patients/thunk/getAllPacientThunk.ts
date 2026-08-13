import { getErrorMessage } from "@/features/errors/getError";
import { patientsService } from "@/services/patientService";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { PatientQuery } from "../model/patientsQuery";

export const getAllPatientThunk = createAsyncThunk(
  "patients",
  async (query:PatientQuery, thunkApi) => {
    try {
      return await patientsService.getAllPatients(query)
    }
    catch (e) {
      return thunkApi.rejectWithValue(getErrorMessage(e))
    }
  }
)