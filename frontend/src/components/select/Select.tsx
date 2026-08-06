import type {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

type SelectOption = {
  label: string;
  value: string;
   disabled?: boolean;
};

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  option: SelectOption[];
  placeholder: string;
  className?: string;
onChange?: (value: string) => void;
  register: UseFormRegister<T>;
  rules?: RegisterOptions<T>;
  error?: string;
};

export const Select = <T extends FieldValues>({
  name,
  label,
  option,
  placeholder,
  className,
  register,
  onChange,
  rules,
  error,
}: Props<T>) => {
  const registerProps = register(name, rules);
  return (
    <div className={`flex flex-col ${className ?? ""}`}>
      <label htmlFor={name} className="mb-[10px] text-[14px] font-medium">
        {label}
      </label>

      <select
        id={name}
        defaultValue=""
        {...registerProps}
  onChange={(e) => {
    registerProps.onChange(e);      
    onChange?.(e.target.value);     
  }}
        className="h-[44px] rounded-[5px] border border-gray-300 px-3"
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {option.map((item) => (
          <option key={item.value} value={item.value}
          disabled={item.disabled}>
            {item.label}
          </option>
        ))}
      </select>

      {error && (
        <span className="mt-1 text-sm text-red-500">
          {error}
        </span>
      )}
    </div>
  );
};