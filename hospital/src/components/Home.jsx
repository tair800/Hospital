import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const [latestEvents, setLatestEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch latest events from API
    useEffect(() => {
        const fetchLatestEvents = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:5000/api/events');
                if (!response.ok) {
                    throw new Error('Failed to fetch latest events');
                }
                const data = await response.json();
                // Sort by date (closest upcoming events first) and take the first 3
                const now = new Date();
                const sortedEvents = data
                    .filter(event => new Date(event.eventDate) > now) // Only upcoming events
                    .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate)) // Closest date first
                    .slice(0, 3);
                setLatestEvents(sortedEvents);
            } catch (err) {
                console.error('Error fetching latest events:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestEvents();
    }, []);

    // Function to truncate text to a specific length and add "..." if needed
    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    };

    // Helper function to format date
    const formatEventDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();

        // Custom month mapping for Azerbaijani
        const months = [
            'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun',
            'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
        ];
        const month = months[date.getMonth()];

        return { day, month };
    };

    // Helper function to format price
    const formatPrice = (price, currency, isFree) => {
        if (isFree) return 'Pulsuz';
        return `${price} ${currency}`;
    };

    return (
        <div className="home-page">
            <div className="home-bg-section">
                <img
                    src="/src/assets/home-bg.png"
                    alt="Home Background"
                    className="home-bg-image"
                />
            </div>

            {/* Home Header Text */}
            <div className="home-header-text">
                <div className="home-header-left">
                    <span className="home-header-first">Ən son</span>
                    <span className="home-header-second">
                        <span>Tədbirlər</span>
                    </span>
                </div>
                <button className="home-header-btn" onClick={() => navigate('/events')}>Hamısına bax</button>
            </div>

            {/* Event Cards */}
            <div className="home-events-container">
                {loading ? (
                    <div className="loading-message">Yüklənir...</div>
                ) : error ? (
                    <div className="error-message">Xəta: {error}</div>
                ) : latestEvents.length === 0 ? (
                    <div className="no-events-message">Heç bir tədbir tapılmadı</div>
                ) : (
                    latestEvents.map((event, index) => {
                        const { day, month } = formatEventDate(event.eventDate);
                        const truncatedDescription = truncateText(event.description, 120);
                        const formattedPrice = formatPrice(event.price, event.currency, event.isFree);

                        return (
                            <div key={event.id} className="home-long-card">
                                <div className="card-left-section">
                                    <div className="date-venue-section">
                                        <div className="home-event-date">
                                            <div className="date-venue-group">
                                                <span className="home-event-day">{day}</span>
                                                <div className="home-event-venue" title={event.venue}>
                                                    {event.venue && event.venue.length > 20
                                                        ? event.venue.substring(0, 20) + '...'
                                                        : event.venue}
                                                </div>
                                            </div>
                                            <span className="home-event-month">{month}</span>
                                        </div>
                                    </div>
                                    <div className="text-content-section">
                                        <h3 className="home-event-title">{event.title}</h3>
                                        <p className="home-event-desc">
                                            {truncatedDescription}
                                        </p>
                                        <h4 className="home-event-trainer">Təlimçi: {event.trainer}</h4>
                                        <div className="home-event-price">{formattedPrice}</div>
                                    </div>
                                </div>
                                <div className="card-right-section">
                                    <img
                                        src="/src/assets/event-shadow.png"
                                        alt="Event Shadow"
                                        className="home-event-shadow"
                                    />
                                    <img
                                        src={event.mainImage}
                                        alt="Event Image"
                                        className="home-event-image"
                                    />
                                    <button
                                        className="home-arrow-button"
                                        onClick={() => navigate(`/event/${event.id}`)}
                                        aria-label={`Go to ${event.title} details`}
                                    >
                                        <img
                                            src="/src/assets/blog-arrow.png"
                                            alt="Go to Event Details"
                                            className="home-arrow-image"
                                        />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Home;
