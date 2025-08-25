import React, { useState, useRef, useEffect } from 'react';
import './Gallery.css';
import LogoCarousel from './LogoCarousel';

const Gallery = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const sliderRef = useRef(null);

    // Array of 10 images (using gallery1.png for all as placeholder)
    const originalImages = Array.from({ length: 10 }, (_, index) => ({
        id: index + 1,
        src: "/src/assets/gallery1.png",
        alt: `Gallery ${index + 1}`
    }));

    // Create infinite loop by duplicating images multiple times
    const images = [...originalImages, ...originalImages, ...originalImages, ...originalImages, ...originalImages];

    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        setStartX(e.pageX);
        setScrollLeft(sliderRef.current.scrollLeft);

        // Add grabbing cursor and disable smooth scrolling
        sliderRef.current.style.cursor = 'grabbing';
        sliderRef.current.style.userSelect = 'none';
        sliderRef.current.style.scrollBehavior = 'auto';
        sliderRef.current.classList.add('grabbing');
    };

    const handleMouseUp = () => {
        setIsDragging(false);

        // Reset cursor, user select, and smooth scrolling
        if (sliderRef.current) {
            sliderRef.current.style.cursor = 'grab';
            sliderRef.current.style.userSelect = 'auto';
            sliderRef.current.style.scrollBehavior = 'smooth';
            sliderRef.current.classList.remove('grabbing');
        }
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();

        const x = e.pageX;
        const walk = (x - startX);
        sliderRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleTouchStart = (e) => {
        setIsDragging(true);
        setStartX(e.touches[0].pageX);
        setScrollLeft(sliderRef.current.scrollLeft);

        // Disable smooth scrolling during touch
        sliderRef.current.style.scrollBehavior = 'auto';
        sliderRef.current.classList.add('grabbing');
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();

        const x = e.touches[0].pageX;
        const walk = (x - startX);
        sliderRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleTouchEnd = () => {
        setIsDragging(false);

        // Re-enable smooth scrolling
        if (sliderRef.current) {
            sliderRef.current.style.scrollBehavior = 'smooth';
            sliderRef.current.classList.remove('grabbing');
        }
    };

    // Handle mouse leave
    const handleMouseLeave = () => {
        if (isDragging) {
            setIsDragging(false);
            if (sliderRef.current) {
                sliderRef.current.style.cursor = 'grab';
                sliderRef.current.style.userSelect = 'auto';
                sliderRef.current.style.scrollBehavior = 'smooth';
                sliderRef.current.classList.remove('grabbing');
            }
        }
    };

    // Global mouse event listeners for better drag experience
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            if (isDragging) {
                setIsDragging(false);
                if (sliderRef.current) {
                    sliderRef.current.style.cursor = 'grab';
                    sliderRef.current.style.userSelect = 'auto';
                    sliderRef.current.style.scrollBehavior = 'smooth';
                    sliderRef.current.classList.remove('grabbing');
                }
            }
        };

        const handleGlobalMouseMove = (e) => {
            if (!isDragging) return;
            handleMouseMove(e);
        };

        // Add global event listeners
        document.addEventListener('mouseup', handleGlobalMouseUp);
        document.addEventListener('mousemove', handleGlobalMouseMove);
        document.addEventListener('mouseleave', handleGlobalMouseUp);

        return () => {
            document.removeEventListener('mouseup', handleGlobalMouseUp);
            document.removeEventListener('mousemove', handleGlobalMouseMove);
            document.removeEventListener('mouseleave', handleGlobalMouseUp);
        };
    }, [isDragging, startX, scrollLeft]);

    return (
        <div className="gallery-page">
            <div className="gallery-slider-container">
                <div
                    className="gallery-slider"
                    ref={sliderRef}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{
                        cursor: 'grab',
                        userSelect: 'none'
                    }}
                >
                    <div className="images-container">
                        {images.map((image, index) => (
                            <div key={`${image.id}-${index}`} className="image-item">
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        pointerEvents: 'none'
                                    }}
                                    draggable={false}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="gallery-logo-section">
                <LogoCarousel />
            </div>
        </div>
    );
};

export default Gallery;
