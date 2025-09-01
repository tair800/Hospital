import React, { useState } from 'react';
import './Employee.css';
import employeeBg from '../assets/employee-bg.png';
import employee1 from '../assets/employee1.png';

const Employee = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const cardsPerPage = 9;

    // All employee data
    const allEmployees = [
        { name: "Əli Məmmədov", specialty: "Ürək-damar cərrahı" },
        { name: "Dr. Leyla Əliyeva", specialty: "Nevrolog" },
        { name: "Prof. Rəşad Həsənov", specialty: "Ortoped" },
        { name: "Dr. Aysel Məmmədova", specialty: "Pediatr" },
        { name: "Dr. Elvin Quliyev", specialty: "Kardioloq" },
        { name: "Dr. Nigar Rəhimova", specialty: "Ginekoloq" },
        { name: "Prof. Tural Əliyev", specialty: "Onkoloq" },
        { name: "Dr. Səbinə Hüseynova", specialty: "Dermatoloq" },
        { name: "Dr. Rəvan Məlikov", specialty: "Urolog" },
        { name: "Dr. Günel Vəliyeva", specialty: "Endokrinoloq" },
        { name: "Dr. Orxan Əliyev", specialty: "Psixiatr" },
        { name: "Dr. Aynur Məmmədova", specialty: "Anesteziolog" }
    ];

    // Calculate total pages dynamically
    const totalPages = Math.ceil(allEmployees.length / cardsPerPage);

    // Calculate which cards to show
    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    const currentEmployees = allEmployees.slice(startIndex, endIndex);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="employee-page">
            <h1>Employee Page</h1>
            <p>This page is currently empty.</p>

            <div className="employee-cards-container">
                {currentEmployees.map((employee, index) => (
                    <div key={index} className="employee-unified-card">
                        <img
                            src={employeeBg}
                            alt="Employee Background"
                            className="employee-bg-image"
                        />
                        <img
                            src={employee1}
                            alt="Employee"
                            className="employee-photo"
                        />
                        <div className="employee-fullname">
                            {employee.name}
                        </div>
                        <div className="employee-field-section">
                            <div className="employee-field">
                                <div className="employee-field-dot"></div>
                                {employee.specialty}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pagination-container">
                <button
                    className="pagination-arrow"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                >
                    &lt;
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                        onClick={() => handlePageClick(page)}
                    >
                        {page}
                    </button>
                ))}

                <button
                    className="pagination-arrow"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                >
                    &gt;
                </button>
            </div>
        </div>
    );
};

export default Employee;