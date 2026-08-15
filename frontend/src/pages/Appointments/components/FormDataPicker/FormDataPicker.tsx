import dayjs from "dayjs";
import {
  DatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Controller,
  type Control,
  type UseFormSetValue,
} from "react-hook-form";
import { PickersCalendarHeader } from "@mui/x-date-pickers/PickersCalendarHeader";

import {
  setDate,
  setTime,
} from "@/features/appointments/appointmentsSlice";
import { useAppDispatch } from "@/app/store/hook";
import type { AppointmentFormData } from "@/types/appointmentFormData";

type Props = {
  name: "appointmentDate";
  label: string;
  control: Control<AppointmentFormData>;
  setValue: UseFormSetValue<AppointmentFormData>;
  error?: string;
  availableDays?: number[];
  
};

export const FormDatePicker = ({
  
  setValue,
  name,
  label,
  control,
  error,
  availableDays = [],
}: Props) => {
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-1 flex-col">
      {label && (
        <label
          htmlFor={name}
          className="mb-[10px] block font-[Inter] text-[14px] font-medium"
        >
          {label}
        </label>
      )}

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <DatePicker
              showDaysOutsideCurrentMonth
              value={field.value ? dayjs(field.value) : null}
              disablePast
              onChange={(value) => {
                const date = value
                  ? value.format("YYYY-MM-DD")
                  : "";

                // React Hook Form
                field.onChange(date);

                // Redux
                dispatch(setDate(date));
                dispatch(setTime(null));

                // Очистити вибраний час
                setValue("appointmentTime", "");
              }}
              shouldDisableDate={(day) =>
                !availableDays.includes((day.date()))
              }
              slots={{
                calendarHeader: (props) => (
                  <PickersCalendarHeader
                    {...props}
                    slots={{
                      switchViewButton: () => null,
                      previousIconButton: () => null,
                      nextIconButton: () => null,
                    }}
                    sx={{
                      "& .MuiPickersCalendarHeader-labelContainer": {
                        margin: "0 auto",
                      },
                    }}
                  />
                ),
              }}
              slotProps={{
                textField: {
                  error: !!error,
                  helperText: error,
                  size: "small",
                  fullWidth: true,
                  readOnly: true,
                },

                day: {
                  sx: {
                    "&.Mui-selected": {
                      borderRadius: "8px",
                    },

                    "&.MuiPickerDay-today": {
                      borderRadius: "8px",
                      border: "2px solid #1976d2",
                    },

                    "&.MuiPickerDay-today::before": {
                      borderRadius: "8px",
                    },
                  },
                },
              }}
            />
          )}
        />
      </LocalizationProvider>
    </div>
  );
};