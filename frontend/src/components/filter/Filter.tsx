import { useEffect, useState } from "react";
import { Input } from "../input/Input";
import { useDebounce } from "@/hooks/useDebounce"
import type { SelectOption } from "@/features/doctors/model/specialties";
import type { DoctorQuery } from "@/features/doctors/model/DoctorQuery";
import { ImInsertTemplate } from "react-icons/im";
type Props = {
   className?: string;
  search: string;
  firstSelect: DoctorQuery['specialization'];
  secondSelect: DoctorQuery['employmentType'];

  firstSelectOptions: SelectOption[];
  secondSelectOptions:SelectOption[];

  onSearchChange: (value: string) => void;
  onFirstSelectChange: (value: string) => void;
  onSecondSelectChange: (value: string) => void;
};


export const Filter: React.FC<Props> = ({
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
        className="w-[250px] h-[36px] rounded-[8px]  bg-white color-[#6B7280] "
      />
        <select
        value={firstSelect.value}
        onChange={(e) => onFirstSelectChange(e.target.value)}
        className="w-[190px] h-[36px]  rounded-[8px]  bg-white color-[#6B7280] border-1 border-[#E5E7EB]" 
      >
        <option value="">All specializations</option>

        {firstSelectOptions.map((item) => (
          <option key={item.label} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      <select
        value={secondSelect}
        onChange={(e) => onSecondSelectChange(e.target.value)}
      className=  "w-[140px] h-[36px] rounded-[8px] bg-white color-[#6B7280] border-1 border-[#E5E7EB]"
      > 
        <option value="">TYPE</option>
        {secondSelectOptions.map((item)=> (
          <option key={item.label} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>  

    </div>
  );
};
      
  