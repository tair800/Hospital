import React, { useState } from 'react';
import searchIcon from '../assets/search-icon.png';
import cardIcon from '../assets/card-icon.png';
import eventImg from '../assets/event-img.png';
import LogoCarousel from './LogoCarousel';
import { eventData } from '../data/eventData';
import './Events.css';

const Events = ({ onEventClick }) => {
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 6;

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

    // Get first day of month (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    // Convert to Monday start (0 = Monday, 1 = Tuesday, etc.)
    const mondayStart = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    // Generate calendar days
    const calendarDays = [];
    for (let i = 0; i < mondayStart; i++) {
        calendarDays.push(null); // Empty cells for days before month starts
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(i);
    }

    const handleEventClick = (eventId) => {
        if (onEventClick) {
            onEventClick('event-detail', eventId);
        }
    };

    // Pagination logic
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = eventData.slice(indexOfFirstEvent, indexOfLastEvent);
    const totalPages = Math.ceil(eventData.length / eventsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="events-page">
            <div className="events-header-text">
                <span className="events-header-first">Bütün</span>
                <span className="events-header-second">
                    <span>Tədbirlər</span>
                </span>
            </div>
            <div className="events-content-container">
                <div className="events-left-section">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder=""
                            className="search-input"
                        />
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

                    {/* Left content area */}
                </div>
                <div className="events-right-section">
                    <div className="events-main-content">
                        <div className="events-grid">
                            {currentEvents.map((event, index) => {
                                // Extract date components from eventDate
                                const eventDate = new Date(event.eventDate);
                                const day = eventDate.getDate();
                                const monthNames = [
                                    'January', 'February', 'March', 'April', 'May', 'June',
                                    'July', 'August', 'September', 'October', 'November', 'December'
                                ];
                                const month = monthNames[eventDate.getMonth()];

                                return (
                                    <div key={event.id} className="events-card">
                                        <span className="event-title">{event.title}</span>
                                        <span className="trainer-name">Təlimçi : {event.trainerTitle} {event.trainer}</span>
                                        <div className="event-date">
                                            <span className="event-day">{day}</span>
                                            <span className="event-month">{month}</span>
                                            <span className="event-venue">{event.venue}</span>
                                        </div>
                                        <img src={event.mainImage} alt="Event" className="event-image" />
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

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="pagination-container">
                                <div className="pagination-controls">
                                    <button
                                        className="pagination-btn"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        data-arrow="‹"
                                    >
                                    </button>

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
                                    >
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="logo-carousel-section">
                <LogoCarousel />
            </div>
        </div>
    );
};

export default Events;
