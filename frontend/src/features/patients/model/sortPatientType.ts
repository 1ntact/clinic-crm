import type { SortBy } from "@/types/sortTypes";

export const sortButtons: { value: SortBy; label: string }[] = [
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