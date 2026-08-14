export type SortButton<T extends string> = {
  value: T;
  label: string;
};

export type SortOrder = "asc" | "desc" | undefined;