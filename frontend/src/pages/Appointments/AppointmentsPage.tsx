import { PageTitle } from "@/components/pageTitle/PageTitle";
import Calendar from "./components/Calendar";
import { AvalibleTime } from "./components/AvalibleTime/AvalibleTime";
import { useEffect, useState } from "react";
import { getAppointmentsDashboardThunk } from "@/features/appointments/thunk/getAppointmentsDashboardThunk";
import { useAppDispatch, useAppSelector } from "@/app/store/hook";
import { getAvailableTimeSlotsThunk } from "@/features/appointments/thunk/getAvailableSlots";
import { AsideMenu } from "@/components/asideMenu/AsideMenu";
import { ButtonPage } from "@/components/button/ButtonsPage";
import { getTreatmentsThunk } from "@/features/appointments/thunk/getTreatments";
import { AppointmentCreateForm } from "@/features/appointments/AppointmentCreateForm";
import { getAppointmentsThunk } from "@/features/appointments/thunk/getAppointmentsThunk";
import { Loader } from "@/components/loader/Loader";
import { Table } from "@/components/table/Table";
import { Th } from "@/components/table/Th";
import { Td } from "@/components/table/Td";
import { UserContacts } from "@/components/userContacts/UserContacts";
import { HiOutlineEllipsisVertical } from "react-icons/hi2";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { ActionModal } from "./components/ActionModal/ActionModal";
import { setSelectedAppointment } from "@/features/appointments/appointmentsSlice";
import { ChangeStatusModal } from "./components/ChangeStatusModal/ChangeStatusModal";
import { statusOptions } from "@/features/appointments/model/statusAppointments";



export const AppointmentsPage = () => {
  const [aside, setOpenAside] = useState(false);
  const [status, setOpenChangeStatus] = useState(false)
 
  const dispatch = useAppDispatch();
  const {appointments, selectedAppointment} = useAppSelector(state=>state.appointment)
  const {
    query, selectedSpecialization, selectedDoctor, selectedDate,
    availableDays, fullyBookedDays, availableTime, availableTimeCount,
    fullyBookedTimeCount, loading
  } = useAppSelector((state) => state.appointment.calendar);
  const {loading:appointmentLoading, appointmentsQuery} = useAppSelector((state) => state.appointment);
  const { doctors } = useAppSelector((state) => state.doctor);

  
  useEffect(() => {
    const appointmentsDashboard = async () => {
      try {
        
        await dispatch(
          getAppointmentsDashboardThunk({
            month: query.month,
            year: query.year,
          }),
        ).unwrap();
        await dispatch(getTreatmentsThunk(true))
        await dispatch(getAppointmentsThunk(appointmentsQuery))
       
      } catch (error) {
        console.log(error);
      }
    };
    appointmentsDashboard();
  }, [dispatch, query,appointmentsQuery]);

  useEffect(() => {
    if (!selectedDoctor || !selectedDate || !selectedSpecialization ) return;

    dispatch(
      getAvailableTimeSlotsThunk({
        doctorId: selectedDoctor.id,
        date: selectedDate,
      }),
    );
  }, [selectedDoctor, selectedDate, selectedSpecialization, dispatch]);
  const handleAside = () => setOpenAside((prev) => !prev);
  dayjs.extend(utc);
  
  return (
    <>
      <PageTitle
        text="Reception Desk"
        description={`Todays appointments ${appointments.length}`}
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
            bookedCount={fullyBookedTimeCount}
            availableCount={availableTimeCount}
            loading={loading}
            handleAside={handleAside}
            doctors={doctors}
            selectedDoctorId={selectedDoctor}
            selectedSpecialization={selectedSpecialization}
            availableTime={availableTime}
            selectedDate = {selectedDate}
          />
          
        } </section>
      
      {selectedAppointment && status &&
        <ChangeStatusModal
        status={statusOptions}
       appointment = {selectedAppointment}
        title={'UpdateStatus'}
        onCancel = {()=>{setOpenChangeStatus(false)}}
        isOpen={status}
      />
      }
        {aside && (
          <AsideMenu
            handleAside={handleAside}
            content={<AppointmentCreateForm  />}
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
                   form="appointment-create"
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
      
    
       {appointmentLoading ? (
              <Loader />
            ) : (
              <div className="w-full h-full p-[24px]">
                <Table>
                  <thead>
                    <tr>
                      <Th>ID</Th>
                      <Th>PACIENT/DOCTOR</Th>
                      <Th>TIME</Th>
                      <Th>PRISE</Th>
                      <Th>TREATMENT</Th>
                  <Th>STATUS</Th>
                  <Th>ACTION</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment) => ( 
                      <tr
                        key={appointment.id}
                        // onClick={() => {
                        //   navigate(`/doctors/${doctor.id}`);
                        // }}
                        className=" h-[76px]  hover:bg-[#DCFCE7] transition-colors"
                      >
                        <Td>{`#${appointment.id}`}</Td>
      
                        <Td>
                          <UserContacts
                            avatar = {'favicon.png'}
                            firstName={appointment.patientFirstName}
                            lastName={appointment.patientLastName}
                            phone={`Dr.${appointment.doctorFirstName} ${appointment.doctorLastName}`}
                          />
                        </Td>
      
                        <Td>{ <>
                          <div>{dayjs(appointment.dateTime).format("YYYY-MM-DD")}</div>
  <div>{dayjs.utc(appointment.dateTime).format("HH:mm")}</div></> }</Td>
      
                        <Td>{appointment.treatmentPrice}</Td>
      
                        <Td>{appointment.treatment}</Td>
      
                        <Td>{appointment.status}</Td>
                        <Td className="relative  "  >{<>
                          <HiOutlineEllipsisVertical className="cursor-pointer" onClick={() => {
                            dispatch(setSelectedAppointment(appointment))
                           
                          }
                           } />
                          {selectedAppointment && !status && selectedAppointment.id === appointment.id &&
                            
                            <ActionModal
                             onClose={() => {
   
    dispatch(setSelectedAppointment(null));
  }}
                              onEditStatus={()=>setOpenChangeStatus(true) }
                            onReschedule={()=>{}}/>} </>
                        }
                          
                        </Td>
                      </tr>
                    ))}
                   
                    </tbody>
                    
                  </Table>
                   {appointments.length === 0 && (
                      <p className="p-3 text-center text-gray-500">
                        Nothing found
                      </p>
                  )}
                
            {/* <Pagination
  page={appointmentsQuery.offset / appointmentsQuery.limit + 1}
  pageSize={appointmentsQuery.limit}
  total={appointments.length}
  onPageChange={(page) =>
    dispatch(
      setAppointmentsQuery({
        offset: (page - 1) * appointmentsQuery.limit,
      })
    )
  }
/> */}
              </div>
            )}
            
     
    </>
  );
};
