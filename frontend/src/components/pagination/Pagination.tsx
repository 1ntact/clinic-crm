type Props = {
  page: number ;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
};

export const Pagination: React.FC<Props> = ({
  page,
  pageSize,
  total,
  onPageChange,
}) => {
  const totalPages = Math.ceil(total / pageSize);

const getPages = (): (number | "...")[] => {
  const siblingCount = 1;
  const boundaryCount = 1;

  // Всі сторінки, якщо їх мало
  const totalVisiblePages =
    boundaryCount * 2 + siblingCount * 2 + 3;

  if (totalPages <= totalVisiblePages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const startPages = Array.from(
    { length: boundaryCount },
    (_, i) => i + 1,
  );

  const endPages = Array.from(
    { length: boundaryCount },
    (_, i) => totalPages - boundaryCount + i + 1,
  );

  const leftSibling = Math.max(
    page - siblingCount,
    boundaryCount + 2,
  );

  const rightSibling = Math.min(
    page + siblingCount,
    totalPages - boundaryCount - 1,
  );

  const showLeftDots = leftSibling > boundaryCount + 2;
  const showRightDots =
    rightSibling < totalPages - boundaryCount - 1;

  const pages: (number | "...")[] = [];


  pages.push(...startPages);

 
  if (showLeftDots) {
    pages.push("...");
  } else {
    for (
      let i = boundaryCount + 1;
      i < leftSibling;
      i++
    ) {
      pages.push(i);
    }
  }


  for (let i = leftSibling; i <= rightSibling; i++) {
    pages.push(i);
  }

 
  if (showRightDots) {
    pages.push("...");
  } else {
    for (
      let i = rightSibling + 1;
      i <= totalPages - boundaryCount;
      i++
    ) {
      pages.push(i);
    }
  }

 
  pages.push(...endPages);

  return pages;
};
  return (total !==0 &&( <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500">
        Showing {(page - 1) * pageSize + 1}-
        {Math.min(page * pageSize, total)} of {total}
      </p>

      <div className="flex items-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="text-[14px] rounded-[8px] text-[#1F2937] cursor-pointer disabled:opacity-50"
        >
          {"< Previous"}
        </button>

        {getPages().map((item, index) =>
          item === "..." ? (
           <span
  key={`dots-${index}`}
  className="w-[38px] h-[38px] flex items-center justify-center text-[18px] font-semibold text-gray-500 leading-none"
>
  ...
</span>
          ) : (
            <button
              key={item}
              disabled={page === item}
              onClick={() => onPageChange(item)}
              className={`text-[14px] w-[38px] h-[38px] rounded-[8px] ${
                page === item
                  ? " border   border-[#E5E7EB] text-blue-600 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              {item}
            </button>
          ),
        )}

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="text-[14px] rounded-[8px] text-[#1F2937] cursor-pointer disabled:opacity-50"
        >
          {"Next >"}
        </button>
      </div>
    </div>)
  );
};