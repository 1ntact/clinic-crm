import { getErrorMessage } from "@/features/errors/getError";
import { patientsService } from "@/services/patientService";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const getPatientNotesThunk = createAsyncThunk(
  "patients/notes",
  async (patientId:number, thunkApi) => {
    try {
      return await patientsService.getPatientNotes(patientId)
    }
    catch (e) {
      return thunkApi.rejectWithValue(getErrorMessage(e))
    }
  }
)