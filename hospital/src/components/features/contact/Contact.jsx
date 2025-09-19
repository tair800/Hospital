import React, { useEffect, useRef, useState } from 'react';
import { Application } from '@splinetool/runtime';
import Swal from 'sweetalert2';
import { mailService } from '../../../services/mailService';
import './Contact.css';
import phoneIcon from '../../../assets/phone-icon.png';
import whatsappIcon from '../../../assets/whatsapp-icon.png';
import mailIcon from '../../../assets/mail-icon.png';
import locationIcon from '../../../assets/location-icon.png';
import facebook from '../../../assets/facebook.png';
import instagram from '../../../assets/instagram.png';
import linkedin from '../../../assets/linkedin.png';
import youtube from '../../../assets/youtube.png';
import telegram from '../../../assets/telegram.png';
import LogoCarousel from '../../ui/LogoCarousel';

// API configuration
const API_BASE_URL = 'https://localhost:5000';

const Contact = () => {
    const canvasRef = useRef(null);
    const [contactData, setContactData] = useState({
        contactInfo: [],
        socialMedia: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [splineLoading, setSplineLoading] = useState(true);
    const [splineError, setSplineError] = useState(false);

    // Contact form state
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        phone: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState({});

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
                // Separate contact info and social media based on type
                const contactInfo = data.filter(item =>
                    ['phone', 'whatsapp', 'email', 'location'].includes(item.type)
                );

                const socialMedia = data.filter(item =>
                    ['facebook', 'instagram', 'linkedin', 'youtube', 'telegram'].includes(item.type)
                );

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
        let app = null;
        let cleanup = null;

        const loadSpline = () => {
            if (!canvasRef.current) {
                console.log('Canvas not ready, retrying...');
                setTimeout(loadSpline, 100);
                return;
            }

            setSplineLoading(true);
            setSplineError(false);

            // Show fallback while loading
            const fallback = document.querySelector('.spline-fallback');
            if (fallback) {
                fallback.style.display = 'block';
            }

            try {
                app = new Application(canvasRef.current);


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
                    console.error('Spline loading timeout');
                    setSplineError(true);
                    setSplineLoading(false);
                    if (fallback) {
                        fallback.style.display = 'block';
                    }
                    if (cleanup) cleanup();
                }, 15000); // 15 seconds timeout

                app.load('https://prod.spline.design/kCfMTbwclFSOycz6/scene.splinecode')
                    .then(() => {
                        console.log('Spline scene loaded successfully');
                        clearTimeout(timeout);
                        setSplineLoading(false);
                        setSplineError(false);
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
                        setSplineError(true);
                        setSplineLoading(false);
                        if (fallback) {
                            fallback.style.display = 'block';
                        }
                        if (cleanup) cleanup();
                    });

            } catch (error) {
                console.error('Failed to create Spline Application:', error);
                setSplineError(true);
                setSplineLoading(false);
                if (fallback) {
                    fallback.style.display = 'block';
                }
            }
        };

        // Start loading with a small delay
        const timer = setTimeout(loadSpline, 100);

        return () => {
            clearTimeout(timer);
            if (cleanup) cleanup();
            if (app) {
                try {
                    app.dispose();
                } catch (e) {
                    console.log('Error disposing Spline app:', e);
                }
            }
        };

        // Start loading
        const cleanupFunction = loadSpline();

        return cleanupFunction;
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

    // Form handling functions
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Ad tələb olunur';
        }

        if (!formData.surname.trim()) {
            newErrors.surname = 'Soyad tələb olunur';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'E-poçt tələb olunur';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Düzgün e-poçt ünvanı daxil edin';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Telefon nömrəsi tələb olunur';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Mesaj tələb olunur';
        }

        setFormErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Create contact form data
            const contactFormData = {
                name: formData.name,
                surname: formData.surname,
                email: formData.email,
                phone: formData.phone,
                message: formData.message
            };

            console.log('Submitting contact form:', contactFormData);
            const response = await mailService.submitContactForm(contactFormData);
            console.log('Contact form response:', response);

            // Reset form
            setFormData({
                name: '',
                surname: '',
                email: '',
                phone: '',
                message: ''
            });

            // Show success message
            Swal.fire({
                icon: 'success',
                title: 'Mesajınız uğurla göndərildi!',
                text: 'Mesajınız qeydə alındı. Tezliklə sizinlə əlaqə saxlayacağıq.',
                confirmButtonColor: '#1B1B3F',
                confirmButtonText: 'Tamam'
            });

        } catch (error) {
            console.error('Error submitting contact form:', error);
            Swal.fire({
                icon: 'error',
                title: 'Xəta!',
                text: 'Mesaj göndərilmədi. Zəhmət olmasa yenidən cəhd edin.',
                confirmButtonColor: '#ef4444',
                confirmButtonText: 'Tamam'
            });
        } finally {
            setIsSubmitting(false);
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
                            display: splineLoading || splineError ? 'block' : 'none'
                        }}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                color: 'white',
                                fontSize: '1.2rem'
                            }}>
                                {splineLoading && (
                                    <>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            border: '3px solid rgba(255,255,255,0.3)',
                                            borderTop: '3px solid white',
                                            borderRadius: '50%',
                                            animation: 'spin 1s linear infinite',
                                            marginBottom: '20px'
                                        }}></div>
                                        <div>Loading 3D Scene...</div>
                                    </>
                                )}
                                {splineError && (
                                    <>
                                        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⚠️</div>
                                        <div>Failed to load 3D scene</div>
                                        <button
                                            onClick={() => window.location.reload()}
                                            style={{
                                                marginTop: '10px',
                                                padding: '8px 16px',
                                                background: 'rgba(255,255,255,0.2)',
                                                border: '1px solid white',
                                                borderRadius: '4px',
                                                color: 'white',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Retry
                                        </button>
                                    </>
                                )}
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
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Ad *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Adınızı daxil edin"
                                    className={`form-input ${formErrors.name ? 'error' : ''}`}
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    maxLength={100}
                                    required
                                    disabled={isSubmitting}
                                />
                                {formErrors.name && <span className="error-message">{formErrors.name}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="surname">Soyad *</label>
                                <input
                                    type="text"
                                    id="surname"
                                    name="surname"
                                    placeholder="Soyadınızı daxil edin"
                                    className={`form-input ${formErrors.surname ? 'error' : ''}`}
                                    value={formData.surname}
                                    onChange={handleInputChange}
                                    maxLength={100}
                                    required
                                    disabled={isSubmitting}
                                />
                                {formErrors.surname && <span className="error-message">{formErrors.surname}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">E-poçt *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Elektron poçtunuzu daxil edin"
                                    className={`form-input ${formErrors.email ? 'error' : ''}`}
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    maxLength={255}
                                    required
                                    disabled={isSubmitting}
                                />
                                {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Telefon *</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    placeholder="Telefon nömrənizi daxil edin"
                                    className={`form-input ${formErrors.phone ? 'error' : ''}`}
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    maxLength={20}
                                    required
                                    disabled={isSubmitting}
                                />
                                {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Mesajınız *</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    placeholder="Mesajınızı daxil edin"
                                    className={`form-textarea ${formErrors.message ? 'error' : ''}`}
                                    rows="4"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    maxLength={1000}
                                    required
                                    disabled={isSubmitting}
                                ></textarea>
                                {formErrors.message && <span className="error-message">{formErrors.message}</span>}
                            </div>

                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="contact-submit-btn"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Göndərilir...' : 'Mesaj Göndər'}
                                </button>
                            </div>
                        </form>
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
