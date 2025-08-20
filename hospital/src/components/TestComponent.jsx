import React, { useEffect, useRef } from 'react';
import { Application } from '@splinetool/runtime';
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
            <div className="spline-container">
                <canvas ref={canvasRef} />
            </div>
        </div>
    );
};

export default TestComponent;
