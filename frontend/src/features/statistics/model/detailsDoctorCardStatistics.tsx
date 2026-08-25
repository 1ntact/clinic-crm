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
  
   prefix?:string,
};

export const detailsDoctorCardStatistics: Card[] = [
    {key: 'patients',
      title: "PATIENTS",
     
    
     
  
      icon:PiUsersThin,
      iconClass: "bg-blue-100 text-blue-600",
    },
    { key: 'completedVisits',
      title: "COMPLETED VISITS",
     
    prefix:'+$',
      icon: PiCheckCircleLight,
      iconClass: "bg-green-100 text-green-600",
    },
    {key: 'cancelledVisits',
      title: "CANCELLED VISITS",
      
     
      icon: PiUserMinusLight,
      iconClass: "bg-orange-100 text-orange-600",
    },
    {key: 'noShowVisits',
      title: "NO-SHOW",
     
      
    
      icon: PiCalendarMinusLight,
      iconClass: "bg-purple-100 text-purple-600",
    },
  ];