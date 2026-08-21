import { BaseSelect } from "@/components/select/BaseSelect";
import dayjs from "dayjs";


type DateFilterProps = {
  value?: string;
  onChange: (
    value: string,
    dateFrom: string | null,
    dateTo: string | null,
  ) => void;
};

const dateOptions = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last7days", label: "Last 7 days" },
  { value: "last30days", label: "Last 30 days" },
  { value: "thisMonth", label: "This month" },
];

export const DateFilter = ({ onChange, value }: DateFilterProps) => {
  const handleChange = (value: string) => {
    const today = dayjs();

  switch (value) {
  case "today": {
    onChange(
      today.format("YYYY-MM-DD"),
      today.format("YYYY-MM-DD"),
    );
    break;
  }

  case "yesterday": {
    const yesterday = today.subtract(1, "day");

    onChange(
      yesterday.format("YYYY-MM-DD"),
      yesterday.format("YYYY-MM-DD"),
    );
    break;
  }

  case "last7days": {
    onChange(
      today.subtract(6, "day").format("YYYY-MM-DD"),
      today.format("YYYY-MM-DD"),
    );
    break;
  }

  case "last30days": {
    onChange(
      today.subtract(29, "day").format("YYYY-MM-DD"),
      today.format("YYYY-MM-DD"),
    );
    break;
  }

  case "thisMonth": {
    onChange(
      today.startOf("month").format("YYYY-MM-DD"),
      today.endOf("month").format("YYYY-MM-DD"),
    );
    break;
  }
}
  };

  return (
    <BaseSelect
        
      name="dateFilter"
      classNames="h-[36px] w-[190px]"
      placeholder="Date range"
        value={value}
      options={dateOptions}
      onChange={handleChange}
    />
  );
};