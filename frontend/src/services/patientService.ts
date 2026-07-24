import { httpClient } from "@/http/httpClient";
import type { PatientFormData } from "@/types/patientFormData";
import { accessTokenService } from "./accessTokenService";

export const patientsService = {
  createPatient: async (data: PatientFormData) => {
    const response = await httpClient.post("/patients", data, {
      headers: {
        Authorization: `Bearer ${accessTokenService.get()}`,
      },
    });
    return response.data;
  },
  getAllPatients: async () => {
    const response = await httpClient.get("patients", {
      headers: {
        Authorization: `Bearer ${accessTokenService.get()}`,
      },
    });
    return response.data;
  },
  getPatientById: async (id: number) => {
    const response = await httpClient.get(`patients/${id}/`, {
      headers: {
        Authorization: `Bearer ${accessTokenService.get()}`,
      },
    });
    return response.data;
  },
  deletePatient: async (id: number) => {
    const response = await httpClient.delete(`patients/${id}/`, {
      headers: {
        Authorization: `Bearer ${accessTokenService.get()}`,
      },
    });
    return response.data;
  },

  updatePatient: async (
    data: PatientFormData, id: string
  ) => {
    const response = await httpClient.patch(`patients/${id}`, data,
      {
        headers: {
        Authorization: `Bearer ${accessTokenService.get()}`
      }})
    return response.data
    

  }
};
