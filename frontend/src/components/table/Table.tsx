import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const Table = ({ children }: Props) => {
  return (
    <div className="mb-[16px] bg-white">
      <table className="w-full">
        <colgroup>
          <col  />
          <col />
          <col />
          <col />
          <col />
          <col />
          <col />
        </colgroup>

        {children}
      </table>
    </div>
  );
};