import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminLogin.css'

function AdminLogin() {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        // Simple password check
        if (password === 'admin123') {
            // Store authentication in localStorage
            localStorage.setItem('adminAuthenticated', 'true')
            navigate('/admin')
        } else {
            setError('Incorrect password. Please try again.')
        }

        setLoading(false)
    }

    return (
        <div className="admin-login-container">
            <div className="login-background">
                <video
                    className="background-video"
                    autoPlay
                    muted
                    loop
                    playsInline
                >
                    <source src="/src/assets/home-video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="video-overlay"></div>
            </div>

            <div className="admin-login-card">
                <div className="login-card-header">
                    <div className="logo-container">
                        <div className="logo-icon">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <h1>Admin Portal</h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="admin-login-form">
                    <div className="form-group">
                        <div className="input-container">

                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                disabled={loading}
                                className="styled-input"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="error-message">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                                <line x1="9" y1="9" x2="15" y2="15" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        <span className="button-content">
                            {loading ? (
                                <>
                                    <div className="spinner"></div>
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                        <polyline points="10,17 15,12 10,7" />
                                        <line x1="15" y1="12" x2="3" y2="12" />
                                    </svg>
                                    Access Dashboard
                                </>
                            )}
                        </span>
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AdminLogin
