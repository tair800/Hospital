import React from 'react'
import './AdminHome.css'

function AdminHome() {
    return (
        <div className="admin-home">
            <div className="admin-home-welcome">
                <p>Xoş gəlmisiniz, Super Admin!</p>
            </div>

            <div className="admin-home-content">
                <div className="admin-stats-grid">
                    <div className="admin-stat-card">
                        <div className="stat-icon">👥</div>
                        <div className="stat-info">
                            <h3>Ümumi Üzvlər</h3>
                            <p className="stat-number">450</p>
                        </div>
                    </div>

                    <div className="admin-stat-card">
                        <div className="stat-icon">📅</div>
                        <div className="stat-info">
                            <h3>Aktiv Tədbirlər</h3>
                            <p className="stat-number">12</p>
                        </div>
                    </div>

                    <div className="admin-stat-card">
                        <div className="stat-icon">💰</div>
                        <div className="stat-info">
                            <h3>Gəlir</h3>
                            <p className="stat-number">₼1,450</p>
                        </div>
                    </div>

                    <div className="admin-stat-card">
                        <div className="stat-icon">🏆</div>
                        <div className="stat-info">
                            <h3>Sponsorlar</h3>
                            <p className="stat-number">8</p>
                        </div>
                    </div>
                </div>

                <div className="admin-actions-section">
                    <div className="action-buttons">
                        <button className="admin-action-btn primary">
                            <span className="btn-icon">➕</span>
                            Yeni Event Yarat
                        </button>
                        <button className="admin-action-btn secondary">
                            <span className="btn-icon">👤</span>
                            Üzv Əlavə Et
                        </button>
                    </div>
                </div>

                <div className="admin-recent-section">
                    <div className="recent-events">
                        <h3>Son Tədbirlər</h3>
                        <div className="event-list">
                            <div className="event-item">
                                <div className="event-info">
                                    <h4>Cardiology Konfransı</h4>
                                    <p>15 İyul, 2024</p>
                                </div>
                                <div className="event-participants">
                                    <span>125 iştirakçı</span>
                                </div>
                            </div>
                            <div className="event-item">
                                <div className="event-info">
                                    <h4>Neurology Seminarı</h4>
                                    <p>20 İyul, 2024</p>
                                </div>
                                <div className="event-participants">
                                    <span>89 iştirakçı</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="recent-members">
                        <h3>Son Üzvlər</h3>
                        <div className="member-list">
                            <div className="member-item">
                                <div className="member-avatar">👩‍⚕️</div>
                                <div className="member-info">
                                    <h4>Dr. Nigar Hüseynova</h4>
                                    <p>Neurologist</p>
                                </div>
                                <span className="member-status new">Yeni</span>
                            </div>
                            <div className="member-item">
                                <div className="member-avatar">👨‍⚕️</div>
                                <div className="member-info">
                                    <h4>Dr. Əli Məmmədov</h4>
                                    <p>Cardiologist</p>
                                </div>
                                <span className="member-status new">Yeni</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminHome
