import { ButtonPage } from "@/components/button/ButtonsPage";
import { Loader } from "@/components/loader/Loader";
import type { Appointment } from "@/types/appointment";
import { useEffect, useState } from "react";
import { AppointmentStatusSelector } from "../AppointmentsStatusSelector/AppointmentStatusSelector";
import { TfiAlert } from "react-icons/tfi";
import {  changeStatusAppointmentThunk } from "@/features/appointments/thunk/changeStatusAppointmentThunk";
import { useAppDispatch, useAppSelector } from "@/app/store/hook";
import { errorToast, successToast } from "@/components/pushAppMessage/PushApp";
import { getAppointmentsThunk } from "@/features/appointments/thunk/getAppointmentsThunk";
import { setSelectedAppointment } from "@/features/appointments/appointmentsSlice";
import { getAvailableTimeSlotsThunk } from "@/features/appointments/thunk/getAvailableSlots";



type Props = {
  isOpen: boolean;

  title: React.ReactNode;
  description?: React.ReactNode;
status:string[],
  confirmText?: string;
  cancelText?: string;
  appointment: Appointment ;

  loading?: boolean;
  closeOnBackdrop?: boolean;

  children?: React.ReactNode;

  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
};



export const ChangeStatusModal: React.FC<Props> = ({
  isOpen,
  
  loading,
  title,
  status,
  appointment,
  confirmText = "Confirm",
  cancelText = "Cancel",
  closeOnBackdrop = true,
  onCancel,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(null)
  const { appointmentsQuery } = useAppSelector(state => state.appointment)
  const {selectedDoctor,selectedDate}= useAppSelector(state=>state.appointment.calendar)
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) {
    return null;
  }

  const handleSaveStatus = async () => {
    if (!selectedStatus || !appointment) {
      return
    }
    try {
      await dispatch(changeStatusAppointmentThunk(
        {
          status: selectedStatus,
          id: appointment.id
        }
      )).unwrap();
    dispatch(setSelectedAppointment(null))
     
      onCancel()
      await dispatch(getAppointmentsThunk(appointmentsQuery))
      await dispatch(getAvailableTimeSlotsThunk({
        doctorId: selectedDoctor.id,
        date: selectedDate,
      }))
       successToast(
              <>
                Appointment refresh  status  successfully!!!
                <br />

              </>,
            );
    } catch (e) {
      dispatch(setSelectedAppointment(null))
      onCancel()
      errorToast(e as string)
    }
  
  }
  return (<div
      className=" fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={() => {
        if (closeOnBackdrop) {
          onCancel();
        }
      }}
    >
      <div
        className="w-full  flex flex-col items-center max-w-md rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-2 text-[Inter] text-[30px] font-semibold ">
          {title}
        </h2>

       <div className="flex items-right gap-2 mb-[24px] flex-wrap text-sm text-gray-500">
  <span>ID: #{appointment.id}</span>

  <span>·</span>

  <span>
    {appointment.patientFirstName} {appointment.patientLastName}
  </span>

  <span>·</span>

  <div className="flex items-center gap-1">
    <span className="h-2.5 w-2.5 rounded-full bg-blue-600"></span>
    <span className="text-blue-600 capitalize">
      {appointment.status}
    </span>
  </div>
</div>

      <AppointmentStatusSelector
  options={status}
  value={selectedStatus}
  onChange={setSelectedStatus}
/>
      
      <div className=" flex items-center h-[56px] mb-[24px] px-[16px] py-[8px] rounded-[8px] text-[14px] text-[#991B1B] bg-[#FECACA]">
        <TfiAlert className="mr-[8px]"/>
        <span >Cancelling will free the appointment slot permanently.</span>
</div>
        <div className=" flex justify-end gap-3">
          <ButtonPage
            
            type="button"
            onClick={onCancel}
            disabled={loading}
            className=" w-[171px] h-[44px] bg-white border"
          >
            <span className="text-[#172554]">
              {cancelText}
            </span>
          </ButtonPage>

          <ButtonPage
            type="button"
            onClick={handleSaveStatus}
            disabled={loading}
            className={'w-[171px] h-[44px] bg-[#EF4444]' }
          >
            {loading ? <Loader/>: confirmText}
          </ButtonPage>
        </div>
      </div>
    </div>)
  
};