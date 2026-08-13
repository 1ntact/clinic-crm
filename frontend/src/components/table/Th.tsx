import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export const Th = ({ children, className = "" }: Props) => {
  return (
    <th
      className={` pl-[16px] text-left text-sm font-semibold text-gray-500 ${className}`}
    >
      {children}
    </th>
  );
};