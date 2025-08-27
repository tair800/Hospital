import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import adminDeleteIcon from '../../assets/admin-delete.png';
import adminBrowseIcon from '../../assets/admin-browse.png';
import './AdminAbout.css';

function AdminAbout() {
    const [aboutData, setAboutData] = useState({ title: '', description: '', img: '' });
    const [carouselData, setCarouselData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Configuration for form fields
    const formConfig = {
        title: { label: 'Heading', type: 'text', placeholder: 'Enter heading' },
        description: { label: 'Subtext', type: 'textarea', placeholder: 'Enter your description here. Use double line breaks to separate paragraphs for proper spacing.' }
    };

    // SweetAlert configuration
    const swalConfig = {
        confirmButtonColor: '#1976d2',
        timer: 2000,
        showConfirmButton: false
    };

    useEffect(() => {
        fetchAboutData();
        fetchCarouselData();
    }, []);

    const fetchAboutData = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/about');
            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) setAboutData(data[0]);
            }
        } catch (error) {
            showAlert('error', 'Error!', 'Failed to fetch data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchCarouselData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/aboutcarousel');
            if (response.ok) {
                const data = await response.json();
                setCarouselData(data);
            }
        } catch (error) {
            showAlert('error', 'Error!', 'Failed to fetch carousel data.');
        }
    };

    const showAlert = (icon, title, text) => {
        Swal.fire({ icon, title, text, ...swalConfig });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAboutData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/api/about/${aboutData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(aboutData),
            });

            if (response.ok) {
                showAlert('success', 'Success!', 'About page updated successfully!');
            } else {
                showAlert('error', 'Error!', 'Failed to update about page. Please try again.');
            }
        } catch (error) {
            showAlert('error', 'Error!', 'Failed to update about page. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleImageDelete = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            setAboutData(prev => ({ ...prev, img: '' }));
            showAlert('success', 'Deleted!', 'Image has been removed.');
        }
    };

    const handleImageBrowse = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                setAboutData(prev => ({ ...prev, img: file.name }));
                showAlert('success', 'Image Selected!', `Image "${file.name}" has been selected. Don't forget to save changes!`);
            }
        };

        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    };

    const handleAddCarouselItem = () => {
        Swal.fire({
            title: 'Add Carousel Item',
            html: `
                <input id="swal-name" class="swal2-input" placeholder="Name">
                <input id="swal-image-file" type="file" accept="image/*" style="margin-top: 10px;">
                <p style="font-size: 12px; color: #666; margin-top: 5px;">Select an image file</p>
            `,
            showCancelButton: true,
            confirmButtonText: 'Add',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#1976d2',
            preConfirm: () => {
                const name = document.getElementById('swal-name').value;
                const imageFile = document.getElementById('swal-image-file').files[0];
                if (!name || !imageFile) {
                    Swal.showValidationMessage('Please fill in name and select an image');
                    return false;
                }
                return { name, imageFile };
            }
        }).then((result) => {
            if (result.isConfirmed) addCarouselItem(result.value);
        });
    };

    const addCarouselItem = async (itemData) => {
        try {
            const carouselData = {
                name: itemData.name,
                image: `/src/assets/${itemData.imageFile.name}`
            };

            const response = await fetch('http://localhost:5000/api/aboutcarousel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(carouselData),
            });

            if (response.ok) {
                showAlert('success', 'Success!', 'Carousel item added successfully!');
                fetchCarouselData();
            } else {
                showAlert('error', 'Error!', 'Failed to add carousel item.');
            }
        } catch (error) {
            showAlert('error', 'Error!', 'Failed to add carousel item.');
        }
    };

    const handleEditCarouselItem = (item) => {
        Swal.fire({
            title: 'Edit Carousel Item',
            html: `
                <input id="swal-name" class="swal2-input" placeholder="Name" value="${item.name}">
                <input id="swal-image-file" type="file" accept="image/*" style="margin-top: 10px;">
                <p style="font-size: 12px; color: #666; margin-top: 5px;">Select a new image file (optional)</p>
            `,
            showCancelButton: true,
            confirmButtonText: 'Update',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#1976d2',
            preConfirm: () => {
                const name = document.getElementById('swal-name').value;
                const imageFile = document.getElementById('swal-image-file').files[0];
                if (!name) {
                    Swal.showValidationMessage('Please fill in the name');
                    return false;
                }
                return { name, imageFile };
            }
        }).then((result) => {
            if (result.isConfirmed) updateCarouselItem(item.id, result.value);
        });
    };

    const updateCarouselItem = async (id, itemData) => {
        try {
            const carouselData = { name: itemData.name };
            if (itemData.imageFile) {
                carouselData.image = `/src/assets/${itemData.imageFile.name}`;
            }

            const response = await fetch(`http://localhost:5000/api/aboutcarousel/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(carouselData),
            });

            if (response.ok) {
                showAlert('success', 'Success!', 'Carousel item updated successfully!');
                fetchCarouselData();
            } else {
                showAlert('error', 'Error!', 'Failed to update carousel item.');
            }
        } catch (error) {
            showAlert('error', 'Error!', 'Failed to update carousel item.');
        }
    };

    const handleDeleteCarouselItem = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`http://localhost:5000/api/aboutcarousel/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    showAlert('success', 'Deleted!', 'Carousel item has been deleted.');
                    fetchCarouselData();
                } else {
                    showAlert('error', 'Error!', 'Failed to delete carousel item.');
                }
            } catch (error) {
                showAlert('error', 'Error!', 'Failed to delete carousel item.');
            }
        }
    };

    const renderFormField = (name) => {
        const config = formConfig[name];
        if (config.type === 'textarea') {
            return (
                <div className="form-group" key={name}>
                    <label htmlFor={name}>{config.label}</label>
                    <textarea
                        id={name}
                        name={name}
                        value={aboutData[name]}
                        onChange={handleInputChange}
                        placeholder={config.placeholder}
                        className="form-textarea"
                        rows="8"
                    />
                </div>
            );
        }
        return (
            <div className="form-group" key={name}>
                <label htmlFor={name}>{config.label}</label>
                <div className="input-container">
                    <input
                        type={config.type}
                        id={name}
                        name={name}
                        value={aboutData[name]}
                        onChange={handleInputChange}
                        placeholder={config.placeholder}
                        className="form-input"
                    />
                </div>
            </div>
        );
    };

    const renderCarouselItem = (item, index) => (
        <div key={item.id || index} className="carousel-placeholder">
            <div className="placeholder-number">#{index + 1}</div>
            <div className="carousel-image-container">
                <img
                    src={item.image}
                    alt={item.name}
                    className="carousel-image"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                    }}
                />
                <div className="image-fallback" style={{ display: 'none' }}>No Image</div>
                <button
                    type="button"
                    onClick={() => handleDeleteCarouselItem(item.id)}
                    className="placeholder-action-btn delete-btn"
                    title="Delete image"
                >
                    <img src={adminDeleteIcon} alt="Delete" className="action-icon" />
                </button>
            </div>
        </div>
    );

    const renderEmptyPlaceholder = (index) => (
        <div key={`empty-${index}`} className="carousel-placeholder">
            <div className="placeholder-number">#{carouselData.length + index + 1}</div>
            <div className="placeholder-icon">🖼️</div>
            <div className="placeholder-text">
                <span className="click-upload">Click to upload</span>
                <span className="drag-drop">or drag and drop</span>
            </div>
            <button
                type="button"
                onClick={handleAddCarouselItem}
                className="placeholder-action-btn browse-btn"
                title="Browse image"
            >
                📁
            </button>
        </div>
    );

    if (loading) return <div className="admin-about-loading">Loading...</div>;

    return (
        <div className="admin-about-page">
            <div className="admin-about-container">
                <div className="admin-about-card">
                    <div className="admin-about-header">
                        <h2>About Us</h2>
                    </div>

                    <div className="admin-about-form">
                        <div className="form-fields-left">
                            {Object.keys(formConfig).map(renderFormField)}
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
                                    <div className="image-placeholder-text">No image uploaded</div>
                                )}

                                <div className="image-bottom-left-content">
                                    <div className="image-actions">
                                        <button
                                            type="button"
                                            onClick={handleImageDelete}
                                            className="action-btn delete-btn"
                                            title="Delete image"
                                        >
                                            <img src={adminDeleteIcon} alt="Delete" className="action-icon" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleImageBrowse}
                                            className="action-btn refresh-btn"
                                            title="Browse image"
                                        >
                                            <img src={adminBrowseIcon} alt="Browse" className="action-icon" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="image-info">
                                *Yüklənən şəkil 318 x 387 ölçüsündə olmalıdır
                            </div>
                        </div>
                    </div>

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

            {/* About Carousel Section */}
            <div className="admin-about-container">
                <div className="admin-about-card">
                    <div className="carousel-section">
                        <div className="carousel-left">
                            <h2>About Carousel</h2>
                            <button
                                type="button"
                                onClick={handleAddCarouselItem}
                                className="add-certificate-btn"
                                title="Add carousel item"
                            >
                                + Add Certificate
                            </button>
                        </div>

                        <div className="carousel-right">
                            <div className="carousel-grid">
                                {carouselData.map(renderCarouselItem)}
                                {Array.from({ length: Math.max(0, 8 - carouselData.length) }, (_, index) =>
                                    renderEmptyPlaceholder(index)
                                )}
                            </div>

                            <div className="carousel-info-text">
                                *Yüklənən şəkil 347 x 224 ölçüsündə olmalıdır
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminAbout;
