import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getContextualImagePath } from '../../../utils/imageUtils';
import LogoCarousel from '../../ui/LogoCarousel';
import { RequestModal, EmployeeSlider } from '../../ui';
// Removed timelineData import - now fetching from API
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
    const [timelineSlots, setTimelineSlots] = useState([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(0);
    const [timelineLoading, setTimelineLoading] = useState(true);

    // Fetch timeline data from API
    useEffect(() => {
        const fetchTimelineData = async () => {
            try {
                setTimelineLoading(true);
                const response = await fetch(`https://ahpbca-api.webonly.io/api/eventtimeline/event/${eventId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch timeline data');
                }
                const data = await response.json();
                setTimelineSlots(data);
                setSelectedTimeSlot(0); // Default to first slot
                console.log('Timeline data loaded successfully:', data.length, 'slots');
            } catch (error) {
                console.error('Error loading timeline data:', error);
                // Fallback to empty array if there's an error
                setTimelineSlots([]);
            } finally {
                setTimelineLoading(false);
            }
        };

        if (eventId) {
            fetchTimelineData();
        }
    }, [eventId]);

    // Update CSS custom property for dynamic height based on timeline slots count
    useEffect(() => {
        const timelineLeft = document.querySelector('.event-detail-timeline-left');
        if (timelineLeft && timelineSlots.length > 0) {
            const itemCount = timelineSlots.length;
            timelineLeft.style.setProperty('--timeline-item-count', itemCount.toString());
            console.log('Setting timeline height for', itemCount, 'items');

            // Force a reflow to ensure the style is applied
            timelineLeft.offsetHeight;
        }
    }, [timelineSlots.length]);

    // Fetch event data from API
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                const response = await fetch(`https://ahpbca-api.webonly.io/api/events/${eventId}`);
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


    // Handle request modal success
    const handleRequestSuccess = () => {
        console.log('Request submitted successfully from event detail page');
        setShowRequestModal(false);
    };

    // Handle time slot selection
    const handleTimeSlotClick = (index) => {
        setSelectedTimeSlot(index);
        console.log(`Selected time slot: ${index}`);
        console.log('Selected slot data:', timelineSlots[index]);
        console.log('Info field:', timelineSlots[index]?.info);
    };

    // Function to refresh timeline data
    const refreshTimelineData = () => {
        try {
            setTimelineSlots(timelineData.slots);
            console.log('Timeline data refreshed');
        } catch (error) {
            console.error('Error refreshing timeline data:', error);
        }
    };

    // Handle scroll button clicks
    const handleScrollUp = () => {
        if (selectedTimeSlot > 0) {
            setSelectedTimeSlot(selectedTimeSlot - 1);
        }
    };

    const handleScrollDown = () => {
        if (selectedTimeSlot < timelineSlots.length - 1) {
            setSelectedTimeSlot(selectedTimeSlot + 1);
        }
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
            <div className="events-detail-background-image">
                <img src="/assets/event-dna.png" alt="Equipment DNA Background" />
            </div>

            <img src="/assets/events-star1.png" alt="Star 1" className="events-star-left" />
            <img src="/assets/events-star2.png" alt="Star 2" className="events-star-right" />

            <div className="events-detail-main-title">
                <div className="title-line-1">{event.title}</div>
                <div className="title-line-2">{event.subtitle}</div>
            </div>

            <div className="events-detail-cards">
                <div className="event-detail-card event-date-card">
                    <img src="/assets/events-detail.png" alt="Event Detail" className="card-event-detail-image" />
                    <img src="/assets/calendar.png" alt="Calendar" className="card-calendar-icon" />
                    <div className="card-date-info">
                        <span className="card-date-day">{new Date(event.eventDate).getDate()}</span>
                        <span className="card-date-month">{new Date(event.eventDate).toLocaleDateString('en-US', { month: 'long' })}</span>
                        <span className="card-date-year">{new Date(event.eventDate).getFullYear()}</span>
                    </div>
                </div>
                <div className="event-detail-card event-location-card">
                    <img src="/assets/events-detail.png" alt="Event Detail" className="card-event-detail-image" />
                    <img src="/assets/clock.png" alt="Clock" className="card-clock-icon" />
                    <div className="card-time-info">
                        <span className="card-time">{event.time}</span>
                    </div>
                </div>
                {event.region && (
                    <div className="event-detail-card event-region-card">
                        <img src="/assets/events-detail.png" alt="Event Detail" className="card-event-detail-image" />
                        <img src="/assets/location.png" alt="Region" className="card-location-icon" />
                        <div className="card-location-info">
                            <span className="card-location">{event.region}</span>
                        </div>
                    </div>
                )}
                <div className="event-detail-card event-participants-card">
                    <img src="/assets/events-detail.png" alt="Event Detail" className="card-event-detail-image" />
                    <img src="/assets/venue-icon.png" alt="Location" className="card-location-icon" />
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
                <img src={getContextualImagePath(event.detailImageLeft, 'admin')} alt="Event Detail Left" className="left-event-image" />
                <img src={getContextualImagePath(event.detailImageMain, 'admin')} alt="Event Detail Main" className="main-event-image" />
                <img src={getContextualImagePath(event.detailImageRight, 'admin')} alt="Event Detail Right" className="right-event-image" />
                <button className="muraciet-btn" onClick={() => setShowRequestModal(true)}>Müraciət et</button>
            </div>

            <div className="employee-slider-section">
                <div className="event-detail-employee-header">
                    <div className="event-detail-employee-header-left">
                        <span className="event-detail-employee-header-second">
                            <span>Konfrans spikerləri</span>
                        </span>
                    </div>
                </div>
                <div className="event-detail-employee-slider">
                    <EmployeeSlider eventId={eventId} />
                </div>
                <div className="event-detail-timeline-header">
                    <div className="event-detail-timeline-header-left">
                        <span className="event-detail-timeline-header-second">
                            <span>Konfrans planlaması</span>
                        </span>
                    </div>
                </div>

                <div className="event-detail-timeline-container">
                    <div className="event-detail-timeline-left">
                        <div className="time-slot-selector">
                            {timelineLoading ? (
                                <div className="timeline-loading">
                                    <div className="loading-spinner"></div>
                                    <p>Timeline yüklənir...</p>
                                </div>
                            ) : (
                                <>
                                    <button
                                        className="time-slot-scroll-btn"
                                        onClick={handleScrollUp}
                                        disabled={selectedTimeSlot === 0}
                                    >
                                        ▲
                                    </button>
                                    <div className="time-slot-list">
                                        {timelineSlots.map((slot, index) => (
                                            <div
                                                key={slot.id}
                                                className={`time-slot-item ${selectedTimeSlot === index ? 'active' : ''}`}
                                                onClick={() => handleTimeSlotClick(index)}
                                            >
                                                <div className="time-slot-clock">
                                                    <img src="/assets/clock.png" alt="Clock" />
                                                </div>
                                                <div className="time-slot-text">{slot.startTime} - {slot.endTime}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        className="time-slot-scroll-btn"
                                        onClick={handleScrollDown}
                                        disabled={selectedTimeSlot === timelineSlots.length - 1}
                                    >
                                        ▼
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="event-detail-timeline-right">
                        {timelineLoading ? (
                            <div className="timeline-loading">
                                <div className="loading-spinner"></div>
                                <p>Məlumatlar yüklənir...</p>
                            </div>
                        ) : timelineSlots.length > 0 && selectedTimeSlot < timelineSlots.length ? (
                            <div key={selectedTimeSlot} className="timeline-slot-details">
                                <div className="timeline-slot-header">
                                    <h3 className="timeline-slot-title">
                                        {timelineSlots[selectedTimeSlot].title}
                                    </h3>
                                    <div className="timeline-slot-time">
                                        {timelineSlots[selectedTimeSlot].startTime} - {timelineSlots[selectedTimeSlot].endTime}
                                    </div>
                                </div>
                                <div className="timeline-slot-content">
                                    <p className="timeline-slot-description">
                                        {timelineSlots[selectedTimeSlot].description}
                                    </p>
                                    <div className="timeline-slot-info">
                                        <div className="info-content">
                                            <div className="info-details">
                                                <div
                                                    className="info-text"
                                                    dangerouslySetInnerHTML={{
                                                        __html: timelineSlots[selectedTimeSlot].info || 'Məlumat mövcud deyil'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="timeline-no-data">
                                <p>Timeline məlumatları mövcud deyil</p>
                            </div>
                        )}
                    </div>
                </div>
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
