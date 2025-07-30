export default function Paginate({
  totalPages,
  hasMore,
  handlePageChange,
  currentPage,
  limit,
}) {
  return (
    <div className="flex justify-center md:justify-between items-center py-4">
      <p className="hidden md:block">
        Showing {currentPage}-{limit} of Page {totalPages}
      </p>
      <div className="join bg-white border border-slate-200 rounded-lg">
        <button
          onClick={() => handlePageChange("first")}
          className={`join-item btn ${
            currentPage === 1
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer"
          }`}
        >
          «
        </button>
        <button
          onClick={() => handlePageChange("prev")}
          className={`join-item btn text-zinc-800 ${
            currentPage === 1
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer"
          }`}
        >
          prev
        </button>
        <button className="join-item btn bg-blue-500 text-white">
          {currentPage}
        </button>
        <button
          onClick={() => handlePageChange("next")}
          className={`join-item btn text-zinc-800 ${
            !hasMore ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          }`}
        >
          next
        </button>
        <button
          onClick={() => handlePageChange("last")}
          className={`join-item btn ${
            !hasMore ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          }`}
        >
          »
        </button>
      </div>
    </div>
  );
}
