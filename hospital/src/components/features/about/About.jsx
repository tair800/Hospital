import React, { useState, useEffect } from 'react'
import './About.css'
const aboutMainImage = '/assets/about-main.png'
const aboutTop1Image = '/assets/about-dot1.png'
const aboutTop2Image = '/assets/about-dot2.png'
const aboutTop3Image = '/assets/about-dot3.png'
const aboutTop4Image = '/assets/about-dot4.png'
const circleImage = '/assets/circle.png'
import LogoCarousel from '../../ui/LogoCarousel'
import AboutCarousel from './AboutCarousel.jsx'

function About() {
    const [counter, setCounter] = useState(1);
    const [counter2, setCounter2] = useState(1);
    const [aboutData, setAboutData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch About data from API
    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://ahpbca-api.webonly.io/api/about');
                if (!response.ok) {
                    throw new Error('Failed to fetch about data');
                }
                const data = await response.json();
                setAboutData(data[0]); // Get the first about entry
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAboutData();
    }, []);







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



    // Show loading state
    if (loading) {
        return (
            <div className="about-page">
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="about-page">
                <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
                    <p>Error loading data: {error}</p>
                </div>
            </div>
        );
    }

    // Helper: normalize image path coming from API or fallback
    const getImagePath = (imageName) => {
        if (!imageName) return aboutMainImage;
        if (imageName.startsWith('/assets/')) return imageName;
        if (imageName.startsWith('/src/assets/')) return imageName.replace('/src/assets/', '/assets/');
        return `/assets/${imageName}`;
    };

    return (
        <div className="about-page">
            <img
                src={circleImage}
                alt="Circle"
                className="about-circle-first"
            />
            <img
                src={circleImage}
                alt="Circle"
                className="about-circle-second"
            />
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
                        <img
                            src={getImagePath(aboutData?.img)}
                            alt="About Main Image"
                        />
                    </div>
                </div>

                <div className="right-text-section" style={{ color: 'black' }}>
                    <h1 className="main-title">
                        {aboutData?.title || 'Azərbaycan Hepato-Pankreato-Biliar Cərrahlar İctimai Birliyi'}
                    </h1>

                    <div className="text-content" style={{ marginTop: '2rem' }}>
                        {aboutData?.description ? (
                            aboutData.description.split('\n\n').map((paragraph, index) => (
                                <p key={index}>
                                    {paragraph.trim()}
                                </p>
                            ))
                        ) : (
                            <>
                                <p>
                                    Azərbaycan Hepato-Pankreato-Biliar Cərrahlar İctimai Birliyi, qaraciyər, öd yolları və mədəaltı vəzi xəstəliklərinin diaqnostika və cərrahiyyəsi sahəsində fəaliyyət göstərən mütəxəssisləri bir araya gətirən elmi-ictimai təşkilatdır.
                                </p>
                                <p>
                                    Birliyin əsas məqsədi HPB sahəsində bilik və təcrübə mübadiləsini təşviq etmək, peşəkar inkişafı dəstəkləmək və ölkədə bu sahənin inkişafına töhfə verməkdir. Birlik həm yerli, həm də beynəlxalq əməkdaşlıqlar quraraq seminarlar, elmi konfranslar və təlimlər təşkil edir. Gənc cərrahların və mütəxəssislərin dəstəklənməsi, müasir cərrahiyyə metodlarının tətbiqi və elmi tədqiqatların təşviqi də fəaliyyətimizin əsas istiqamətlərindəndir.
                                </p>
                                <p>
                                    Azərbaycan HPB Cərrahları İctimai Birliyi olaraq, səhiyyə sisteminə dəyər qatmaq və xəstələrin həyat keyfiyyətini artırmaq üçün peşəkar bir cəmiyyət olaraq çalışırıq.
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>



            <AboutCarousel />

            <LogoCarousel />
        </div>
    )
}

export default About
