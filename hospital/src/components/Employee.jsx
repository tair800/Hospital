import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Employee.css';
import employeeBg from '../assets/employee-bg.png';
import { employeeData } from '../data/employee-data';

const Employee = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('all');

    // Fetch employee data from API (fallback to local data)
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setLoading(true);
                // Try to fetch from API first
                const response = await fetch('http://localhost:5000/api/employees');
                if (response.ok) {
                    const data = await response.json();
                    setEmployees(data);
                } else {
                    // Fallback to local data
                    setEmployees(employeeData);
                }
            } catch (err) {
                console.log('Using local employee data');
                setEmployees(employeeData);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    // Helper function to get correct image path
    const getImagePath = (imageName) => {
        if (!imageName) return '';
        if (imageName.startsWith('/src/assets/')) return imageName;
        return `/src/assets/${imageName}`;
    };

    // Filter employees based on search and department
    const filteredEmployees = employees.filter(employee => {
        const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.department.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;

        return matchesSearch && matchesDepartment;
    });

    // Get unique departments for filter
    const departments = ['all', ...new Set(employees.map(emp => emp.department))];

    // Show loading state
    if (loading) {
        return (
            <div className="employee-page">
                <div className="employee-loading">
                    <p>Loading employees...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="employee-page">
                <div className="employee-error">
                    <p>Error loading employees: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="employee-page">
            {/* Background Image */}
            <div className="employee-bg">
                <img src={employeeBg} alt="Employee Background" />
            </div>

            {/* Header Section */}
            <div className="employee-header">
                <div className="employee-header-content">
                    <h1 className="employee-title">Our Medical Team</h1>
                    <p className="employee-subtitle">
                        Meet our dedicated healthcare professionals committed to providing exceptional care
                    </p>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="employee-filters">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <i className="search-icon">🔍</i>
                </div>

                <div className="department-filter">
                    <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="department-select"
                    >
                        {departments.map(dept => (
                            <option key={dept} value={dept}>
                                {dept === 'all' ? 'All Departments' : dept}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Employee Grid */}
            <div className="employee-grid">
                {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                        <div key={employee.id} className="employee-card">
                            <div className="employee-card-image">
                                <img
                                    src={getImagePath(employee.image)}
                                    alt={employee.name}
                                    className="employee-image"
                                />
                                <div className="employee-card-overlay">
                                    <Link
                                        to={`/employee/${employee.id}`}
                                        className="view-profile-btn"
                                    >
                                        View Profile
                                    </Link>
                                </div>
                            </div>

                            <div className="employee-card-content">
                                <h3 className="employee-name">{employee.name}</h3>
                                <p className="employee-position">{employee.position}</p>
                                <p className="employee-department">{employee.department}</p>
                                <p className="employee-experience">{employee.experience} experience</p>

                                <div className="employee-card-actions">
                                    <Link
                                        to={`/employee/${employee.id}`}
                                        className="profile-link"
                                    >
                                        Full Profile →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-results">
                        <p>No employees found matching your criteria.</p>
                    </div>
                )}
            </div>

            {/* Stats Section */}
            <div className="employee-stats">
                <div className="stat-item">
                    <h3>{employees.length}</h3>
                    <p>Medical Professionals</p>
                </div>
                <div className="stat-item">
                    <h3>{new Set(employees.map(emp => emp.department)).size}</h3>
                    <p>Departments</p>
                </div>
                <div className="stat-item">
                    <h3>{employees.reduce((total, emp) => {
                        const years = parseInt(emp.experience);
                        return total + (isNaN(years) ? 0 : years);
                    }, 0)}</h3>
                    <p>Combined Years of Experience</p>
                </div>
            </div>
        </div>
    );
};

export default Employee;
