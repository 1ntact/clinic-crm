import { HiOutlineUserGroup } from "react-icons/hi2";
import { HiArrowUpRight } from "react-icons/hi2";

type Props = {
  statistic: Record<string, number>;
};

export const PatientStatisticCard: React.FC<Props> = ({ statistic }) => {
  const formatKey = (key: string) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());
  return (
    <><div className="flex gap-[8px]">
      {Object.entries(statistic).map(([key, value]) => (
        <div 
          key={key}
          className="flex h-[110px] w-[277px] gap-[8px] items-center justify-between rounded-2xl border border-[#E5E7EB] bg-white px-7 shadow-sm"
        >
          <div className="flex flex-col">
            <span className="text-[14px] font-semibold uppercase tracking-wide text-[#6B7280]">
              {formatKey(key)}
            </span>

            <h2 className="mt-5 text-[20px] font-bold leading-none text-[#111827]">
              {value}
            </h2>

            <div className="mt-6 flex items-center gap-2 text-[#15803D]">
              <HiArrowUpRight className="h-[16px] w-[16px]" />

              <span className="text-[12px] font-medium">
                +8% vs last month
              </span>
            </div>
          </div>

          <div className="flex h-[40px] w-[40px] items-center justify-center rounded-3xl bg-[#DBEAFE]">
            <HiOutlineUserGroup className="h-[16px] w-[16px] text-[#2563EB]" />
          </div>
        </div>
      ))}
   </div> </>
  );
};