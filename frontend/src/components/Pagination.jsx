import React from "react";

function Pagination({ page, totalPages, setPage }) {
    return (
        <div className="flex justify-center items-center gap-3 mt-6">
            <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className={`px-4 py-2 rounded-full transition font-medium text-sm ${
                    page === 0
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
                ◀ Previous
            </button>

            <span className="text-sm text-gray-700 font-semibold tracking-wide">
        Page <span className="text-blue-600">{page + 1}</span> of <span>{totalPages}</span>
      </span>

            <button
                disabled={page + 1 >= totalPages}
                onClick={() => setPage(page + 1)}
                className={`px-4 py-2 rounded-full transition font-medium text-sm ${
                    page + 1 >= totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
                Next ▶
            </button>
        </div>
    );
}

export default Pagination;
