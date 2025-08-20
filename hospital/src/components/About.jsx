import React, { useState, useRef, useEffect } from 'react'
import './About.css'
import { carouselData } from '../data/about-data.js'
import aboutMainImage from '../assets/about-main.png'
import aboutTop1Image from '../assets/about-dot1.png'
import aboutTop2Image from '../assets/about-dot2.png'
import aboutTop3Image from '../assets/about-dot3.png'
import aboutTop4Image from '../assets/about-dot4.png'
import LogoCarousel from './LogoCarousel.jsx'

function About() {
    const [counter, setCounter] = useState(1);
    const [counter2, setCounter2] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const carouselRef = useRef(null);

    // Counter animation for dot4 (Events)
    useEffect(() => {
        const timer = setInterval(() => {
            setCounter(prevCounter => {
                if (prevCounter < 70) {
                    return prevCounter + 1;
                } else {
                    clearInterval(timer);
                    return 70;
                }
            });
        }, 1);

        return () => clearInterval(timer);
    }, []);

    // Counter animation for dot3 (doctors)
    useEffect(() => {
        const timer = setInterval(() => {
            setCounter2(prevCounter => {
                if (prevCounter < 100) {
                    return prevCounter + 1;
                } else {
                    clearInterval(timer);
                    return 100;
                }
            });
        }, 1);

        return () => clearInterval(timer);
    }, []);

    // Carousel drag handlers
    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        setStartX(e.pageX);
        setScrollLeft(carouselRef.current.scrollLeft);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX;
        const walk = (x - startX);
        const newScrollLeft = scrollLeft - walk;
        carouselRef.current.scrollLeft = newScrollLeft;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const extendedData = [...carouselData, ...carouselData, ...carouselData];

    return (
        <div className="about-page">
            <div className="about-content-container">
                <div className="left-image-section">
                    <div className="dot-image-container">
                        <img src={aboutTop1Image} alt="About Dot Image" />
                    </div>
                    <div className="dot2-image-container">
                        <img src={aboutTop2Image} alt="About Dot 2 Image" />
                    </div>
                    <div className="dot3-image-container">
                        <img src={aboutTop3Image} alt="About Dot 3 Image" />
                        <div className="dot3-text-overlay">
                            <span className="dot3-number">+{counter2}</span>
                            <span className="dot3-label">doctors</span>
                        </div>
                    </div>
                    <div className="dot4-image-container">
                        <img src={aboutTop4Image} alt="About Dot 4 Image" />
                        <div className="dot4-text-overlay">
                            <span className="dot4-number">+{counter}</span>
                            <span className="dot4-label">Events</span>
                        </div>
                    </div>
                    <div className="main-image-container">
                        <img src={aboutMainImage} alt="About Main Image" />
                    </div>
                </div>

                <div className="right-text-section">
                    <h1 className="main-title">
                        Azərbaycan Hepato-<br />
                        Pankreato-Biliar Cərrahlar<br />
                        İctimai Birliyi
                    </h1>

                    <div className="text-content">
                        <p>
                            Azərbaycan Hepato-Pankreato-Biliar Cərrahlar İctimai Birliyi, qaraciyər, öd yolları və mədəaltı vəzi xəstəliklərinin diaqnostika və cərrahiyyəsi sahəsində fəaliyyət göstərən mütəxəssisləri bir araya gətirən elmi-ictimai təşkilatdır.
                        </p>

                        <p>
                            Birliyin əsas məqsədi HPB sahəsində bilik və təcrübə mübadiləsini təşviq etmək, peşəkar inkişafı dəstəkləmək və ölkədə bu sahənin inkişafına töhfə verməkdir. Birlik həm yerli, həm də beynəlxalq əməkdaşlıqlar quraraq seminarlar, elmi konfranslar və təlimlər təşkil edir. Gənc cərrahların və mütəxəssislərin dəstəklənməsi, müasir cərrahiyyə metodlarının tətbiqi və elmi tədqiqatların təşviqi də fəaliyyətimizin əsas istiqamətlərindəndir.
                        </p>

                        <p>
                            Azərbaycan HPB Cərrahları İctimai Birliyi olaraq, səhiyyə sisteminə dəyər qatmaq və xəstələrin həyat keyfiyyətini artırmaq üçün peşəkar bir cəmiyyət olaraq çalışırıq.
                        </p>
                    </div>
                </div>
            </div>

            <div className="carousel-section">
                <div
                    className="carousel-container"
                    ref={carouselRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    {extendedData.map((item, index) => (
                        <div key={`${item.id}-${index}`} className="carousel-item">
                            <img src={item.image} alt={item.name} />
                        </div>
                    ))}
                </div>
            </div>

            <LogoCarousel />
        </div>
    )
}

export default About
