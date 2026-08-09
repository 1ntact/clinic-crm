import { useAppSelector } from "@/app/store/hook"
import { AsideMenu } from "@/components/asideMenu/AsideMenu";
import { ButtonPage } from "@/components/button/ButtonsPage"
import { PageTitle } from "@/components/pageTitle/PageTitle"
import { UserForm } from "@/features/users/UserForm";
import { buttonStyles } from "@/shared/styles/formButtonStyles";
import { useState } from "react";
import { BiPlus } from "react-icons/bi";
import { BiShield } from "react-icons/bi";
export const DashboardPage = () => {
  const userData = useAppSelector(state => state.auth.user)
  const [aside, setOpenAside] = useState(false)
  const now = new Date()
  const nowTime = now.toLocaleDateString('uk-UA')
  const handleAside = () =>
    setOpenAside(prev=>!prev)
  return (<>
    <div className="flex justify-between items-center  mb-[26px] h-[57px]" >
      <PageTitle
      text={`Hello,${userData?.firstName}!`}
        description={nowTime} />
      <div className="flex  gap-4  ">
        <ButtonPage className={buttonStyles.editButton}
       
          icon={<BiShield className="mr-[8px]" />} >
          Change role</ButtonPage>
        <ButtonPage className={buttonStyles.createButton}
           onClick={handleAside}
          
          icon={<BiPlus className="mr-[8px]" />} >Invite a member</ButtonPage>
      </div>
     
    </div>
    {aside && <AsideMenu
      
      title={'ADD NEW USER'}
      description={'An invitation will be sent to the specified email'}
      handleAside={handleAside}
      content={<UserForm />} 
    footer={  <>
              <ButtonPage className={buttonStyles.formCancel} onClick={handleAside}>
                Cancel
              </ButtonPage>
      <ButtonPage
        form="user-create"
        type="submit"
        className={buttonStyles.formSubmit}>
                Send an invitation
              </ButtonPage>
            </>}/>}
    </>

  )
}