import type {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  placeholder?: string;
  className?: string;
  rows?: number;

  register: UseFormRegister<T>;
  rules?: RegisterOptions<T>;
  error?: string;
};

export const TextArea = <T extends FieldValues>({
  name,
  label,
  placeholder,
  className,
  rows = 5,
  register,
  rules,
  error,
}: Props<T>) => {
  return (
    <div className={`flex flex-col ${className ?? ""}`}>
      <label
        htmlFor={name}
        className="mb-[10px] text-[14px] font-medium"
      >
        {label}
      </label>

      <textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        {...register(name, rules)}
        className={`
          min-h-[120px]
          rounded-[5px]
          border
          border-gray-300
          px-3
          py-2
          outline-none
          transition-colors
          resize-none
          focus:border-blue-500
          ${error ? "border-red-500" : ""}
        `}
      />

      {error && (
        <span className="mt-1 text-sm text-red-500">
          {error}
        </span>
      )}
    </div>
  );
};