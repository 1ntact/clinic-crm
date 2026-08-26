import {  useMemo } from "react";
import dayjs, { type Dayjs } from "dayjs";

import {
  DateCalendar,
  DatePicker,
  type PickersCalendarHeaderProps,
} from "@mui/x-date-pickers";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import {
  PickerDay,
  type PickerDayProps,
} from "@mui/x-date-pickers/PickerDay";

import {
  setDate,
  setQuery,
} from "@/features/appointments/appointmentsSlice";

import {
  useAppDispatch,
  useAppSelector,
} from "@/app/store/hook";

type CalendarProps = {
  availableDays: number[];
  bookedDays: number[];
  selectedDate: string | null;

  variant?: "calendar" | "picker";

  onDateChange?: (date: string | null) => void;
  onMonthChange?: (date: Dayjs) => void;
};

/* =========================================================
   DAY
========================================================= */

function createServerDay(
  availableDays: number[],
  bookedDays: number[],
  backendMonth: number,
  backendYear: number,
) {
  return function ServerDay({
    day,
    sx,
    ...other
  }: PickerDayProps) {
    const dayNumber = day.date();

    const isBackendMonth =
      day.month() + 1 === backendMonth &&
      day.year() === backendYear;

    const isAvailable =
      isBackendMonth &&
      availableDays.includes(dayNumber);

    const isBooked =
      isBackendMonth &&
      bookedDays.includes(dayNumber);

    const isPast = day.isBefore(dayjs(), "day");

    return (
      <PickerDay
        {...other}
        day={day}
        sx={[
          {
            borderRadius: "8px",

            /* Available */
            ...(isAvailable && {
              backgroundColor: "#FFFFFF",
              color: "#1F2937",
            }),

            /* Fully booked */
            ...(isBooked && {
              backgroundColor: "#FEE2E2",
              color: "#9CA3AF",
            }),

            /* Past */
            ...(isPast && {
              backgroundColor: "#FFFFFF",
              color: "#9CA3AF",
            }),

            /* Today */
            "&.MuiPickersDay-today": {
              border: "2px solid #2563EB",
              backgroundColor: "#FFFFFF",
              color: "#1F2937",
            },

            /* Selected */
            "&.Mui-selected": {
              backgroundColor:
                "#1E3A8A !important",
              color: "#FFFFFF !important",
            },

            "&.Mui-selected:hover": {
              backgroundColor:
                "#1E3A8A !important",
            },
          },

          ...(Array.isArray(sx)
            ? sx
            : [sx]),
        ]}
      />
    );
  };
}

/* =========================================================
   HEADER
========================================================= */

function CustomCalendarHeader(
  props: PickersCalendarHeaderProps,
) {
  const {
    currentMonth,
    onMonthChange,
  } = props;

  const previousMonth =
    currentMonth.subtract(1, "month");

  const nextMonth =
    currentMonth.add(1, "month");

  return (
    <div
      className="flex items-center justify-between px-3 py-2"
    >
      <button
        type="button"
        onClick={() =>
          onMonthChange(previousMonth)
        }
        className="flex h-8 w-8 items-center justify-center border-none bg-transparent text-[28px] leading-none cursor-pointer"
        aria-label="Previous month"
      >
        ‹
      </button>

      <div className="text-[16px] font-semibold capitalize">
        {currentMonth.format("MMMM YYYY")}
      </div>

      <button
        type="button"
        onClick={() =>
          onMonthChange(nextMonth)
        }
        className="flex h-8 w-8 items-center justify-center border-none bg-transparent text-[28px] leading-none cursor-pointer"
        aria-label="Next month"
      >
        ›
      </button>
    </div>
  );
}

/* =========================================================
   CALENDAR
========================================================= */

export default function Calendar({
  availableDays,
  bookedDays,
  selectedDate,
  variant = "calendar",
  onDateChange,
  onMonthChange,
}: CalendarProps) {
  const dispatch = useAppDispatch();

  const {
    currentMonth,
    currentYears,
    query,
  } = useAppSelector(
    (state) => state.appointment.calendar,
  );

  

  /* =======================================================
     SELECTED DATE
  ======================================================= */

  const value = useMemo(() => {
    if (!selectedDate) {
      return null;
    }

    const parsedDate = dayjs(selectedDate);

    return parsedDate.isValid()
      ? parsedDate
      : null;
  }, [selectedDate]);

  /* =======================================================
     SERVER DAY
  ======================================================= */

  const ServerDay = useMemo(
    () =>
      createServerDay(
        availableDays,
        bookedDays,
        currentMonth,
        currentYears,
      ),
    [
      availableDays,
      bookedDays,
      currentMonth,
      currentYears,
    ],
  );

  /* =======================================================
     MONTH CHANGE
  ======================================================= */

  const handleMonthChange = (
    date: Dayjs,
  ) => {
    const month = date.month() + 1;
    const year = date.year();

    

   
    if (
      month === query.month &&
      year === query.year
    ) {
      console.log(
        "⛔ IGNORE — SAME QUERY MONTH",
      );

      return;
    }

   
    if (
      month === currentMonth &&
      year === currentYears &&
      (
        query.month !== currentMonth ||
        query.year !== currentYears
      )
    ) {
      console.log(
        "⛔ IGNORE — STALE BACKEND MONTH",
        {
          received: {
            month,
            year,
          },

          query: {
            month: query.month,
            year: query.year,
          },

          backend: {
            month: currentMonth,
            year: currentYears,
          },
        },
      );

      return;
    }

   

    
    dispatch(
      setQuery({
        month,
        year,
      }),
    );

   
    onMonthChange?.(date);
  };

  /* =======================================================
     DATE CHANGE
  ======================================================= */

  const handleDateChange = (
    date: Dayjs | null,
  ) => {
    const formattedDate = date
      ? date.format("YYYY-MM-DD")
      : null;

    

    
    dispatch(
      setDate(formattedDate),
    );

    onDateChange?.(formattedDate);
  };

  /* =======================================================
     DISABLE DATE
  ======================================================= */

  const shouldDisableDate = (
    day: Dayjs,
  ) => {
   
    const isBackendMonth =
      day.month() + 1 === currentMonth &&
      day.year() === currentYears;

    
    if (!isBackendMonth) {
      return true;
    }

    return !availableDays.includes(
      day.date(),
    );
  };

  /* =======================================================
     COMMON PROPS
  ======================================================= */

  const commonProps = {
    value,

    onChange: handleDateChange,

    onMonthChange:
      handleMonthChange,

    shouldDisableDate,

    slots: {
      day: ServerDay,
      calendarHeader:
        CustomCalendarHeader,
    },
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
    >
      {variant === "calendar" ? (
        <div
          className={`rounded-[8px] border bg-white p-3 shadow-sm ${
            selectedDate
              ? "border-gray-200"
              : "border-red-500"
          }`}
        >
          <DateCalendar
            {...commonProps}
            views={["day"]}
            openTo="day"
            showDaysOutsideCurrentMonth
            dayOfWeekFormatter={(date) =>
              date.format("dd")
            }
            sx={{
              "& .MuiDayCalendar-weekContainer":
                {
                  marginBottom: "8px",
                },
            }}
          />
        </div>
      ) : (
  <div className="w-1/2">
  <label  className="mb-[10px] block font-[Inter] font-medium text-[14px]">
    Date *
  </label>

  <DatePicker
    {...commonProps}
    format="DD.MM.YYYY"
    slotProps={{
      textField: {
        fullWidth: true,
        sx: {
          "& .MuiPickersInputBase-root": {
            height: "44px",
            borderRadius: "8px",
            width: "100%",
            padding: "8px",
          },

          "& .MuiPickersInputBase-sectionsContainer": {
            padding: "0",
            flex: 1,
          },

          "& .MuiInputAdornment-root": {
            marginLeft: "0px",
          },

          "& .MuiIconButton-root": {
            padding: "8px",
          },
        },
      },
    }}
  />
</div>
      )}
    </LocalizationProvider>
  );
}