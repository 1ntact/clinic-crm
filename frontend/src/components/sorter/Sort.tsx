import type { SortBy } from "@/types/sortTypes";
import { RiArrowUpDownLine } from "react-icons/ri";


type SortOrder = "asc" | "desc";

type Props = {
  userCount:number,
  className?: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
  buttons,
  onChange: (
    sortBy: SortBy,
    sortOrder: SortOrder
  ) => void;
};



export const Sort: React.FC<Props> = ({ className,
    userCount,
  buttons,
  sortBy,
  sortOrder,
  onChange,
}) => {
  const handleClick = (value: SortBy) => {
    if (value === sortBy) {
      onChange(
        value,
        sortOrder === "asc" ? "desc" : "asc"
      );
    } else {
      onChange(value, "asc");
    }
  };

  return ( 
    <div className={`h-[32px] flex  items-center gap-4 ${className ?? ""}`}>
      <div className="flex items-center justify-center gap-1">
  <RiArrowUpDownLine className="h-3 w-3" />
  <span>Sort:</span>
</div>
     
      {buttons.map((button) => (
        <button
          disabled={userCount<2}
          key={button.value}
          onClick={() => handleClick(button.value)}
          className={` h-[32px]
  flex
  items-center
  rounded-[8px]
  px-3
  transition

  disabled:opacity-50
  disabled:cursor-not-allowed
  disabled:bg-gray-200
  disabled:text-gray-400
            ${
              sortBy === button.value
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-gray-300 bg-white hover:bg-[#DBEAFE]"
            }`}
        >
          {button.label }

          {sortBy === button.value && (
            <span className="ml-2">
              {sortOrder === "asc" ? "↑" : "↓"}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};