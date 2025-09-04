import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Employee.css';
import employeeBg from '../assets/employee-bg.png';
import Pagination from './Pagination';
import usePagination from '../hooks/usePagination';

const Employee = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const {
        currentPage,
        totalPages,
        currentItems: currentEmployees,
        startIndex,
        endIndex,
        handlePageChange,
        handlePreviousPage,
        handleNextPage
    } = usePagination(employees, 9);

    // Fetch employees from API
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:5000/api/employees');
                if (!response.ok) {
                    throw new Error('Failed to fetch employees');
                }
                const data = await response.json();
                setEmployees(data);
            } catch (err) {
                console.error('Error fetching employees:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    const handleEmployeeClick = (employeeId) => {
        navigate(`/employee/${employeeId}`);
    };

    if (loading) {
        return (
            <div className="employee-page">
                <h1>Employee Page</h1>
                <div className="loading-container">
                    <p>Loading employees...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="employee-page">
                <h1>Employee Page</h1>
                <div className="error-container">
                    <p>Error loading employees: {error}</p>
                    <button onClick={() => window.location.reload()}>Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="employee-page">

            <div className="employee-cards-container">
                {currentEmployees.map((employee) => (
                    <div
                        key={employee.id}
                        className="employee-unified-card"
                        onClick={() => handleEmployeeClick(employee.id)}
                        style={{ cursor: 'pointer' }}
                    >
                        <img
                            src={employeeBg}
                            alt="Employee Background"
                            className="employee-bg-image"
                        />
                        <img
                            src={employee.image ? (employee.image.startsWith('/src/assets/') ? employee.image : `/src/assets/${employee.image}`) : "/src/assets/employee1.png"}
                            alt="Employee"
                            className="employee-photo"
                        />
                        <div className="employee-fullname">
                            {employee.fullname}
                        </div>
                        <div className="employee-field-section">
                            <div className="employee-field">
                                <div className="employee-field-dot"></div>
                                {employee.field}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Component */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onPreviousPage={handlePreviousPage}
                onNextPage={handleNextPage}
                startIndex={startIndex}
                endIndex={endIndex}
                totalItems={employees.length}
                itemsPerPage={9}
                showInfo={true}
                className="employee-pagination"
            />
        </div>
    );
};

export default Employee;