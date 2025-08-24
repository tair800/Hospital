import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BlogDetail.css';
import { blogData } from '../data/blog-data';

const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const blog = blogData.find(b => b.id === parseInt(id));

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

    const handleBackToBlog = () => {
        navigate('/blog');
    };

    return (
        <div className="blog-detail-page">
            <div className="blog-detail-container">
                {/* Header Section */}
                <div className="blog-detail-header">
                    <button onClick={handleBackToBlog} className="back-btn">
                        ‹ Back to Blog
                    </button>
                    <div className="blog-number">{blog.number}</div>
                </div>

                {/* Title Section */}
                <div className="blog-detail-title">
                    <h1>{blog.title}</h1>
                </div>

                {/* Content Section */}
                <div className="blog-detail-content">
                    <div className="blog-detail-text">
                        <p>{blog.description}</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    </div>

                    {/* Blog Image */}
                    <div className="blog-detail-image">
                        <img
                            src="/src/assets/blog1.png"
                            alt="Blog Detail Image"
                        />
                    </div>

                    {/* Additional Content */}
                    <div className="blog-detail-additional">
                        <h3>Key Points</h3>
                        <ul>
                            <li>Advanced medical technologies and their applications</li>
                            <li>Innovative treatment approaches</li>
                            <li>Patient care improvements</li>
                            <li>Research and development insights</li>
                        </ul>
                        
                        <h3>Conclusion</h3>
                        <p>The implementation of new technologies in healthcare continues to revolutionize patient care and treatment outcomes. As we move forward, these innovations will play an increasingly important role in improving healthcare delivery worldwide.</p>
                    </div>
                </div>

                {/* Navigation Footer */}
                <div className="blog-detail-navigation">
                    <button 
                        className="nav-btn prev-btn" 
                        onClick={() => navigate(`/blog/${Math.max(1, blog.id - 1)}`)}
                        disabled={blog.id === 1}
                    >
                        ‹ Previous Post
                    </button>
                    
                    <button 
                        className="nav-btn next-btn" 
                        onClick={() => navigate(`/blog/${Math.min(blogData.length, blog.id + 1)}`)}
                        disabled={blog.id === blogData.length}
                    >
                        Next Post ›
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;
