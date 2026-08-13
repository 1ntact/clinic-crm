import { CgPlayListCheck } from "react-icons/cg";
import { FiCalendar } from "react-icons/fi";

type Props = {
  value: "list" | "calendar";
  onChange: (value: "list" | "calendar") => void;
};

export const AppointmentsViewToggle = ({
  value,
  onChange,
}: Props) => {
  return (
    <div className="flex items-center gap-4">
    
      <span
        className={`text-[16px] leading-none ${
          value === "list"
            ? "text-[#6B7280]"
            : "text-[#6B7280]"
        }`}
      >
        List
      </span>

      <div className="flex h-[36px] w-[66px] px-[1px]  shrink-0 items-center rounded-full bg-[#172554] ">
        <button
          type="button"
          aria-label="List view"
          onClick={() => onChange("list")}
          className={`flex h-[32px] w-[32px] items-center justify-center rounded-full transition-all ${
            value === "list"
              ? "bg-white text-[#172554]"
              : "text-white"
          }`}
        >
          <CgPlayListCheck size={16} />
        </button>

        <button
          type="button"
          aria-label="Calendar view"
          onClick={() => onChange("calendar")}
          className={`flex h-[32px] w-[32px]   shrink-0 items-center justify-center rounded-full transition-all ${
            value === "calendar"
              ? "bg-white text-[#172554]"
              : "text-white"
          }`}
        >
          <FiCalendar size={16} />
        </button>
      </div>

    
      <span className="text-[16px] leading-none text-[#6B7280]">
        Calendar
      </span>
    </div>
  );
};