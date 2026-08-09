export type Appointment = {
  patientId: string;
  doctorId: string;
  treatmentId: string;
  dateTime: string;
  duration: 30;
  status: "scheduled";
  notes: "string";
  id: number;
  createdAt: string;
  patientFirstName: string;
  patientLastName: string;
  patientPhoneNumber: string;
  doctorFirstName: string;
  doctorLastName: string;
  treatment: string;
  treatmentPrice: number;
};
