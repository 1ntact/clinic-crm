import { PageTitle } from "@/components/pageTitle/PageTitle";
import Calendar from "./components/Calendar";
import { AvalibleTime } from "./components/AvalibleTime/AvalibleTime";
import { useEffect } from "react";
import { getAppointmentsDashboardThunk } from "@/features/appointments/thunk/getAppointmentsDashboardThunk";
import { useAppDispatch, useAppSelector } from "@/app/store/hook";

export const AppointmentsPage = () => {
  const dispatch = useAppDispatch()
  const {availableDays, fullyBookedDays}= useAppSelector((state)=>state.appointment.calendar)
console.log(availableDays, fullyBookedDays)
  useEffect(() => {
    
      const appointmentsDashboard = async () => {
        try {
          dispatch(await getAppointmentsDashboardThunk()).unwrap();
          
        } catch (error) {
          console.log(error)
        }
      }
      appointmentsDashboard()
    
    
  
  }, [dispatch]);
  return (
    <>
      <PageTitle
        text="Reception Desk"
        description={"14 apointments jul 3,2026"}
      />

      <section className="flex gap-[16px]">
        <div className="h-[348px] w-[348px]">
        { availableDays && <Calendar
            availableDays={availableDays}
            bookedDays={fullyBookedDays}
          />}
        </div>
        <AvalibleTime />
      </section>
    </>
  );
};
