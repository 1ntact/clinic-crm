import { PageTitle } from "@/components/pageTitle/PageTitle";
import Calendar from "./components/Calendar";
import { AvalibleTime } from "./components/AvalibleTime/AvalibleTime";
import { useEffect, useState } from "react";
import { getAppointmentsDashboardThunk } from "@/features/appointments/thunk/getAppointmentsDashboardThunk";
import { useAppDispatch, useAppSelector } from "@/app/store/hook";
import { getAvailableTimeSlotsThunk } from "@/features/appointments/thunk/getAvailableSlots";
import { AsideMenu } from "@/components/asideMenu/AsideMenu";
import { ButtonPage } from "@/components/button/ButtonsPage";
import { DoctorCreteForm } from "@/features/doctors/DoctorCreateForm";

export const AppointmentsPage = () => {
  const [aside, setOpenAside] = useState(false);
  const dispatch = useAppDispatch()
  const { availableDays, fullyBookedDays,availableTime } = useAppSelector((state) => state.appointment.calendar)
  const {query, selectedSpecialization,selectedDoctorId, selectedDate} = useAppSelector((state)=>state.appointment.calendar)
const {doctors} = useAppSelector((state)=>state.doctor)
 
  useEffect(() => {
    
      const appointmentsDashboard = async () => {
        try {
          await dispatch(getAppointmentsDashboardThunk({
            month:query.month,
            year:query.year
        })).unwrap();
          
        } catch (error) {
          console.log(error)
        }
      }
      appointmentsDashboard()
    
    
  
  }, [dispatch, query]);
 
  useEffect(() => {
  if (!selectedDoctorId || !selectedDate) return;

  dispatch(getAvailableTimeSlotsThunk({
      doctorId: selectedDoctorId,
      date: selectedDate,
    })
  );
  }, [selectedDoctorId, selectedDate, dispatch]);
  const handleAside = () => setOpenAside((prev) => !prev);
  return (
    <>
      <PageTitle
        text="Reception Desk"
        description={"14 apointments jul 3,2026"}
      />

      <section className="flex gap-[16px]">
        <div className="h-[348px] w-[348px]">
          {availableDays &&
            <Calendar
            availableDays={availableDays}
            bookedDays={fullyBookedDays}
          />}
        </div>
        {<AvalibleTime 
          handleAside={handleAside}
            doctors={doctors}
  selectedDoctorId={selectedDoctorId}
          selectedSpecialization={selectedSpecialization}
          availableTime={availableTime}
        
        />}
        {aside && (
                <AsideMenu
                  handleAside={handleAside}
                  content={<DoctorCreteForm handleAside={handleAside} />}
                  footer={   <>
                        <ButtonPage className="flex-1 bg-[#FFFFFF] " onClick={handleAside}>
                            <span className="text-[#172554]">Cancel</span>
                        </ButtonPage>
        
                        <ButtonPage type="submit" form="doctor-create" className="flex-1">
                          Send an invitation
                        </ButtonPage>
                      </>}
                  title={"ADD NEW DOCTOR"}
                  description={"Fill in the details below"}
                />
              )}
      </section>
    </>
  );
};
