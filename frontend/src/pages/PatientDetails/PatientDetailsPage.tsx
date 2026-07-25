import { useAppDispatch, useAppSelector } from "@/app/store/hook"
import { AsideMenu } from "@/components/asideMenu/AsideMenu";
import { ButtonPage } from "@/components/button/ButtonsPage";
import { Loader } from "@/components/loader/Loader";
import { errorToast, successToast } from "@/components/pushAppMessage/PushApp";
import { getPatientByIdThunk } from "@/features/patients/thunk/getPatientByIdThunk";
import { removePatientThunk } from "@/features/patients/thunk/removePatientThunk";
import { useEffect, useState } from "react";
import { IoTrash } from "react-icons/io5";
import { TfiPencil } from "react-icons/tfi";
import { useNavigate, useParams } from "react-router-dom";
import { DoctorsProfile } from "../DoctorDetails/components/DoctorsProfile";
import { PatientEditForm } from "@/features/patients/PatientEditForm";
import { ConfirmModal } from "@/components/confirmModal/ConfirmModal";

export const PatientDetailsPage = () => {
  const [aside, setOpenAside] = useState(false);
  const [modal, setOpenModal] = useState(false)
  const dispatch = useAppDispatch();
  const {loading, selectedPatient} = useAppSelector(state=>state.patient)
  const {patientId} = useParams();
  const navigate = useNavigate();
  
    useEffect(() => {
      if (!patientId) return;
  
      dispatch(getPatientByIdThunk(Number(patientId)));
    }, [dispatch,patientId]);
  
  
    const handleAside = () => setOpenAside((prev) => !prev);
    
  
  const handleRemove = async () => {
     
     try {
       await dispatch(removePatientThunk(Number(patientId))).unwrap();
       successToast('Patient remove')
       navigate("/patients");
     } catch (e) {
       errorToast(e as string)
     }
     
   }
 
   return (
     <>
       <ConfirmModal
            loading={loading}
        isOpen={modal}
        title="Is the patient healthy?"
        description="This action cannot be undone."
        confirmText="Delete"
        onCancel={() => setOpenModal(false)}
        onConfirm={handleRemove}
    />
       {aside && (
         <AsideMenu
           handleAside={handleAside}
           forms={<PatientEditForm  handleAside={handleAside}  />}
              
           title={"EDIT PATIENT"}
           description={"Fill in the details below"}
         />
       )}
 
       {loading? <Loader/>: <div className="rounded-xl bg-white p-6 shadow-sm">
         <section className="mb-8 flex items-center justify-between">
           <div className="text-sm text-gray-500">
             <span className="cursor-pointer hover:text-blue-600" onClick={()=>navigate('/patients')}>
               &lt; Patients
             </span>
 
             <span className="mx-2">/</span>
 
             <span className="font-medium text-gray-900">
               Dr. {} {}
             </span>
           </div>
 
           <div className="flex gap-3">
             <ButtonPage
             
               className="bg-[#EF4444] px-4 hover:bg-black"
               icon={<IoTrash className="mr-2 text-white" />}
               onClick={ ()=>setOpenModal(true)}
             >
               Remove patients
             </ButtonPage>
 
             <ButtonPage
               className="px-4"
               icon={<TfiPencil className="mr-2" />}
               onClick={handleAside}
             >
               Edit doctor
             </ButtonPage>
           </div>
         </section>
 
         <section className="flex items-center justify-between rounded-xl border border-gray-200 p-6">
           {!loading && selectedPatient && (
             <DoctorsProfile selectedDoctor={selectedPatient} />
           )}
         </section>
       </div>}
     </>
   );
 };
 