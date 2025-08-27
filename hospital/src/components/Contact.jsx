import React, { useEffect, useRef, useState } from 'react';
import { Application } from '@splinetool/runtime';
import './Contact.css';
import phoneIcon from '../assets/phone-icon.png';
import whatsappIcon from '../assets/whatsapp-icon.png';
import mailIcon from '../assets/mail-icon.png';
import locationIcon from '../assets/location-icon.png';
import facebook from '../assets/facebook.png';
import instagram from '../assets/instagram.png';
import linkedin from '../assets/linkedin.png';
import youtube from '../assets/youtube.png';
import telegram from '../assets/telegram.png';
import LogoCarousel from './LogoCarousel';

// API configuration
const API_BASE_URL = 'http://localhost:5000';

const Contact = () => {
    const canvasRef = useRef(null);
    const [contactData, setContactData] = useState({
        contactInfo: [],
        socialMedia: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch contact data from API
    useEffect(() => {
        const fetchContactData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/api/Contact`);
                if (!response.ok) {
                    throw new Error('Failed to fetch contact data');
                }
                const data = await response.json();
                console.log('Fetched contact data:', data);

                // Separate contact info and social media based on type
                const contactInfo = data.filter(item =>
                    ['phone', 'whatsapp', 'email', 'location'].includes(item.type)
                );

                const socialMedia = data.filter(item =>
                    ['facebook', 'instagram', 'linkedin', 'youtube', 'telegram'].includes(item.type)
                );

                console.log('Filtered contact info:', contactInfo);
                console.log('Filtered social media:', socialMedia);

                setContactData({
                    contactInfo: contactInfo,
                    socialMedia: socialMedia
                });
            } catch (err) {
                console.error('Error fetching contact data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchContactData();
    }, []);

    useEffect(() => {
        // Add a small delay to ensure the canvas is rendered
        const timer = setTimeout(() => {
            if (canvasRef.current) {
                console.log('Canvas ref found, initializing Spline...');
                console.log('Canvas dimensions:', canvasRef.current.width, 'x', canvasRef.current.height);

                // Show fallback while loading
                const fallback = document.querySelector('.spline-fallback');
                if (fallback) {
                    fallback.style.display = 'block';
                }

                try {
                    const app = new Application(canvasRef.current);
                    console.log('Spline Application created successfully');

                    // Set up mouse tracking for the Spline scene
                    const canvas = canvasRef.current;

                    // Add mouse event listeners for better tracking
                    let isMouseDown = false;
                    let lastMouseX = 0;
                    let lastMouseY = 0;

                    const handleMouseDown = (e) => {
                        isMouseDown = true;
                        lastMouseX = e.clientX;
                        lastMouseY = e.clientY;
                    };

                    const handleMouseUp = () => {
                        isMouseDown = false;
                    };

                    const handleMouseMove = (e) => {
                        if (isMouseDown) {
                            const deltaX = e.clientX - lastMouseX;
                            const deltaY = e.clientY - lastMouseY;
                            lastMouseX = e.clientX;
                            lastMouseY = e.clientY;

                            // Pass mouse movement to Spline
                            if (app && app.events) {
                                app.events.emit('mouseMove', { deltaX, deltaY });
                            }
                        }
                    };

                    // Add event listeners
                    canvas.addEventListener('mousedown', handleMouseDown);
                    canvas.addEventListener('mouseup', handleMouseUp);
                    canvas.addEventListener('mouseleave', handleMouseUp);
                    canvas.addEventListener('mousemove', handleMouseMove);

                    // Add touch support for mobile devices
                    const handleTouchStart = (e) => {
                        e.preventDefault();
                        if (e.touches.length === 1) {
                            isMouseDown = true;
                            lastMouseX = e.touches[0].clientX;
                            lastMouseY = e.touches[0].clientY;
                        }
                    };

                    const handleTouchEnd = (e) => {
                        e.preventDefault();
                        isMouseDown = false;
                    };

                    const handleTouchMove = (e) => {
                        e.preventDefault();
                        if (isMouseDown && e.touches.length === 1) {
                            const deltaX = e.touches[0].clientX - lastMouseX;
                            const deltaY = e.touches[0].clientY - lastMouseY;
                            lastMouseX = e.touches[0].clientX;
                            lastMouseY = e.touches[0].clientY;

                            // Pass touch movement to Spline
                            if (app && app.events) {
                                app.events.emit('mouseMove', { deltaX, deltaY });
                            }
                        }
                    };

                    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
                    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
                    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });

                    // Cleanup function
                    const cleanup = () => {
                        canvas.removeEventListener('mousedown', handleMouseDown);
                        canvas.removeEventListener('mouseup', handleMouseUp);
                        canvas.removeEventListener('mouseleave', handleMouseUp);
                        canvas.removeEventListener('mousemove', handleMouseMove);
                        canvas.removeEventListener('touchstart', handleTouchStart);
                        canvas.removeEventListener('touchend', handleTouchEnd);
                        canvas.removeEventListener('touchmove', handleTouchMove);
                    };

                    // Set a timeout for loading
                    const timeout = setTimeout(() => {
                        console.log('Spline loading timeout, showing fallback');
                        if (fallback) {
                            fallback.style.display = 'block';
                        }
                        cleanup();
                    }, 10000); // 10 seconds timeout

                    app.load('https://prod.spline.design/kCfMTbwclFSOycz6/scene.splinecode')
                        .then(() => {
                            console.log('Spline scene loaded successfully');
                            clearTimeout(timeout);
                            if (fallback) {
                                fallback.style.display = 'none';
                            }

                            // Enable mouse tracking after scene loads
                            if (app && app.events) {
                                app.events.emit('mouseTracking', { enabled: true });
                            }
                        })
                        .catch((error) => {
                            console.error('Failed to load Spline scene:', error);
                            clearTimeout(timeout);
                            if (fallback) {
                                fallback.style.display = 'block';
                            }
                            cleanup();
                        });

                    // Return cleanup function
                    return cleanup;
                } catch (error) {
                    console.error('Failed to create Spline Application:', error);
                    if (fallback) {
                        fallback.style.display = 'block';
                    }
                }
            } else {
                console.log('Canvas ref still not found after delay');
            }
        }, 100); // 100ms delay

        return () => clearTimeout(timer);
    }, []);

    // Helper function to get icon based on icon name
    const getIcon = (iconName) => {
        switch (iconName) {
            case 'phone-icon.png':
                return phoneIcon;
            case 'whatsapp-icon.png':
                return whatsappIcon;
            case 'mail-icon.png':
                return mailIcon;
            case 'location-icon.png':
                return locationIcon;
            default:
                return phoneIcon;
        }
    };

    // Helper function to get social media icon
    const getSocialIcon = (iconName) => {
        switch (iconName) {
            case 'facebook.png':
                return facebook;
            case 'instagram.png':
                return instagram;
            case 'linkedin.png':
                return linkedin;
            case 'youtube.png':
                return youtube;
            case 'telegram.png':
                return telegram;
            default:
                return facebook;
        }
    };

    // Show loading state
    if (loading) {
        return (
            <div className="contact-page">
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <p>Loading contact information...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="contact-page">
                <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
                    <p>Error loading contact information: {error}</p>
                    <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>
                        Please check if the API server is running at {API_BASE_URL}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="contact-page">
            <div className="contact-content-container">
                <div className="left-image-section">
                    <div className="contact-bg-container">
                        <canvas ref={canvasRef} className="spline-canvas" />
                        <div className="spline-fallback" style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'none'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                color: 'white',
                                fontSize: '1.2rem'
                            }}>
                                3D Scene Loading...
                            </div>
                        </div>
                        {/* Contact Information Overlay */}
                        <div className="contact-info-overlay">
                            <div className="contact-heading">
                                <h2>Nə sualın varsa,</h2>
                                <h2>buradayıq!</h2>
                            </div>
                            <div className="contact-details">
                                {contactData.contactInfo && contactData.contactInfo.length > 0 ? (
                                    contactData.contactInfo.map((item, index) => {
                                        console.log(`Rendering contact item ${index}:`, item);
                                        return (
                                            <div key={`${item.type}-${item.value}-${index}`} className="contact-item">
                                                <img
                                                    src={getIcon(item.icon)}
                                                    alt={item.type}
                                                    className="contact-icon"
                                                />
                                                <span>{item.value}</span>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="contact-item">
                                        <span>No contact information available</span>
                                    </div>
                                )}
                            </div>

                            {/* Social Media Icons */}
                            <div className="social-media-icons">
                                {contactData.socialMedia && contactData.socialMedia.length > 0 ? (
                                    contactData.socialMedia.map((social, index) => {
                                        console.log(`Rendering social media item ${index}:`, social);
                                        return (
                                            <a
                                                key={`${social.type}-${social.value}-${index}`}
                                                href={social.value}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title={social.type}
                                            >
                                                <img
                                                    src={getSocialIcon(social.icon)}
                                                    alt={social.type}
                                                />
                                            </a>
                                        );
                                    })
                                ) : (
                                    <div>No social media links available</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="right-content-section">
                    <div className="contact-form-container">
                        <div className="contact-form">
                            <div className="form-group">
                                <label htmlFor="name">Ad</label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Adınızı daxil edin"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="surname">Soyad</label>
                                <input
                                    type="text"
                                    id="surname"
                                    placeholder="Soyadınızı daxil edin"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">E-poçt</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Elektron poçtunuzu daxil edin"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Mesajınızı daxil edin</label>
                                <textarea
                                    id="message"
                                    placeholder="Mesajınızı daxil edin"
                                    className="form-textarea"
                                    rows="4"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Maps Section */}
            <div className="maps-section">
                <div className="maps-container">
                    <h3 className="maps-title">Xəritədə Bizi Tapın</h3>
                    <div className="map-wrapper">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24310.547386!2d49.851066!3d40.3772!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d6bd6211cf9%3A0x343f6a9e9e6b3b3a!2sAhmad%20Rajabli%2C%20Baku%2C%20Azerbaijan!5e0!3m2!1sen!2s!4v1234567890"
                            width="100%"
                            height="400"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Hospital Location Map - Ahmad Rajabli, Baku"
                        ></iframe>
                    </div>
                </div>
            </div>

            {/* Logo Carousel Section */}
            <div className="logo-carousel-section">
                <div className="logo-carousel-container">
                    <LogoCarousel />
                </div>
            </div>
        </div>
    );
};

export default Contact;
