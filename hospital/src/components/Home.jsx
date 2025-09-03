import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import './InfoCard.css';
import InfoCard from './InfoCard';

const Home = () => {
    const navigate = useNavigate();
    const [latestEvents, setLatestEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);
    const [homeData, setHomeData] = useState({
        section1Description: '',
        section2Image: '',
        section3Image: '',
        section4Title: '',
        section4Description: '',
        section4PurposeTitle: '',
        section4PurposeDescription: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch home sections data from API
    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/HomeSection/first');
                if (response.ok) {
                    const data = await response.json();
                    setHomeData({
                        section1Description: data.section1Description || '',
                        section2Image: data.section2Image || '',
                        section3Image: data.section3Image || '',
                        section4Title: data.section4Title || '',
                        section4Description: data.section4Description || '',
                        section4PurposeTitle: data.section4PurposeTitle || '',
                        section4PurposeDescription: data.section4PurposeDescription || ''
                    });
                }
            } catch (err) {
                console.error('Error fetching home data:', err);
            }
        };

        fetchHomeData();
    }, []);

    // Fetch latest events from API
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:5000/api/events');
                if (!response.ok) {
                    throw new Error('Failed to fetch events');
                }
                const data = await response.json();
                const now = new Date();

                // Get upcoming events (for existing cards)
                const upcomingEvents = data
                    .filter(event => new Date(event.eventDate) > now) // Only upcoming events
                    .sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate)) // Furthest date first (longest waiting)
                    .slice(0, 3);
                setLatestEvents(upcomingEvents);

                // Get past events (for InfoCard components)
                const pastEventsData = data
                    .filter(event => new Date(event.eventDate) < now) // Only past events
                    .sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate)) // Most recent first
                    .slice(0, 3);
                setPastEvents(pastEventsData);
            } catch (err) {
                console.error('Error fetching events:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    // Function to truncate text to a specific length and add "..." if needed
    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    };

    // Helper function to format section 1 text with proper line breaks
    const formatSection1Text = (text) => {
        if (!text) {
            return (
                <>
                    Azərbaycan<br />
                    Hepato-Pankreato-Biliar<br />
                    Cərrahlar İctimai Birliyi
                </>
            );
        }

        // If the text contains the expected structure, format it with line breaks
        if (text.includes('Azərbaycan') && text.includes('Hepato-Pankreato-Biliar')) {
            return (
                <>
                    Azərbaycan<br />
                    Hepato-Pankreato-Biliar<br />
                    Cərrahlar İctimai Birliyi
                </>
            );
        }

        // For other text, try to split intelligently or return as is
        return text;
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
    const formatPrice = (price, currency) => {
        if (price === 0 || price === '0' || price === null || price === undefined) return 'Pulsuz';
        return `${price} ${currency}`;
    };

    // Helper function to get correct image path
    const getImagePath = (imageName) => {
        if (!imageName) return '';
        if (imageName === 'event-img.png') return '/src/assets/event-img.png';
        if (imageName.startsWith('/src/assets/')) return imageName;
        return `/src/assets/${imageName}`;
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

            {/* Home Circle Right Decorative Element */}
            <div className="home-circle-right">
                <img
                    src="/src/assets/home-circle-right.png"
                    alt="Decorative Circle"
                    className="home-circle-right-image"
                />
            </div>

            {/* Home Circle Left Decorative Element */}
            <div className="home-circle-left">
                <img
                    src="/src/assets/home-circle-left1.png"
                    alt="Decorative Circle Left"
                    className="home-circle-left-image"
                />
            </div>

            {/* Home Circle Left 2 Decorative Element */}
            <div className="home-circle-left2">
                <img
                    src="/src/assets/home-circle-left2.png"
                    alt="Decorative Circle Left 2"
                    className="home-circle-left2-image"
                />
            </div>

            {/* Home Circle Left 3 Decorative Element */}
            <div className="home-circle-left3">
                <img
                    src="/src/assets/home-circle-left3.png"
                    alt="Decorative Circle Left 3"
                    className="home-circle-left3-image"
                />
            </div>

            {/* Four Sections Grid */}
            <div className="four-sections-grid">
                <div className="section section-1">
                    <div className="section-content">
                        <div className="section-1-text">
                            <h1>{formatSection1Text(homeData.section1Description)}</h1>
                        </div>
                    </div>
                </div>
                <div className="section section-2">
                    <div className="section-bg-image">
                        <img
                            src="/src/assets/home1-bg.png"
                            alt="Background Pattern"
                            className="section-2-bg-pattern"
                        />
                    </div>
                    <div className="section-content">
                        <div className="section-2-image">
                            <img
                                src={homeData.section2Image ? `/src/assets/${homeData.section2Image}` : "/src/assets/home1.png"}
                                alt="Hospital Services"
                                className="section-2-main-image"
                            />
                        </div>
                    </div>
                </div>
                <div className="section section-3">
                    <div className="section-3-bg-image">
                        <img
                            src="/src/assets/home2-bg.png"
                            alt="Background Pattern"
                            className="section-3-bg-pattern"
                        />
                    </div>
                    <div className="section-content">
                        <div className="section-3-image">
                            <img
                                src={homeData.section3Image ? `/src/assets/${homeData.section3Image}` : "/src/assets/home2.png"}
                                alt="Hospital Services"
                                className="section-3-main-image"
                            />
                        </div>
                    </div>
                </div>
                <div className="section section-4">
                    <div className="section-content">
                        <div className="section-4-text">
                            <h1>{homeData.section4Title || 'Azərbaycan Hepato-Pankreato-Biliar Cərrahlar İctimai Birliyi'}</h1>
                            <div className="section-4-description">
                                <p>{homeData.section4Description || 'qaraciyər, öd yolları və mədəaltı vəzi xəstəliklərinin cərrahiyyəsi sahəsində çalışan mütəxəssisləri bir araya gətirən elmi-ictimai təşkilatdır.'}</p>
                            </div>
                            <div className="section-4-purpose">
                                <h3>{homeData.section4PurposeTitle || 'Birliyin məqsədi'}</h3>
                                <p>{homeData.section4PurposeDescription || 'bu sahədə bilik və təcrübə mübadiləsini təşviq etmək, gənc həkimlərin inkişafını dəstəkləmək və beynəlxalq əməkdaşlıq vasitəsilə ölkəmizdə müasir tibbi yanaşmaların tətbiqinə töhfə verməkdir.'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Home Header Text */}
            <div className="home-header-text">
                <div className="home-header-left">
                    <span className="home-header-first">Gözlənilən</span>
                    <span className="home-header-second">
                        <span>Tədbirlər</span>
                    </span>
                </div>
                <button className="home-header-btn" onClick={() => {
                    navigate('/events');
                    window.scrollTo(0, 0);
                }}>Hamısına bax</button>
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
                        const formattedPrice = formatPrice(event.price, event.currency);

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
                                        src={getImagePath(event.mainImage)}
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

            {/* Home Header Text 2 */}
            <div className="home-header-text-2">
                <div className="home-header-left-2">
                    <span className="home-header-first-2">Ən son</span>
                    <span className="home-header-second-2">
                        <span>Tədbirlər</span>
                    </span>
                </div>
                <button className="home-header-btn-2" onClick={() => {
                    navigate('/events');
                    window.scrollTo(0, 0);
                }}>Hamsına bax</button>
            </div>

            {/* Additional Info Cards in one row */}
            <div className="info-card-row">
                {loading ? (
                    <div className="loading-message">Yüklənir...</div>
                ) : error ? (
                    <div className="error-message">Xəta: {error}</div>
                ) : pastEvents.length === 0 ? (
                    <div className="no-events-message">Keçmiş tədbir tapılmadı</div>
                ) : pastEvents.slice(0, 3).map((event, index) => {
                    const { day, month } = formatEventDate(event.eventDate);
                    const truncatedDescription = truncateText(event.description, 100);

                    return (
                        <InfoCard
                            key={event.id}
                            imageSrc={getImagePath(event.mainImage)}
                            title={event.title}
                            description={truncatedDescription}
                            date={day.toString()}
                            month={month}
                            onReadMoreClick={() => navigate(`/event/${event.id}`)}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Home;
