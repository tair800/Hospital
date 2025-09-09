import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import employeeBg from '../../assets/employee-bg.png';
// Removed speakerData import - now fetching from API
import './EmployeeSlider.css';

const EmployeeSlider = ({ eventId = 1 }) => {
    const [employees, setEmployees] = useState([]);
    const [speakers, setSpeakers] = useState([]);
    const [combinedData, setCombinedData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const navigate = useNavigate();

    const itemsPerPage = 4;

    // Fetch employees and speakers from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch event-specific employees from API
                const employeeResponse = await fetch(`http://localhost:5000/api/eventemployees/event/${eventId}`);
                if (!employeeResponse.ok) {
                    throw new Error('Failed to fetch event employees');
                }
                const employeeData = await employeeResponse.json();
                setEmployees(employeeData);

                // Fetch speakers for the specific event
                const speakerResponse = await fetch(`http://localhost:5000/api/eventspeakers/event/${eventId}`);
                let speakerData = [];
                if (speakerResponse.ok) {
                    speakerData = await speakerResponse.json();
                    setSpeakers(speakerData);
                }

                // Combine employees and speakers
                const combined = [
                    ...employeeData.map(emp => ({ ...emp, type: 'employee' })),
                    ...speakerData.map(speaker => ({ ...speaker, type: 'speaker' }))
                ];

                setCombinedData(combined);

            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [eventId]); // Add eventId dependency to refetch when event changes

    const handleItemClick = (item) => {
        if (item.type === 'employee') {
            navigate(`/employee/${item.id}`);
        } else if (item.type === 'speaker') {
            // For speakers, we could navigate to a speaker detail page or show a modal
            console.log('Speaker clicked:', item);
            // For now, just log. You can add speaker detail functionality later
        }
    };

    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(0, prev - 1));
    };

    const handleNextPage = () => {
        const maxPage = Math.ceil(combinedData.length / itemsPerPage) - 1;
        setCurrentPage(prev => Math.min(maxPage, prev + 1));
    };

    const getCurrentPageItems = () => {
        const startIndex = currentPage * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return combinedData.slice(startIndex, endIndex);
    };

    const totalPages = Math.ceil(combinedData.length / itemsPerPage);

    if (loading) {
        return (
            <div className="employee-slider">
                <div className="employee-slider-loading">
                    <p>Loading data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="employee-slider">
                <div className="employee-slider-error">
                    <p>Error loading data: {error}</p>
                </div>
            </div>
        );
    }

    if (combinedData.length === 0) {
        return (
            <div className="employee-slider">
                <div className="employee-slider-empty">
                    <p>No data found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="employee-slider">

            <div className="employee-slider-container">
                <div className="employee-slider-cards" key={currentPage}>
                    {getCurrentPageItems().map((item, index) => (
                        <div
                            key={`${item.type}-${item.id || index}`}
                            className="employee-slider-card"
                            onClick={() => handleItemClick(item)}
                            style={{ cursor: 'pointer' }}
                        >
                            <img
                                src={employeeBg}
                                alt="Background"
                                className="employee-slider-bg-image"
                            />
                            <img
                                src={item.image ? (item.image.startsWith('/src/assets/') ? item.image : `/src/assets/${item.image}`) : "/src/assets/employee1.png"}
                                alt={item.type === 'speaker' ? 'Speaker' : 'Employee'}
                                className="employee-slider-photo"
                            />
                            <div className="employee-slider-fullname">
                                {item.type === 'speaker' ? item.name : item.fullname}
                            </div>
                            <div className="employee-slider-field-section">
                                <div className="employee-slider-field">
                                    <div className="employee-slider-field-dot"></div>
                                    {item.type === 'speaker' ? item.title : item.field}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {combinedData.length > 4 && (
                <div className="employee-slider-bottom-controls">
                    <button
                        className="employee-slider-bottom-arrow employee-slider-bottom-arrow-left"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 0}
                    >
                        ‹
                    </button>
                    <button
                        className="employee-slider-bottom-arrow employee-slider-bottom-arrow-right"
                        onClick={handleNextPage}
                        disabled={currentPage >= totalPages - 1}
                    >
                        ›
                    </button>
                </div>
            )}
        </div>
    );
};

export default EmployeeSlider;
