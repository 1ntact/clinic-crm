import { useAppDispatch, useAppSelector } from "@/app/store/hook";
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
import { UserProfile } from "../../components/userProfile/UserProfile";
import { PatientEditForm } from "@/features/patients/PatientEditForm";
import { ConfirmModal } from "@/components/confirmModal/ConfirmModal";
import { buttonStyles } from "@/shared/styles/formButtonStyles";
import { PatientInformation } from "./info/InfoItem";
import { PatientDocuments } from "./info/medicalRecords";
import { detailsPatientCardStatistics } from "@/features/statistics/model/detailsPatientCardStatistics";
import { CardStatistics } from "@/components/cardStatistics/CardStatistics";
import { patientDetailsStatisticThunk } from "@/features/statistics/thunk/patientDetailsStatisticsThunk";


export const PatientDetailsPage = () => {
  const [aside, setOpenAside] = useState(false);
  const [modal, setOpenModal] = useState(false);
  const dispatch = useAppDispatch();
  const { loading, selectedPatient } = useAppSelector((state) => state.patient);
  const cards = useAppSelector(state=>state.statistic.statistics.patientDetailsCard)
  const { patientId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!patientId) return;
    dispatch(getPatientByIdThunk(Number(patientId)))
      dispatch(patientDetailsStatisticThunk(Number(patientId)));
  }, [dispatch, patientId]);

  const handleAside = () => setOpenAside((prev) => !prev);

  const handleRemove = async () => {
    try {
      await dispatch(removePatientThunk(Number(patientId))).unwrap();
      successToast("Patient remove");
      navigate("/patients");
    } catch (e) {
      errorToast(e as string);
    }
  };

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
          content={<PatientEditForm  />}
          footer={<>
                <ButtonPage className={buttonStyles.formCancel} onClick={handleAside}>
                 <span className=" text-[#172554]">Cancel</span>
                </ButtonPage>

            <ButtonPage type="submit"
              form="patient-edit"
              className={buttonStyles.formSubmit}>
                  Update patient
            </ButtonPage>
                </>}
          title={"EDIT PATIENT"}
          description={"Fill in the details below"}
        />
      )}

      {loading ? (
        <Loader />
      ) : (
        <div className="rounded-xl bg-white p-[16px] shadow-sm mb-[16px]">
          <section className="mb-[16px] flex items-center justify-between">
            <div className="text-sm text-gray-500">
              <span
                className="cursor-pointer hover:text-blue-600"
                onClick={() => navigate("/patients")}
              >
                &lt; Patient list
              </span>

              <span className="mx-2">/</span>

              <span className="font-medium text-gray-900">
                 {selectedPatient?.firstName} {selectedPatient?.lastName}
              </span>
            </div>

            <div className="w-[250px] flex gap-4">
              <ButtonPage
                className={buttonStyles.removeButton}
                icon={<IoTrash className="mr-2 text-[#DC2626]" />}
                onClick={() => setOpenModal(true)}
              >
                Remove 
              </ButtonPage>

              <ButtonPage
                className={buttonStyles.editButton}
                icon={<TfiPencil className="mr-2" />}
                onClick={handleAside}
              >
                Edit Patient
              </ButtonPage>
            </div>
          </section>

          <section className="flex items-center justify-between ">
            {!loading && selectedPatient && (
                <UserProfile type="patient"
                avatar='patient.jpg'  
                  selectedUser={selectedPatient} />
            )}
          </section>
        </div>
      )}
      
      <div className=" grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4 mb-[24px]">
          {detailsPatientCardStatistics.map((card) => {
  const data =
    card.key === "balance"
      ? undefined
      : cards?.[card.key];

  return (
    <CardStatistics
      key={card.key}
      title={card.title}
      icon={card.icon}
      iconClass={card.iconClass}
      value={data?.total ?? card.value}
      change={data?.change ?? card.change}
    />
  );
})}
          </div>
      <PatientInformation />
      <PatientDocuments/>
    </>
  );
};
