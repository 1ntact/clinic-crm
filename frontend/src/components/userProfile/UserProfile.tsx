import type { Doctor } from "@/types/doctor";
import type { Patient } from "@/types/patient";
import { PiPhoneCallThin, PiEnvelopeSimpleLight } from "react-icons/pi";

type Props =
  | {
      type: "doctor";
      selectedUser: Doctor;
    }
  | {
      type: "patient";
      selectedUser: Patient;
    };

export const UserProfile: React.FC<Props> = ({ selectedUser, type }) => {
  const userYear = (date: string) => {
    return new Date().getFullYear() - new Date(date).getFullYear();
  };

  return (
    <>
      <div className="flex w-full mr-[16px]">
        <img
          src={selectedUser.avatarUrl ?? "/favicon.svg"}
          alt="User"
          className="mr-2 h-12 w-12 rounded-lg bg-amber-300 object-cover"
        />

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-[18px] font-semibold">
              {selectedUser.firstName} {selectedUser.lastName}
            </h1>

            <span className="rounded-md bg-teal-100 px-3 py-1 text-sm font-medium text-teal-700">
              {type === "patient" ? "active" : selectedUser.employmentType}
            </span>
          </div>

          <div className=" flex items-center justify-between text-[14px] text-gray-500">
            
            <div className="flex gap-[4px]">
              <span>
                {type === "patient"
                  ? `ID: #${selectedUser.id}`
                  : selectedUser.doctorCode}
              </span>

              <span>
                {type === "patient"
                  ? `· ${userYear(selectedUser.dateOfBirth)} y.o.`
                  : `${selectedUser.yearsExperience} yrs exp.`}
              </span>
            </div>

            
         {  type ==='doctor' && <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <PiPhoneCallThin className="text-lg" />
                <span>{selectedUser.phoneNumber}</span>
              </div>

              <div className="flex items-center gap-2">
                <PiEnvelopeSimpleLight className="text-lg" />
                <span>{selectedUser.email}</span>
              </div>
            </div>}
          </div>
        </div>
      </div>

      {type === "doctor" && (
        <div className="mt-6 w-[320px] ml-auto">
          <div className="mb-2 flex justify-between text-sm">
            <span className="font-medium">Workload</span>
            <span>80%</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full w-[80%] rounded-full bg-[#EF4444]" />
          </div>
        </div>
      )}
    </>
  );
};