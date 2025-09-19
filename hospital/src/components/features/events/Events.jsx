import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getContextualImagePath } from '../../../utils/imageUtils';
const searchIcon = '/assets/search-icon.png';
const cardIcon = '/assets/card-icon.png';
const eventImg = '/assets/event-img.png';
import iconNext from '../../../assets/icon-next.svg';
import iconPrev from '../../../assets/icon-prev.svg';
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

    // Animation state
    const [isPageChanging, setIsPageChanging] = useState(false);


    // Region filter state
    const [selectedRegion, setSelectedRegion] = useState('All');
    const [showRegionDropdown, setShowRegionDropdown] = useState(false);

    // Search state
    const [searchTerm, setSearchTerm] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const searchTimeoutRef = useRef(null);

    // Get current date for calendar
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const currentDate = today.getDate();

    // Date filter state
    const [selectedDate, setSelectedDate] = useState(null);

    // Calendar navigation state
    const [displayMonth, setDisplayMonth] = useState(currentMonth);
    const [displayYear, setDisplayYear] = useState(currentYear);

    // Countdown timer state
    const [timeLeft, setTimeLeft] = useState({});
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState('right'); // 👈 for animations

    // Request modal state
    const [showRequestModal, setShowRequestModal] = useState(false);

    // Track large viewport (1920px+)
    const [isLargeViewport, setIsLargeViewport] = useState(() => {
        if (typeof window !== 'undefined' && window.matchMedia) {
            return window.matchMedia('(min-width: 1920px)').matches;
        }
        return false;
    });

    useEffect(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return;
        const mq = window.matchMedia('(min-width: 1920px)');
        const handler = (e) => setIsLargeViewport(e.matches);
        if (mq.addEventListener) {
            mq.addEventListener('change', handler);
        } else if (mq.addListener) {
            mq.addListener(handler);
        }
        return () => {
            if (mq.removeEventListener) {
                mq.removeEventListener('change', handler);
            } else if (mq.removeListener) {
                mq.removeListener(handler);
            }
        };
    }, []);

    // Get month name
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Get days in month for display month
    const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();


    // Get unique regions from events
    const uniqueRegions = [...new Set(events.map(event => event.region).filter(region => region))].sort();

    // Check if a day has events
    const hasEventsOnDate = (day) => {
        if (!day) return false;
        const checkDate = new Date(displayYear, displayMonth, day);
        return events.some(event => {
            const eventDate = new Date(event.eventDate);
            return eventDate.getDate() === checkDate.getDate() &&
                eventDate.getMonth() === checkDate.getMonth() &&
                eventDate.getFullYear() === checkDate.getFullYear();
        });
    };

    // Get first day of month (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfMonth = new Date(displayYear, displayMonth, 1).getDay();
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
                    fetch('https://localhost:5000/api/events'),
                    fetch('https://localhost:5000/api/events/featured')
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

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showRegionDropdown && !event.target.closest('.region-filter-container')) {
                setShowRegionDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showRegionDropdown]);

    // Cleanup search timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
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

    // Handle calendar day click
    const handleDateClick = (day) => {
        if (day) {
            const clickedDate = new Date(displayYear, displayMonth, day);
            setSelectedDate(clickedDate);
            setCurrentPage(1); // Reset to first page when filtering
            console.log('Selected date:', clickedDate);
            console.log('Events on this date:', events.filter(event => {
                const eventDate = new Date(event.eventDate);
                return eventDate.getDate() === clickedDate.getDate() &&
                    eventDate.getMonth() === clickedDate.getMonth() &&
                    eventDate.getFullYear() === clickedDate.getFullYear();
            }));
        }
    };

    // Handle refresh button click
    const handleRefresh = () => {
        setSelectedDate(null);
        setSelectedRegion('All');
        setSearchTerm('');
        setCurrentPage(1);
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setInputValue(value); // update input immediately so user can type freely

        // Clear previous timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        setIsSearching(true);
        // Debounce applying the filter term
        searchTimeoutRef.current = setTimeout(() => {
            setSearchTerm(value);
            setCurrentPage(1);
            setIsSearching(false);
        }, 200);
    };

    // Clear search
    const clearSearch = () => {
        // Clear any existing timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        setIsSearching(true);

        setSearchTerm('');
        setInputValue('');
        setCurrentPage(1);
        setIsSearching(false);
    };

    // Handle calendar navigation
    const handlePreviousMonth = () => {
        if (displayMonth === 0) {
            setDisplayMonth(11);
            setDisplayYear(displayYear - 1);
        } else {
            setDisplayMonth(displayMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (displayMonth === 11) {
            setDisplayMonth(0);
            setDisplayYear(displayYear + 1);
        } else {
            setDisplayMonth(displayMonth + 1);
        }
    };

    const handleCalendarRefresh = () => {
        setDisplayMonth(currentMonth);
        setDisplayYear(currentYear);
        setSelectedDate(null);
        setSelectedRegion('All');
        setSearchTerm('');
        setCurrentPage(1);
    };

    // Filter events by region, date, and search term
    const filteredEvents = events.filter(event => {
        // Region filter
        const regionMatch = selectedRegion === 'All' || event.region === selectedRegion;

        // Date filter - show events on or after selected date
        let dateMatch = true;
        if (selectedDate) {
            const eventDate = new Date(event.eventDate);
            const filterDate = new Date(selectedDate);
            // Set time to start of day for comparison
            filterDate.setHours(0, 0, 0, 0);
            eventDate.setHours(0, 0, 0, 0);
            dateMatch = eventDate >= filterDate;
        }

        // Search filter - search by first letters of title, subtitle, and venue
        let searchMatch = true;
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase();
            searchMatch = (
                event.title?.toLowerCase().startsWith(searchLower) ||
                event.subtitle?.toLowerCase().startsWith(searchLower) ||
                event.venue?.toLowerCase().startsWith(searchLower)
            );
        }

        return regionMatch && dateMatch && searchMatch;
    });

    // Pagination logic
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
    const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber === currentPage) return;

        setIsPageChanging(true);

        setTimeout(() => {
            setCurrentPage(pageNumber);
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Reset animation state after new cards have time to render
            setTimeout(() => {
                setIsPageChanging(false);
            }, 50);
        }, 200);
    };

    return (
        <div className="events-page">
            <div className="events-top-card">
                <div className="events-top-background">
                    <img src="/assets/events-top.png" alt="Events Top" />
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
                                            <img src="/assets/calendar.png" alt="Calendar" className="featured-icon" />
                                            <span>{eventDate.toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}</span>
                                        </div>
                                        <div className="featured-event-venue">
                                            <img src="/assets/location.png" alt="Venue" className="featured-icon" />
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
                <img
                    src={iconPrev}
                    alt="Previous"
                    className="slider-nav-btn prev-btn"
                    onClick={() => {
                        setDirection('left');
                        setCurrentSlide(prev => prev === 0 ? mainEvents.length - 1 : prev - 1);
                    }}
                    style={{ cursor: 'pointer' }}
                />

                <img
                    src={iconNext}
                    alt="Next"
                    className="slider-nav-btn next-btn"
                    onClick={() => {
                        setDirection('right');
                        setCurrentSlide(prev => prev === mainEvents.length - 1 ? 0 : prev + 1);
                    }}
                    style={{ cursor: 'pointer' }}
                />
            </div>

            {/* Header */}
            <div className="events-header-section">
                <div className="events-header-text">
                    <span className="events-header-first">Bütün</span>
                    <span className="events-header-second">
                        <span>Tədbirlər</span>
                    </span>
                </div>

                {/* Filters Container */}
                <div className="filters-container">
                    {/* Region Filter Dropdown */}
                    <div className="region-filter-container">
                        <div
                            className="region-filter-dropdown"
                            onClick={() => setShowRegionDropdown(!showRegionDropdown)}
                        >
                            <div className="filter-icon">
                                <div className="filter-line"></div>
                                <div className="filter-line short"></div>
                                <div className="filter-line"></div>
                            </div>
                            <span className="region-filter-text">{selectedRegion}</span>
                            <div className="dropdown-arrow">▼</div>
                        </div>

                        {showRegionDropdown && (
                            <div className="region-dropdown-menu">
                                <div
                                    className="region-dropdown-item"
                                    onClick={() => {
                                        setSelectedRegion('All');
                                        setShowRegionDropdown(false);
                                        setCurrentPage(1);
                                    }}
                                >
                                    All
                                </div>
                                {uniqueRegions.map(region => (
                                    <div
                                        key={region}
                                        className="region-dropdown-item"
                                        onClick={() => {
                                            setSelectedRegion(region);
                                            setShowRegionDropdown(false);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        {region}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>


                </div>
            </div>

            {/* Content */}
            <div className="events-content-container">
                <div className="events-left-section">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Tədbir axtar..."
                            className="search-input"
                            value={inputValue}
                            onChange={handleSearchChange}
                        />
                        {searchTerm && (
                            <button
                                className="search-clear-btn"
                                onClick={clearSearch}
                                style={{
                                    position: 'absolute',
                                    right: '40px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '18px',
                                    color: '#666'
                                }}
                            >
                                ×
                            </button>
                        )}
                        <img src={searchIcon} alt="Search" className="search-icon" />
                    </div>

                    <div className={`calendar-container ${(selectedDate || selectedRegion !== 'All' || searchTerm) ? 'has-refresh-button' : ''}`}>
                        <div className="calendar-header">
                            <span className="calendar-month-year">{monthNames[displayMonth]} {displayYear}</span>
                            <div className="calendar-navigation">
                                <span className="nav-arrow" onClick={handlePreviousMonth} style={{ cursor: 'pointer' }}>‹</span>
                                <span className="nav-arrow" onClick={handleNextMonth} style={{ cursor: 'pointer' }}>›</span>
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
                            {calendarDays.map((day, index) => {
                                const isSelected = selectedDate && day &&
                                    selectedDate.getDate() === day &&
                                    selectedDate.getMonth() === displayMonth &&
                                    selectedDate.getFullYear() === displayYear;

                                const isToday = day === currentDate &&
                                    displayMonth === currentMonth &&
                                    displayYear === currentYear;

                                const hasEvents = hasEventsOnDate(day);
                                const isDisabled = day && !hasEvents;

                                return (
                                    <div
                                        key={index}
                                        className={`calendar-day ${isToday ? 'today' : ''} ${day === null ? 'empty' : ''} ${isSelected ? 'selected' : ''} ${hasEvents ? 'has-events' : ''} ${isDisabled ? 'disabled' : ''}`}
                                        onClick={isDisabled ? undefined : () => handleDateClick(day)}
                                        style={{ cursor: isDisabled ? 'not-allowed' : (day ? 'pointer' : 'default') }}
                                    >
                                        {day}
                                        {hasEvents && <div className="event-indicator"></div>}
                                    </div>
                                );
                            })}
                        </div>

                        {(selectedDate || selectedRegion !== 'All' || searchTerm) && (
                            <div className="calendar-refresh-section">
                                <button className="calendar-refresh-text" onClick={handleCalendarRefresh}>
                                    Refresh Calendar
                                </button>
                            </div>
                        )}
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
                                            <div
                                                key={`${event.id}-${currentPage}-${searchTerm}`}
                                                className={`events-card ${isPageChanging ? 'page-changing' : ''} ${isSearching ? 'search-animating' : ''}`}
                                            >
                                                <span className="event-title">{event.title}</span>
                                                <div className="event-date">
                                                    <span className="event-day">{day}</span>
                                                    <span className="event-month">{month}</span>
                                                    <span className="event-venue">{event.venue}</span>
                                                </div>
                                                <img src={getContextualImagePath(event.mainImage, 'admin')} alt="Event" className="event-image" />
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
