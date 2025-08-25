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

const Contact = () => {
    const canvasRef = useRef(null);
    const [contactData, setContactData] = useState({
        heading: { line1: '', line2: '' },
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
                const response = await fetch('http://localhost:5000/api/contacts');
                if (!response.ok) {
                    throw new Error('Failed to fetch contact data');
                }
                const data = await response.json();
                setContactData(data);
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
        if (canvasRef.current) {
            const app = new Application(canvasRef.current);
            app.load('https://prod.spline.design/kCfMTbwclFSOycz6/scene.splinecode');
        }
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
                        {/* Contact Information Overlay */}
                        <div className="contact-info-overlay">
                            <div className="contact-heading">
                                <h2>{contactData.heading.line1}</h2>
                                <h2>{contactData.heading.line2}</h2>
                            </div>

                            <div className="contact-details">
                                {contactData.contactInfo.map((item, index) => (
                                    <div key={index} className="contact-item">
                                        <img
                                            src={getIcon(item.icon)}
                                            alt={item.type}
                                            className="contact-icon"
                                        />
                                        <span>{item.value}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Social Media Icons */}
                            <div className="social-media-icons">
                                {contactData.socialMedia.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={social.name}
                                    >
                                        <img
                                            src={getSocialIcon(social.icon)}
                                            alt={social.name}
                                        />
                                    </a>
                                ))}
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
