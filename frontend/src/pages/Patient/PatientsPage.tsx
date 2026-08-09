import { useAppDispatch, useAppSelector } from "@/app/store/hook";
import { AsideMenu } from "@/components/asideMenu/AsideMenu";
import { ButtonPage } from "@/components/button/ButtonsPage";
import { Loader } from "@/components/loader/Loader";
import { PageTitle } from "@/components/pageTitle/PageTitle";
import { Table } from "@/components/table/Table";
import { PatientCreateForm } from "@/features/patients/PatientCreateForm";
import { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { Td } from "@/components/table/Td";
import { Th } from "@/components/table/Th";
import { useNavigate } from "react-router-dom";
import { UserContacts } from "@/components/userContacts/UserContacts";
import { getAllPatientThunk } from "@/features/patients/thunk/getAllPacientThunk";
import { Filter } from "@/components/filter/Filter";
import { setQuery } from "@/features/patients/patientsSlice";
import { specializations } from "@/features/doctors/model/specialties";
import { employmentTypes } from "@/features/doctors/model/employmentTypes";
import { Sort } from "@/components/sorter/Sort";
import { sortButtons } from "@/features/patients/model/sortPatientType";
import { Pagination } from "@/components/pagination/Pagination";
import { getStatisticPatient } from "@/features/patients/thunk/getStatisticPatient";
import { PatientStatisticCard } from "./components/statisticPacient/StatisticPatient";
import { buttonStyles } from "@/shared/styles/formButtonStyles";

export const PatientsPage = () => {
  const [aside, setOpenAside] = useState(false)
  const { loading , patients,query, total, statistic} = useAppSelector(state => state.patient)
  const dispatch = useAppDispatch();
  const navigate = useNavigate()
    const handleAside = () =>
    setOpenAside(prev => !prev)
  
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        
        await dispatch(getAllPatientThunk(query)).unwrap()
        await dispatch(getStatisticPatient()).unwrap()
      } 
      catch (e) {
        console.log(e)
      }
    }
    fetchPatient()
  },[dispatch, query])

  return <>
    {aside && (<AsideMenu
      handleAside={handleAside}
      content={<PatientCreateForm />}
      footer = { <>
               <ButtonPage className={buttonStyles.formCancel} onClick={handleAside}>
                      <span className="text-[#172554]">Cancel</span>
                  </ButtonPage>
  
                  <ButtonPage type="submit" form="patient-create" className={buttonStyles.formSubmit}>
                    Send an invitation
                  </ButtonPage>
             </> }
      title={"ADD NEW PATIENT"}
       description={"Fill in the details below"}
    />)}
    <div className="flex justify-between   mb-[25px] h-[57px]" >
     
        <PageTitle
          text={`Patient Managment`}
        description={`${total} die`} />
      
       
      
      
          <div className="flex  gap-4  ">
         
            <ButtonPage className={buttonStyles.createButton}
               onClick={handleAside}
              
              icon={<BiPlus className="mr-[8px]" />} >Add patients</ButtonPage>
          </div>
           
    </div>
    <div className="mb-[25px]">{statistic && <PatientStatisticCard statistic={statistic} />} </div>
    
     <div className="flex  justify-between">
            <Filter
        className="mb-[24px]"
        search={query.search}
       
        
        firstSelectOptions={specializations}
        secondSelectOptions={employmentTypes}
      onSearchChange={(value) =>
      dispatch(setQuery({ search: value, page: 1 }))
                     }
                  
                     
                   />
      <Sort
        userCount={patients.length}
              sortBy={query.sortBy}
        sortOrder={query.sortOrder}
        buttons={sortButtons}
              onChange={(sortBy, sortOrder) =>
                dispatch(
                  setQuery({
                    sortBy,
                    sortOrder,
                    page: 1,
                  }),
                )
              }
            /> 
          </div>
   {loading ? (
          <Loader />
        ) : (
          <div className="w-full min-h-[380px] p-[16px] rounded-[8px] bg-[#FFFFFF] ">
            <Table>
              <thead>
                <tr className="h-[40px] bg-[#F3F4F6]">
                  <Th>ID</Th>
                  <Th>PATIENT/CONTACT</Th>
                  <Th>LAST VISIT</Th>
                  <Th>TYPE OF TREATMENT</Th>
                  <Th>TOTAL VISITS</Th>
                <Th>STATUS</Th>
                <Th>ACTION</Th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr
                    key={patient.userId}
                    onClick={() => {
                      navigate(`/patients/${patient.id}`);
                    }}
                    className=" h-[40px] cursor-pointer hover:bg-[#DCFCE7] transition-colors"
                  >
                    <Td>{`#${patient.id}`}</Td>
  
                    <Td>
                      <UserContacts
                        
                        firstName={patient.firstName}
                        lastName={patient.lastName}
                        phone={patient.phoneNumber}
                      />
                    </Td>
  
                    <Td>{patient.email}</Td>
  
                    <Td>{patient.gender}</Td>
  
                    <Td>{"09:00-18:00"}</Td>
  
                    <Td>{patient.address}</Td>
                  </tr>
                ))}
               
                </tbody>
                
              </Table>
               {patients.length === 0 && (
                  <p className="p-3 text-center text-gray-500">
                    Nothing found
                  </p>
                )}
        </div>
        
    )}
   <Pagination
          page={query.page}
          pageSize={query.pageSize}
          total={total}
          onPageChange={(page) =>
            dispatch(
              setQuery({
                page,
              }),
            )
          }
        /></>
};
