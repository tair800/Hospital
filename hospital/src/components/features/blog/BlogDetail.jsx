import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getImagePath } from '../../../utils/imageUtils';
import blog1Image from '../../../assets/blog1.png';
import './BlogDetail.css';
import LogoCarousel from '../../ui/LogoCarousel';

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
                const response = await fetch('https://ahpbca-api.webonly.io/api/blogs');
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
                src="/assets/blogdetail-bg1.png"
                alt="Background 1"
                className="blogdetail-bg1"
            />
            <img
                src="/assets/blogdetail-bg2.png"
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
                                    src="/assets/calendar.png"
                                    alt="Calendar"
                                    className="calendar-icon"
                                />
                                <span className="date-text">{blog.date}</span>
                            </div>

                            {/* Visitors Component */}
                            <div className="blog-visitors-component">
                                <img
                                    src="/assets/eye.png"
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
                        {blog.image ? (
                            <img
                                src={getImagePath(blog.image)}
                                alt="Blog Image"
                                className="blog-detail-image"
                                onError={(e) => {
                                    console.log('BlogDetail image load error:', blog.image);
                                    e.target.style.display = 'none';
                                }}
                            />
                        ) : (
                            <div className="blog-detail-no-image">
                                No image (API returned: {blog.image || 'null'})
                            </div>
                        )}

                        {/* More Blog Posts Section - Moved under the image */}
                        <div className="more-blog-posts">
                            <h3 className="more-blog-header">Daha çox blog yazı</h3>
                            <div className="blog-posts-list">
                                {(() => {
                                    // Get the next 5 blogs with circular navigation
                                    const currentBlogNumber = parseInt(blog.number);
                                    const totalBlogs = blogData.length;

                                    // First, get next blogs after current
                                    const nextBlogs = blogData
                                        .filter(blogItem => blogItem.id !== blog.id) // Exclude current blog
                                        .sort((a, b) => parseInt(a.number) - parseInt(b.number)) // Sort numerically
                                        .filter(blogItem => parseInt(blogItem.number) > currentBlogNumber); // Only blogs with higher numbers

                                    // If we don't have 5 next blogs, loop back to beginning
                                    let finalBlogs = [...nextBlogs];

                                    if (finalBlogs.length < 5) {
                                        // Get blogs from the beginning to fill up to 5
                                        const remainingCount = 5 - finalBlogs.length;
                                        const beginningBlogs = blogData
                                            .filter(blogItem => blogItem.id !== blog.id) // Exclude current blog
                                            .sort((a, b) => parseInt(a.number) - parseInt(b.number)) // Sort numerically
                                            .filter(blogItem => parseInt(blogItem.number) <= currentBlogNumber) // Only blogs with lower or equal numbers
                                            .slice(0, remainingCount); // Take only what we need

                                        finalBlogs = [...nextBlogs, ...beginningBlogs];
                                    }

                                    // Take only first 5 blogs
                                    finalBlogs = finalBlogs.slice(0, 5);



                                    return finalBlogs.map((blogItem) => (
                                        <div
                                            key={blogItem.id}
                                            className="blog-post-item"
                                            onClick={() => navigate(`/blog/${blogItem.id}`)}
                                        >
                                            <div className="blog-post-number">{blogItem.number}</div>
                                            <div className="blog-post-title">{blogItem.title}</div>
                                            <div className="blog-post-arrow">
                                                <img
                                                    src="/assets/blog-arrow.png"
                                                    alt="Arrow"
                                                />
                                            </div>
                                        </div>
                                    ));
                                })()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Remove the old more-blog-posts section that was here */}
            </div>

            <div className="logo-carousel-section blog-detail-logo-carousel">
                <LogoCarousel />
            </div>
        </div>
    );
};

export default BlogDetail;
