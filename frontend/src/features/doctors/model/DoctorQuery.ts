import type { DoctorSortBy } from "./sortDoctorTypes";

export interface DoctorQuery {
  search?: string;
  specialization?: string;
  employmentType?: string;
  sortBy?: DoctorSortBy;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}