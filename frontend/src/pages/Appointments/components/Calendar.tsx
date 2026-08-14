import dayjs, { type Dayjs } from "dayjs";
import {
  DateCalendar,
  type PickersCalendarHeaderProps,
} from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PickerDay, type PickerDayProps } from "@mui/x-date-pickers/PickerDay";

import {
  setDate,
  setQuery,
} from "@/features/appointments/appointmentsSlice";
import { useAppDispatch, useAppSelector } from "@/app/store/hook";

type CalendarProps = {
  availableDays: number[];
  bookedDays: number[];
};

function createServerDay(
  availableDays: number[],
  bookedDays: number[],
) {
  return function ServerDay({
    day,
    sx,
    ...other
  }: PickerDayProps) {
    const date = day.date();

    const isCurrentMonth =
      day.month() === dayjs().month() &&
      day.year() === dayjs().year();

    const isPast = day.isBefore(dayjs(), "day");

    const available =
      isCurrentMonth &&
      !isPast &&
      availableDays.includes(date);

    const booked =
      isCurrentMonth &&
      bookedDays.includes(date);

    return (
      <PickerDay
        {...other}
        day={day}
        sx={[
          {
            borderRadius: 2,

            ...(available && {
              bgcolor: "#FFFFFF",
              color: "#1F2937",
            }),

            ...(booked && {
              bgcolor: "#FEE2E2",
              color: "#9CA3AF",
            }),

            ...(isPast && {
              bgcolor: "#FFFFFF",
              color: "#9CA3AF",
            }),

            "&.MuiPickersDay-today": {
              border: "2px solid #2563EB",
              backgroundColor: "#FFFFFF",
              color: "#1F2937",
            },

            "&.Mui-selected": {
              bgcolor: "#1E3A8A !important",
              color: "#fff",
            },
          },

          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      />
    );
  };
}

function CustomCalendarHeader(
  props: PickersCalendarHeaderProps,
) {
  const {
    currentMonth,
    onMonthChange,
  } = props;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 12px",
      }}
    >
      <button
        type="button"
        onClick={() =>
          onMonthChange(
            currentMonth.subtract(1, "month"),
          )
        }
        style={{
          border: "none",
          background: "transparent",
          fontSize: "28px",
          cursor: "pointer",
          lineHeight: 1,
        }}
      >
        ‹
      </button>

      <div
        style={{
          fontSize: "16px",
          fontWeight: 600,
          textTransform: "capitalize",
        }}
      >
        {currentMonth.format("MMMM YYYY")}
      </div>

      <button
        type="button"
        onClick={() =>
          onMonthChange(
            currentMonth.add(1, "month"),
          )
        }
        style={{
          border: "none",
          background: "transparent",
          fontSize: "28px",
          cursor: "pointer",
          lineHeight: 1,
        }}
      >
        ›
      </button>
    </div>
  );
}

export default function Calendar({
  availableDays,
  bookedDays,
}: CalendarProps) {
  const dispatch = useAppDispatch();

  const value = useAppSelector(
    (state) =>
      state.appointment.calendar.selectedDate,
  );

  const ServerDay = createServerDay(
    availableDays,
    bookedDays,
  );

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
      >
        <DateCalendar
          views={["day"]}
          openTo="day"
          showDaysOutsideCurrentMonth
          dayOfWeekFormatter={(date) =>
            date.format("dd")
          }

          value={
            value
              ? dayjs(value)
              : null
          }

          onMonthChange={(value: Dayjs) => {
            dispatch(setDate(null));

            dispatch(
              setQuery({
                month: value.month() + 1,
                year: value.year(),
              }),
            );
          }}

          onChange={(value) => {
            if (!value) return;

            dispatch(
              setDate(
                value.format("YYYY-MM-DD"),
              ),
            );
          }}

          shouldDisableDate={(day) => {
            return (
              day.isBefore(dayjs(), "day") ||
              !availableDays.includes(
                day.date(),
              )
            );
          }}

          slots={{
            day: ServerDay,
            calendarHeader:
              CustomCalendarHeader,
          }}
        />
      </LocalizationProvider>
    </div>
  );
}