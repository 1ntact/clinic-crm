


const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div>
    <p className="text-sm font-medium text-slate-500">{label}</p>
    <p className="mt-2 text-[15px] text-slate-800">{value}</p>
  </div>
);

export const PatientInformation = () => {
  return (
    <div className="w-full bg-[#f5f6f8] p-4 text-slate-900">
      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex items-center gap-5">
          <button
            type="button"
            className="border-b-2 border-blue-600 px-0 pb-3 text-[13px] font-medium text-blue-600"
          >
            Patient information
          </button>

          <button
            type="button"
            className="flex items-center gap-2 pb-3 text-[13px] text-slate-400"
          >
            Appointment history
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] text-blue-400">
              5
            </span>
          </button>

          <button
            type="button"
            className="flex items-center gap-2 pb-3 text-[13px] text-slate-400"
          >
            Medical records
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] text-blue-400">
              24
            </span>
          </button>
        </div>
      </div>

      {/* Medical alerts */}
      <section className="mt-4 rounded-lg border border-slate-200 bg-white px-5 py-4">
        <h2 className="text-[13px] font-semibold uppercase text-slate-500">
          Medical alerts & conditions
        </h2>

        <div className="mt-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1.5 text-xs text-red-700">
            Allergy: Penicillin
            <button type="button" className="ml-1 text-red-500">
              ×
            </button>
          </span>

          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1.5 text-xs text-red-700">
            Requires premedication
            <button type="button" className="ml-1 text-red-500">
              ×
            </button>
          </span>

          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm"
          >
            <span className="text-base leading-none">+</span>
            Add allergy
          </button>
        </div>
      </section>

     

      {/* Information */}
      <div className="mt-2 grid grid-cols-1 gap-2 lg:grid-cols-[0.8fr_1.2fr]">
        {/* Personal info */}
        <section className="rounded-lg border border-slate-200 bg-white px-5 py-4">
          <h2 className="text-[13px] font-semibold uppercase text-slate-500">
            Personal info
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-7">
            <InfoItem label="Gender" value="Female" />
            <InfoItem label="Mobile number" value="+380935671250" />

            <InfoItem label="City" value="London" />
            <InfoItem label="Address" value="St. Saint Street" />

            <InfoItem label="Birth date" value="24 March, 1995" />
            <InfoItem label="Member status" value="Active" />
          </div>
        </section>

        {/* Administrative info */}
        <section className="rounded-lg border border-slate-200 bg-white px-5 py-4">
          <h2 className="text-[13px] font-semibold uppercase text-slate-500">
            Administrative info
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-x-12 gap-y-7">
            <InfoItem
              label="Patient Source"
              value="Recommendation M.Polischuk"
            />

            <InfoItem label="Preferred time" value="After 12 a.m." />

            <InfoItem
              label="Confirmation preference"
              value="Phone call"
            />

            <InfoItem label="Preferred language" value="English" />

            <InfoItem label="Reminder type" value="SMS" />

            <InfoItem label="Registration date" value="14.08.2022" />
          </div>
        </section>
      </div>
    </div>
  );
};