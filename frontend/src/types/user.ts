import type { UserRole } from "./userRole";

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phoneNumber: number,
  registrationDate?: Date,
  source?: string,
  

}