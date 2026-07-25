export interface PatientQuery {
  search: string;

  sortBy: "name" | "recent_visit" | "upcoming_visit"

  sortOrder: "asc" | "desc";

  page: number;
  pageSize: number;
}