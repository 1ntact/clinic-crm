import type { CalendarQuery } from "@/features/appointments/model/calendarQuery";
import { httpClient } from "@/http/httpClient"


export const appointmentsService = {
  getAppointmentsDashboard: async (query:CalendarQuery) => {
    const params = {
      month: query.month,
      year: query.year,
    }
    if (query.month) {
      params.month = query.month;
    }
    if (query.year) {
      params.year = query.year
    }
    const response = await httpClient.get(`appointments/dashboard/`, {params})
    return response.data
  },
  getAvailableAppointmentsTime: async (query) => {
    const params = {
      date: query.date,
      doctor_id:query.id
    }
      if (query.date) {
      params.date = query.date;
    }
    if (query.doctorId) {
      params.doctor_id = query.doctorId
    }
    const response = await httpClient.get('appointments/available-slots/',{params})
return response.data
  },
  getAppointments: async () => {
    const respoonse = await httpClient.get('/appointments/')
    return respoonse.data
  },
  getAppointmentsByID: async (id:string) => {
    const response = await httpClient.get(`/appointments/${id}`)
    return response.data
  },
  createAppointments: async (data) => {
    const response = await httpClient.post('/appointments', data,)
    return response.data
  },
  getTreatments: async (query:boolean) => {
    const params = {
    is_main:query
    }
    const response = await httpClient.get('/treatments/', { params })
    return response.data
  }
}