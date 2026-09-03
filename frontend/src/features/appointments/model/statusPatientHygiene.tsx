

export type StatusHygieneOptions = {
  value: string;
  label: string;
  description: string;
  color: string;
  textColor: string;
  disabled?: boolean;
  
}
export const hygieneStatus:StatusHygieneOptions[] = [
  {
    value: "no_history",
    label: "no history",
    description: "Appointment is booked and pending confirmation",
    color: "bg-[#DBEAFE]",
    textColor:"text-[#1E40AF]",
    disabled: true,
  },
  {
    value: "up_to_date",
    label: "up to date",
    description: "Patient has confirmed their visit",
    color: "bg-[#DCFCE7]",
    textColor:"text-[#115E59]"
  },
  {
    value: "overdue",
    label: "overdue",
    description: "Visit is done and recorded",
    color: "bg-[#4ADE80]",
    textColor:"text-[#115E59]"
  },
 
];