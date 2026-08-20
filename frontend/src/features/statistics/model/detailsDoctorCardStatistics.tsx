import {  PiUsersThin } from "react-icons/pi";
import { PiCheckCircleLight } from "react-icons/pi";
import { PiUserMinusLight } from "react-icons/pi";
import { PiCalendarMinusLight } from "react-icons/pi";
type DoctorDetailsCardKey =
  | "patients"
  | "completedVisits"
  | "cancelledVisits"
  | "noShowVisits";

type Card = {
  key: DoctorDetailsCardKey;
  title: string;
  icon: React.ElementType;
  iconClass: string;
  value: number;
  change: number;
   prefix?:string,
};

export const detailsDoctorCardStatistics: Card[] = [
    {key: 'patients',
      title: "PATIENTS",
      value: 0,
    change: 0,
     
  
      icon:PiUsersThin,
      iconClass: "bg-blue-100 text-blue-600",
    },
    { key: 'completedVisits',
      title: "COMPLETED VISITS",
      value: 200,
      change: 5,
    prefix:'+$',
      icon: PiCheckCircleLight,
      iconClass: "bg-green-100 text-green-600",
    },
    {key: 'cancelledVisits',
      title: "CANCELLED VISITS",
      value: 0,
      change: 0,
     
      icon: PiUserMinusLight,
      iconClass: "bg-orange-100 text-orange-600",
    },
    {key: 'noShowVisits',
      title: "NO-SHOW",
      value: 0,
      change:0,
      
    
      icon: PiCalendarMinusLight,
      iconClass: "bg-purple-100 text-purple-600",
    },
  ];