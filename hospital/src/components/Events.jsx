import React from 'react';
import searchIcon from '../assets/search-icon.png';
import cardIcon from '../assets/card-icon.png';
import eventImg from '../assets/event-img.png';
import LogoCarousel from './LogoCarousel';
import './Events.css';

const Events = () => {
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
                            <div className="events-card">
                                <span className="event-title">HPB Cərrahiyyə Hallarının Klinik Təhlili</span>
                                <span className="trainer-name">Təlimçi : Yusif Qasımov</span>
                                <div className="event-date">
                                    <span className="event-day">31</span>
                                    <span className="event-month">May</span>
                                    <span className="event-venue">Baku Crystal Hall</span>
                                </div>
                                <img src={eventImg} alt="Event" className="event-image" />
                                <img src={cardIcon} alt="Card Icon" className="card-icon" />
                            </div>

                            <div className="events-card">
                                <span className="event-title">HPB Cərrahiyyə Hallarının Klinik Təhlili</span>
                                <span className="trainer-name">Təlimçi : Yusif Qasımov</span>
                                <div className="event-date">
                                    <span className="event-day">31</span>
                                    <span className="event-month">May</span>
                                    <span className="event-venue">Baku Crystal Hall</span>
                                </div>
                                <img src={eventImg} alt="Event" className="event-image" />
                                <img src={cardIcon} alt="Card Icon" className="card-icon" />
                            </div>

                            <div className="events-card">
                                <span className="event-title">HPB Cərrahiyyə Hallarının Klinik Təhlili</span>
                                <span className="trainer-name">Təlimçi : Yusif Qasımov</span>
                                <div className="event-date">
                                    <span className="event-day">31</span>
                                    <span className="event-month">May</span>
                                    <span className="event-venue">Baku Crystal Hall</span>
                                </div>
                                <img src={eventImg} alt="Event" className="event-image" />
                                <img src={cardIcon} alt="Card Icon" className="card-icon" />
                            </div>

                            <div className="events-card">
                                <span className="event-title">HPB Cərrahiyyə Hallarının Klinik Təhlili</span>
                                <span className="trainer-name">Təlimçi : Yusif Qasımov</span>
                                <div className="event-date">
                                    <span className="event-day">31</span>
                                    <span className="event-month">May</span>
                                    <span className="event-venue">Baku Crystal Hall</span>
                                </div>
                                <img src={eventImg} alt="Event" className="event-image" />
                                <img src={cardIcon} alt="Card Icon" className="card-icon" />
                            </div>

                            <div className="events-card">
                                <span className="event-title">HPB Cərrahiyyə Hallarının Klinik Təhlili</span>
                                <span className="trainer-name">Təlimçi : Yusif Qasımov</span>
                                <div className="event-date">
                                    <span className="event-day">31</span>
                                    <span className="event-month">May</span>
                                    <span className="event-venue">Baku Crystal Hall</span>
                                </div>
                                <img src={eventImg} alt="Event" className="event-image" />
                                <img src={cardIcon} alt="Card Icon" className="card-icon" />
                            </div>

                            <div className="events-card">
                                <span className="event-title">HPB Cərrahiyyə Hallarının Klinik Təhlili</span>
                                <span className="trainer-name">Təlimçi : Yusif Qasımov</span>
                                <div className="event-date">
                                    <span className="event-day">31</span>
                                    <span className="event-month">May</span>
                                    <span className="event-venue">Baku Crystal Hall</span>
                                </div>
                                <img src={eventImg} alt="Event" className="event-image" />
                                <img src={cardIcon} alt="Card Icon" className="card-icon" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <LogoCarousel />
        </div>
    );
};

export default Events;
