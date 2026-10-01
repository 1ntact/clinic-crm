import type { AppointmentOutcomesData, WeeklyRevenueData } from "./statisticsSlice";


export const mockWeeklyRevenue: WeeklyRevenueData = {
  total: 12450,
  change: 12.5,
  data: [
    {
      day: "Mon",
      actual: 1500,
      expected: 0,
      total: 1500,
      isPeakDay: false,
    },
    {
      day: "Tue",
      actual: 2100,
      expected: 0,
      total: 2100,
      isPeakDay: false,
    },
    {
      day: "Wed",
      actual: 1650,
      expected: 1800,
      total: 1650,
      isPeakDay: false,
    },
    {
      day: "Thu",
      actual: 2300,
      expected: 0,
      total: 2300,
      isPeakDay: true,
    },
    {
      day: "Fri",
      actual: 1900,
      expected: 0,
      total: 1900,
      isPeakDay: false,
    },
    {
      day: "Sat",
      actual: 1800,
      expected: 0,
      total: 1800,
      isPeakDay: false,
    },
    {
      day: "Sun",
      actual: 1200,
      expected: 0,
      total: 1200,
      isPeakDay: false,
    },
  ],
};

export const mockAppointmentOutcomes: AppointmentOutcomesData = {
  total: 120,
  completed: 82,
  noShow: 12,
  cancelled: 26,
};