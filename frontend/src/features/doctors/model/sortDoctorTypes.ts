import type { SortBy } from "@/types/sortTypes";

export const sortButtons: { value: SortBy; label: string }[] = [
  {
    value: "name",
    label: "Name",
  },
  {
    value: "specialization",
    label: "Specialization",
  },
  {
    value: "years_experience",
    label: "Experience",
  },
];