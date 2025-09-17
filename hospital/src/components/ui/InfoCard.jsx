import React from 'react';
import './InfoCard.css';

const InfoCard = ({
    imageSrc = "/assets/event-img.png",
    title = "HPB Cərrahiyyə Hallarının Klinik Təhlili",
    description = "Bu seminar, kompleks hepato-pankreato-biliar cərrahiyyə hallarının idarə olunmasında qarşılaşılan çətinlikləri və müasir yanaşmaları.",
    date = "12",
    month = "MART",
    onReadMoreClick
}) => {
    return (
        <div className="info-card">
            <img
                src={imageSrc}
                alt="Event Image"
            />
            <div className="blue-cover"></div>

            {/* Top-right description text */}
            <div className="card-top-text">
                {description}
            </div>

            {/* Bottom-left title text */}
            <div className="card-bottom-text">
                {title}
            </div>

            {/* Top-left date triangle */}
            <div className="card-triangle-white-top">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M0 0 L100 0 L0 100 Z" fill="white" />
                    <text x="5" y="32" fill="#1B1B3F" fontSize="28" fontWeight="700" fontFamily="Arial, sans-serif">
                        {date}
                    </text>
                    <text x="4" y="45" fill="#1B1B3F" fontSize="10" fontWeight="700" fontFamily="Arial, sans-serif">
                        {month}
                    </text>
                </svg>
            </div>

            {/* Bottom-right read more triangle */}
            <div className="card-triangle-white">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M100 0 L0 100 L100 100 Z" fill="white" />
                </svg>
            </div>

            <div className="card-triangle" onClick={onReadMoreClick}>
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M100 10 Q100 0 90 10 L10 90 Q0 100 10 100 L100 100 Z" fill="#1B1B3F" />
                    <image
                        href="/assets/arrow-right.png"
                        x="60"
                        y="50"
                        width="30"
                        height="20"
                    />
                    <text
                        x="70"
                        y="80"
                        textAnchor="middle"
                        fill="white"
                        fontSize="8"
                        fontFamily="Arial, sans-serif"
                    >
                        Read more
                    </text>
                </svg>
            </div>
        </div>
    );
};

export default InfoCard;
