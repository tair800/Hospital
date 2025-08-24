import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventData } from '../data/eventData';
import LogoCarousel from './LogoCarousel';
import './EventsDetail.css';

const EventsDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const eventId = parseInt(id);

    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        phone: '',
        position: '',
        finCode: ''
    });

    // Find the specific event data
    const event = eventData.find(e => e.id === eventId);

    // Countdown timer effect
    useEffect(() => {
        if (!event) return;

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const eventTime = new Date(event.eventDate).getTime();
            const difference = eventTime - now;

            console.log('Timer Debug:', {
                now: new Date(now),
                eventTime: new Date(eventTime),
                difference,
                eventDate: event.eventDate
            });

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

                setTimeLeft({ days, hours, minutes });
                console.log('Time Left:', { days, hours, minutes });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0 });
                console.log('Event has passed');
            }
        };

        // Calculate immediately
        calculateTimeLeft();

        // Update every second for real-time countdown
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [event]);

    // Form handling functions
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Here you can add API call or other logic
        setShowModal(false);
        setFormData({
            name: '',
            surname: '',
            email: '',
            phone: '',
            position: '',
            finCode: ''
        });
    };

    // If event not found, show error or redirect
    if (!event) {
        return (
            <div className="events-detail-page">
                <div className="events-detail-header-text">
                    <span className="events-detail-header-first">Event Not Found</span>
                    <button onClick={() => navigate('/events')} className="back-button">Back to Events</button>
                </div>
            </div>
        );
    }

    return (
        <div className="events-detail-page">
            <img src="/src/assets/events-star1.png" alt="Star 1" className="events-star-left" />
            <img src="/src/assets/events-star2.png" alt="Star 2" className="events-star-right" />

            <div className="events-detail-main-title">
                <div className="title-line-1">{event.title}</div>
                <div className="title-line-2">{event.subtitle}</div>
            </div>

            <div className="events-detail-cards">
                <div className="event-detail-card event-date-card">
                    <img src={event.detailImages.background} alt="Event Detail" className="card-event-detail-image" />
                    <img src="/src/assets/calendar.png" alt="Calendar" className="card-calendar-icon" />
                    <div className="card-date-info">
                        <span className="card-date-day">{new Date(event.eventDate).getDate()}</span>
                        <span className="card-date-month">{new Date(event.eventDate).toLocaleDateString('en-US', { month: 'long' })}</span>
                        <span className="card-date-year">{new Date(event.eventDate).getFullYear()}</span>
                    </div>
                </div>
                <div className="event-detail-card event-location-card">
                    <img src={event.detailImages.background} alt="Event Detail" className="card-event-detail-image" />
                    <img src="/src/assets/clock.png" alt="Clock" className="card-clock-icon" />
                    <div className="card-time-info">
                        <span className="card-time">{event.time}</span>
                    </div>
                </div>
                <div className="event-detail-card event-participants-card">
                    <img src={event.detailImages.background} alt="Event Detail" className="card-event-detail-image" />
                    <img src="/src/assets/location.png" alt="Location" className="card-location-icon" />
                    <div className="card-location-info">
                        <span className="card-location">{event.venue}</span>
                    </div>
                </div>
            </div>

            <div className="events-detail-description">
                <p>{event.longDescription}</p>
            </div>

            <div className="events-detail-main-image">
                <div className="countdown-timer">
                    <div className="timer-display">
                        <div className="timer-unit">
                            <span className="timer-number">{timeLeft.days.toString().padStart(2, '0')}</span>
                            <span className="timer-label">Gün</span>
                        </div>
                        <span className="timer-separator">:</span>
                        <div className="timer-unit">
                            <span className="timer-number">{timeLeft.hours.toString().padStart(2, '0')}</span>
                            <span className="timer-label">Saat</span>
                        </div>
                        <span className="timer-separator">:</span>
                        <div className="timer-unit">
                            <span className="timer-number">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                            <span className="timer-label">Dəq</span>
                        </div>
                    </div>

                </div>
                <img src={event.detailImages.left} alt="Event Detail Left" className="left-event-image" />
                <img src={event.detailImages.main} alt="Event Detail Main" className="main-event-image" />
                <img src={event.detailImages.right} alt="Event Detail Right" className="right-event-image" />
                <button className="muraciet-btn" onClick={() => setShowModal(true)}>Müraciət et</button>
            </div>

            <div className="logo-carousel-section events-detail-logo-carousel">
                <LogoCarousel />
            </div>

            {/* Application Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Müraciət göndər</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-columns">
                                <div className="form-left-column">
                                    <div className="form-group">
                                        <label htmlFor="name">Ad</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Adınızı daxil edin"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="Emailinizi daxil edin"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="position">Vəzifəsi</label>
                                        <input
                                            type="text"
                                            id="position"
                                            name="position"
                                            value={formData.position}
                                            onChange={handleInputChange}
                                            placeholder="Vəzifənizi daxil edin"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-right-column">
                                    <div className="form-group">
                                        <label htmlFor="surname">Soyad</label>
                                        <input
                                            type="text"
                                            id="surname"
                                            name="surname"
                                            value={formData.surname}
                                            onChange={handleInputChange}
                                            placeholder="Soyadınızı daxil edin"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="phone">Telefon</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="Telefon nömrənizi daxil edin"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="finCode">FİN kodu</label>
                                        <input
                                            type="text"
                                            id="finCode"
                                            name="finCode"
                                            value={formData.finCode}
                                            onChange={handleInputChange}
                                            placeholder="FİN kodunuzu daxil edin"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="submit-btn">Müraciət et</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventsDetail;
