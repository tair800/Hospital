import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EmployeeSlider = ({ employees }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const navigate = useNavigate();
    const cardsPerPage = 4;

    if (!employees || employees.length === 0) {
        return <div className="no-employees-message">Həkim tapılmadı</div>;
    }

    const totalPages = Math.ceil(employees.length / cardsPerPage);

    // Debug: Log the slider state
    console.log('EmployeeSlider Debug:', {
        totalEmployees: employees.length,
        totalPages,
        currentPage,
        cardsPerPage
    });

    // Use all employees for the slider
    const displayEmployees = employees;
    const displayTotalPages = Math.ceil(displayEmployees.length / cardsPerPage);

    const goToNextPage = () => {
        setCurrentPage((prev) => (prev + 1) % displayTotalPages);
    };

    const goToPrevPage = () => {
        setCurrentPage((prev) => (prev - 1 + displayTotalPages) % displayTotalPages);
    };

    const goToPage = (pageIndex) => {
        setCurrentPage(pageIndex);
    };

    return (
        <div className="employee-slider-container">
            <div className="employee-slider-wrapper">
                <div
                    className="employee-slider-content"
                    style={{
                        transform: `translateX(-${currentPage * 100}%)`
                    }}
                >
                    {Array.from({ length: displayTotalPages }, (_, pageIndex) => {
                        const pageEmployees = displayEmployees.slice(
                            pageIndex * cardsPerPage,
                            (pageIndex + 1) * cardsPerPage
                        );

                        return (
                            <div key={pageIndex} className="employee-slider-page">
                                {pageEmployees.map((employee) => (
                                    <div
                                        key={employee.id}
                                        className="home-employee-card"
                                        onClick={() => {
                                            navigate(`/employee/${employee.id}`);
                                            window.scrollTo(0, 0);
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <img
                                            src="/src/assets/employee-bg.png"
                                            alt="Employee Background"
                                            className="home-employee-bg-image"
                                        />
                                        <img
                                            src={employee.image ? (employee.image.startsWith('/src/assets/') ? employee.image : `/src/assets/${employee.image}`) : "/src/assets/employee1.png"}
                                            alt="Employee"
                                            className="home-employee-photo"
                                        />
                                        <div className="home-employee-fullname">
                                            {employee.fullname}
                                        </div>
                                        <div className="home-employee-field-section">
                                            <div className="home-employee-field">
                                                <div className="home-employee-field-dot"></div>
                                                {employee.field}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Navigation Controls - Always show if there are multiple pages */}
            {displayTotalPages > 1 && (
                <>
                    <button
                        className="slider-nav-btn prev-btn"
                        onClick={goToPrevPage}
                        disabled={currentPage === 0}
                        aria-label="Previous page"
                    >
                        <img src="/src/assets/slider-prev.png" alt="Previous" width="34" height="34" />
                    </button>

                    <button
                        className="slider-nav-btn next-btn"
                        onClick={goToNextPage}
                        disabled={currentPage === displayTotalPages - 1}
                        aria-label="Next page"
                    >
                        <img src="/src/assets/slider-next.png" alt="Next" width="34" height="34" />
                    </button>
                </>
            )}
        </div>
    );
};

export default EmployeeSlider;
