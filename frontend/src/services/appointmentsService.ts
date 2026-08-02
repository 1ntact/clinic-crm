import { httpClient } from "@/http/httpClient"


export const appointmentsService = {
  getAppointmentsDashboard: async () => {
    const response = await httpClient.get('appointments/dashboard')
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
  return response.data}
}