import React, { useState, useEffect } from 'react';
import circle1 from '../../../assets/circle1.png'
import circle2 from '../../../assets/circle2.png'
import circle3 from '../../../assets/circle3.png'
import { useNavigate } from 'react-router-dom';
import './Home.css';
import iconNext from '../../../assets/icon-next.svg';
import homeLongButton from '../../../assets/home-long-button.svg';
import InfoCard from '../../ui/InfoCard';
import EmployeeSlider from '../employee/EmployeeSlider';
import LogoCarousel from '../../ui/LogoCarousel';
import { RequestModal } from '../../ui';
import { getContextualImagePath } from '../../../utils/imageUtils';

const Home = () => {
    const navigate = useNavigate();
    const [latestEvents, setLatestEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [heroEvents, setHeroEvents] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLargeScreen, setIsLargeScreen] = useState(false);
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
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

    // Fetch home sections data from API
    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const response = await fetch('https://localhost:5000/api/HomeSection/first');
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
                const response = await fetch('https://localhost:5000/api/events');
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

                // Get past events (for InfoCard components) - fetch more for large screens
                const pastEventsData = data
                    .filter(event => new Date(event.eventDate) < now) // Only past events
                    .sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate)) // Most recent first
                    .slice(0, 8); // Fetch up to 8 events to support 3, 4, and 5 card displays
                setPastEvents(pastEventsData);

                // Get hero events (upcoming events for slider - take first 3)
                const heroEventsData = data
                    .filter(event => new Date(event.eventDate) > now) // Only upcoming events
                    .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate)) // Closest date first
                    .slice(0, 3);
                setHeroEvents(heroEventsData);
            } catch (err) {
                console.error('Error fetching events:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    // Fetch employees from API
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch('https://localhost:5000/api/employees');
                if (!response.ok) {
                    throw new Error('Failed to fetch employees');
                }
                const data = await response.json();
                // Fetch all employees - let the slider handle pagination
                setEmployees(data);
            } catch (err) {
                console.error('Error fetching employees:', err);
            }
        };

        fetchEmployees();
    }, []);

    // Countdown timer effect for current hero event
    useEffect(() => {
        if (!heroEvents.length || currentSlide >= heroEvents.length) return;

        const currentEvent = heroEvents[currentSlide];
        if (!currentEvent) return;

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const eventTime = new Date(currentEvent.eventDate).getTime();
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
    }, [heroEvents, currentSlide]);

    // Function to truncate text to a specific length and add "..." if needed
    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    };

    // Helper function to format section 1 text with proper line breaks
    const formatSection1Text = (text) => {
        if (!text) {
            return '';
        }

        // Preserve user-provided content from admin; render line breaks
        const lines = text.split(/\r?\n/);
        return lines.map((line, index) => (
            <React.Fragment key={index}>
                {line}
                {index < lines.length - 1 && <br />}
            </React.Fragment>
        ));
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


    // Slider navigation functions
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % heroEvents.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + heroEvents.length) % heroEvents.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    // Add home-page class to body for page-specific styling
    useEffect(() => {
        document.body.classList.add('home-page');
        return () => {
            document.body.classList.remove('home-page');
        };
    }, []);

    // Screen size detection for card display
    useEffect(() => {
        const checkScreenSize = () => {
            setIsLargeScreen(window.innerWidth >= 1920);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    return (
        <div className="home-page">
            <div className="home-bg-section">
                <video
                    src="/assets/home-video.mp4"
                    className="home-bg-video"
                    autoPlay
                    loop
                    muted
                    playsInline
                />

                {/* Hero Event Slider */}
                <div className="home-hero-slider">
                    <div className="home-hero-slider-container">
                        {loading ? (
                            <div className="home-hero-loading">Yüklənir...</div>
                        ) : error ? (
                            <div className="home-hero-error">Xəta: {error}</div>
                        ) : heroEvents.length === 0 ? (
                            <div className="home-hero-no-events">Heç bir tədbir tapılmadı</div>
                        ) : (
                            heroEvents.map((event, index) => {
                                const { day, month } = formatEventDate(event.eventDate);
                                const formattedPrice = formatPrice(event.price, event.currency);
                                const eventDate = new Date(event.eventDate);
                                const timeString = eventDate.toLocaleTimeString('az-AZ', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false
                                });

                                return (
                                    <div
                                        key={event.id}
                                        className={`home-hero-slide ${index === currentSlide ? 'active' : ''}`}
                                    >
                                        {/* Event Date and Time - Above Card */}
                                        <div className="home-hero-event-datetime">
                                            {day} {month} {eventDate.getFullYear()}, {timeString}
                                        </div>

                                        {/* White Card with 70/30 Split - Centered on Video */}
                                        <div className="home-white-card">
                                            <div className="home-hero-card-left-section">
                                                <div className="home-hero-event-info">
                                                    <div className="home-hero-event-date-location">
                                                        {day} {month}, {event.venue}
                                                        {event.region && `, ${event.region}`}
                                                    </div>
                                                    <div className="home-hero-event-title">
                                                        {event.title}
                                                    </div>
                                                    <div className="home-hero-event-description">
                                                        <p>{event.description}</p>
                                                    </div>
                                                    <div className="home-hero-event-price">
                                                        Qiymət: {formattedPrice}
                                                    </div>
                                                    <div className="home-hero-event-buttons">
                                                        <button
                                                            className="home-hero-btn-primary"
                                                            onClick={() => setShowRequestModal(true)}
                                                        >
                                                            Bilet al
                                                        </button>
                                                        <button
                                                            className="home-hero-btn-secondary"
                                                            onClick={() => navigate(`/event/${event.id}`)}
                                                        >
                                                            Detaillı bax
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="home-hero-card-right-section">
                                                <div className="home-hero-event-image-container">
                                                    <img
                                                        src={getContextualImagePath(event.detailImageMain, 'admin')}
                                                        alt="Event Main Image"
                                                        className="home-hero-event-image"
                                                    />
                                                    <div className="home-hero-countdown-timer">
                                                        <div className="home-hero-timer-display">
                                                            <div className="home-hero-timer-unit">
                                                                <span className="home-hero-timer-number">{timeLeft.days.toString().padStart(2, '0')}</span>
                                                            </div>
                                                            <span className="home-hero-timer-separator">:</span>
                                                            <div className="home-hero-timer-unit">
                                                                <span className="home-hero-timer-number">{timeLeft.hours.toString().padStart(2, '0')}</span>
                                                            </div>
                                                            <span className="home-hero-timer-separator">:</span>
                                                            <div className="home-hero-timer-unit">
                                                                <span className="home-hero-timer-number">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Stable Navigation Buttons - Outside slider container */}
                    {heroEvents.length > 1 && (
                        <>
                            <button
                                className="home-hero-side-nav home-hero-side-nav-left"
                                onClick={prevSlide}
                                disabled={currentSlide === 0}
                                aria-label="Previous slide"
                            >
                                <img src={iconNext} alt="Previous" className="home-hero-side-nav-icon left" />
                            </button>
                            <button
                                className="home-hero-side-nav home-hero-side-nav-right"
                                onClick={nextSlide}
                                disabled={currentSlide === heroEvents.length - 1}
                                aria-label="Next slide"
                            >
                                <img src={iconNext} alt="Next" className="home-hero-side-nav-icon" />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Decorative Circle 3 */}
            <div className="home-circle-right">
                <img
                    src={circle3}
                    alt="Dekorativ Dairə 3"
                    className="home-circle-right-image"
                />
            </div>

            {/* Decorative Circle 1 */}
            <div className="home-circle-left">
                <img
                    src={circle1}
                    alt="Dekorativ Dairə 1"
                    className="home-circle-left-image"
                />
            </div>

            {/* Decorative Circle 2 */}
            <div className="home-circle-left2">
                <img
                    src={circle2}
                    alt="Dekorativ Dairə 2"
                    className="home-circle-left2-image"
                />
            </div>

            {/* Removed extra circle: left3 */}

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
                            src="/assets/home1-bg.png"
                            alt="Background Pattern"
                            className="section-2-bg-pattern"
                        />
                    </div>
                    <div className="section-content">
                        <div className="section-2-image">
                            {homeData.section2Image && (
                                <img
                                    src={getContextualImagePath(homeData.section2Image, 'admin')}
                                    alt="Hospital Services"
                                    className="section-2-main-image"
                                />
                            )}
                        </div>
                    </div>
                </div>
                <div className="section section-3">
                    <div className="section-3-bg-image">
                        <img
                            src="/assets/home2-bg.png"
                            alt="Background Pattern"
                            className="section-3-bg-pattern"
                        />
                    </div>
                    <div className="section-content">
                        <div className="section-3-image">
                            {homeData.section3Image && (
                                <img
                                    src={getContextualImagePath(homeData.section3Image, 'admin')}
                                    alt="Hospital Services"
                                    className="section-3-main-image"
                                />
                            )}
                        </div>
                    </div>
                </div>
                <div className="section section-4">
                    <div className="section-content">
                        <div className="section-4-text">
                            <h1>{homeData.section4Title}</h1>
                            <div className="section-4-description">
                                <p>{homeData.section4Description}</p>
                            </div>
                            <div className="section-4-purpose">
                                <h3>{homeData.section4PurposeTitle}</h3>
                                <p>{homeData.section4PurposeDescription}</p>
                            </div>
                        </div>
                    </div>
                </div>
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
                ) : (
                    <>
                        {pastEvents.slice(0, isLargeScreen ? 5 : 3).map((event, index) => {
                            const { day, month } = formatEventDate(event.eventDate);
                            const truncatedDescription = truncateText(event.description, 100);

                            return (
                                <div
                                    key={event.id}
                                    className={`info-card-slide ${index === 0 ? 'active' : ''}`}
                                >
                                    <InfoCard
                                        imageSrc={getContextualImagePath(event.mainImage, 'admin')}
                                        title={event.title}
                                        description={truncatedDescription}
                                        date={day.toString()}
                                        month={month}
                                        onReadMoreClick={() => navigate(`/event/${event.id}`)}
                                    />
                                </div>
                            );
                        })}

                        {/* Navigation Buttons */}
                        <button
                            className="info-card-nav info-card-nav-left"
                            onClick={() => {
                                const slides = document.querySelectorAll('.info-card-slide');
                                const activeSlide = document.querySelector('.info-card-slide.active');
                                const currentIndex = Array.from(slides).indexOf(activeSlide);
                                const prevIndex = currentIndex > 0 ? currentIndex - 1 : slides.length - 1;

                                activeSlide.classList.remove('active');
                                slides[prevIndex].classList.add('active');
                            }}
                        >
                            ‹
                        </button>

                        <button
                            className="info-card-nav info-card-nav-right"
                            onClick={() => {
                                const slides = document.querySelectorAll('.info-card-slide');
                                const activeSlide = document.querySelector('.info-card-slide.active');
                                const currentIndex = Array.from(slides).indexOf(activeSlide);
                                const nextIndex = currentIndex < slides.length - 1 ? currentIndex + 1 : 0;

                                activeSlide.classList.remove('active');
                                slides[nextIndex].classList.add('active');
                            }}
                        >
                            ›
                        </button>
                    </>
                )}
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
                                                <div className="home-event-venue" title={`${event.venue}${event.region ? `, ${event.region}` : ''}`}>
                                                    {event.venue && event.venue.length > 20
                                                        ? event.venue.substring(0, 20) + '...'
                                                        : event.venue}
                                                    {event.region && (
                                                        <div className="home-event-region">
                                                            {event.region.length > 15
                                                                ? event.region.substring(0, 15) + '...'
                                                                : event.region}
                                                        </div>
                                                    )}
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

                                        <div className="home-event-price">{formattedPrice}</div>
                                    </div>
                                </div>
                                <div className="card-right-section">
                                    <img
                                        src="/assets/event-shadow.png"
                                        alt="Event Shadow"
                                        className="home-event-shadow"
                                    />
                                    <img
                                        src={getContextualImagePath(event.mainImage, 'admin')}
                                        alt="Event Image"
                                        className="home-event-image"
                                    />
                                    <img
                                        src={homeLongButton}
                                        alt="Go to Event Details"
                                        className="home-arrow-image"
                                        onClick={() => navigate(`/event/${event.id}`)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Home Header Text 3 */}
            <div className="home-header-text-3">
                <div className="home-header-left-3">
                    <span className="home-header-first-3">Bizim</span>
                    <span className="home-header-second-3">
                        <span>Üzvlərimiz</span>
                    </span>
                </div>
                <button className="home-header-btn-3" onClick={() => {
                    navigate('/employee');
                    window.scrollTo(0, 0);
                }}>Hamsına bax</button>
            </div>

            {/* Employee Cards Slider */}
            <EmployeeSlider employees={employees} />

            {/* Logo Carousel */}
            <LogoCarousel />

            {/* Request Modal */}
            <RequestModal
                isOpen={showRequestModal}
                onClose={() => setShowRequestModal(false)}
                onSuccess={() => {
                }}
            />
        </div>
    );
};

export default Home;
