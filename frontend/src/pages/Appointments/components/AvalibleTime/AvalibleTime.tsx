import { useAppDispatch, useAppSelector } from "@/app/store/hook"
import { ButtonPage } from "@/components/button/ButtonsPage"
import { Loader } from "@/components/loader/Loader"
import { BaseSelect } from "@/components/select/BaseSelect"
import { setDoctor, setSpecialization, setTime } from "@/features/appointments/appointmentsSlice"
import { specializations } from "@/features/doctors/model/specialties"
import { getAllDoctorsThunk } from "@/features/doctors/thunk/getAllDoctorsThunk"
import { useEffect } from "react"



export const AvalibleTime = ({selectedDate,loading,handleAside,availableTime ,selectedSpecialization,selectedDoctorId, doctors}) => {
  const dispatch = useAppDispatch()
useEffect(() => {
  if (!selectedSpecialization) return;
  dispatch(
    getAllDoctorsThunk({
      specialization: selectedSpecialization,
    })
  );
}, [selectedSpecialization, dispatch]);
 
  return (<>
    
    <div className=" flex flex-col bg-[#FFFFFF] w-full h-[361px] rounded-[8px] px-[24px] py-[16px]">
     
      <div className="mb-[24px]">
        <h1>AVALIBLE TIME SLOTS</h1>
      <span>20 Aug 2026 - 19 available · 1 booked </span>
      </div>
      
      
      <div className="flex mb-[45px]">
        <BaseSelect
          name={"specializationSelect"}
          classNames="mr-[8px]"
        placeholder={"Select a speciality"}
        value={selectedSpecialization ?? ""}
        options={specializations}
        onChange={(value) => {
          dispatch(setSpecialization(value))
          setDoctor(null)
           
        }} />
      
        <BaseSelect
          name={'doctorSelect'}
        placeholder={"Select a doctor"}
  value={selectedDoctorId?.id ?? ""}
  options={doctors.map((doctor) => ({
    value: String(doctor.id),
    label: `${doctor.firstName} ${doctor.lastName}`,
  }))}
  onChange={(value) => {
    const doctor = doctors.find((d) => String(d.id) === value);

    if (!doctor) return;

    dispatch(setDoctor(doctor));
  }}
/>
      </div>
     
      
      {loading ? <Loader /> : (<div className="grid grid-cols-7 gap-2 mb-[45px]">
        {availableTime && availableTime.map((slot) => (
          <ButtonPage
      disabled={!selectedDate }
            key={slot.time}
            className="h-[36px] text-[#2563EB]"
            onClick={() => {
              handleAside()
              dispatch(setTime(slot.time))
            }}
          >
            {slot.time.slice(0, -3)}
          </ButtonPage>
        ))}
      </div>)}
      <span>Click a free slot to schedule a new appointment</span>
    </div>

  </>)
}