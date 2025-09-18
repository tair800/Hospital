import React, { useState, useRef, useEffect, useMemo } from 'react';
import './Gallery.css';
import LogoCarousel from '../../ui/LogoCarousel';

const Gallery = () => {
    const [galleryData, setGalleryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const cardsRef = useRef(null);
    const cursorRef = useRef(null);
    const rafRef = useRef(0);
    const scrollPosRef = useRef(0);
    const cardSpanRef = useRef(0);

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
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchGalleryData();
    }, []);

    const getImagePath = (imageName) => {
        if (!imageName) return '';
        if (imageName.startsWith('/assets/')) return imageName;
        if (imageName.startsWith('/src/assets/')) return imageName.replace('/src/assets/', '/assets/');
        return `/assets/${imageName}`;
    };

    const baseCards = useMemo(() => {
        const color = '#00e1ff';
        return galleryData.map((img) => ({
            id: img.id,
            title: img.title,
            src: getImagePath(img.image),
            color,
            glowDuration: 3 + Math.random() * 4,
            glowDelay: Math.random() * -5
        }));
    }, [galleryData]);

    const repeated = useMemo(() => {
        return [...baseCards, ...baseCards, ...baseCards];
    }, [baseCards]);

    useEffect(() => {
        const cardsEl = cardsRef.current;
        if (!cardsEl || baseCards.length === 0) return;

        const computeCardSpan = () => {
            const styles = getComputedStyle(document.documentElement);
            const cardWidth = parseInt(styles.getPropertyValue('--gallery-card-width')) || 280;
            const cardSpacing = parseInt(styles.getPropertyValue('--gallery-card-spacing')) || 40;
            cardSpanRef.current = baseCards.length * (cardWidth + cardSpacing);
        };

        computeCardSpan();
        const handleResize = () => computeCardSpan();
        window.addEventListener('resize', handleResize);

        const speed = 0.5;
        const animate = () => {
            scrollPosRef.current += speed;
            if (scrollPosRef.current >= cardSpanRef.current) {
                scrollPosRef.current = 0;
            }
            cardsEl.style.transform = `translateX(-${scrollPosRef.current}px)`;
            rafRef.current = requestAnimationFrame(animate);
        };
        rafRef.current = requestAnimationFrame(animate);

        const handleMouseMove = (e) => {
            if (!cursorRef.current) return;
            cursorRef.current.style.left = `${e.clientX}px`;
            cursorRef.current.style.top = `${e.clientY}px`;
        };
        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            cancelAnimationFrame(rafRef.current);
            document.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
        };
    }, [baseCards]);

    if (loading) {
        return (
            <div className="gallery-page">
                <div className="gallery-loading">
                    <p>Loading gallery...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="gallery-page">
                <div className="gallery-error">
                    <p>Error loading gallery: {error}</p>
                </div>
            </div>
        );
    }

    if (baseCards.length === 0) {
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
            <div className="gallery-anim-page">
                <div className="gallery-anim-container">
                    <div className="gallery-cards-container" ref={cardsRef}>
                        {repeated.map((card, idx) => (
                            <div
                                key={`${card.id}-${idx}`}
                                className="gallery-card"
                                style={{
                                    ['--glow-color']: card.color,
                                    ['--glow-duration']: `${card.glowDuration}s`,
                                    ['--glow-delay']: `${card.glowDelay}s`
                                }}
                            >
                                <img className="gallery-card-image" src={card.src} alt={card.title || `Gallery ${card.id}`} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="gallery-cursor-light" ref={cursorRef} />
            </div>

            <div className="gallery-logo-section">
                <LogoCarousel />
            </div>
        </div>
    );
};

export default Gallery;
