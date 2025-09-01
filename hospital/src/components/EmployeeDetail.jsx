import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './EmployeeDetail.css';
import LogoCarousel from './LogoCarousel';

const EmployeeDetail = () => {
    // Carousel state
    const [currentPage, setCurrentPage] = useState(0);
    const [slideDirection, setSlideDirection] = useState('');
    const [isSliding, setIsSliding] = useState(false);

    // Sample data for multiple cards (you can add more cards here)
    const allCards = [
        { id: 1, image: "/src/assets/employee-certificate.png" },
        { id: 2, image: "/src/assets/employee-certificate.png" },
        { id: 3, image: "/src/assets/employee-certificate.png" },
        { id: 4, image: "/src/assets/employee-certificate.png" },
        { id: 5, image: "/src/assets/employee-certificate.png" },
        { id: 6, image: "/src/assets/employee-certificate.png" },
        { id: 7, image: "/src/assets/employee-certificate.png" },
        { id: 8, image: "/src/assets/employee-certificate.png" },
        { id: 9, image: "/src/assets/employee-certificate.png" },
        { id: 10, image: "/src/assets/employee-certificate.png" },
        { id: 11, image: "/src/assets/employee-certificate.png" },
        { id: 12, image: "/src/assets/employee-certificate.png" },
    ];

    const cardsPerPage = 4;
    const totalPages = Math.ceil(allCards.length / cardsPerPage);

    // Get current page cards
    const getCurrentPageCards = () => {
        const startIndex = currentPage * cardsPerPage;
        return allCards.slice(startIndex, startIndex + cardsPerPage);
    };

    // Navigation functions with sliding animation
    const nextPage = () => {
        if (isSliding) return;
        setIsSliding(true);
        setSlideDirection('slide-left');

        setTimeout(() => {
            setCurrentPage(prev => (prev + 1) % totalPages);
            setSlideDirection('');
            setIsSliding(false);
        }, 250);
    };

    const prevPage = () => {
        if (isSliding) return;
        setIsSliding(true);
        setSlideDirection('slide-right');

        setTimeout(() => {
            setCurrentPage(prev => (prev - 1 + totalPages) % totalPages);
            setSlideDirection('');
            setIsSliding(false);
        }, 250);
    };

    const goToPage = (pageIndex) => {
        if (isSliding || pageIndex === currentPage) return;

        setIsSliding(true);
        const direction = pageIndex > currentPage ? 'slide-left' : 'slide-right';
        setSlideDirection(direction);

        setTimeout(() => {
            setCurrentPage(pageIndex);
            setSlideDirection('');
            setIsSliding(false);
        }, 250);
    };

    return (
        <div className="employee-detail-page">
            {/* Background Image Section */}
            <div className="employee-detail-bg-section">
                <img
                    src="/src/assets/employee-detail-bg.png"
                    alt="Employee Detail Background"
                    className="employee-detail-bg-image"
                />

                {/* Header Content Inside Background */}
                <div className="employee-detail-header-content">
                    {/* Left Side - Employee Information */}
                    <div className="employee-detail-left">
                        {/* Breadcrumb Navigation */}
                        <div className="breadcrumb">
                            <span>Üzvlərimiz</span>
                            <span className="separator">&gt;</span>
                            <span>Raul Mirzəyev</span>
                        </div>

                        {/* Employee Name and Title */}
                        <div className="employee-info">
                            <h1 className="employee-name">Raul Mirzəyev</h1>
                            <div className="employee-title">
                                <div className="title-icon"></div>
                                <p>Ürək-damar cərrahı - Bakı Klinikası</p>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="contact-info">
                            <div className="contact-item">
                                <img src="/src/assets/phone-icon.png" alt="Phone" className="contact-icon" />
                                <span>+(994) 50 xxx xx xx</span>
                            </div>
                            <div className="contact-item">
                                <img src="/src/assets/whatsapp-icon.png" alt="WhatsApp" className="contact-icon" />
                                <span>+(994) 50 xxx xx xx</span>
                            </div>
                            <div className="contact-item">
                                <img src="/src/assets/mail-icon.png" alt="Email" className="contact-icon" />
                                <span>example@gmail.com</span>
                            </div>
                            <div className="contact-item">
                                <img src="/src/assets/location-icon.png" alt="Location" className="contact-icon" />
                                <span>Bakı, Azərbaycan</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Employee Image */}
                    <div className="employee-detail-right">
                        <img src="/src/assets/employee1.png" alt="Employee" className="employee-detail-image" />
                    </div>
                </div>
            </div>

            {/* New Section: About Employee */}
            <div className="employee-about-section">
                <div className="employee-about-content">
                    <div className="about-title-container">
                        <h2 className="about-title">Mən Kiməm?</h2>
                    </div>
                    <p className="about-paragraph">
                        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical
                        Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at
                        Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur,
                        from a Lorem Ipsum passage, and going through the cites of the word in classical literature.
                    </p>
                    <p className="about-paragraph">
                        The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.
                        Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in
                        their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
                    </p>
                </div>

                {/* Right Side - Equipment DNA Image */}
                <div className="equipment-dna-right">
                    <img src="/src/assets/equipment-dna.png" alt="Equipment DNA" className="equipment-dna-image" />
                </div>
            </div>

            {/* New Section: Divided Layout */}
            <div className="employee-divided-section">
                <div className="divided-left">
                    <img src="/src/assets/employee-detail.png" alt="Employee Detail" className="divided-left-image" />
                </div>
                <div className="divided-right">
                    <div className="certificate-timeline-container">
                        <div className="certificate-title-container">
                            <h3 className="certificate-title">Tibbə Aparan Yol</h3>
                        </div>
                        <p className="certificate-description">
                            Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical
                            Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at
                            Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur,
                            from a Lorem Ipsum passage, and going through the cites of the word in classical literature.
                        </p>

                        <div className="certificate-timeline-line certificates-4">
                            <div className="certificate-dot certificate-dot-1"></div>
                            <div className="certificate-number certificate-number-1">01</div>
                            <div className="certificate-dot certificate-dot-2"></div>
                            <div className="certificate-number certificate-number-2">02</div>
                            <div className="certificate-dot certificate-dot-3"></div>
                            <div className="certificate-number certificate-number-3">03</div>
                            <div className="certificate-dot certificate-dot-4"></div>
                            <div className="certificate-number certificate-number-4">04</div>

                            <div className="certificate-info certificate-info-1">
                                <h4 className="certificate-university">University of Medicine in Colifonia</h4>
                                <p className="certificate-years">2010-2016</p>
                            </div>
                            <div className="certificate-info certificate-info-2">
                                <h4 className="certificate-university">University of Medicine (Master degree)</h4>
                                <p className="certificate-years">2016-2018</p>
                            </div>
                            <div className="certificate-info certificate-info-3">
                                <h4 className="certificate-university">America Government Clinic</h4>
                                <p className="certificate-years">2019-2023</p>
                            </div>
                            <div className="certificate-info certificate-info-4">
                                <h4 className="certificate-university">Baku Clinic</h4>
                                <p className="certificate-years">2023-indi</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cards Section with Carousel */}
            <div className="cards-section">
                <div className="cards-carousel-container">
                    {/* Navigation Buttons */}
                    <button className="carousel-btn carousel-btn-prev" onClick={prevPage}>
                        ‹
                    </button>

                    {/* Cards Container */}
                    <div className={`cards-container ${isSliding ? 'sliding' : ''} ${slideDirection}`}>
                        {getCurrentPageCards().map((card, index) => (
                            <div key={card.id} className={`card card-${index + 1}`}>
                                <div className="inner-card"></div>
                                <img src={card.image} alt="Employee Certificate" className="card-image" />
                            </div>
                        ))}
                    </div>

                    {/* Navigation Buttons */}
                    <button className="carousel-btn carousel-btn-next" onClick={nextPage}>
                        ›
                    </button>
                </div>


            </div>

            {/* Logo Carousel Section */}
            <LogoCarousel />
        </div>
    );
};

export default EmployeeDetail;
