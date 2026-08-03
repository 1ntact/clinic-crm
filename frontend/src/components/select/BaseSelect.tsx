type Option = {
  label: string;
  value: string;
};

type Props = {
  classNames?: string;
  label: string;
  options: Option[];
  value: string[];
  placeholder?: string;
  onChange: (value: string) => void;
};

export const BaseSelect = ({
  classNames,
  label,
  options,
  value,
  placeholder,
  onChange,
}: Props) => (
  <>
    <label>{label}</label>

    <select className={`${classNames ?? ''}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">
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