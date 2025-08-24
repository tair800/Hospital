import React, { useEffect, useRef } from 'react';
import { Application } from '@splinetool/runtime';
import HealthcareCard from './HealthcareCard';
import './TestComponent.css';

const TestComponent = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (canvasRef.current) {
            const app = new Application(canvasRef.current);
            app.load('https://prod.spline.design/kCfMTbwclFSOycz6/scene.splinecode');
        }
    }, []);

    return (
        <div className="test-component">


            {/* Healthcare Card Section */}
            <div className="healthcare-section">
                <HealthcareCard />
            </div>
        </div>
    );
};

export default TestComponent;
