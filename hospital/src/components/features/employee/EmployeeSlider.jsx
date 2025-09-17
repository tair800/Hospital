import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import iconNext from '../../../assets/icon-next.svg';

const EmployeeSlider = ({ employees }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [cardsPerPage, setCardsPerPage] = useState(window.innerWidth <= 768 ? 2 : 4);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            setCardsPerPage(window.innerWidth <= 768 ? 2 : 4);
            setCurrentPage(0); // Reset to first page when switching between mobile/desktop
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
                                            src="/assets/employee-bg.png"
                                            alt="Employee Background"
                                            className="home-employee-bg-image"
                                        />
                                        <img
                                            src={employee.image ? (employee.image.startsWith('/assets/') ? employee.image : employee.image.startsWith('/src/assets/') ? employee.image.replace('/src/assets/', '/assets/') : `/assets/${employee.image}`) : "/assets/employee1.png"}
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
                    <img
                        src={iconNext}
                        alt="Previous"
                        className="slider-nav-btn prev-btn"
                        onClick={goToPrevPage}
                        style={{
                            cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                            opacity: currentPage === 0 ? 0.3 : 1
                        }}
                    />

                    <img
                        src={iconNext}
                        alt="Next"
                        className="slider-nav-btn next-btn"
                        onClick={goToNextPage}
                        style={{
                            cursor: currentPage === displayTotalPages - 1 ? 'not-allowed' : 'pointer',
                            opacity: currentPage === displayTotalPages - 1 ? 0.3 : 1
                        }}
                    />
                </>
            )}
        </div>
    );
};

export default EmployeeSlider;
