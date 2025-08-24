import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Blog.css';
import { blogData } from '../data/blog-data';
import LogoCarousel from './LogoCarousel';

const Blog = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();
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
        return blogData.slice(startIndex, startIndex + cardsPerScreen);
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
                                <img
                                    src="/src/assets/blog1.png"
                                    alt="Blog Image"
                                    style={{
                                        width: '100%',
                                        height: 'auto'
                                    }}
                                />
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
