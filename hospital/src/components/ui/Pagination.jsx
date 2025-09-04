import React from 'react';
import './Pagination.css';

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    onPreviousPage,
    onNextPage,
    startIndex,
    endIndex,
    totalItems,
    itemsPerPage = 9,
    showInfo = true,
    className = ""
}) => {
    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className={`pagination-wrapper ${className}`}>
            {showInfo && (
                <div className="pagination-info">
                    Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} items
                </div>
            )}

            <div className="pagination-controls">
                <button
                    className="pagination-arrow pagination-prev"
                    onClick={onPreviousPage}
                    disabled={currentPage === 1}
                >
                    &lt;
                </button>

                <div className="pagination-pages">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                        <button
                            key={pageNumber}
                            className={`pagination-page ${currentPage === pageNumber ? 'pagination-active' : ''}`}
                            onClick={() => onPageChange(pageNumber)}
                        >
                            {pageNumber}
                        </button>
                    ))}
                </div>

                <button
                    className="pagination-arrow pagination-next"
                    onClick={onNextPage}
                    disabled={currentPage === totalPages}
                >
                    &gt;
                </button>
            </div>
        </div>
    );
};

export default Pagination;
