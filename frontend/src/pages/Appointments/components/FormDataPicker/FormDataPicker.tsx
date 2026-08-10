
import { setDate, setTime } from "@/features/appointments/appointmentsSlice";
import { useAppDispatch } from "@/app/store/hook";

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  control: Control<T>;
  error?: string;

  availableDays?: string[];
};

import dayjs from "dayjs";
import {
  DatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Controller } from "react-hook-form";
import { PickersCalendarHeader } from "@mui/x-date-pickers/PickersCalendarHeader";

export const FormDatePicker = ({
  setValue,
  name,
  label,
  control,
  error,
  availableDays,
}: Props) => {
  const dispatch = useAppDispatch();

  return (
    <><div className="flex flex-col  flex-1">
    <>
    {label && (
              <label
                htmlFor={name}
                className="mb-[10px] block font-[Inter] font-medium text-[14px]"
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
            const date = value ? value.format("YYYY-MM-DD") : "";

            field.onChange(date);
            dispatch(setDate(date));
            dispatch(setTime(null));
            setValue("appointmentTime", "");
          }}
          shouldDisableDate={(day) =>
            !availableDays.includes(day.date())
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
              readOnly:true,
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
</>
   </div> </>
  );
};