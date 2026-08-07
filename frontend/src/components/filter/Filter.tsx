import { useEffect, useState } from "react";
import { Input } from "../input/Input";
import { useDebounce } from "@/hooks/useDebounce"

export type FilterOption = {
  label: string;
  value: string;
};

type Props = {
  className?: string;

  search?: string;

  firstSelect?: string;
  secondSelect?: string;

  firstPlaceholder?: string;
  secondPlaceholder?: string;

  firstSelectOptions?: FilterOption[];
  secondSelectOptions?: FilterOption[];

  onSearchChange: (value: string) => void;
  onFirstSelectChange?: (value: string) => void;
  onSecondSelectChange?: (value: string) => void;
};

export const Filter: React.FC<Props> = ({
  firstPlaceholder,
  secondPlaceholder,
  search,
  className,
  firstSelect,
  secondSelect,
  firstSelectOptions,
  secondSelectOptions,
  onSearchChange,
  onFirstSelectChange,
  onSecondSelectChange,
 
}) => {
  const [value, setValue] = useState(search);

  const debouncedSearch = useDebounce(value, 500);

  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <div className ={`flex items-center gap-2  ${className ?? ""}`} >
      <Input 
        name="124"
        type="search"
        value={value}
        placeholder="Search ..."
        onChange={(e) => setValue(e.target.value)}
        className="w-full h-[36px] rounded-[8px]  bg-white color-[#6B7280] "
      />
       {firstSelectOptions && (
  <select
    value={firstSelect ?? ""}
    onChange={(e) => onFirstSelectChange?.(e.target.value)}
    className="w-[190px] h-[36px] rounded-[8px] border border-[#E5E7EB]"
  >
    <option value="">
      {firstPlaceholder ?? "Select"}
    </option>

    {firstSelectOptions.map((item) => (
      <option key={item.value} value={item.value}>
        {item.label}
      </option>
    ))}
  </select>
)}

    {secondSelectOptions && (
  <select
    value={secondSelect ?? ""}
    onChange={(e) => onSecondSelectChange?.(e.target.value)}
    className="w-[190px] h-[36px] rounded-[8px] border border-[#E5E7EB]"
  >
    <option value="">
      {secondPlaceholder ?? "Select"}
    </option>

    {secondSelectOptions.map((item) => (
      <option key={item.value} value={item.value}>
        {item.label}
      </option>
    ))}
  </select>
)}  

    </div>
  );
};
      
  