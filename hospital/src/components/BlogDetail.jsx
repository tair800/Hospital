import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BlogDetail.css';
import LogoCarousel from './LogoCarousel';

const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [blogData, setBlogData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                setBlogData(data);

                // Find the specific blog
                const foundBlog = data.find(b => b.id === parseInt(id));
                if (foundBlog) {
                    setBlog(foundBlog);
                }
            } catch (err) {
                console.error('Error fetching blog data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogData();
    }, [id]);

    // Show loading state
    if (loading) {
        return (
            <div className="blog-detail-page">
                <div className="blog-detail-container">
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <p>Loading blog...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="blog-detail-page">
                <div className="blog-detail-container">
                    <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
                        <p>Error loading blog: {error}</p>
                        <button onClick={() => navigate('/blog')} className="back-btn">
                            Back to Blog
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Show not found state
    if (!blog) {
        return (
            <div className="blog-detail-page">
                <div className="blog-detail-container">
                    <h1>Blog not found</h1>
                    <button onClick={() => navigate('/blog')} className="back-btn">
                        Back to Blog
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="blog-detail-page">
            {/* Background Images */}
            <img
                src="/src/assets/blogdetail-bg1.png"
                alt="Background 1"
                className="blogdetail-bg1"
            />
            <img
                src="/src/assets/blogdetail-bg2.png"
                alt="Background 2"
                className="blogdetail-bg2"
            />

            <div className="blog-detail-container">
                {/* Main Content - Left and Right Layout */}
                <div className="blog-detail-main">
                    {/* Left Side - Title Only */}
                    <div className="blog-detail-left">
                        <div className="blog-detail-title">
                            <h1>{blog.title}</h1>
                        </div>

                        {/* Date Component */}
                        <div className="blog-meta-container">
                            <div className="blog-date-component">
                                <img
                                    src="/src/assets/calendar.png"
                                    alt="Calendar"
                                    className="calendar-icon"
                                />
                                <span className="date-text">{blog.date}</span>
                            </div>

                            {/* Visitors Component */}
                            <div className="blog-visitors-component">
                                <img
                                    src="/src/assets/eye.png"
                                    alt="Eye"
                                    className="eye-icon"
                                />
                                <span className="visitors-text">{blog.visitors}</span>
                            </div>
                        </div>

                        {/* Blog Description Text */}
                        <div className="blog-description">
                            <p>
                                {blog.description}
                            </p>
                        </div>

                        {/* Second Description Section */}
                        <div className="blog-second-desc">
                            <h3 className="second-desc-title">{blog.secondDescTitle}</h3>
                            <p className="second-desc-body">
                                {blog.secondDescBody}
                            </p>
                        </div>

                        {/* Third Text Section */}
                        <div className="blog-third-text">
                            <h3 className="third-text-title">{blog.thirdTextTitle}</h3>
                            <p className="third-text-body">
                                {blog.thirdTextBody}
                            </p>
                        </div>
                    </div>

                    {/* Right Side - Blog Image */}
                    <div className="blog-detail-right">
                        <div className="blog-detail-image">
                            <img
                                src="/src/assets/blog1.png"
                                alt="Blog Image"
                            />
                        </div>

                        {/* More Blog Posts Section */}
                        <div className="more-blog-posts">
                            <h3 className="more-blog-header">Daha çox blog yazı</h3>
                            <div className="blog-posts-list">
                                {blogData
                                    .filter(blogItem => blogItem.id !== blog.id)
                                    .slice(0, 5)
                                    .map((blogItem) => (
                                        <div
                                            key={blogItem.id}
                                            className="blog-post-item"
                                            onClick={() => navigate(`/blog/${blogItem.id}`)}
                                        >
                                            <div className="blog-post-number">{blogItem.number}</div>
                                            <div className="blog-post-title">{blogItem.title}</div>
                                            <div className="blog-post-arrow">
                                                <img
                                                    src="/src/assets/blog-arrow.png"
                                                    alt="Arrow"
                                                />
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="logo-carousel-section blog-detail-logo-carousel">
                <LogoCarousel />
            </div>
        </div>
    );
};

export default BlogDetail;
