export interface AppointmentsQuery {
  appointmentDate?: string | null;
  doctorId?: number | null;
  patientId?: number | null;
  appointmentStatus?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  
  
}