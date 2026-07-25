import { httpClient } from "@/http/httpClient";
import type { PatientFormData } from "@/types/patientFormData";
import { accessTokenService } from "./accessTokenService";

export const patientsService = {
  createPatient: async (data: PatientFormData) => {
    const response = await httpClient.post("/patients/", data, {
      headers: {
        Authorization: `Bearer ${accessTokenService.get()}`,
      },
    });
    return response.data;
  },
  getAllPatients: async (query) => {
     const params: Record<string, string | number> = {
      page: query.page,
      page_size: query.pageSize,
      sort_by: query.sortBy,
       sort_order: query.sortOrder,
      
    };
  
    if (query.search) {
      params.search = query.search;
    }
  
    if (query.doctors) {
      params.doctors = query.doctors;
    }
  
    if (query.date) {
      params.date = query.date;
    }
  
    const response = await httpClient.get("/patients/", {params});
    return response.data;
  },

  getPatientById: async (id: number) => {
    const response = await httpClient.get(`/patients/${id}/`, {
      headers: {
        Authorization: `Bearer ${accessTokenService.get()}`,
      },
    });
    return response.data;
  },
  deletePatient: async (id: number) => {
    const response = await httpClient.delete(`/patients/${id}/`, {
      headers: {
        Authorization: `Bearer ${accessTokenService.get()}`,
      },
    });
    return response.data;
  },

  updatePatient: async (
    data: PatientFormData, id: string
  ) => {
    const response = await httpClient.patch(`/patients/${id}`, data,
      {
        headers: {
        Authorization: `Bearer ${accessTokenService.get()}`
      }})
    return response.data
    

  }
};
