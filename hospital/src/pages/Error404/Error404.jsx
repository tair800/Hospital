import React from 'react'
import { Link } from 'react-router-dom'
import './Error404.css'

function Error404() {
    return (
        <div className="error-container">
            <div className="error-background">
                <video
                    className="error-background-video"
                    autoPlay
                    muted
                    loop
                    playsInline
                >
                    <source src="/assets/home-video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="error-video-overlay"></div>
            </div>

            <div className="error-content">
                <div className="error-card">
                    <div className="error-icon">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                    </div>

                    <h1 className="error-title">404</h1>
                    <h2 className="error-subtitle">Page Not Found</h2>
                    <p className="error-description">
                        The page you're looking for doesn't exist or has been moved.
                    </p>

                    <div className="error-actions">
                        <Link to="/" className="error-button primary">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                <polyline points="9,22 9,12 15,12 15,22" />
                            </svg>
                            Go Home
                        </Link>

                        <button
                            className="error-button secondary"
                            onClick={() => window.history.back()}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5" />
                                <polyline points="12,19 5,12 12,5" />
                            </svg>
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Error404
