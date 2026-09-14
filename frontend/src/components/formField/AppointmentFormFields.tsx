import { useEffect, useRef, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import type { AppointmentFormData } from "@/types/appointmentFormData";

import { Input } from "../input/Input";
import { Select } from "../select/Select";
import { TextArea } from "../textArea/TextArea";

import { formValidation } from "@/features/auth/model/form.validation";
import { useFormContext } from "react-hook-form";

import { useAppDispatch, useAppSelector } from "@/app/store/hook";

import { getFormAppointmentsDashboardThunk } from "@/features/appointments/thunk/getFormAppointmentsDashboardThunk";
import { getFormAvailableTimeSlotsThunk } from "@/features/appointments/thunk/getFormAvailableTimeSlotsThunk";

import Calendar from "@/pages/Appointments/components/Calendar";

type Props = {
  type: "create" | "update";
};

export const AppointmentFormFields: React.FC<Props> = ({ type }) => {
  const dispatch = useAppDispatch();

  const { doctors } = useAppSelector((state) => state.doctor);

  const { treatments } = useAppSelector((state) => state.appointment);

  
  const {
    availableDays,
    fullyBookedDays,
    availableTime,
    calendarLoading,
  } = useAppSelector((state) => state.appointment.formCalendar);
console.log("TIMEEEEEEEEEEER",availableTime)
  const {
    control,
    setValue,
    register,
    watch,
    formState: { errors },
  } = useFormContext<AppointmentFormData>();

  /**
   * =====================================================
   * FORM VALUES
   * =====================================================
   */

  const doctorId = watch("doctorId");
const appointmentDate = watch("appointmentDate");

const [formDisplayedMonth, setFormDisplayedMonth] = useState<Dayjs>(() =>
  appointmentDate
    ? dayjs(appointmentDate).startOf("month")
    : dayjs().startOf("month"),
);

/**
 * Selecting a date in the calendar closes the popup in the same
 * tick. `watch("appointmentDate")` may not have re-rendered yet
 * by the time `onClose` fires, so we can't rely on it to know
 * "was a date just picked?". Track it synchronously instead.
 */
const justSelectedDateRef = useRef(false);

  /**
   * =====================================================
   * LOAD AVAILABLE DAYS
   * =====================================================
   */

  useEffect(() => {
    dispatch(
      getFormAppointmentsDashboardThunk({
        month: formDisplayedMonth.month() + 1,
        year: formDisplayedMonth.year(),
      }),
    );
  }, [dispatch, formDisplayedMonth]);

  /**
   * =====================================================
   * LOAD AVAILABLE TIME SLOTS
   * =====================================================
   *
   * Depends ONLY on form values.
   */
  useEffect(() => {
    if (!doctorId || !appointmentDate) {
      return;
    }

    dispatch(
      getFormAvailableTimeSlotsThunk({
        doctorId: Number(doctorId),
        date: appointmentDate,
      }),
    );
  }, [dispatch, doctorId, appointmentDate]);

  /**
   * =====================================================
   * DOCTOR
   * =====================================================
   */

  const handleDoctorChange = (id: string) => {
    setValue("doctorId", id, {
      shouldValidate: true,
      shouldDirty: true,
    });

    /**
     * New doctor means previous selected time
     * may no longer be valid.
     */
    setValue("appointmentTime", "", {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  /**
   * =====================================================
   * TREATMENT
   * =====================================================
   */

  const handleTreatmentChange = (value: string) => {
    setValue("treatmentId", value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  /**
   * =====================================================
   * DATE
   * =====================================================
   */

  const handleDateChange = (date: string | null) => {
    justSelectedDateRef.current = date !== null;

    setValue("appointmentDate", date ?? "", {
      shouldValidate: true,
      shouldDirty: true,
    });

    /**
     * Date changed -> old time may no longer be valid.
     */
    setValue("appointmentTime", "", {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  /**
   * =====================================================
   * CALENDAR CLOSE
   * =====================================================
   *
   * If the popup closes without a date being picked,
   * bring the displayed month back in sync with the
   * actual selected date (or today), instead of leaving
   * it pointed at whatever month the user last browsed to.
   * Without this, `availableDays` stays fetched for the
   * stale browsed month next time the popup opens.
   *
   * IMPORTANT: when a date WAS just picked, MUI closes the
   * popup in the same tick as onChange, before this component
   * re-renders with the new `appointmentDate`. In that case
   * `formDisplayedMonth` is already correct (it's the month
   * the user was browsing when they picked the date) -> leave
   * it alone, don't recompute from the stale watched value.
   */
  const handleCalendarClose = () => {
    if (justSelectedDateRef.current) {
      justSelectedDateRef.current = false;
      return;
    }

    const resetMonth = appointmentDate
      ? dayjs(appointmentDate).startOf("month")
      : dayjs().startOf("month");

    setFormDisplayedMonth(resetMonth);
  };

  return (
    <>
      <p className="mb-[24px] text-xs text-[#6B7280]">
        PERSONAL INFO
      </p>

      <div className="mb-[16px] flex gap-4">
        <Input
          inputClassName="h-[44px]"
          className="flex-1"
          name="firstName"
          label="First name *"
          type="text"
          placeholder="First, select a patient."
          register={register}
          rules={formValidation.name}
          readOnly={type === "create"}
        />

        <Input
          inputClassName="h-[44px]"
          className="flex-1"
          name="lastName"
          label="Last name *"
          type="text"
          placeholder="First, select a patient."
          register={register}
          rules={formValidation.name}
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
        rules={formValidation.phoneNumber}
      />

      <p className="mb-[24px] text-xs text-[#6B7280]">
        APPOINTMENT
      </p>

      <div className="mb-[16px] flex gap-4">
        <Select
          className="flex-1"
          name="doctorId"
          label="Doctor *"
          placeholder="select a doctor"
          options={doctors.map((doctor) => ({
            value: String(doctor.id),
            label: `Dr. ${doctor.firstName} ${doctor.lastName}`,
          }))}
          onChange={handleDoctorChange}
          control={control}
          rules={formValidation.doctor}
          error={errors.doctorId?.message}
        />

        <Select
          className="flex-1"
          name="treatmentId"
          label="Treatments *"
          placeholder="Choose Treatments"
          options={treatments.map((treatment) => ({
            value: String(treatment.id),
            label: `${treatment.treatment} - ${treatment.price
              .toString()
              .slice(0, -3)}$`,
          }))}
          onChange={handleTreatmentChange}
          control={control}
          rules={formValidation.treatments}
          error={errors.treatmentId?.message}
        />
      </div>

      <div className="mb-[16px] flex gap-4">
        <Calendar
          variant="picker"
          availableDays={availableDays}
          bookedDays={fullyBookedDays}
          selectedDate={appointmentDate || null}
          displayedMonth={formDisplayedMonth}
          onMonthChange={(date) => {
            setFormDisplayedMonth(date.startOf("month"));
          }}
          onDateChange={handleDateChange}
          onClose={handleCalendarClose}
          error={errors.appointmentDate?.message}
          minDate={dayjs()}
        />

        <Select
          className="flex-1"
          name="appointmentTime"
          label="Time *"
          placeholder={
            !doctorId
              ? "Choose a doctor first"
              : !appointmentDate
                ? "Choose a date first"
                : calendarLoading
                  ? "Loading..."
                  : "Choose Time"
          }
          options={availableTime.map((time) => ({
            disabled: time.status !== "free",
            value: time.time,
            label: time.time.slice(0, -3),
          }))}
          control={control}
          rules={formValidation.requireField}
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
    </>
  );
};
