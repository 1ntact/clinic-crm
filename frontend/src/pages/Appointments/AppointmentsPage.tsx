import { PageTitle } from "@/components/pageTitle/PageTitle";
import Calendar from "./components/Calendar";
import { AvalibleTime } from "./components/AvalibleTime/AvalibleTime";
import { useEffect, useState } from "react";
import { getAppointmentsDashboardThunk } from "@/features/appointments/thunk/getAppointmentsDashboardThunk";
import { useAppDispatch, useAppSelector } from "@/app/store/hook";
import { getAvailableTimeSlotsThunk } from "@/features/appointments/thunk/getAvailableSlots";
import { AsideMenu } from "@/components/asideMenu/AsideMenu";
import { ButtonPage } from "@/components/button/ButtonsPage";

import { AppointmentCreateForm } from "@/features/appointments/thunk/AppointmentCreateForm";
import { getTreatmentsThunk } from "@/features/appointments/thunk/getTreatments";

export const AppointmentsPage = () => {
  const [aside, setOpenAside] = useState(false);
  const dispatch = useAppDispatch();
  const { availableDays, fullyBookedDays, availableTime ,loading} = useAppSelector(
    (state) => state.appointment.calendar,
  );
  const {
    query,
    selectedSpecialization,
     selectedDoctor,
    selectedDate,
  } = useAppSelector((state) => state.appointment.calendar);
  const { doctors } = useAppSelector((state) => state.doctor);

  useEffect(() => {
    const appointmentsDashboard = async () => {
      try {
        console.log("query changed", query);
        await dispatch(
          getAppointmentsDashboardThunk({
            month: query.month,
            year: query.year,
          }),
        ).unwrap();
        await dispatch(getTreatmentsThunk(true))
       
      } catch (error) {
        console.log(error);
      }
    };
    appointmentsDashboard();
  }, [dispatch, query]);

  useEffect(() => {
    if (!selectedDoctor || !selectedDate || !selectedSpecialization) return;

    dispatch(
      getAvailableTimeSlotsThunk({
        doctorId: selectedDoctor.id,
        date: selectedDate,
      }),
    );
  }, [selectedDoctor, selectedDate, selectedSpecialization, dispatch]);
  const handleAside = () => setOpenAside((prev) => !prev);
  return (
    <>
      <PageTitle
        text="Reception Desk"
        description={"14 apointments jul 3,2026"}
      />

      <section className="flex gap-[16px]">
        <div className="h-[348px] w-[348px]">
          {availableDays && (
            <Calendar
              availableDays={availableDays}
              bookedDays={fullyBookedDays}
            />
          )}
        </div>
        {
          <AvalibleTime
            loading={loading}
            handleAside={handleAside}
            doctors={doctors}
            selectedDoctorId={selectedDoctor}
            selectedSpecialization={selectedSpecialization}
            availableTime={availableTime}
            selectedDate = {selectedDate}
          />
          
        } </section>
        {aside && (
          <AsideMenu
            handleAside={handleAside}
            content={<AppointmentCreateForm handleAside={handleAside} />}
            footer={
              <>
                <ButtonPage
                  className="flex-1 bg-[#FFFFFF] "
                  onClick={handleAside}
                >
                  <span className="text-[#172554]">Cancel</span>
                </ButtonPage>

                <ButtonPage
                  type="submit"
                  form="doctor-create"
                  className="flex-1"
                >
                  Creaate appointment
                </ButtonPage>
              </>
            }
            title={"ADD APPOINTMENT"}
            description={"Fill in the details below"}
          />
        )}
     
    </>
  );
};
