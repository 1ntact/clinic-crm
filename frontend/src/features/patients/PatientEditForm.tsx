import { FormProvider, useForm } from "react-hook-form";
import { ButtonPage } from "@/components/button/ButtonsPage";
import { useAppDispatch, useAppSelector } from "@/app/store/hook";
import { Loader } from "@/components/loader/Loader";
import { errorToast, successToast } from "@/components/pushAppMessage/PushApp";

import { useEffect } from "react";
import type { PatientFormData } from "@/types/patientFormData";
import { PatientsFormFields } from "@/components/formField/PatientFormField";
import { updatePatientThunk } from "./thunk/updatePatientThunk";





export const PatientEditForm: React.FC = () => {
  const methods = useForm<PatientFormData>();
  const { reset, handleSubmit } = methods;

  const dispatch = useAppDispatch();
  const { selectedPatient, loading } = useAppSelector((state) => state.patient);
  

  
  useEffect(() => {
    if (!selectedPatient) return;

    reset({
      firstName: selectedPatient.firstName,
      lastName: selectedPatient.lastName,
      email: selectedPatient.email,
      phoneNumber: selectedPatient.phoneNumber,
      dateOfBirth: selectedPatient.dateOfBirth,
      gender: selectedPatient.gender,
      address:selectedPatient.address,
    
    });
  }, [selectedPatient, reset]);

  const onSubmit = async (data: PatientFormData) => {
    if (!selectedPatient) {
      return;
    }
  
    try {
      await dispatch(updatePatientThunk({ 
        data: data,
        id:selectedPatient.id
        
      })).unwrap();
      reset();
      successToast(
        <>
          Patient updates successfully
          <br />
          Mr. {selectedPatient.firstName} {selectedPatient.lastName}
        </>,
      );
    } catch (e) {
      errorToast(e as string);
    }
  };

  return (
    <>
      {" "}
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full">
          <FormProvider {...methods}>
            <form id="patient-edit"
              className="flex flex-col gap-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <PatientsFormFields/>

              
              </form>
             
          </FormProvider>
        </div>
      )}{" "}
    </>
  );
};
