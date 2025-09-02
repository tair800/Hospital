import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import logoHeader from '../assets/logo-header.png'
import topImage from '../assets/top.png'
import homeBgImage from '../assets/home-bg.png'
import './Header.css'

function Header({ showTopImage = false, customTopImage = null, hidePageName = false }) {
    const [activePage, setActivePage] = useState('home');
    const navigate = useNavigate();
    const location = useLocation();

    // Check if we're on the home page
    const isHomePage = location.pathname === '/';

    const navigationItems = [
        { label: 'Ana səhifə', href: '/', id: 'home' },
        { label: 'Haqqımızda', href: '/about', id: 'about' },
        { label: 'Tedbirlər', href: '/events', id: 'events' },
        { label: 'Employee', href: '/employee', id: 'employee' },
        { label: 'Qalereya', href: '/gallery', id: 'gallery' },
        { label: 'Blog', href: '/blog', id: 'blog' },
    ];

    const handleItemClick = (item) => {
        setActivePage(item.id);
        navigate(item.href);
    };

    // Set initial active page based on current path
    useEffect(() => {
        const path = location.pathname;
        if (path === '/about') {
            setActivePage('about');
        } else if (path === '/contact') {
            setActivePage('contact');
        } else if (path === '/employee') {
            setActivePage('employee');
        } else if (path.startsWith('/employee/')) {
            setActivePage('employee');
        } else if (path === '/events') {
            setActivePage('events');
        } else if (path.startsWith('/event/')) {
            setActivePage('events');
        } else if (path === '/gallery') {
            setActivePage('gallery');
        } else if (path === '/blog') {
            setActivePage('blog');
        } else if (path.startsWith('/blog/')) {
            setActivePage('blog');
        } else if (path === '/') {
            setActivePage('home');
        }
    }, [location.pathname]);

    return (
        <header>
            {showTopImage && (
                <div className="header-top-image">
                    <img src={customTopImage || topImage} alt="Top Background" />
                </div>
            )}
            <div className={`header-container ${isHomePage ? 'home-header' : ''}`}>
                <div className="logo-section">
                    <img
                        src={logoHeader}
                        alt="Hospital Logo"
                        onClick={() => handleItemClick({ id: 'home', label: 'Ana səhifə', href: '/' })}
                        style={{ cursor: 'pointer' }}
                    />
                </div>

                <nav className="nav-center">
                    <div className="navigation-container">
                        {navigationItems.map((item) => (
                            <button
                                key={item.id}
                                className={`navigation-item ${activePage === item.id ? 'active' : ''}`}
                                onClick={() => handleItemClick(item)}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </nav>

                <div className="login-section">
                    <div className="language-selector">
                        <img src="https://flagcdn.com/w20/us.png" alt="US Flag" className="flag-icon" />
                        <span className="language-text">Eng</span>
                        <span className="dropdown-arrow">▼</span>
                    </div>
                    <button className="uzv-btn">Üzv ol</button>
                </div>
            </div>

            {!hidePageName && (
                <div className="page-name-display">
                    {activePage !== 'home' && activePage !== 'none' && (
                        <>
                            {activePage === 'about' && 'Haqqımızda'}
                            {activePage === 'contact' && 'Əlaqə'}
                            {activePage === 'events' && 'Tədbirlər'}
                            {activePage === 'employee' && 'Employee'}
                            {activePage === 'gallery' && 'Qalereya'}
                            {activePage === 'blog' && 'Blog'}
                        </>
                    )}
                </div>
            )}
        </header>
    )
}

export default Header
