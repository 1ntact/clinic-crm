export interface AppointmentsQuery {
  search?: string;
  appointmentDate?: string | null;
  doctorId?: number | null;
  patientId?: number | null;
  appointmentStatus?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  page:number ;
  pageSize: number ;

  
  
}