import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  control: Control<T>;
  error?: string;

  availableDays?: string[];
};

export const FormDatePicker = <T extends FieldValues>({
  name,
  label,
  control,
  error,
  availableDays,
}: Props<T>) => {
  console.log(availableDays);
console.log(typeof availableDays[0]);
  return (
    <div className="flex flex-col">
      <label className="mb-[10px] text-[14px] font-medium">
        {label}
      </label>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <DatePicker
              value={field.value ? dayjs(field.value) : null}
              disablePast
              onChange={(value) => {
                field.onChange(
                  value ? value.format("YYYY-MM-DD") : ""
                );
              }}
      shouldDisableDate={(day) => !availableDays.includes(day.date())}
              slotProps={{
                textField: {
                  error: !!error,
                  helperText: error,
                  size: "small",
                  fullWidth: true,
                },
              }}
            />
          )}
        />
      </LocalizationProvider>
    </div>
  );
};