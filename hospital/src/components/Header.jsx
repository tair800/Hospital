import React, { useState, useEffect } from 'react'
import logoHeader from '../assets/logo-header.png'
import topImage from '../assets/top.png'
import './Header.css'

function Header({ onPageChange, showTopImage = false }) {
    const [activePage, setActivePage] = useState('home');

    const navigationItems = [
        { label: 'Ana səhifə', href: '/', id: 'home' },
        { label: 'Haqqımızda', href: '/about', id: 'about' },
        { label: 'Tedbirlər', href: '/events', id: 'events' },
        { label: 'Üzv', href: '/members', id: 'members' },
        { label: 'Qalereya', href: '/gallery', id: 'gallery' },
        { label: 'Blog', href: '/blog', id: 'blog' },
    ];

    const handleItemClick = (item) => {
        setActivePage(item.id);
        if (onPageChange) {
            onPageChange(item.id);
        }
        console.log('Navigation clicked:', item);
    };

    // Set initial active page based on current path
    useEffect(() => {
        const path = window.location.pathname;
        if (path === '/about') {
            setActivePage('about');
        } else if (path === '/') {
            setActivePage('home');
        }
        // Add more path checks as needed
    }, []);

    return (
        <header>
            {showTopImage && (
                <div className="header-top-image">
                    <img src={topImage} alt="Top Background" />
                </div>
            )}
            <div className="header-container">
                <div className="logo-section">
                    <img
                        src={logoHeader}
                        alt="Hospital Logo"
                        onClick={() => handleItemClick({ id: 'home', label: 'Ana səhifə' })}
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

            <div className="page-name-display">
                {activePage !== 'home' && (
                    <>
                        {activePage === 'about' && 'Haqqımızda'}
                        {activePage === 'events' && 'Tədbirlər'}
                        {activePage === 'members' && 'Üzv'}
                        {activePage === 'gallery' && 'Qalereya'}
                        {activePage === 'blog' && 'Blog'}
                    </>
                )}
            </div>
        </header>
    )
}

export default Header
