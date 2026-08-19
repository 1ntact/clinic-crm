
import { PiCalendarCheckLight } from "react-icons/pi";
import { PiVaultLight } from "react-icons/pi";
import { TbAlertOctagon } from "react-icons/tb";
import { PiStethoscope } from "react-icons/pi";
type PatientDetailsCardKey =
  | "appointments"
  | "balance"
  | "noShow"
  | "hygiene";

type Card = {
  key: PatientDetailsCardKey;
  title: string;
  icon: React.ElementType;
  iconClass: string;
  value: number;
  change: number;
  
};

export const detailsPatientCardStatistics: Card[] = [
    {key: 'appointments',
      title: "APPOINTMENTS",
      value: 0,
      change:0,
  
      icon:PiCalendarCheckLight,
      iconClass: "bg-blue-100 text-blue-600",
    },
    { key: 'balance',
      title: "BALANCE",
      value: 200,
      change: 5,
    
      icon: PiVaultLight,
      iconClass: "bg-green-100 text-green-600",
    },
    {key: 'noShow',
      title: "NO-SHOW",
      value: 0,
      change: 0,
     
      icon: TbAlertOctagon,
      iconClass: "bg-orange-100 text-orange-600",
    },
    {key: 'hygiene',
      title: "HYGIENE",
      value: 0,
      change:0,
      
    
      icon: PiStethoscope,
      iconClass: "bg-purple-100 text-purple-600",
    },
  ];