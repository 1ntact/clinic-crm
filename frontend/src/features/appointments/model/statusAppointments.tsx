
import { TfiAlert } from "react-icons/tfi";
export const statusOptions = [
  {
    value: "scheduled",
    label: "Scheduled",
    description: "Appointment is booked and pending confirmation",
    color: "bg-gray-400",
    disabled: true,
  },
  {
    value: "confirmed",
    label: "Confirmed",
    description: "Patient has confirmed their visit",
    color: "bg-green-500",
  },
  {
    value: "completed",
    label: "Completed",
    description: "Visit is done and recorded",
    color: "bg-gray-400",
  },
  {
    value: "no_show",
    label: "No-show",
    description: "Patient did not arrive - slot will be free",
    color: "bg-orange-400",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    description: "Appointment cancelled by patient or clinic",
    color: "bg-red-500",
    icon:<TfiAlert/> ,
  },
];