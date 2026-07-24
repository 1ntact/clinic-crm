import { getErrorMessage } from "@/features/errors/getError";
import { patientsService } from "@/services/patientService";
import type { Patient } from "@/types/patient";
import type { PatientFormData } from "@/types/patientFormData";
import { createAsyncThunk } from "@reduxjs/toolkit";
interface UpdatePatientPayload {
  id: string;
  data: PatientFormData;
}
export const updatePatientThunk = createAsyncThunk<Patient, UpdatePatientPayload>(
  "patient/delete",
  async ({id ,data }, thunkApi) => {
    try {
      return await patientsService.updatePatient(data, id)
    } 
    catch (e) {
      return thunkApi.rejectWithValue(getErrorMessage(e))
    }
  }
)