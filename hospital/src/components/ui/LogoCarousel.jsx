import React, { useRef, useEffect, useState } from 'react';
import { getContextualImagePath } from '../../utils/imageUtils';
import './LogoCarousel.css';

const LogoCarousel = () => {
    const carouselRef = useRef(null);
    const [logoData, setLogoData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);


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

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Create zigzag pattern: odd IDs on first row, even IDs on second row
    const createZigzagData = () => {
        // Use all available logos for better infinite scroll on both mobile and desktop
        const oddLogos = logoData.filter(logo => logo.id % 2 === 1);  // 1,3,5,7,9,11,13
        const evenLogos = logoData.filter(logo => logo.id % 2 === 0); // 2,4,6,8,10,12,14

        // Duplicate for infinite scroll effect (both mobile and desktop)
        const duplicatedOdd = [...oddLogos, ...oddLogos, ...oddLogos];
        const duplicatedEven = [...evenLogos, ...evenLogos, ...evenLogos];
        return { oddLogos: duplicatedOdd, evenLogos: duplicatedEven };
    };

    const { oddLogos, evenLogos } = createZigzagData();

    // Auto-scroll functionality with seamless looping
    useEffect(() => {
        if (logoData.length === 0) return; // Don't start scrolling until data is loaded
        if (!carouselRef.current) return;

        const wrapper = carouselRef.current;

        const computeSingleSetWidth = () => wrapper.scrollWidth / 3;
        let singleSetWidth = computeSingleSetWidth();

        // Start from the middle set to allow seamless back-shift later
        wrapper.scrollLeft = singleSetWidth;

        const speedPxPerSec = 30; // pixels per second
        let rafId = null;
        let lastTs = null;

        const step = (ts) => {
            if (!wrapper) return;
            if (lastTs == null) {
                lastTs = ts;
            }
            const deltaSec = (ts - lastTs) / 1000;
            lastTs = ts;

            let next = wrapper.scrollLeft + speedPxPerSec * deltaSec;
            // When we reach near the end of the second set, jump back by one set width instantly
            if (next >= singleSetWidth * 2) {
                next -= singleSetWidth;
            }
            wrapper.scrollLeft = next;
            rafId = requestAnimationFrame(step);
        };

        rafId = requestAnimationFrame(step);

        // Recompute widths on resize to keep loop seamless
        const handleResize = () => {
            singleSetWidth = computeSingleSetWidth();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            window.removeEventListener('resize', handleResize);
        };
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
                                <div className="logo-card">
                                    <div className="logo-card-image">
                                        <img
                                            src={getContextualImagePath(logo.image, 'admin')}
                                            alt={logo.name}
                                            draggable={false}
                                            key={logo.image}
                                        />
                                    </div>
                                    <div className="logo-card-text" title={logo.name}>
                                        {logo.name}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Second Row - Even IDs */}
                    <div className="logo-row">
                        {evenLogos.map((logo, index) => (
                            <div key={`even-${logo.id}-${index}`} className="logo-carousel-item">
                                <div className="logo-card">
                                    <div className="logo-card-image">
                                        <img
                                            src={getContextualImagePath(logo.image, 'admin')}
                                            alt={logo.name}
                                            draggable={false}
                                            key={logo.image}
                                        />
                                    </div>
                                    <div className="logo-card-text" title={logo.name}>
                                        {logo.name}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogoCarousel;