import { useAppDispatch, useAppSelector } from "@/app/store/hook"
import { ButtonPage } from "@/components/button/ButtonsPage"
import { BaseSelect } from "@/components/select/BaseSelect"
import { setDoctor, setSpecialization, setTime } from "@/features/appointments/appointmentsSlice"
import { specializations } from "@/features/doctors/model/specialties"
import { getAllDoctorsThunk } from "@/features/doctors/thunk/getAllDoctorsThunk"
import { useEffect } from "react"



export const AvalibleTime = ({handleAside,availableTime ,selectedSpecialization,selectedDoctorId, doctors}) => {
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
    <div className="bg-amber-600 w-full h-[361px]">
      <h1>AVALIBLE TIME SLOTS</h1>
      <span>20 Aug 2026 - 19 available · 1 booked </span>
      
      <BaseSelect
        value={selectedSpecialization}
        options={specializations}
        onChange={(value) => {
          dispatch(setSpecialization(value))
          
           
        }} />
      
        <BaseSelect
        value={selectedDoctorId}
         options={doctors.map((doctor) => ({
    value: String(doctor.id),
    label: `${doctor.firstName} ${doctor.lastName}`,
  }))}
        onChange={(value) => {
          dispatch(setDoctor(value))
           
      }}/>
      
     <div className="grid grid-cols-7 gap-2">
  {availableTime &&  availableTime.map((slot) => (
    <ButtonPage
      
      key={slot.time}
      className="h-10 rounded border"
      onClick={() => {
        handleAside()
        dispatch(setTime(slot.time))
      }}
    >
      {slot.time}
    </ButtonPage>
  ))}
</div>
      
    </div>

  </>)
}