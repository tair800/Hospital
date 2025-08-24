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
        setStartX(e.pageX - sliderRef.current.offsetLeft);
        setScrollLeft(sliderRef.current.scrollLeft);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - sliderRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        sliderRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleTouchStart = (e) => {
        setIsDragging(true);
        setStartX(e.touches[0].pageX - sliderRef.current.offsetLeft);
        setScrollLeft(sliderRef.current.scrollLeft);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        sliderRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    // Global mouse event listeners
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            if (isDragging) {
                setIsDragging(false);
            }
        };

        const handleGlobalMouseMove = (e) => {
            if (!isDragging) return;
            handleMouseMove(e);
        };

        document.addEventListener('mouseup', handleGlobalMouseUp);
        document.addEventListener('mousemove', handleGlobalMouseMove);
        document.addEventListener('mouseleave', handleGlobalMouseUp);

        return () => {
            document.removeEventListener('mouseup', handleGlobalMouseUp);
            document.removeEventListener('mousemove', handleGlobalMouseMove);
            document.removeEventListener('mouseleave', handleGlobalMouseUp);
        };
    }, [isDragging]);

    return (
        <div className="gallery-page">
            <div className="gallery-slider-container">
                <div
                    className="gallery-slider"
                    ref={sliderRef}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{
                        cursor: isDragging ? 'grabbing' : 'grab',
                        userSelect: isDragging ? 'none' : 'auto'
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
