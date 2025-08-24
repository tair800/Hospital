import React from 'react';
import eventBgImg from '../assets/employee-bg.png';
import employeeImg from '../assets/employee1.png';
import './HealthcareCard.css';

export default function HealthcareCard() {
    return (
        <div className="healthcare-card">
            <img src={eventBgImg} alt="Event Background" className="event-background" />
            <img src={employeeImg} alt="Employee" className="employee-image" />
        </div>
    );
}
