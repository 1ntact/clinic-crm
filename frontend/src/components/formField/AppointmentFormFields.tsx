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
  console.log(availableTime)
  const {
    control,
      register,
      formState: { errors },
    } = useFormContext<AppointmentFormData>();
  return (<><div className="flex gap-4 mb-6">
            <Input
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
   <section>
        <Input
          name="phoneNumber"
          label="Phone *"
          type="tel"
          placeholder="+38 (0XX) XXX-XXXX"
          register={register}
          rules={formValidation.phone}
          error={errors.phoneNumber?.message}
      />
       <div className="flex gap-4">
                {<Select
                  className="flex-1"
                  name="doctor"
                  label="Doctor *"
                  placeholder="select a doctor"
          option={doctors.map((doctor) => ({
    value: String(doctor.id),
    label: `Dr. ${doctor.firstName} ${doctor.lastName}`,
  }))}
  onChange={(id) => {
    const doctor = doctors.find((d) => String(d.id) === id);

    if (doctor) {
      dispatch(setDoctor(doctor));
    }
  }}
                  register={register}
                  rules={formValidation.specialization}
                  error={errors.specialization?.message}
        />
          
        }
           {<Select
                  className="flex-1"
                  name="treatments"
                  label="Treatments *"
                  placeholder="Choose Treatments"
          option={treatments.map((treatment) => ({
             value: String(treatment.id),
             label: `${treatment.treatment} - ${treatment.price.slice(0,-3)}$ `,
           }))}
                 onChange={(value) => {
                   dispatch(setTreatment(value))
                    
               }}
                  register={register}
                  rules={formValidation.specialization}
                  error={errors.specialization?.message}
        />
          
        }
       
                
      </div>
        <div className="flex gap-4">
       <FormDatePicker
  name="appointmentDate"
  label="Appointment date"
  control={control}
  error={errors.appointmentDate?.message}
  availableDays={availableDays}
      />
      <Select
                  className="flex-1"
                  name="appointmentTime"
                  label="Time *"
                  placeholder="Choose Time"
        option={availableTime.map((time) => ({
          
             value: String(time.time),
             label: `${time.time.slice(0,-3)}  `,
           }))}
                 onChange={(value) => {
                   dispatch(setTime(value))
                    
               }}
                  register={register}
                  rules={formValidation.specialization}
                  error={errors.specialization?.message}
        />
      </div>
     <TextArea
  name="notes"
        label="Notes"
        placeholder="Any additional notes for this appointment"
  register={register}
  error={errors.description?.message}
/>
    </section>
  </>)
}