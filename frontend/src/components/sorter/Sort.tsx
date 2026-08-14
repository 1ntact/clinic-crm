import type { SortButton, SortOrder } from "./sortTypes";

type Props<T extends string> = {
  userCount: number;
  className?: string;
  sortBy: T;
  sortOrder: SortOrder;
  buttons: SortButton<T>[];
  onChange: (sortBy: T, sortOrder: SortOrder) => void;
};

export const Sort = <T extends string>({
  className,
  userCount,
  buttons,
  sortBy,
  sortOrder,
  onChange,
}: Props<T>) => {
  const handleClick = (value: T) => {
    if (value === sortBy) {
      onChange(
        value,
        sortOrder === "asc" ? "desc" : "asc",
      );
    } else {
      onChange(value, "asc");
    }
  };

  return (
    <div
      className={`h-[32px] flex items-center gap-4 ${
        className ?? ""
      }`}
    >
      <span>Sort:</span>

      {buttons.map((button) => (
        <button
          key={button.value}
          type="button"
          disabled={userCount < 5}
          onClick={() => handleClick(button.value)}
          className={`h-[32px]
            flex
            items-center
            rounded-[8px]
            px-3
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
            disabled:bg-gray-200
            disabled:text-gray-400
            ${
              sortBy === button.value
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-gray-300 bg-white hover:bg-[#DBEAFE]"
            }`}
        >
          {button.label}

          {sortBy === button.value && (
            <span className="ml-2">
              {sortOrder === "asc" ? "↑" : "↓"}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};