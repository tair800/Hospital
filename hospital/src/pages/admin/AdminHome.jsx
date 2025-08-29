import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import adminDeleteIcon from '../../assets/admin-delete.png'
import adminBrowseIcon from '../../assets/admin-browse.png'
import './AdminHome.css'

function AdminHome() {
    const [homeData, setHomeData] = useState({
        section1Description: '',
        section2Image: '',
        section3Image: '',
        section4Title: '',
        section4Description: '',
        section4PurposeTitle: '',
        section4PurposeDescription: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchHomeData();
    }, []);

    const fetchHomeData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/HomeSection/first');
            if (response.ok) {
                const data = await response.json();
                setHomeData({
                    section1Description: data.section1Description || '',
                    section2Image: data.section2Image || '',
                    section3Image: data.section3Image || '',
                    section4Title: data.section4Title || '',
                    section4Description: data.section4Description || '',
                    section4PurposeTitle: data.section4PurposeTitle || '',
                    section4PurposeDescription: data.section4PurposeDescription || ''
                });
            }
        } catch (error) {
            showAlert('error', 'Error!', 'Failed to fetch home data.');
        }
    };

    const showAlert = (icon, title, text) => {
        Swal.fire({ icon, title, text, confirmButtonColor: '#1976d2', timer: 2000, showConfirmButton: false });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setHomeData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageBrowse = (sectionName) => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                // Store only the filename, not the File object
                setHomeData(prev => ({ ...prev, [sectionName]: file.name }));
                showAlert('success', 'Image Selected!', `Image "${file.name}" selected for ${sectionName}. Don't forget to save changes!`);
            }
        };

        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    };

    const handleImageDelete = (sectionName) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                setHomeData(prev => ({ ...prev, [sectionName]: '' }));
                showAlert('success', 'Deleted!', 'Image has been removed.');
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            const response = await fetch('http://localhost:5000/api/HomeSection/first', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(homeData),
            });

            if (response.ok) {
                showAlert('success', 'Success!', 'Home sections updated successfully!');
            } else {
                showAlert('error', 'Error!', 'Failed to update home sections.');
            }
        } catch (error) {
            showAlert('error', 'Error!', 'Failed to update home sections.');
        } finally {
            setLoading(false);
        }
    };

    const renderImageSection = (sectionName, title) => (
        <div className="section-form-group">
            <h3>{title}</h3>
            <div className="image-section">
                <div className="image-placeholder">
                    {homeData[sectionName] ? (
                        // Show existing uploaded image
                        <img
                            src={`/src/assets/${homeData[sectionName]}`}
                            alt={`${title} image`}
                            className="current-image"
                        />
                    ) : (
                        <div className="image-placeholder-text">No image uploaded</div>
                    )}
                </div>

                <div className="image-actions-left">
                    <button
                        type="button"
                        onClick={() => handleImageDelete(sectionName)}
                        className="action-btn delete-btn"
                        title="Delete image"
                    >
                        <img src={adminDeleteIcon} alt="Delete" className="action-icon" />
                    </button>
                    <button
                        type="button"
                        onClick={() => handleImageBrowse(sectionName)}
                        className="action-btn browse-btn"
                        title="Browse image"
                    >
                        <img src={adminBrowseIcon} alt="Browse" className="action-icon" />
                    </button>
                </div>

                <div className="image-info">
                    *Yüklənən şəkil 400 x 400 ölçüsündə olmalıdır
                </div>
            </div>
        </div>
    );

    if (loading) return <div className="admin-home-loading">Loading...</div>;

    return (
        <div className="admin-home">
            <div className="admin-home-container">
                <div className="admin-home-card">
                    <div className="admin-home-header">
                        <h2>Home Page Management</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="admin-home-form">
                        <div className="form-fields-left">
                            {/* Section 1 - Description */}
                            <div className="section-form-group">
                                <h3>Section 1 - Main Title</h3>
                                <div className="form-group">
                                    <label htmlFor="section1Description">Main Title & Description</label>
                                    <textarea
                                        id="section1Description"
                                        name="section1Description"
                                        value={homeData.section1Description}
                                        onChange={handleInputChange}
                                        placeholder="Enter the main title and description for section 1"
                                        className="form-textarea"
                                        rows="3"
                                    />
                                </div>
                            </div>

                            {/* Section 4 - Content */}
                            <div className="section-form-group">
                                <h3>Section 4 - Organization Details</h3>
                                {['section4Title', 'section4Description', 'section4PurposeTitle', 'section4PurposeDescription'].map(field => (
                                    <div className="form-group" key={field}>
                                        <label htmlFor={field}>
                                            {field.replace('section4', '').replace(/([A-Z])/g, ' $1').trim()}
                                        </label>
                                        {field.includes('Description') ? (
                                            <textarea
                                                id={field}
                                                name={field}
                                                value={homeData[field]}
                                                onChange={handleInputChange}
                                                placeholder={`Enter ${field.replace('section4', '').replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`}
                                                className="form-textarea"
                                                rows="3"
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                id={field}
                                                name={field}
                                                value={homeData[field]}
                                                onChange={handleInputChange}
                                                placeholder={`Enter ${field.replace('section4', '').replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`}
                                                className="form-input"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="image-section-right">
                            {renderImageSection('section2Image', 'Section 2 - Main Image')}
                            {renderImageSection('section3Image', 'Section 3 - Secondary Image')}
                        </div>
                    </form>

                    <div className="form-actions">
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="submit-btn"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminHome
