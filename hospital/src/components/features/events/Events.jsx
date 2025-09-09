import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import searchIcon from '../../../assets/search-icon.png';
import cardIcon from '../../../assets/card-icon.png';
import eventImg from '../../../assets/event-img.png';
import LogoCarousel from '../../ui/LogoCarousel';
import { RequestModal } from '../../ui';
import './Events.css';

const Events = () => {
    const navigate = useNavigate();

    // API state
    const [events, setEvents] = useState([]);
    const [mainEvents, setMainEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 6;

    // Countdown timer state
    const [timeLeft, setTimeLeft] = useState({});
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState('right'); // 👈 for animations

    // Request modal state
    const [showRequestModal, setShowRequestModal] = useState(false);

    // Get current date for calendar
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const currentDate = today.getDate();

    // Get month name
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Get days in month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Helper function to get correct image path
    const getImagePath = (imageName) => {
        if (!imageName) return '';
        if (imageName === 'event-img.png') return '/src/assets/event-img.png';
        if (imageName.startsWith('/src/assets/')) return imageName;
        return `/src/assets/${imageName}`;
    };

    // Get first day of month (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    // Convert to Monday start
    const mondayStart = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    // Generate calendar days
    const calendarDays = [];
    for (let i = 0; i < mondayStart; i++) {
        calendarDays.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(i);
    }

    // Fetch events from API
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const [eventsResponse, mainEventsResponse] = await Promise.all([
                    fetch('http://localhost:5000/api/events'),
                    fetch('http://localhost:5000/api/events/featured')
                ]);

                if (!eventsResponse.ok || !mainEventsResponse.ok) {
                    throw new Error('Failed to fetch events');
                }

                const eventsData = await eventsResponse.json();
                const mainEventsData = await mainEventsResponse.json();

                setEvents(eventsData);
                setMainEvents(mainEventsData);
            } catch (err) {
                console.error('Error fetching events:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    // Countdown timer effect
    useEffect(() => {
        if (mainEvents.length === 0) return;

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const newTimeLeft = {};

            mainEvents
                .forEach(event => {
                    const eventTime = new Date(event.eventDate).getTime();
                    const difference = eventTime - now;

                    if (difference > 0) {
                        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

                        newTimeLeft[event.id] = { days, hours, minutes };
                    } else {
                        newTimeLeft[event.id] = { days: 0, hours: 0, minutes: 0 };
                    }
                });

            setTimeLeft(newTimeLeft);
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [mainEvents]);

    const handleEventClick = (eventId) => {
        navigate(`/event/${eventId}`);
    };

    // Pagination logic
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
    const totalPages = Math.ceil(events.length / eventsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="events-page">
            <div className="events-top-card">
                <div className="events-top-background">
                    <img src="/src/assets/events-top.png" alt="Events Top" />
                </div>

                {/* Featured Event Section */}
                {(() => {
                    if (loading) return <div className="loading-message">Yüklənir...</div>;
                    if (error) return <div className="error-message">Xəta: {error}</div>;
                    if (mainEvents.length === 0) return null;

                    const currentEvent = mainEvents[currentSlide];
                    const eventDate = new Date(currentEvent.eventDate);
                    const eventTimeLeft = timeLeft[currentEvent.id] || { days: 0, hours: 0, minutes: 0 };

                    return (
                        <div className="featured-events-content">
                            <div
                                key={currentEvent.id}
                                className={`featured-event-card slide-${direction}`} // 👈 new animation class
                            >
                                <div className="featured-event-header">
                                    <h3 className="featured-event-title">
                                        {currentEvent.title}:
                                    </h3>
                                    <p className="featured-event-subtitle" title={currentEvent.subtitle}>
                                        {currentEvent.subtitle && currentEvent.subtitle.length > 50
                                            ? currentEvent.subtitle.substring(0, 50) + '...'
                                            : currentEvent.subtitle}
                                    </p>
                                </div>

                                <div className="featured-event-timer">
                                    <div className="timer-unit">
                                        <span className="timer-number">{eventTimeLeft.days.toString().padStart(2, '0')}</span>
                                    </div>
                                    <span className="timer-separator">:</span>
                                    <div className="timer-unit">
                                        <span className="timer-number">{eventTimeLeft.hours.toString().padStart(2, '0')}</span>
                                    </div>
                                    <span className="timer-separator">:</span>
                                    <div className="timer-unit">
                                        <span className="timer-number">{eventTimeLeft.minutes.toString().padStart(2, '0')}</span>
                                    </div>
                                </div>


                                <div className="featured-event-details">
                                    <div className="featured-event-date-venue-row">
                                        <div className="featured-event-date">
                                            <img src="/src/assets/calendar.png" alt="Calendar" className="featured-icon" />
                                            <span>{eventDate.toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}</span>
                                        </div>
                                        <div className="featured-event-venue">
                                            <img src="/src/assets/location.png" alt="Venue" className="featured-icon" />
                                            <span>{currentEvent.venue}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="featured-event-buttons-outer">
                                    <button
                                        className="featured-event-btn qeydiyyat-btn"
                                        onClick={() => setShowRequestModal(true)}
                                    >
                                        Qeydiyyatdan keç
                                    </button>
                                    <button
                                        className="featured-event-btn detalli-btn"
                                        onClick={() => {
                                            const currentEvent = mainEvents[currentSlide];
                                            if (currentEvent) {
                                                navigate(`/event/${currentEvent.id}`);
                                            }
                                        }}
                                    >
                                        Detallı bax
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })()}
            </div>

            {/* Slider Navigation */}
            <div className="featured-slider-navigation">
                <button
                    className="slider-nav-btn prev-btn"
                    onClick={() => {
                        setDirection('left');
                        setCurrentSlide(prev => prev === 0 ? mainEvents.length - 1 : prev - 1);
                    }}
                >
                    <img src="/src/assets/card-icon.png" alt="Previous" className="slider-nav-icon" />
                </button>

                <button
                    className="slider-nav-btn next-btn"
                    onClick={() => {
                        setDirection('right');
                        setCurrentSlide(prev => prev === mainEvents.length - 1 ? 0 : prev + 1);
                    }}
                >
                    <img src="/src/assets/card-icon.png" alt="Next" className="slider-nav-icon" />
                </button>
            </div>

            {/* Header */}
            <div className="events-header-text">
                <span className="events-header-first">Bütün</span>
                <span className="events-header-second">
                    <span>Tədbirlər</span>
                </span>
            </div>

            {/* Content */}
            <div className="events-content-container">
                <div className="events-left-section">
                    <div className="search-container">
                        <input type="text" placeholder="" className="search-input" />
                        <img src={searchIcon} alt="Search" className="search-icon" />
                    </div>

                    <div className="calendar-container">
                        <div className="calendar-header">
                            <span className="calendar-month-year">{monthNames[currentMonth]} {currentYear}</span>
                            <div className="calendar-navigation">
                                <span className="nav-arrow">‹</span>
                                <span className="nav-arrow">›</span>
                            </div>
                        </div>

                        <div className="calendar-days-header">
                            <span>Mo</span>
                            <span>Tu</span>
                            <span>We</span>
                            <span>Th</span>
                            <span>Fr</span>
                            <span>Sa</span>
                            <span>Su</span>
                        </div>

                        <div className="calendar-days-grid">
                            {calendarDays.map((day, index) => (
                                <div
                                    key={index}
                                    className={`calendar-day ${day === currentDate ? 'today' : ''} ${day === null ? 'empty' : ''}`}
                                >
                                    {day}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="events-right-section">
                    <div className="events-main-content">
                        {loading ? (
                            <div className="loading-message">Yüklənir...</div>
                        ) : error ? (
                            <div className="error-message">Xəta: {error}</div>
                        ) : (
                            <>
                                <div className="events-grid">
                                    {currentEvents.map((event) => {
                                        const eventDate = new Date(event.eventDate);
                                        const day = eventDate.getDate();
                                        const month = monthNames[eventDate.getMonth()];

                                        return (
                                            <div key={event.id} className="events-card">
                                                <span className="event-title">{event.title}</span>
                                                <div className="event-date">
                                                    <span className="event-day">{day}</span>
                                                    <span className="event-month">{month}</span>
                                                    <span className="event-venue">{event.venue}</span>
                                                </div>
                                                <img src={getImagePath(event.mainImage)} alt="Event" className="event-image" />
                                                <img
                                                    src={cardIcon}
                                                    alt="Card Icon"
                                                    className="card-icon"
                                                    onClick={() => handleEventClick(event.id)}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="pagination-container">
                                        <div className="pagination-controls">
                                            <button
                                                className="pagination-btn"
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                data-arrow="‹"
                                            />

                                            <div className="pagination-numbers">
                                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                                                    <button
                                                        key={pageNumber}
                                                        className={`pagination-number ${pageNumber === currentPage ? 'active' : ''}`}
                                                        onClick={() => handlePageChange(pageNumber)}
                                                    >
                                                        {pageNumber}
                                                    </button>
                                                ))}
                                            </div>

                                            <button
                                                className="pagination-btn"
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                data-arrow="›"
                                            />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="logo-carousel-section events-logo-carousel">
                <LogoCarousel />
            </div>

            {/* Request Modal */}
            <RequestModal
                isOpen={showRequestModal}
                onClose={() => setShowRequestModal(false)}
                onSuccess={() => setShowRequestModal(false)}
            />
        </div>
    );
};

export default Events;
