export default function Paginate({
  totalPages,
  hasMore,
  handlePageChange,
  currentPage,
  limit,
}) {
  return (
    <div className="flex justify-center md:justify-between items-center p-4">
      <p className="hidden md:block">
        Showing {currentPage}-{limit} of {totalPages}
      </p>
      <div className="join border-[0.2px] border-gray-300 rounded-md">
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
          className={`join-item btn ${
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
          className={`join-item btn ${
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
