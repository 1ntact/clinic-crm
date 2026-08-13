import {
  FiCheckCircle,
  FiClipboard,
  FiUsers,
  FiUserX,
} from "react-icons/fi";

export const DashboardOverview = () => {
  const statistics = [
    {
      title: "PATIENTS",
      value: "20",
      description: "↗ +8% vs last week",
      descriptionClass: "text-green-700",
      icon: FiUsers,
      iconClass: "bg-blue-100 text-blue-600",
    },
    {
      title: "COMPLETED VISITS",
      value: "46",
      description: "↗ +1% vs last week",
      descriptionClass: "text-green-700",
      icon: FiCheckCircle,
      iconClass: "bg-green-100 text-green-600",
    },
    {
      title: "CANCELLED VISITS",
      value: "12",
      description: "↘ 5 more than last week",
      descriptionClass: "text-red-600",
      icon: FiUserX,
      iconClass: "bg-orange-100 text-orange-600",
    },
    {
      title: "NO-SHOW",
      value: "46",
      description: "↘ 2 more than last week",
      descriptionClass: "text-red-600",
      icon: FiClipboard,
      iconClass: "bg-red-100 text-red-600",
    },
  ];

  const schedule = [
    {
      day: "Monday",
      time: "09:00 — 17:00",
    },
    {
      day: "Tuesday",
      time: "09:00 — 17:00",
    },
    {
      day: "Wednesday",
      time: "09:00 — 17:00",
    },
    {
      day: "Thursday",
      time: "09:00 — 17:00",
    },
    {
      day: "Friday",
      time: "09:00 — 17:00",
    },
    {
      day: "Saturday",
      time: "10:00 — 14:00",
      disabled: true,
    },
  ];

  const revenue = [
    {
      day: "Mo",
      value: 28000,
      height: "h-[97px]",
    },
    {
      day: "Tu",
      value: 32000,
      height: "h-[111px]",
    },
    {
      day: "We",
      value: 37000,
      height: "h-[126px]",
    },
    {
      day: "Th",
      value: 46000,
      height: "h-[161px]",
      active: true,
    },
    {
      day: "Fr",
      value: 32000,
      height: "h-[111px]",
    },
    {
      day: "Sa",
      value: 19000,
      height: "h-[67px]",
    },
    {
      day: "Su",
      value: 7000,
      height: "h-[25px]",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f6f8] p-5">
      <div className="mx-auto max-w-[1100px]">
        {/* ================= TABS ================= */}

        <div className="mb-5 border-b border-gray-200">
          <div className="flex h-7 items-start gap-4">
            <button
              type="button"
              className="relative h-7 text-[13px] font-medium text-blue-600"
            >
              Overview

              <span className="absolute bottom-[-1px] left-0 h-[2px] w-full bg-blue-600" />
            </button>

            <button
              type="button"
              className="text-[13px] text-gray-500"
            >
              Visits
            </button>
          </div>
        </div>

        {/* ================= STATISTICS ================= */}

        <div className="mb-2 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {statistics.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-gray-500">
                      {item.title}
                    </p>

                    <p className="mt-2 text-[20px] font-semibold leading-none text-gray-900">
                      {item.value}
                    </p>
                  </div>

                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${item.iconClass}`}
                  >
                    <Icon size={17} strokeWidth={1.7} />
                  </div>
                </div>

                <p
                  className={`mt-3 text-[11px] font-medium ${item.descriptionClass}`}
                >
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* ================= BOTTOM CONTENT ================= */}

        <div className="grid grid-cols-1 gap-2 lg:grid-cols-[0.8fr_1.25fr]">
          {/* ================= WORKING SCHEDULE ================= */}

          <section className="rounded-lg border border-gray-200 bg-white p-5">
            <h2 className="mb-4 text-[13px] font-semibold text-gray-600">
              WORKING SCHEDULE
            </h2>

            <div>
              {schedule.map((item) => (
                <div
                  key={item.day}
                  className={`flex h-[44px] items-center justify-between border-b border-gray-200 text-[14px] ${
                    item.disabled
                      ? "text-gray-400"
                      : "text-gray-800"
                  }`}
                >
                  <span>{item.day}</span>

                  <span>{item.time}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ================= WEEKLY REVENUE ================= */}

          <section className="rounded-lg border border-gray-200 bg-white p-5">
            {/* Header */}
            <div className="mb-3">
              <h2 className="text-[13px] font-semibold text-gray-600">
                WEEKLY REVENUE
              </h2>

              <div className="mt-1 flex items-center gap-4">
                <span className="text-[24px] font-semibold leading-none text-gray-900">
                  ₴ 46 800
                </span>

                <span className="text-[11px] font-medium text-red-500">
                  ↓ +8% vs last week
                </span>
              </div>
            </div>

            {/* Chart */}
            <div className="relative mt-4 h-[235px]">
              {/* Y axis labels */}
              <div className="absolute left-0 top-0 flex h-[180px] flex-col justify-between text-[10px] text-gray-500">
                <span>₴50k</span>
                <span>₴40k</span>
                <span>₴25k</span>
                <span>₴10k</span>
                <span>₴0</span>
              </div>

              {/* Chart area */}
              <div className="absolute left-[35px] right-0 top-0 h-[180px]">
                {/* Grid lines */}
                <div className="absolute left-0 right-0 top-0 border-t border-gray-200" />

                <div className="absolute left-0 right-0 top-[44px] border-t border-gray-200" />

                <div className="absolute left-0 right-0 top-[88px] border-t border-gray-200" />

                <div className="absolute left-0 right-0 top-[133px] border-t border-gray-200" />

                <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200" />

                {/* Bars */}
                <div className="absolute inset-x-0 bottom-0 flex h-full items-end justify-around px-5">
                  {revenue.map((item) => (
                    <div
                      key={item.day}
                      className="relative flex h-full w-8 items-end justify-center"
                    >
                      {/* Peak label */}
                      {item.active && (
                        <div className="absolute bottom-[169px] left-1/2 -translate-x-1/2">
                          <div className="relative whitespace-nowrap rounded-md bg-blue-600 px-2 py-2 text-[10px] font-medium text-white">
                            ↑ Peak day

                            <span className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 border-x-[5px] border-t-[5px] border-x-transparent border-t-blue-600" />
                          </div>
                        </div>
                      )}

                      {/* Bar */}
                      <div
                        className={`w-5 rounded-t-md ${
                          item.active
                            ? "bg-sky-500"
                            : "bg-sky-200"
                        } ${item.height}`}
                      />

                      {/* Day */}
                      <span className="absolute -bottom-7 text-[11px] text-gray-500">
                        {item.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};