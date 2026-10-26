
import { Input } from "../input/Input";
import { CiBellOn } from "react-icons/ci";
import { UserInfo } from "./component/userInfo/UserInfo";
import { useAppSelector } from "@/app/store/hook";


export const Header: React.FC = () => {
  const user = useAppSelector(state => state.auth.user);

  return (
    <header className="w-full shrink-0 bg-white ">
      <div className="mx-auto flex h-[76px] w-full max-w-[1440px] items-center justify-between pl-[16px] pr-[24px] py-[16px]">
        <div className="flex w-[260px] h-[76px] shrink-0 items-center border-b border-[#F3F4F6] mr-[24px]">
          <img
            className="mr-[16px]"
            src="smallLogo.png"
            alt="smallLogo"
          />

          <span className="m-0 p-0 font-[Inter] text-[18px] font-semibold">
            LumiDent
          </span>
        </div>

        <Input
          name="search"
          type="search"
          placeholder="Search patients, doctors, appointments..."
          inputClassName="h-[44px] w-[872px]"
        />

        <div className="ml-[16px] flex items-center justify-between">
          <button className="relative h-[44px] w-[44px] rounded-[8px] border border-solid border-[#E5E7EB] p-[9px]">
            <CiBellOn className="h-[24px] w-[24px]" />
            <div className="absolute right-[12px] top-[13px] h-[8px] w-[8px] rounded-full bg-[#EF4444]" />
          </button>

          <div className="ml-[16px] h-full border-l border-[#E5E7EB]" />

          {user && <UserInfo user={user} />}
        </div>
      </div>
    </header>
  );
};


