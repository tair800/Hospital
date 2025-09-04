import React, { useState, useEffect } from 'react';
import './AboutCarousel.css';

function AboutCarousel() {
    const [carouselData, setCarouselData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [imagesPerScreen, setImagesPerScreen] = useState(5);

    // Fetch carousel data from API
    useEffect(() => {
        const fetchCarouselData = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:5000/api/aboutcarousel');
                if (!response.ok) {
                    throw new Error('Failed to fetch carousel data');
                }
                const data = await response.json();
                setCarouselData(data);
            } catch (err) {
                console.error('Error fetching carousel data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCarouselData();
    }, []);

    // Set images per screen based on screen size
    useEffect(() => {
        const updateImagesPerScreen = () => {
            if (window.innerWidth <= 480) {
                setImagesPerScreen(2);
            } else if (window.innerWidth <= 768) {
                setImagesPerScreen(3);
            } else if (window.innerWidth <= 1200) {
                setImagesPerScreen(4);
            } else {
                setImagesPerScreen(5);
            }
        };

        updateImagesPerScreen();
        window.addEventListener('resize', updateImagesPerScreen);
        return () => window.removeEventListener('resize', updateImagesPerScreen);
    }, []);

    // Manual navigation
    const goToSlide = (index) => {
        const maxIndex = Math.max(0, carouselData.length - imagesPerScreen);
        setCurrentIndex(Math.min(index, maxIndex));
    };

    const goToPrevious = () => {
        setCurrentIndex(prevIndex => {
            if (prevIndex <= 0) {
                const maxIndex = Math.max(0, carouselData.length - imagesPerScreen);
                return maxIndex;
            } else {
                return prevIndex - 1;
            }
        });
    };

    const goToNext = () => {
        setCurrentIndex(prevIndex => {
            const maxIndex = Math.max(0, carouselData.length - imagesPerScreen);
            if (prevIndex >= maxIndex) {
                return 0;
            } else {
                return prevIndex + 1;
            }
        });
    };

    if (loading) {
        return (
            <div className="about-carousel-container">
                <div className="about-carousel-loading">Loading carousel...</div>
            </div>
        );
    }

    if (carouselData.length === 0) {
        return null;
    }

    // Calculate how many dots we need (one per group of images)
    const totalGroups = Math.ceil(carouselData.length / imagesPerScreen);
    const currentGroup = Math.floor(currentIndex / imagesPerScreen);

    return (
        <div className="about-carousel-container">
            <div className="about-carousel-wrapper">
                <div
                    className="about-carousel-slides"
                    style={{
                        transform: `translateX(-${currentIndex * (100 / imagesPerScreen)}%)`
                    }}
                >
                    {carouselData.map((item, index) => (
                        <div key={item.id} className="about-carousel-slide">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="about-carousel-image"
                            />
                        </div>
                    ))}
                </div>

                {/* Navigation arrows */}
                <button className="about-carousel-arrow about-carousel-arrow-left" onClick={goToPrevious}>
                    &#8249;
                </button>
                <button className="about-carousel-arrow about-carousel-arrow-right" onClick={goToNext}>
                    &#8250;
                </button>

                {/* Dots indicator - one per group */}
                <div className="about-carousel-dots">
                    {Array.from({ length: totalGroups }, (_, index) => (
                        <button
                            key={index}
                            className={`about-carousel-dot ${index === currentGroup ? 'active' : ''}`}
                            onClick={() => goToSlide(index * imagesPerScreen)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AboutCarousel;
