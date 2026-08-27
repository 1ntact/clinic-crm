import { useAppDispatch, useAppSelector } from "@/app/store/hook"
import { Loader } from "@/components/loader/Loader"

import { getAppointmentByIdThunk } from "@/features/appointments/thunk/getAppointmentByIdThunk"
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

export const AppointmentDetails = () => {
  const { appointmentId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {selectedAppointment, appointmentsLoading} = useAppSelector(state =>state.appointment)
  console.log("thisisisisi",selectedAppointment)
 
  useEffect(() => {
    if (!appointmentId) return 
    dispatch(getAppointmentByIdThunk(appointmentId))

  },[dispatch, appointmentId])
  return (<>
  </>)
}