import { useAppDispatch } from "@/app/store/hook"
import { ButtonPage } from "@/components/button/ButtonsPage"
import { Loader } from "@/components/loader/Loader"
import { BaseSelect } from "@/components/select/BaseSelect"
import { setDoctor, setSpecialization, setTime } from "@/features/appointments/appointmentsSlice"
import { specializations } from "@/features/doctors/model/specialties"
import { getAllDoctorsThunk } from "@/features/doctors/thunk/getAllDoctorsThunk"
import type { Doctor } from "@/types/doctor"
import { useEffect } from "react"


type Props = {
  selectedDate: string | null;
  loading: boolean;
  handleAside: () => void;
  availableTime: string[];
  selectedSpecialization: string | null;
  selectedDoctorId: Doctor | null;
  doctors: Doctor[];
  bookedCount: number;
  availableCount: number;
};
export const AvalibleTime:React.FC<Props> = ({
  selectedDate,
  loading,
  handleAside,
  availableTime,
  selectedSpecialization,
  selectedDoctorId,
  doctors,bookedCount,availableCount }) => {
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
   { <span>{`20 Aug 2026 - ${availableCount} available · ${bookedCount} booked`} </span>}
      </div>
      
      
      <div className="flex justify-between mb-[45px]">
        <div>
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
  options={doctors.map((doctor:Doctor) => ({
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
      <div className="flex items-center gap-6 text-sm">
  <div className="flex items-center gap-2">
    <span className="h-2.5 w-2.5 rounded-full bg-blue-600"></span>
    <span>Free</span>
  </div>

  <div className="flex items-center gap-2">
    <span className="h-2.5 w-2.5 rounded-full bg-gray-400"></span>
    <span>Booked</span>
  </div>
</div>
      </div>
     
      
      {loading ? <Loader /> : (<div className="grid grid-cols-7 gap-2 mb-[45px]">
        {availableTime && availableTime.map((slot) => (
          <ButtonPage
      disabled={!selectedDate || slot.status ==='booked' || slot.status === 'expired'}
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