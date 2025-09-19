import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getImagePath } from '../../../utils/imageUtils';
import blog1Image from '../../../assets/blog1.png';
import iconNext from '../../../assets/icon-next.svg';
import iconPrev from '../../../assets/icon-prev.svg';
import blogCardButton from '../../../assets/blog-card-button.svg';
import './Blog.css';
import LogoCarousel from '../../ui/LogoCarousel';

const Blog = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [blogData, setBlogData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLargeScreen, setIsLargeScreen] = useState(false);
    const navigate = useNavigate();

    // Fetch blog data from API
    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://localhost:5000/api/blogs');
                if (!response.ok) {
                    throw new Error('Failed to fetch blog data');
                }
                const data = await response.json();

                // Sort blogs by Number field numerically
                const sortedData = data.sort((a, b) => {
                    const numA = parseInt(a.number);
                    const numB = parseInt(b.number);
                    return numA - numB;
                });

                setBlogData(sortedData);
            } catch (err) {
                console.error('Error fetching blog data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogData();
    }, []);

    // Screen size detection for card display
    useEffect(() => {
        const checkScreenSize = () => {
            const isLarge = window.innerWidth >= 1920;
            console.log('Blog screen width:', window.innerWidth, 'Is large screen:', isLarge);
            setIsLargeScreen(isLarge);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const totalBlogs = blogData.length;
    const cardsPerScreen = isLargeScreen ? 4 : 3;
    const totalSlides = Math.ceil(totalBlogs / cardsPerScreen);

    console.log('Blog cards per screen:', cardsPerScreen, 'Is large screen:', isLargeScreen);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    const getVisibleBlogs = () => {
        const startIndex = currentSlide * cardsPerScreen;
        const visibleBlogs = blogData.slice(startIndex, startIndex + cardsPerScreen);



        return visibleBlogs;
    };

    const handleCardClick = (blogId) => {
        navigate(`/blog/${blogId}`);
    };

    const renderSeparator = (blogIndex) => {
        const segmentWidth = 100 / totalBlogs;
        return (
            <div className="blog-separator">
                {Array.from({ length: totalBlogs }, (_, index) => (
                    <div
                        key={index}
                        className={`separator-segment ${index === blogIndex - 1 ? 'active' : ''}`}
                        style={{
                            width: `${segmentWidth}%`,
                            height: index === blogIndex - 1 ? '3px' : '2px'
                        }}
                    />
                ))}
            </div>
        );
    };

    // Show loading state
    if (loading) {
        return (
            <div className="blog-page">
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <p>Loading blogs...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="blog-page">
                <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
                    <p>Error loading blogs: {error}</p>
                </div>
            </div>
        );
    }

    // Show empty state
    if (blogData.length === 0) {
        return (
            <div className="blog-page">
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <p>No blogs available.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="blog-page">
            <div className="blog-slider-container">
                <div className="blog-cards-container">
                    {getVisibleBlogs().map((blog) => (
                        <div
                            key={blog.id}
                            className="blog-card"
                        >
                            <div className="blog-card-number">{blog.number}</div>

                            <div className="blog-card-header">
                                <h2 className="blog-card-title">{blog.title}</h2>
                            </div>

                            <div className="blog-card-body">
                                <p className="blog-card-text">
                                    {blog.description}
                                </p>
                            </div>

                            {renderSeparator(blog.id)}

                            <div className="blog-card-image">
                                {blog.image ? (
                                    <img
                                        src={getImagePath(blog.image)}
                                        alt="Blog Image"
                                        style={{
                                            width: '100%',
                                            height: '200px',
                                            objectFit: 'cover',
                                            borderRadius: '8px'
                                        }}
                                        onError={(e) => {
                                            console.log('Blog image load error:', blog.image);
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        width: '100%',
                                        height: '200px',
                                        backgroundColor: '#f0f0f0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '8px',
                                        color: '#666'
                                    }}>
                                        No image (API returned: {blog.image || 'null'})
                                    </div>
                                )}
                            </div>

                            <div
                                className="blog-card-arrow"
                                onClick={() => handleCardClick(blog.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <img
                                    src={blogCardButton}
                                    alt="Arrow"
                                    style={{
                                        width: 'auto',
                                        height: 'auto'
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Controls */}
                <div className="blog-navigation">
                    <img
                        src={iconPrev}
                        alt="Previous"
                        className="nav-btn prev-btn"
                        onClick={prevSlide}
                        style={{
                            cursor: currentSlide === 0 ? 'not-allowed' : 'pointer',
                            opacity: currentSlide === 0 ? 0.3 : 1
                        }}
                    />

                    <img
                        src={iconNext}
                        alt="Next"
                        className="nav-btn next-btn"
                        onClick={nextSlide}
                        style={{
                            cursor: currentSlide === totalSlides - 1 ? 'not-allowed' : 'pointer',
                            opacity: currentSlide === totalSlides - 1 ? 0.3 : 1
                        }}
                    />
                </div>
            </div>

            <div className="logo-carousel-section blog-logo-carousel">
                <LogoCarousel />
            </div>
        </div>
    );
};

export default Blog;
