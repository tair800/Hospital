import React, { useState, useRef, useEffect } from 'react';
import './Gallery.css';
import LogoCarousel from '../../ui/LogoCarousel';

const Gallery = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [galleryData, setGalleryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const sliderRef = useRef(null);

    // Fetch gallery data from API
    useEffect(() => {
        const fetchGalleryData = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://ahpbca-api.webonly.io/api/gallery');
                if (!response.ok) {
                    throw new Error('Failed to fetch gallery data');
                }
                const data = await response.json();
                setGalleryData(data);
            } catch (err) {
                console.error('Error fetching gallery data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGalleryData();
    }, []);

    // Helper function to get correct image path
    const getImagePath = (imageName) => {
        if (!imageName) return '';
        if (imageName.startsWith('/assets/')) return imageName;
        if (imageName.startsWith('/src/assets/')) return imageName.replace('/src/assets/', '/assets/');
        return `/assets/${imageName}`;
    };

    // Create infinite loop by duplicating images multiple times
    const images = galleryData.length > 0
        ? [...galleryData, ...galleryData, ...galleryData, ...galleryData, ...galleryData]
        : [];

    const handleMouseDown = (e) => {
        e.preventDefault();
        if (sliderRef.current) {
            setIsDragging(true);
            setStartX(e.pageX);
            setScrollLeft(sliderRef.current.scrollLeft);

            // Add grabbing cursor and disable smooth scrolling
            sliderRef.current.style.cursor = 'grabbing';
            sliderRef.current.style.userSelect = 'none';
            sliderRef.current.style.scrollBehavior = 'auto';
            sliderRef.current.classList.add('grabbing');
        }
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
        if (sliderRef.current) {
            sliderRef.current.scrollLeft = scrollLeft - walk;
        }
    };

    const handleTouchStart = (e) => {
        if (sliderRef.current) {
            setIsDragging(true);
            setStartX(e.touches[0].pageX);
            setScrollLeft(sliderRef.current.scrollLeft);

            // Disable smooth scrolling during touch
            sliderRef.current.style.scrollBehavior = 'auto';
            sliderRef.current.classList.add('grabbing');
        }
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();

        const x = e.touches[0].pageX;
        const walk = (x - startX);
        if (sliderRef.current) {
            sliderRef.current.scrollLeft = scrollLeft - walk;
        }
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

            const x = e.pageX;
            const walk = (x - startX);
            if (sliderRef.current) {
                sliderRef.current.scrollLeft = scrollLeft - walk;
            }
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

    // Show loading state
    if (loading) {
        return (
            <div className="gallery-page">
                <div className="gallery-loading">
                    <p>Loading gallery...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="gallery-page">
                <div className="gallery-error">
                    <p>Error loading gallery: {error}</p>
                </div>
            </div>
        );
    }

    // Show empty state
    if (galleryData.length === 0) {
        return (
            <div className="gallery-page">
                <div className="gallery-empty">
                    <p>No gallery images available.</p>
                </div>
            </div>
        );
    }

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
                                    src={getImagePath(image.image)}
                                    alt={image.title || `Gallery ${image.id}`}
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
