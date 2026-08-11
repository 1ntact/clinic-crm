import React from "react";

const CalendarIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
  >
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
    <path d="m9 15 2 2 4-4" />
  </svg>
);

const WalletIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
  >
    <rect x="3" y="5" width="18" height="15" rx="2" />
    <path d="M16 12h5" />
    <path d="M16 9h5v6h-5a3 3 0 1 1 0-6Z" />
  </svg>
);

const AlertIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
  >
    <path d="M10.3 3.7 2.9 17a2 2 0 0 0 1.7 3h14.8a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9v4M12 16h.01" />
  </svg>
);

const HygieneIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
  >
    <path d="M19 3c-4 0-7 3-7 7v4" />
    <path d="M12 14c0 4-2 7-6 7" />
    <path d="M7 21c-2-1-3-3-3-5" />
    <path d="M12 14c2 0 4 1 5 3" />
    <path d="M19 3v5" />
    <path d="M19 8c-2 0-4-1-5-2" />
  </svg>
);

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  iconClass,
  subtitleClass = "text-slate-500",
}: {
  title: string;
  value: string;
  subtitle: React.ReactNode;
  icon: React.ReactNode;
  iconClass: string;
  subtitleClass?: string;
}) => (
  <div className="rounded-lg border border-slate-200 bg-white px-4 py-3.5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
          {title}
        </p>

        <p className="mt-2 text-xl font-semibold text-slate-900">
          {value}
        </p>
      </div>

      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconClass}`}
      >
        {icon}
      </div>
    </div>

    <p className={`mt-1 text-xs ${subtitleClass}`}>{subtitle}</p>
  </div>
);

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

      {/* Statistics */}
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Appointments"
          value="14"
          subtitle={<>Next: 24.07, 14:00</>}
          icon={<CalendarIcon />}
          iconClass="bg-blue-100 text-blue-600"
        />

        <StatCard
          title="Balance"
          value="+ ₴ 200"
          subtitle={
            <>
              <span className="mr-1 text-green-600">↗</span>
              <span className="text-green-700">On deposit</span>
            </>
          }
          icon={<WalletIcon />}
          iconClass="bg-green-100 text-green-600"
        />

        <StatCard
          title="No-shows"
          value="3"
          subtitle={<>Late cancellations</>}
          icon={<AlertIcon />}
          iconClass="bg-orange-100 text-orange-600"
        />

        <StatCard
          title="Hygiene"
          value="Overdue"
          subtitle={
            <>
              <span className="mr-1 text-red-600">↓</span>
              <span className="text-red-600">Last visit: 6 months ago</span>
            </>
          }
          icon={<HygieneIcon />}
          iconClass="bg-red-100 text-red-600"
          subtitleClass="text-red-600"
        />
      </div>

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