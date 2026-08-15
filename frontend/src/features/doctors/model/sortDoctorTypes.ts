import type { SortButton } from "@/components/sorter/sortTypes";

export type DoctorSortBy =
  | "name"
  | "recent_visit"
  | "upcoming_visit";


export const doctorSortButtons: SortButton<DoctorSortBy>[] = [
  {
    value: "name",
    label: "Name",
  },
  {
    value: "recent_visit",
    label: "Recent visit",
  },
  {
    value: "upcoming_visit",
    label: "Upcoming visit",
  },
];