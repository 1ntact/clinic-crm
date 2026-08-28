import { httpClient } from "@/http/httpClient"

export const visitsService = {
  createVisit: async (appointmentId:number) => {
    const responce = await httpClient.post("visits", {
      appointmentId: appointmentId,
  //     treatmentAdd1: 1,
  // treatmentAdd2:1,
  // diagnosis: string,
  // description: string,
  // recommendation: string,
    })
    return responce.data
  },
  getVisitByAppointmentId:async (appointmentId:number)=>{
    const responce = await httpClient.get(`visits/by-appointment/${appointmentId}`)
  
    return responce.data
  },
  getVisits: async()=>{
    const responce = await httpClient.get("visits/")
    return responce.data
  }
}