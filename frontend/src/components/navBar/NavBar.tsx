import { useAppSelector } from "@/app/store/hook";
import { navigation } from "@/shared/config/navigation";
import type React from "react";
import { NavLink } from "react-router-dom";

export const NavBar: React.FC = () => {
  const role = useAppSelector((state) => state.auth.user?.role);

  const isActiveVisit = useAppSelector(
    (state) => state.visit.isActiveVisit
  );

  const visibleItems = navigation.filter(
    (item) => role !== undefined && item.roles?.includes(role)
  );

  const handleNavigation = (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    if (isActiveVisit) {
      event.preventDefault();
    }
  };

  return (
    <div className="flex flex-col w-[260px] px-[16px] py-[24px] h-full bottom-0 bg-[#fff]">
    

      <nav className="flex flex-col">
        <ul>
          {visibleItems.map((nav) => (
            <li
              key={nav.title}
              className="flex justify-right w-full h-[40px] mb-[8px]"
            >
              <NavLink
              className={({ isActive }) => `
  flex items-center h-full w-full rounded-[8px]
  pl-[12px] pr-[12px]
  ${
    isActiveVisit
      ? "cursor-not-allowed opacity-60"
      : "hover:bg-[#EFF6FF] hover:text-[#1E3A8A]"
  }
  ${
    isActive
      ? "text-[#1E3A8A] bg-[#DBEAFE]"
      : "text-[#1F2937]"
  }
`}
                to={nav.path}
                onClick={handleNavigation}
              >
                <span className="w-[20px] h-[20px] mr-[8px]">
                  {nav.icon}
                </span>

                <span className={`font-[Inter] font-medium text-[16px] ${nav.title==="Dashboard"?"rext-[#1F2937]":"text-[#374151]"}`}>
                  {nav.title}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};