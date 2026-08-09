
import { TfiAlert } from "react-icons/tfi";
export const statusOptions = [
  {
    value: "scheduled",
    label: "Scheduled",
    description: "Appointment is booked and pending confirmation",
    color: "bg-[#DBEAFE]",
    textColor:"text-[#1E40AF]",
    disabled: true,
  },
  {
    value: "confirmed",
    label: "Confirmed",
    description: "Patient has confirmed their visit",
    color: "bg-[#DCFCE7]",
    textColor:"text-[#115E59]"
  },
  {
    value: "completed",
    label: "Completed",
    description: "Visit is done and recorded",
    color: "bg-[#4ADE80]",
    textColor:"text-[#115E59]"
  },
  {
    value: "no_show",
    label: "No-show",
    description: "Patient did not arrive - slot will be free",
    color: "bg-[#FFEDD5]",
    textColor:"text-[#C2410C]"
  },
  {
    value: "cancelled",
    label: "Cancelled",
    description: "Appointment cancelled by patient or clinic",
    color: "bg-[#FEE2E2]",
    icon: <TfiAlert />,
    textColor:"text-[#991B1B]"
  },
];