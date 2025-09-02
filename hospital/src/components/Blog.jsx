import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import blog1Image from '../assets/blog1.png';
import './Blog.css';
import LogoCarousel from './LogoCarousel';

const Blog = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [blogData, setBlogData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch blog data from API
    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:5000/api/blogs');
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

    const totalBlogs = blogData.length;
    const cardsPerScreen = 3;
    const totalSlides = Math.ceil(totalBlogs / cardsPerScreen);

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
                                        src={blog.image === 'blog1.png' ? blog1Image : `/src/assets/${blog.image}`}
                                        alt="Blog Image"
                                        style={{
                                            width: '100%',
                                            height: '200px',
                                            objectFit: 'cover',
                                            borderRadius: '8px'
                                        }}
                                        onError={(e) => {
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
                                    src="/src/assets/blog-arrow.png"
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
                    <button
                        className="nav-btn prev-btn"
                        onClick={prevSlide}
                        disabled={currentSlide === 0}
                    >
                        ‹
                    </button>

                    <button
                        className="nav-btn next-btn"
                        onClick={nextSlide}
                        disabled={currentSlide === totalSlides - 1}
                    >
                        ›
                    </button>
                </div>
            </div>

            <div className="logo-carousel-section blog-logo-carousel">
                <LogoCarousel />
            </div>
        </div>
    );
};

export default Blog;
