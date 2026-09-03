
import type { ReactElement } from "react";
import { TfiAlert } from "react-icons/tfi";
export type StatusOptions = {
  value: string;
  label: string;
  description: string;
  color: string;
  textColor: string;
  disabled?: boolean;
  icon?: ReactElement;
}
export const statusOptions:StatusOptions[] = [
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
    color: "bg-[#E5E7EB]",
    textColor:"text-[#1F2937]"
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