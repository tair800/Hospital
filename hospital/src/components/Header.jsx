import React from 'react'
import logoHeader from '../assets/logo-header.png'
import './Header.css'

function Header() {
    const navigationItems = [
        { label: 'Ana səhifə', href: '/' },
        { label: 'Haqqımızda', href: '/about' },
        { label: 'Tedbirlər', href: '/events' },
        { label: 'Üzv', href: '/members' },
        { label: 'Qalereya', href: '/gallery' },
        { label: 'Qalereya', href: '/gallery2' },
    ];

    const handleItemClick = (item) => {
        console.log('Navigation clicked:', item);
    };

    return (
        <header>
            <div className="header-container">
                <div className="logo-section">
                    <img src={logoHeader} alt="Hospital Logo" />
                </div>

                <nav className="nav-center">
                    <div className="navigation-container">
                        {navigationItems.map((item, index) => (
                            <button
                                key={index}
                                className={`navigation-item ${index === 0 ? 'active' : ''}`}
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
        </header>
    )
}

export default Header
