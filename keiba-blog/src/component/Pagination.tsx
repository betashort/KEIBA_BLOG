interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="ページネーション" className="mt-8 flex justify-center">
      <ul className="flex flex-wrap items-center gap-1">
        <li>
          <button
            type="button"
            className="rounded px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300"
            disabled={page <= 1}
            onClick={() => onChange(page - 1)}
            aria-label="前のページ"
          >
            &lt;
          </button>
        </li>
        {pages.map((pageNumber) => (
          <li key={pageNumber}>
            <button
              type="button"
              className={`min-w-9 rounded px-3 py-1.5 text-sm ${
                pageNumber === page
                  ? "bg-blue-600 font-semibold text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              aria-current={pageNumber === page ? "page" : undefined}
              onClick={() => onChange(pageNumber)}
            >
              {pageNumber}
            </button>
          </li>
        ))}
        <li>
          <button
            type="button"
            className="rounded px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300"
            disabled={page >= totalPages}
            onClick={() => onChange(page + 1)}
            aria-label="次のページ"
          >
            &gt;
          </button>
        </li>
      </ul>
    </nav>
  );
}
