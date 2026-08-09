import type { AppointmentFormData } from "@/types/appointmentFormData";
import { Input } from "../input/Input";
import { formValidation } from "@/features/auth/model/form.validation";
import { useFormContext } from "react-hook-form";

import { useAppDispatch, useAppSelector } from "@/app/store/hook";
import { Select } from "../select/Select";
import { setDoctor, setTime, setTreatment } from "@/features/appointments/appointmentsSlice";
import { FormDatePicker } from "@/pages/Appointments/components/FormDataPicker/FormDataPicker";
import { TextArea } from "../textArea/TextArea";

export const AppointmentFormFields = ({ type }) => {
  const { doctors } = useAppSelector(state => state.doctor)
  const { treatments } = useAppSelector(state => state.appointment)
  const {availableDays, availableTime} = useAppSelector(state =>state.appointment.calendar)
  const dispatch = useAppDispatch() 

  const {
    control,
    setValue,
      register,
      formState: { errors },
    } = useFormContext<AppointmentFormData>();
  return (<>
    <p className="mb-[24px] text-xs text-[#6B7280]">
          PERSONAL INFO
        </p>
    <div className="flex gap-4 mb-[16px]">
    
    <Input
      inputClassName="h-[44px]"
              className="flex-1"
              name="firstName"
              label="First name *"
              type="text"
              placeholder="First, select a user."
              register={register}
              rules={formValidation.name}
              error={errors.firstName?.message}
              readOnly={type === "create"}
            />
  
    <Input
      inputClassName="h-[44px]"
              className="flex-1"
              name="lastName"
              label="Last name *"
              type="text"
              placeholder="First, select a user."
              register={register}
              rules={formValidation.name}
              error={errors.lastName?.message}
              readOnly={type === "create"}
            />
  </div>
   
    <Input
      inputClassName="h-[44px] mb-[32px]"
          name="phoneNumber"
          label="Phone *"
          type="tel"
          placeholder="+38 (0XX) XXX-XXXX"
          register={register}
          rules={formValidation.phone}
          error={errors.phoneNumber?.message}
    />
     <p className="mb-[24px] text-xs text-[#6B7280]">
          APPOINTMENT
    </p>
    
       <div className="flex gap-4 mb-[16px]">
                <Select
                  className="flex-1"
                  name="doctor"
                  label="Doctor *"
                  placeholder="select a doctor"
          options={doctors.map((doctor) => ({
    value: String(doctor.id),
    label: `Dr. ${doctor.firstName} ${doctor.lastName}`,
  }))}
  onChange={(id) => {
    const doctor = doctors.find((d) => String(d.id) === id);

    if (doctor) {
      dispatch(setDoctor(doctor));
    }
  }}
                  control={control}
                  rules={formValidation.doctor}
                  error={errors.doctor?.message}
        />
          
        
           <Select
                  className="flex-1"
                  name="treatments"
                  label="Treatments *"
                  placeholder="Choose Treatments"
          options={treatments.map((treatment) => ({
             value: String(treatment.id),
             label: `${treatment.treatment} - ${treatment.price.slice(0,-3)}$ `,
           }))}
                 onChange={(value) => {
                   dispatch(setTreatment(value))
                    
               }}
                  control={control}
                  rules={formValidation.treatments}
                  error={errors.treatments?.message}
        />       
            
      </div>
        <div className="flex  gap-4 mb-[16px]">
     
      <FormDatePicker
        setValue = {setValue}
  name="appointmentDate"
  label="Date*"
  control={control}
  error={errors.appointmentDate?.message}
  availableDays={availableDays}
      />
      <Select
                  className="flex-1"
                  name="appointmentTime"
                  label="Time *"
                  placeholder="Choose Time"
        options={availableTime.map((time) => ({
           disabled: time.status === "booked",
             value: String(time.time),
             label: `${time.time.slice(0,-3)}  `,
           }))}
                 onChange={(value) => {
                   dispatch(setTime(value))
                    
               }}
                  control={control}
                  rules={formValidation.date}
                  error={errors.appointmentTime?.message}
        />
      </div>
     <TextArea
  name="notes"
        label="Notes"
        placeholder="Any additional notes for this appointment"
      register={register}
      rules={formValidation.notes}
  error={errors.notes?.message}
/>
    
  </>)
}