import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LogoCarousel from '../../ui/LogoCarousel';
import { RequestModal } from '../../ui';
import './EventsDetail.css';

const EventsDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const eventId = parseInt(id);

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
    const [showRequestModal, setShowRequestModal] = useState(false);

    // Fetch event data from API
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:5000/api/events/${eventId}`);
                if (!response.ok) {
                    throw new Error('Event not found');
                }
                const eventData = await response.json();
                setEvent(eventData);
            } catch (err) {
                console.error('Error fetching event:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (eventId) {
            fetchEvent();
        }
    }, [eventId]);

    // Countdown timer effect
    useEffect(() => {
        if (!event) return;

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const eventTime = new Date(event.eventDate).getTime();
            const difference = eventTime - now;

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

                setTimeLeft({ days, hours, minutes });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0 });
            }
        };

        // Calculate immediately
        calculateTimeLeft();

        // Update every second for real-time countdown
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [event]);

    // Helper function to get correct image path
    const getImagePath = (imageName) => {
        if (!imageName) return '';
        if (imageName === 'event-img.png') return '/src/assets/event-img.png';
        if (imageName.startsWith('/src/assets/')) return imageName;
        return `/src/assets/${imageName}`;
    };

    // Handle request modal success
    const handleRequestSuccess = () => {
        console.log('Request submitted successfully from event detail page');
        setShowRequestModal(false);
    };

    // Show loading state
    if (loading) {
        return (
            <div className="events-detail-page">
                <div className="events-detail-header-text">
                    <span className="events-detail-header-first">Yüklənir...</span>
                </div>
            </div>
        );
    }

    // Show error state
    if (error || !event) {
        return (
            <div className="events-detail-page">
                <div className="events-detail-header-text">
                    <span className="events-detail-header-first">
                        {error || 'Event Not Found'}
                    </span>
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
                    <img src="/src/assets/events-detail.png" alt="Event Detail" className="card-event-detail-image" />
                    <img src="/src/assets/calendar.png" alt="Calendar" className="card-calendar-icon" />
                    <div className="card-date-info">
                        <span className="card-date-day">{new Date(event.eventDate).getDate()}</span>
                        <span className="card-date-month">{new Date(event.eventDate).toLocaleDateString('en-US', { month: 'long' })}</span>
                        <span className="card-date-year">{new Date(event.eventDate).getFullYear()}</span>
                    </div>
                </div>
                <div className="event-detail-card event-location-card">
                    <img src="/src/assets/events-detail.png" alt="Event Detail" className="card-event-detail-image" />
                    <img src="/src/assets/clock.png" alt="Clock" className="card-clock-icon" />
                    <div className="card-time-info">
                        <span className="card-time">{event.time}</span>
                    </div>
                </div>
                <div className="event-detail-card event-participants-card">
                    <img src="/src/assets/events-detail.png" alt="Event Detail" className="card-event-detail-image" />
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
                <img src={getImagePath(event.detailImageLeft)} alt="Event Detail Left" className="left-event-image" />
                <img src={getImagePath(event.detailImageMain)} alt="Event Detail Main" className="main-event-image" />
                <img src={getImagePath(event.detailImageRight)} alt="Event Detail Right" className="right-event-image" />
                <button className="muraciet-btn" onClick={() => setShowRequestModal(true)}>Müraciət et</button>
            </div>

            <div className="logo-carousel-section events-detail-logo-carousel">
                <LogoCarousel />
            </div>

            {/* Request Modal */}
            <RequestModal
                isOpen={showRequestModal}
                onClose={() => setShowRequestModal(false)}
                onSuccess={handleRequestSuccess}
            />
        </div>
    );
};

export default EventsDetail;
