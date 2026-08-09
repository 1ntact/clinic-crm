

type CalendarView = 'day' | 'week' | 'month';

export const CalendarToolbar = () => {
  return(<><div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
  <button
    type="button"
    onClick={() => setCalendarView('month')}
    className={
      calendarView === 'month'
        ? 'rounded-md bg-white px-3 py-1 shadow'
        : 'px-3 py-1'
    }
  >
    Month
  </button>

  <button
    type="button"
    onClick={() => setCalendarView('week')}
    className={
      calendarView === 'week'
        ? 'rounded-md bg-white px-3 py-1 shadow'
        : 'px-3 py-1'
    }
  >
    Week
  </button>

  <button
    type="button"
    onClick={() => setCalendarView('day')}
    className={
      calendarView === 'day'
        ? 'rounded-md bg-white px-3 py-1 shadow'
        : 'px-3 py-1'
    }
  >
    Day
  </button>
</div></>)
}

