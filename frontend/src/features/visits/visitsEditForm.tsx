import { VisitsFormFields } from "@/components/formField/VisitsFormField";
import type { VisitsFormData } from "@/types/visitsFormData";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { updatePatientNoteThunk } from "./thunks/updateVisit";
import { useAppDispatch } from "@/app/store/hook";
import type { Visit } from "@/types/visit";
import { getPatientNotesThunk } from "../patients/thunk/getPatientNotesVisits";
import { useParams } from "react-router-dom";
import { errorToast, successToast } from "@/components/pushAppMessage/PushApp";


type Props = {
  visit: Visit  ;
}

export const VisitEditForm: React.FC<Props> = ({ visit }) => {
  const methods = useForm<VisitsFormData>({
    defaultValues: {
      mainTreatment: "",
      treatmentAdd1: "",
      treatmentAdd2: "",
      diagnosis: "",
      description: "",
      recommendation: "",
    },
  });

  const { reset, handleSubmit } = methods;

  const dispatch = useAppDispatch();
  const {patientId} = useParams()

  useEffect(() => {
    if (!visit) return;

    reset({
      // readonly Title
      mainTreatment: visit.mainTreatment ?? "",

      // additional treatments
      treatmentAdd1: visit.treatmentAdd1 ?? "",
      treatmentAdd2: visit.treatmentAdd2 ?? "",

      // visit information
      diagnosis: visit.diagnosis ?? "",
      description: visit.description ?? "",
      recommendation: visit.recommendation ?? "",
    });
  }, [visit, reset]);

  const onSubmit = async (data: VisitsFormData) => {
    try {
      await dispatch(
        updatePatientNoteThunk({
          visitId: visit.visitId,
          data,
        })
      ).unwrap();
      await dispatch(getPatientNotesThunk(Number(patientId)))
      reset();
      
      successToast('Note added successfully')
    } catch (e) {
      errorToast(e as string);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        id="visit-edit"
        className="flex flex-col gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <VisitsFormFields />
      </form>
    </FormProvider>
  );
};