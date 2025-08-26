import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Sidebar.css'
import logoHeader from '../../assets/logo-header.png'
import adminDashboard from '../../assets/admin-dashboard.png'
import adminHome from '../../assets/admin-home.png'
import adminAbout from '../../assets/admin-about.png'
import adminUzv from '../../assets/admin-uzv.png'
import adminEvents from '../../assets/admin-events.png'
import adminSponsor from '../../assets/admin-sponsor.png'
import adminContact from '../../assets/admin-contact.png'
import adminBlog from '../../assets/admin-blog.png'
import adminGallery from '../../assets/admin-gallery.png'

function Sidebar() {
    const location = useLocation();

    return (
        <div className="admin-sidebar">
            <div className="admin-sidebar-header">
                <div className="admin-logo-container">
                    <img src={logoHeader} alt="Hospital Logo" className="admin-logo" />
                </div>
                <div className="admin-user-role">
                    <span>Super Admin</span>
                </div>
            </div>

            <nav className="admin-sidebar-nav">
                <ul className="admin-nav-list">
                    <li className="admin-nav-item">
                        <Link to="/admin" className={`admin-nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
                            <img src={adminDashboard} alt="Dashboard" className="admin-nav-icon" />
                            Dashboard
                        </Link>
                    </li>
                    <li className="admin-nav-item">
                        <Link to="/admin/home" className={`admin-nav-link ${location.pathname === '/admin/home' ? 'active' : ''}`}>
                            <img src={adminHome} alt="Home" className="admin-nav-icon" />
                            Əsas səhifə
                        </Link>
                    </li>
                    <li className="admin-nav-item">
                        <Link to="/admin/about" className={`admin-nav-link ${location.pathname === '/admin/about' ? 'active' : ''}`}>
                            <img src={adminAbout} alt="About" className="admin-nav-icon" />
                            About us
                        </Link>
                    </li>
                    <li className="admin-nav-item">
                        <Link to="/admin/members" className={`admin-nav-link ${location.pathname === '/admin/members' ? 'active' : ''}`}>
                            <img src={adminUzv} alt="Members" className="admin-nav-icon" />
                            Üzvlər
                        </Link>
                    </li>
                    <li className="admin-nav-item">
                        <Link to="/admin/events" className={`admin-nav-link ${location.pathname === '/admin/events' ? 'active' : ''}`}>
                            <img src={adminEvents} alt="Events" className="admin-nav-icon" />
                            Tədbirlər
                        </Link>
                    </li>
                    <li className="admin-nav-item">
                        <Link to="/admin/sponsors" className={`admin-nav-link ${location.pathname === '/admin/sponsors' ? 'active' : ''}`}>
                            <img src={adminSponsor} alt="Sponsors" className="admin-nav-icon" />
                            Sponsors
                        </Link>
                    </li>
                    <li className="admin-nav-item">
                        <Link to="/admin/contact" className={`admin-nav-link ${location.pathname === '/admin/contact' ? 'active' : ''}`}>
                            <img src={adminContact} alt="Contact" className="admin-nav-icon" />
                            Contact
                        </Link>
                    </li>
                    <li className="admin-nav-item">
                        <Link to="/admin/blog" className={`admin-nav-link ${location.pathname === '/admin/blog' ? 'active' : ''}`}>
                            <img src={adminBlog} alt="Blog" className="admin-nav-icon" />
                            Blog
                        </Link>
                    </li>
                    <li className="admin-nav-item">
                        <Link to="/admin/gallery" className={`admin-nav-link ${location.pathname === '/admin/gallery' ? 'active' : ''}`}>
                            <img src={adminGallery} alt="Gallery" className="admin-nav-icon" />
                            Gallery
                        </Link>
                    </li>
                </ul>
            </nav>

            <div className="admin-sidebar-footer">
                <button className="admin-chat-btn">
                    <span className="admin-chat-icon">💬</span>
                    Chat
                </button>
            </div>
        </div>
    )
}

export default Sidebar
