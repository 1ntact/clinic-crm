import {
FiUserX,
  FiUsers,
  
} from "react-icons/fi"; 
import { AiOutlineUserAdd } from "react-icons/ai";
import { LuCalendarHeart } from "react-icons/lu";
type PatientsManagementCardKey =
  | "totalPatients"
  | "newPatients"
  | "returningPatients"
  | "inactivePatients";

type Card = {
  key: PatientsManagementCardKey;
  title: string;
  icon: React.ElementType;
  iconClass: string;
  value: number;
  change: number;
};

export const patientManagmentCard: Card[] = [
    {key: 'totalPatients',
      title: "TOTAL PATIENTS",
      value: 0,
      change:0,
      
      icon: FiUsers,
      iconClass: "bg-blue-100 text-blue-600",
    },
    { key: 'newPatients',
      title: "NEW PATIENTS",
      value: 0,
      change: 0,
    
      icon: AiOutlineUserAdd,
      iconClass: "bg-green-100 text-green-600",
    },
    {key: 'returningPatients',
      title: "RETURNING PATIENTS",
      value: 0,
      change: 0,
     
      icon: LuCalendarHeart,
      iconClass: "bg-orange-100 text-orange-600",
    },
    {key: 'inactivePatients',
      title: " INACTIVE PATIENTS",
      value: 0,
      change: 0,
    
      icon: FiUserX,
      iconClass: "bg-purple-100 text-purple-600",
    },
  ];