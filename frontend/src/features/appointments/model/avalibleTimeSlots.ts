export type AvailableTimeSlot = {
  time: string;
  status: "available" | "booked" | "expired";
}