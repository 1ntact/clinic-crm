import type { SortBy } from "@/types/sortTypes";

export type SortButton = {
  value: SortBy;
  label: string;
};

export const sortButtons: SortButton[] = [
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