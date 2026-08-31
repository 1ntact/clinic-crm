
export type Notes = {

      "visitId": number,
      "appointmentId": number,
      "description": "string",
      "doctorId": number,
      "visitDate": string
    
}
export type PatientNotes = {
  
 
  clinicalNotes: Notes[];

}