import { useState } from "react";
import type {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

import { PiEyeLight, PiEyeSlash } from "react-icons/pi";
import { CiSearch } from "react-icons/ci";

type InputProps<T extends FieldValues> =
  React.InputHTMLAttributes<HTMLInputElement> & {
    name: Path<T>;
    label?: string;
    register?: UseFormRegister<T>;
    rules?: RegisterOptions<T>;
    error?: string;
    inputClassName?: string;
    clasName?: string;
    readOnly?: boolean;
  };

export function Input<T extends FieldValues>({
  readOnly,
  label,
  register,
  rules,
  error,
  type,
  name,
  className,
  inputClassName,
  ...props
}: InputProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  const registerProps =
    register ? register(name, rules) : {};

 return (
  <div className={className}>
    {label && (
      <label
        htmlFor={name}
        className="mb-1 block text-sm font-medium text-[#374151]"
      >
        {label}
      </label>
    )}

    <div className="relative">
      <input
        readOnly={readOnly}
        id={name}
        type={
          showPassword && type === "password"
            ? "text"
            : type
        }
        className={`
          h-[44px]
          w-full
          rounded-[8px]
          border
          bg-white
          p-2
          text-[14px]
          outline-none
          transition-colors

          ${type === "search" ? "pl-10" : "pr-10"}

          ${
            error
              ? "border-[#EF4444] focus:border-[#EF4444]"
              : "border-[#E5E7EB] focus:border-[#2563EB]"
          }

          ${inputClassName ?? ""}
        `}
        {...props}
        {...registerProps}
      />

      {type === "password" && (
        <button
          type="button"
          onClick={() =>
            setShowPassword((prev) => !prev)
          }
          className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
          "
        >
          {showPassword ? (
            <PiEyeLight />
          ) : (
            <PiEyeSlash />
          )}
        </button>
      )}

      {type === "search" && (
        <CiSearch
          className="
            absolute
            left-3
            top-1/2
            -translate-y-1/2
            text-xl
          "
        />
      )}
    </div>

    {error && (
      <p className="mt-2 text-[13px] text-red-500">
        {error}
      </p>
    )}
  </div>
);
}