import React, { useState, useEffect } from 'react';
import './AdminAbout.css';

function AdminAbout() {
    const [aboutData, setAboutData] = useState({
        title: '',
        description: '',
        img: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Fetch existing about data
    useEffect(() => {
        fetchAboutData();
    }, []);

    const fetchAboutData = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/about');
            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
                    setAboutData(data[0]);
                }
            }
        } catch (error) {
            setMessage('Error fetching data');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAboutData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/api/about/${aboutData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(aboutData),
            });

            if (response.ok) {
                setMessage('About page updated successfully!');
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('Error updating about page');
            }
        } catch (error) {
            setMessage('Error updating about page');
        } finally {
            setLoading(false);
        }
    };

    const handleImageDelete = () => {
        setAboutData(prev => ({
            ...prev,
            img: ''
        }));
        setMessage('Image removed');
        setTimeout(() => setMessage(''), 3000);
    };

    const handleImageRefresh = () => {
        fetchAboutData();
        setMessage('Data refreshed');
        setTimeout(() => setMessage(''), 3000);
    };

    if (loading) {
        return <div className="admin-about-loading">Loading...</div>;
    }

    return (
        <div className="admin-about-page">
            <div className="admin-about-container">
                <div className="admin-about-card">
                    <div className="admin-about-header">
                        <h2>About Us</h2>
                    </div>

                    <div className="admin-about-form">
                        <div className="form-fields-left">
                            <div className="form-group">
                                <label htmlFor="title">Heading</label>
                                <div className="input-container">
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={aboutData.title}
                                        onChange={handleInputChange}
                                        placeholder="Enter heading"
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Subtext</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={aboutData.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter your description here. Use double line breaks to separate paragraphs for proper spacing."
                                    className="form-textarea"
                                    rows="8"
                                />
                            </div>
                        </div>

                        <div className="image-section-right">
                            <div className="image-placeholder">
                                {aboutData.img ? (
                                    <img
                                        src={`/src/assets/${aboutData.img}`}
                                        alt="About page image"
                                        className="current-image"
                                    />
                                ) : (
                                    <div className="image-placeholder-text">
                                        No image uploaded
                                    </div>
                                )}

                                <div className="image-bottom-left-content">
                                    <div className="image-actions">
                                        <button
                                            type="button"
                                            onClick={handleImageDelete}
                                            className="action-btn delete-btn"
                                            title="Delete image"
                                        >
                                            🗑️
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleImageRefresh}
                                            className="action-btn refresh-btn"
                                            title="Refresh data"
                                        >
                                            🔄
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="image-info">
                                *Yüklənən şəkil 318 x 387 ölçüsündə olmalıdır
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminAbout;
