type Option = {
  label: string;
  value: string;
};

type Props = {
  name: string;
  classNames?: string;
  label?: string;
  options: Option[];
  value: string[];
  placeholder?: string;
  onChange: (value: string) => void;
};

export const BaseSelect = ({
  name,
  classNames,
  label,
  options,
  value,
  placeholder,
  onChange,
}: Props) => (
  <>
    <label>{label}</label>

    <select className={`h-[44px] rounded-[8px] border border-gray-300 px-[16px] py-[8px] ${classNames ?? ''}`}
     id={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
     
    >
      <option value="" disabled>
        {placeholder}
      </option>

      {options.map(option => (
        <option
          key={option.id}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  </>
);