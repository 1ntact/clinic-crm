import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export const Td = ({ children, className = "" }: Props) => {
  return (
    <td
      className={`px-[16px] py-[12px] text-[14px]  border-t border-gray-100 ${className}`}
    >
      {children}
    </td>
  );
};