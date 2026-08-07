import { useAppDispatch, useAppSelector } from "@/app/store/hook";
import { errorToast, successToast } from "@/components/pushAppMessage/PushApp";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Search } from "@/components/search/Search";

import type { AppointmentFormData } from "@/types/appointmentFormData";
import { getAllPatientThunk } from "@/features/patients/thunk/getAllPacientThunk";
import { AppointmentFormFields } from "@/components/formField/AppointmentFormFields";
import { createAppointmentThunk } from "./thunk/createAppointmentThunk";
import { getAppointmentsThunk } from "./thunk/getAppointmentsThunk";
import { getAvailableTimeSlotsThunk } from "./thunk/getAvailableSlots";

export const AppointmentCreateForm: React.FC = () => {
  const methods = useForm<AppointmentFormData>();
  const { reset, setValue, handleSubmit } = methods;
  const [selectedUser, setSelectedUser] = useState(null);
  const dispatch = useAppDispatch();
  const { patients, loading } = useAppSelector((state) => state.patient);
  const {appointmentsQuery} = useAppSelector((state)=>state.appointment)
const {selectedDoctor,selectedDate,selectedSlotsTime,selectedTreatment} = useAppSelector(
    (state) => state.appointment.calendar
  );
 

  useEffect(() => {
    if (selectedDoctor) {
      setValue("doctor", String(selectedDoctor.id));
      setValue("appointmentDate", selectedDate)
      setValue("appointmentTime",selectedSlotsTime)
  }
    if (!selectedUser) return;
    setValue("firstName", selectedUser.firstName);
    setValue("lastName", selectedUser.lastName);
    setValue("phoneNumber", selectedUser.phoneNumber);
    
    
}, [selectedUser, selectedDoctor, setValue]);

   const onSubmit = async () => {
    if (!selectedUser) {
      return;
    }

    try {
      await dispatch(createAppointmentThunk({
        patientId: selectedUser.id,
        doctorId: selectedDoctor.id,
        treatmentId: selectedTreatment,
        appointmentDate: selectedDate,
        appointmentTime: selectedSlotsTime,
        notes:'',
        duration: 30,
        
        
        
      
      })).unwrap();

      await dispatch(getAppointmentsThunk(appointmentsQuery)).unwrap()
      await dispatch(getAvailableTimeSlotsThunk({
        doctorId: selectedDoctor.id,
        date: selectedDate,
      }))

      reset();

      successToast(
        <>
          Appointments created successfully
          <br />
          For{selectedUser.firstName} {selectedUser.lastName}
        </>,
      );
    } catch (e) {
      errorToast(e as string);
    }
  };

  return (
    <>
      {" "}
      {/* {loading? (
          <Loader />
        ) : ( */}
      <div className="w-full">
        <section></section>
        <section className="mb-[24px]">
          <Search
            items={patients}
            placeholder="Find an pacient"
            loading={loading}
            onSearch={(value) =>
              dispatch(getAllPatientThunk({ search: value }))
            }
            selectedUser={setSelectedUser}
            onSelect={setSelectedUser}
            getKey={(user) => user.id}
            getValue={(user) => `${user.firstName} ${user.lastName}`}
            renderItem={(user) => (
              <>
                <div>
                  {user.firstName} {user.lastName}
                </div>
                <div>{user.email}</div>
              </>
            )}
          />
        </section>

        <FormProvider {...methods}>
          <form
            id="appointment-create"
            className="flex flex-col gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            {<AppointmentFormFields type={"create"} />}
          </form>
        </FormProvider>
      </div>
      {/* )}{" "} */}
    </>
  );
};
