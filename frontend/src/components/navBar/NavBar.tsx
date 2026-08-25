import { useAppSelector } from "@/app/store/hook";
import { navigation } from "@/shared/config/navigation";
import type React from "react";
import { NavLink } from "react-router-dom";

export const NavBar: React.FC = () => {
  const role = useAppSelector(state=>state.auth.user?.role)
  const visibleItems = navigation.filter((item)=>item.roles?.includes(role))
  return (
    <>
      <div className=" flex flex-col w-[260px] p-[16px] h-full bottom-0 bg-[#fff]">
        <div className="h-[68px] flex items-center border-b  border-[#F3F4F6]  mb-[24px] p-[16px]">
          <img className="mr-[16px]" src="smallLogo.png" alt="smallLogo" />
          <div className="flex  ">
            <span className=" m-0 p-0 font-[Inter] font-semibold text-[18px]">
              {"LumiDent"}
            </span>
           
          </div>
        </div>

        <nav className="flex flex-col">
          {
            <ul>
              {visibleItems.map((nav) => (
                <li
                  key={nav.title}
                  className=" flex justify-right w-full h-[40px] mb-[8px] "
                >
                  <NavLink className={({ isActive }) => `flex items-center h-full w-full  rounded-[8px] pl-[12px] pr-[12px]  hover:bg-[#EFF6FF] hover:text-[#1E3A8A]
                  ${isActive
                    ? "text-[#1E3A8A] bg-[#DBEAFE]"
                    : "text-[#1F2937]"}
                    `} to={nav.path}>
                    <span className="w-[20px] h-[20px] mr-[8px]">
                      {nav.icon}
                    </span>
                    <span className="font-[Inter] font-medium text-[16px] ">
                      {" "}
                      {nav.title}{" "}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          }
        </nav>
        
      </div>
      
    </>
  );
};
