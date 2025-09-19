import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getContextualImagePath } from '../../../utils/imageUtils';
import './EmployeeDetail.css';
import iconNext from '../../../assets/icon-next.svg';
import iconPrev from '../../../assets/icon-prev.svg';
import LogoCarousel from '../../ui/LogoCarousel';

const EmployeeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const employeeId = parseInt(id);

    // Employee data state
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    // Carousel state
    const [currentPage, setCurrentPage] = useState(0);
    const [slideDirection, setSlideDirection] = useState('');
    const [isSliding, setIsSliding] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [activeImageSrc, setActiveImageSrc] = useState('');

    // Fetch employee data from API
    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                setLoading(true);
                const response = await fetch(`https://localhost:5000/api/employees/${employeeId}`);
                if (!response.ok) {
                    throw new Error('Employee not found');
                }
                const employeeData = await response.json();
                setEmployee(employeeData);
            } catch (err) {
                console.error('Error fetching employee:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (employeeId) {
            fetchEmployee();
        }
    }, [employeeId]);

    // Get certificate cards from employee data only
    const allCards = employee?.certificates ? employee.certificates.map(cert => ({
        id: cert.id,
        image: cert.certificateImage,
        name: cert.certificateName
    })) : [];

    // Detect mobile screen size
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const cardsPerPage = isMobile ? 2 : 4;
    const totalPages = Math.ceil(allCards.length / cardsPerPage);
    const shouldShowSlider = allCards.length > cardsPerPage;

    // Get current page cards
    const getCurrentPageCards = () => {
        if (!shouldShowSlider) {
            return allCards; // Show all cards if no slider needed
        }
        const startIndex = currentPage * cardsPerPage;
        return allCards.slice(startIndex, startIndex + cardsPerPage);
    };

    // Navigation functions with sliding animation
    const nextPage = () => {
        if (isSliding || !shouldShowSlider) return;
        setIsSliding(true);
        setSlideDirection('slide-left');

        setTimeout(() => {
            setCurrentPage(prev => (prev + 1) % totalPages);
            setSlideDirection('');
            setIsSliding(false);
        }, 250);
    };

    const prevPage = () => {
        if (isSliding || !shouldShowSlider) return;
        setIsSliding(true);
        setSlideDirection('slide-right');

        setTimeout(() => {
            setCurrentPage(prev => (prev - 1 + totalPages) % totalPages);
            setSlideDirection('');
            setIsSliding(false);
        }, 250);
    };

    const goToPage = (pageIndex) => {
        if (isSliding || pageIndex === currentPage || !shouldShowSlider) return;

        setIsSliding(true);
        const direction = pageIndex > currentPage ? 'slide-left' : 'slide-right';
        setSlideDirection(direction);

        setTimeout(() => {
            setCurrentPage(pageIndex);
            setSlideDirection('');
            setIsSliding(false);
        }, 250);
    };

    if (loading) {
        return (
            <div className="employee-detail-page">
                <div className="loading-container">
                    <p>Loading employee details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="employee-detail-page">
                <div className="error-container">
                    <p>Error loading employee: {error}</p>
                    <button onClick={() => navigate('/employee')}>Back to Employees</button>
                </div>
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="employee-detail-page">
                <div className="error-container">
                    <p>Employee not found</p>
                    <button onClick={() => navigate('/employee')}>Back to Employees</button>
                </div>
            </div>
        );
    }

    return (
        <div className="employee-detail-page">
            {/* Background Image Section */}
            <div className="employee-detail-bg-section">
                <img
                    src="/assets/employee-detail-bg.png"
                    alt="Employee Detail Background"
                    className="employee-detail-bg-image"
                />

                {/* Header Content Inside Background */}
                <div className="employee-detail-header-content">
                    {/* Left Side - Employee Information */}
                    <div className="employee-detail-left">
                        {/* Breadcrumb Navigation */}
                        <div className="breadcrumb">
                            <span>Üzvlərimiz</span>
                            <span className="separator">&gt;</span>
                            <span>{employee.fullname}</span>
                        </div>

                        {/* Employee Name and Title */}
                        <div className="employee-info">
                            <h1 className="employee-name">{employee.fullname}</h1>
                            <div className="employee-title">
                                <div className="title-icon"></div>
                                <p>{employee.field} - {employee.clinic}</p>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="contact-info">
                            {employee.phone && (
                                <div className="contact-item">
                                    <img src="/assets/phone-icon.png" alt="Phone" className="contact-icon" />
                                    <span>{employee.phone}</span>
                                </div>
                            )}
                            {employee.whatsApp && (
                                <div className="contact-item">
                                    <img src="/assets/whatsapp-icon.png" alt="WhatsApp" className="contact-icon" />
                                    <span>{employee.whatsApp}</span>
                                </div>
                            )}
                            {employee.email && (
                                <div className="contact-item">
                                    <img src="/assets/mail-icon.png" alt="Email" className="contact-icon" />
                                    <span>{employee.email}</span>
                                </div>
                            )}
                            {employee.location && (
                                <div className="contact-item">
                                    <img src="/assets/location-icon.png" alt="Location" className="contact-icon" />
                                    <span>{employee.location}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Side - Employee Image */}
                    <div className="employee-detail-right">
                        <img
                            src={getContextualImagePath(employee.image, 'admin') || "/assets/employee1.png"}
                            alt={employee.fullname}
                            className="employee-detail-image"
                        />
                    </div>
                </div>
            </div>

            {/* New Section: About Employee */}
            <div className="employee-about-section">
                <div className="employee-about-content">
                    <div className="about-title-container">
                        <h2 className="about-title">
                            <span>Mən Kiməm?</span>
                        </h2>
                    </div>
                    <p className="about-paragraph">
                        {employee.firstDesc}
                    </p>
                </div>

                {/* Right Side - Equipment DNA Image */}
                <div className="equipment-dna-right">
                    <img src="/assets/equipment-dna.png" alt="Equipment DNA" className="equipment-dna-image" />
                </div>
            </div>

            {/* New Section: Divided Layout */}
            <div className="employee-divided-section">
                <div className="divided-left">
                    <img src="/assets/employee-detail.png" alt="Employee Detail" className="divided-left-image" />
                </div>
                <div className="divided-right">
                    <div className="certificate-timeline-container">
                        <div className="certificate-title-container">
                            <h3 className="certificate-title">
                                <span>Tibbə Aparan Yol</span>
                            </h3>
                        </div>
                        <p className="certificate-description">
                            {employee.secondDesc}
                        </p>

                        <div className={`certificate-timeline-line certificates-${employee.degrees ? Math.min(employee.degrees.length, 8) : 0}`}>
                            {employee.degrees && employee.degrees.slice(0, 8).map((degree, index) => (
                                <React.Fragment key={degree.id}>
                                    <div className={`certificate-dot certificate-dot-${index + 1}`}></div>
                                    <div className={`certificate-number certificate-number-${index + 1}`}>
                                        {String(index + 1).padStart(2, '0')}
                                    </div>
                                    <div className={`certificate-info certificate-info-${index + 1}`}>
                                        <h4 className="certificate-university">{degree.universityName}</h4>
                                        <p className="certificate-years">
                                            {degree.startYear}-{degree.endYear === 0 ? 'indi' : degree.endYear}
                                        </p>
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Cards Section with Carousel */}
            <div className="cards-section">
                <div className="cards-carousel-container">
                    {/* Cards Container */}
                    <div className={`cards-container ${isSliding ? 'sliding' : ''} ${slideDirection}`}>
                        {getCurrentPageCards().map((card, index) => (
                            <div key={card.id} className={`card card-${index + 1}`} onClick={() => {
                                const src = card.image && getContextualImagePath(card.image, 'admin');
                                setActiveImageSrc(src);
                                setShowImageModal(true);
                            }}>
                                <div className="inner-card"></div>
                                <img src={getContextualImagePath(card.image, 'admin')} alt="Employee Certificate" className="card-image" />
                            </div>
                        ))}
                    </div>

                    {/* Navigation Buttons - Only show if slider is needed */}
                    {shouldShowSlider && (
                        <div className="carousel-buttons-container">
                            <img
                                src={iconPrev}
                                alt="Previous"
                                className="carousel-btn carousel-btn-prev"
                                onClick={prevPage}
                                style={{ cursor: 'pointer' }}
                            />
                            <img
                                src={iconNext}
                                alt="Next"
                                className="carousel-btn carousel-btn-next"
                                onClick={nextPage}
                                style={{ cursor: 'pointer' }}
                            />
                        </div>
                    )}
                </div>


            </div>

            {showImageModal && (
                <div className="employee-detail-image-modal-overlay" onClick={() => setShowImageModal(false)}>
                    <div className="employee-detail-image-modal" onClick={(e) => e.stopPropagation()}>
                        <img src={activeImageSrc} alt="Certificate" className="employee-detail-image-modal-img" />
                        <button className="employee-detail-image-modal-close" onClick={() => setShowImageModal(false)}>×</button>
                    </div>
                </div>
            )}

            {/* Logo Carousel Section */}
            <LogoCarousel />
        </div>
    );
};

export default EmployeeDetail;
