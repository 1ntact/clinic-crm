import { getErrorMessage } from "@/features/errors/getError";
import { patientsService } from "@/services/patientService";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const removePatientThunk = createAsyncThunk(
  "doctors/delete",
  async (id: number, thunkApi) => {
    try {
      await patientsService.deletePatient(id);
      return id;
    } catch (e) {
      return thunkApi.rejectWithValue(getErrorMessage(e));
    }
  },
);
