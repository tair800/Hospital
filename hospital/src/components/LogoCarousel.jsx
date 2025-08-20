import React, { useRef, useEffect } from 'react';
import { logoData } from '../data/logo-data.js';
import './LogoCarousel.css';

const LogoCarousel = () => {
    const carouselRef = useRef(null);

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
    }, []);

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
                                    src={logo.image}
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
                                    src={logo.image}
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
