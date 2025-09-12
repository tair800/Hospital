import React, { useRef, useEffect, useState } from 'react';
import './LogoCarousel.css';

const LogoCarousel = () => {
    const carouselRef = useRef(null);
    const [logoData, setLogoData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper function to get correct image path
    const getImagePath = (imageName) => {
        if (!imageName) return '';
        if (imageName.startsWith('/assets/')) return imageName;
        if (imageName.startsWith('/src/assets/')) return imageName.replace('/src/assets/', '/assets/');
        return `/assets/${imageName}`;
    };

    // Fetch logo data from API
    useEffect(() => {
        const fetchLogoData = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://ahpbca-api.webonly.io/api/logos');
                if (!response.ok) {
                    throw new Error('Failed to fetch logo data');
                }
                const data = await response.json();
                setLogoData(data);
            } catch (err) {
                console.error('Error fetching logo data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLogoData();
    }, []);

    // Create zigzag pattern: odd IDs on first row, even IDs on second row
    const createZigzagData = () => {
        const oddLogos = logoData.filter(logo => logo.id % 2 === 1);  // 1,3,5,7,9,11,13
        const evenLogos = logoData.filter(logo => logo.id % 2 === 0); // 2,4,6,8,10,12,14

        // Duplicate for infinite scroll effect
        const duplicatedOdd = [...oddLogos, ...oddLogos, ...oddLogos];
        const duplicatedEven = [...evenLogos, ...evenLogos, ...evenLogos];

        return { oddLogos: duplicatedOdd, evenLogos: duplicatedEven };
    };

    const { oddLogos, evenLogos } = createZigzagData();

    // Auto-scroll functionality
    useEffect(() => {
        if (logoData.length === 0) return; // Don't start scrolling until data is loaded

        const autoScroll = setInterval(() => {
            if (carouselRef.current) {
                const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
                if (carouselRef.current.scrollLeft >= maxScroll) {
                    // Reset to beginning for infinite effect
                    carouselRef.current.scrollLeft = 0;
                } else {
                    carouselRef.current.scrollLeft += 1; // Scroll speed
                }
            }
        }, 30); // Update every 30ms for smooth scrolling

        return () => clearInterval(autoScroll);
    }, [logoData]);

    // Show loading state
    if (loading) {
        return (
            <div className="logo-carousel-section">
                <div className="logo-carousel-container">
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <p>Loading logos...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="logo-carousel-section">
                <div className="logo-carousel-container">
                    <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
                        <p>Error loading logos: {error}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Show empty state
    if (logoData.length === 0) {
        return (
            <div className="logo-carousel-section">
                <div className="logo-carousel-container">
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <p>No logos available.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="logo-carousel-section">
            <div className="logo-carousel-container">
                <div
                    className="logo-carousel-wrapper"
                    ref={carouselRef}
                >
                    {/* First Row - Odd IDs */}
                    <div className="logo-row">
                        {oddLogos.map((logo, index) => (
                            <div key={`odd-${logo.id}-${index}`} className="logo-carousel-item">
                                <img
                                    src={getImagePath(logo.image)}
                                    alt={logo.name}
                                    draggable={false}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Second Row - Even IDs */}
                    <div className="logo-row">
                        {evenLogos.map((logo, index) => (
                            <div key={`even-${logo.id}-${index}`} className="logo-carousel-item">
                                <img
                                    src={getImagePath(logo.image)}
                                    alt={logo.name}
                                    draggable={false}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogoCarousel;