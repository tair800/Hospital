import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import logoHeader from '../../assets/logo-header.png'
import topImage from '../../assets/top.png'
import homeBgImage from '../../assets/home-bg.png'
import RequestModal from '../ui/RequestModal'
import './Header.css'

function Header({ showTopImage = false, customTopImage = null, hidePageName = false }) {
    const [activePage, setActivePage] = useState('home');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('aze');
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Check if we're on the home page
    const isHomePage = location.pathname === '/';

    // Check if we're on the employee detail page
    const isEmployeeDetailPage = location.pathname.startsWith('/employee/') && location.pathname !== '/employee';

    // Check if we're on the blog detail page
    const isBlogDetailPage = location.pathname.startsWith('/blog/') && location.pathname !== '/blog';

    const languageOptions = [
        { code: 'aze', name: 'Aze', flag: 'https://flagcdn.com/w20/az.png' },
        { code: 'eng', name: 'Eng', flag: 'https://flagcdn.com/w20/us.png' },
        { code: 'rus', name: 'Rus', flag: 'https://flagcdn.com/w20/ru.png' }
    ];

    const navigationItems = [
        { label: 'Ana səhifə', href: '/', id: 'home' },
        { label: 'Haqqımızda', href: '/about', id: 'about' },
        { label: 'Tedbirlər', href: '/events', id: 'events' },
        { label: 'Üzv', href: '/employee', id: 'employee' },
        { label: 'Qalereya', href: '/gallery', id: 'gallery' },
        { label: 'Bloq', href: '/blog', id: 'blog' },
    ];

    const handleItemClick = (item) => {
        setActivePage(item.id);
        navigate(item.href);
        setIsMobileMenuOpen(false); // Close mobile menu when item is clicked
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleRequestModalOpen = () => {
        setIsRequestModalOpen(true);
    };

    const handleRequestModalClose = () => {
        setIsRequestModalOpen(false);
    };

    const handleLanguageSelect = (languageCode) => {
        setSelectedLanguage(languageCode);
        setIsLanguageDropdownOpen(false);
    };

    const toggleLanguageDropdown = () => {
        setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
    };

    const getCurrentLanguage = () => {
        return languageOptions.find(lang => lang.code === selectedLanguage) || languageOptions[0];
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
        <header className={isHomePage ? 'home-page-header' : isEmployeeDetailPage ? 'employee-detail-page-header' : isBlogDetailPage ? 'blog-detail-page-header' : ''}>
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

                <nav className="nav-center desktop-nav">
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
                    <div className="language-selector" onClick={toggleLanguageDropdown}>
                        <img src={getCurrentLanguage().flag} alt={`${getCurrentLanguage().name} Flag`} className="flag-icon" />
                        <span className="language-text">{getCurrentLanguage().name}</span>
                        <span className="dropdown-arrow">▼</span>
                        {isLanguageDropdownOpen && (
                            <div className="language-dropdown">
                                {languageOptions.map((language) => (
                                    <div
                                        key={language.code}
                                        className={`language-option ${selectedLanguage === language.code ? 'selected' : ''}`}
                                        onClick={() => handleLanguageSelect(language.code)}
                                    >
                                        <img src={language.flag} alt={`${language.name} Flag`} className="flag-icon" />
                                        <span className="language-text">{language.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button className="uzv-btn" onClick={handleRequestModalOpen}>Üzv ol</button>
                </div>

                {/* Mobile Hamburger Menu */}
                <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                </button>

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <div className="mobile-nav-overlay">
                        <nav className="nav-center mobile-nav">
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
                            <div className="mobile-login-section">
                                <div className="language-selector" onClick={toggleLanguageDropdown}>
                                    <img src={getCurrentLanguage().flag} alt={`${getCurrentLanguage().name} Flag`} className="flag-icon" />
                                    <span className="language-text">{getCurrentLanguage().name}</span>
                                    <span className="dropdown-arrow">▼</span>
                                    {isLanguageDropdownOpen && (
                                        <div className="language-dropdown mobile-language-dropdown">
                                            {languageOptions.map((language) => (
                                                <div
                                                    key={language.code}
                                                    className={`language-option ${selectedLanguage === language.code ? 'selected' : ''}`}
                                                    onClick={() => handleLanguageSelect(language.code)}
                                                >
                                                    <img src={language.flag} alt={`${language.name} Flag`} className="flag-icon" />
                                                    <span className="language-text">{language.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button className="uzv-btn" onClick={handleRequestModalOpen}>Üzv ol</button>
                            </div>
                        </nav>
                    </div>
                )}
            </div>

            {!hidePageName && (
                <div className="page-name-display">
                    {activePage !== 'home' && activePage !== 'none' && (
                        <>
                            {activePage === 'about' && 'Haqqımızda'}
                            {activePage === 'contact' && 'Əlaqə'}
                            {activePage === 'events' && 'Tədbirlər'}
                            {activePage === 'employee' && 'Üzv'}
                            {activePage === 'gallery' && 'Qalereya'}
                            {activePage === 'blog' && 'Bloq'}
                        </>
                    )}
                </div>
            )}

            <RequestModal
                isOpen={isRequestModalOpen}
                onClose={handleRequestModalClose}
            />
        </header>
    )
}

export default Header
