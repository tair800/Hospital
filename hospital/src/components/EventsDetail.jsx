import React, { useState, useEffect } from 'react';
import { eventData } from '../data/eventData';
import './EventsDetail.css';

const EventsDetail = ({ eventId, onBackToEvents }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

    // Find the specific event data
    const event = eventData.find(e => e.id === eventId);

    // Countdown timer effect
    useEffect(() => {
        if (!event) return;

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const eventTime = new Date(event.eventDate).getTime();
            const difference = eventTime - now;

            console.log('Timer Debug:', {
                now: new Date(now),
                eventTime: new Date(eventTime),
                difference,
                eventDate: event.eventDate
            });

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

                setTimeLeft({ days, hours, minutes });
                console.log('Time Left:', { days, hours, minutes });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0 });
                console.log('Event has passed');
            }
        };

        // Calculate immediately
        calculateTimeLeft();

        // Update every second for real-time countdown
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [event]);

    // If event not found, show error or redirect
    if (!event) {
        return (
            <div className="events-detail-page">
                <div className="events-detail-header-text">
                    <span className="events-detail-header-first">Event Not Found</span>
                    <button onClick={onBackToEvents} className="back-button">Back to Events</button>
                </div>
            </div>
        );
    }

    return (
        <div className="events-detail-page">
            <img src="/src/assets/events-star1.png" alt="Star 1" className="events-star-left" />
            <img src="/src/assets/events-star2.png" alt="Star 2" className="events-star-right" />

            <div className="events-detail-main-title">
                <div className="title-line-1">Biliar Forum 2025: Müasir</div>
                <div className="title-line-2">Diaqnostika və Müalicə Yanaşmaları</div>
            </div>

            <div className="events-detail-cards">
                <div className="event-detail-card event-date-card">
                    <img src="/src/assets/events-detail.png" alt="Event Detail" className="card-event-detail-image" />
                    <img src="/src/assets/calendar.png" alt="Calendar" className="card-calendar-icon" />
                    <div className="card-date-info">
                        <span className="card-date-day">{event.day}</span>
                        <span className="card-date-month">{event.month}</span>
                        <span className="card-date-year">2025</span>
                    </div>
                </div>
                <div className="event-detail-card event-location-card">
                    <img src="/src/assets/events-detail.png" alt="Event Detail" className="card-event-detail-image" />
                    <img src="/src/assets/clock.png" alt="Clock" className="card-clock-icon" />
                    <div className="card-time-info">
                        <span className="card-time">{event.time}</span>
                    </div>
                </div>
                <div className="event-detail-card event-participants-card">
                    <img src="/src/assets/events-detail.png" alt="Event Detail" className="card-event-detail-image" />
                    <img src="/src/assets/location.png" alt="Location" className="card-location-icon" />
                    <div className="card-location-info">
                        <span className="card-location">{event.venue}</span>
                    </div>
                </div>
            </div>

            <div className="events-detail-description">
                <p>
                    Qaraciyər, öd yolları və pankreas xəstəliklərinin diaqnostika və müalicəsində ən son yenilikləri bir araya gətirən nüfuzlu elmi tədbirdir. Forumun əsas məqsədi bu sahədə çalışan həkimlər, cərrahlar, radioloqlar, gastroenteroloqlar, onkoloqlar və tədqiqatçıların bilik və təcrübə mübadiləsini təmin etməkdir. Tədbirdə müasir görüntüləmə texnologiyaları, minimal invaziv müdaxilələr, endoskopik və cərrahi yanaşmalar, həmçinin farmakoloji və molekulyar səviyyədə yeni müalicə üsulları geniş şəkildə müzakirə olunacaq. Dünyanın müxtəlif ölkələrindən dəvət olunmuş aparıcı mütəxəssislər elmi çıxışlar edəcək, klinik halların təhlilini təqdim edəcək və iştirakçılarla interaktiv sessiyalarda fikir mübadiləsi aparacaqlar.
                </p>
                <p>
                    Forum həm də gənc mütəxəssislər və rezidentlər üçün öyrədici məzmunu ilə seçilir. Onlar üçün xüsusi workshop-lar, "case study" sessiyaları və praktik təlimlər təşkil olunacaq. Bu, iştirakçılara yalnız nəzəri bilikləri deyil, həm də real klinik təcrübəni öyrənmək imkanı yaradacaq.
                </p>
            </div>

            <div className="events-detail-main-image">
                <div className="countdown-timer">
                    <div className="timer-display">
                        <div className="timer-unit">
                            <span className="timer-number">{timeLeft.days.toString().padStart(2, '0')}</span>
                            <span className="timer-label">Gün</span>
                        </div>
                        <span className="timer-separator">:</span>
                        <div className="timer-unit">
                            <span className="timer-number">{timeLeft.hours.toString().padStart(2, '0')}</span>
                            <span className="timer-label">Saat</span>
                        </div>
                        <span className="timer-separator">:</span>
                        <div className="timer-unit">
                            <span className="timer-number">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                            <span className="timer-label">Dəq</span>
                        </div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '10px', textAlign: 'center' }}>
                        Event: {event?.eventDate || 'No date'}
                    </div>
                </div>
                <img src="/src/assets/events-detail-left.png" alt="Event Detail Left" className="left-event-image" />
                <img src="/src/assets/events-detail-main.png" alt="Event Detail Main" className="main-event-image" />
                <img src="/src/assets/events-detail-right.png" alt="Event Detail Right" className="right-event-image" />
            </div>
        </div>
    );
};

export default EventsDetail;
