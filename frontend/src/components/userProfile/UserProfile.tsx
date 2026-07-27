import type { Doctor } from "@/types/doctor";
import type { Patient } from "@/types/patient";

type Props = {
  type : 'patient' | 'doctor',
  selectedUser: Patient;
};
export const UserProfile: React.FC<Props> = ({ selectedUser, type }) => {
  const userYear = (date:string) => {
  const now = new Date()
    const year =  Number( now.toLocaleDateString('uk-UA').slice(-4))  - Number(date.slice(0,4))
    return year
  }
  
  return (
    <>
      {" "}
      <div className="h-[52px]  flex  ">
        <img
          src={selectedUser.avatarUrl ?? '/favicon.png'}
          alt="User"
          className=" h-[48px] w-[48px] mr-[8px] rounded-[8px] bg-amber-300 object-cover"
        />

        <div>
          <div className=" flex items-center gap-2">
            <h1 className="text-[18px] font-semibold">
              {selectedUser?.firstName} {selectedUser?.lastName}
            </h1>

            <span className="rounded-md bg-teal-100 px-3 py-1 text-sm font-medium text-teal-700">
              {'active'}
            </span>
          </div>

        

          <div className="flex gap-[4px] text-[14px]  text-gray-500">
            <span>{`ID: #${selectedUser?.id}`}</span>

            <span>{`· ${userYear(selectedUser.dateOfBirth)} y.o.`}</span>
          </div>
        </div>
      </div>
    {type === 'doctor' && <div className="w-[320px]">
      <div className="mb-2 flex justify-between text-sm">
        <span className="font-medium">Workload</span>

        <span>80%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-gray-200">
        <div className="h-full w-[80%] rounded-full bg-[#EF4444]"></div>
      </div>
    </div>}
    </>
  );
};
