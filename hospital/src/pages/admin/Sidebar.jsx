import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Sidebar.css'
const logoHeader = '/assets/logo-header.png'
const adminDashboard = '/assets/admin-dashboard.png'
const adminHome = '/assets/admin-home.png'
const adminAbout = '/assets/admin-about.png'
const adminEmployee = '/assets/admin-uzv.png'
const adminEvents = '/assets/admin-events.png'
const adminSponsor = '/assets/admin-sponsor.png'
const adminContact = '/assets/admin-contact.png'
const adminBlog = '/assets/admin-blog.png'
const adminGallery = '/assets/admin-gallery.png'
const adminRequests = '/assets/admin-contact.png'
const adminMail = '/assets/admin-contact.png'

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
                        <Link to="/admin/employee" className={`admin-nav-link ${location.pathname === '/admin/employee' ? 'active' : ''}`}>
                            <img src={adminEmployee} alt="Üzv" className="admin-nav-icon" />
                            Üzv
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
                    <li className="admin-nav-item">
                        <Link to="/admin/requests" className={`admin-nav-link ${location.pathname === '/admin/requests' ? 'active' : ''}`}>
                            <img src={adminRequests} alt="Requests" className="admin-nav-icon" />
                            Requests
                        </Link>
                    </li>
                    <li className="admin-nav-item">
                        <Link to="/admin/mail" className={`admin-nav-link ${location.pathname === '/admin/mail' ? 'active' : ''}`}>
                            <img src={adminMail} alt="Mail" className="admin-nav-icon" />
                            Mail
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
