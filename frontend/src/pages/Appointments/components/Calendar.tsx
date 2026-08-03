import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers";
import { PickerDay } from "@mui/x-date-pickers/PickerDay";

import { setDate, setQuery } from "@/features/appointments/appointmentsSlice";
import { useAppDispatch, useAppSelector } from "@/app/store/hook";

type CalendarProps = {
  availableDays: string[];
  bookedDays: string[];
};

type ServerDayProps = React.ComponentProps<typeof PickerDay> & {
  availableDays: number[];
  bookedDays: number[];
};

function ServerDay({
  day,
  availableDays,
  bookedDays,
  sx,
  ...other
}: ServerDayProps) {
 
  const date = day.date();

  const available = availableDays.includes(date);
  const booked = bookedDays.includes(date);
 
  return (
    <PickerDay
      {...other}
      day={day}
      sx={[
        {
          borderRadius: 2,

          ...(available && {
            bgcolor: "#DCFCE7",
            color: "#15803D",
          }),

          ...(booked && {
            bgcolor: "#FEE2E2",
            color: "#DC2626",
          }),

          "&.Mui-selected": {
            bgcolor: "#2563EB !important",
            color: "#fff",
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
}

export default function Calendar({
  availableDays,
  bookedDays,
}: CalendarProps) {
  
  const value = useAppSelector(state=>state.appointment.calendar.selectedDate)
const dispatch = useAppDispatch();
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          disablePast
          minDate={dayjs()}
         onMonthChange={(value: Dayjs) => {
    dispatch(
      setQuery({
        month: value.month() + 1,
        year: value.year(),
      })
    );
  }}
          value={value? dayjs(value) : null}
          onChange={value => {
            if (!value) { return }
            dispatch(setDate(value.format("YYYY-MM-DD")));
          }
          }
          shouldDisableDate={(day) => {
    return !availableDays.includes(day.date());
  }}
          slots={{
            day: ServerDay,
          }}
          slotProps={{
            day: {
              availableDays,
              bookedDays,
            } as any,
          }}
        />
      </LocalizationProvider>
    </div>
  );
}