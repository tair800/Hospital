import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import adminDeleteIcon from '../../assets/admin-delete.png';
import adminBrowseIcon from '../../assets/admin-browse.png';
import './AdminAbout.css';

function AdminAbout() {
    const [aboutData, setAboutData] = useState({
        title: '',
        description: '',
        img: ''
    });
    const [carouselData, setCarouselData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch existing about data
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
                if (data.length > 0) {
                    setAboutData(data[0]);
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to fetch data. Please try again.',
                confirmButtonColor: '#1976d2'
            });
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
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'About page updated successfully!',
                    confirmButtonColor: '#1976d2',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Failed to update about page. Please try again.',
                    confirmButtonColor: '#1976d2'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to update about page. Please try again.',
                confirmButtonColor: '#1976d2'
            });
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
            setAboutData(prev => ({
                ...prev,
                img: ''
            }));
            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Image has been removed.',
                confirmButtonColor: '#1976d2',
                timer: 2000,
                showConfirmButton: false
            });
        }
    };

    const handleImageBrowse = () => {
        // Create a hidden file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                // For now, we'll just update the image name
                // In a real app, you'd upload the file to the server
                const fileName = file.name;
                setAboutData(prev => ({
                    ...prev,
                    img: fileName
                }));

                Swal.fire({
                    icon: 'success',
                    title: 'Image Selected!',
                    text: `Image "${fileName}" has been selected. Don't forget to save changes!`,
                    confirmButtonColor: '#1976d2'
                });
            }
        };

        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    };

    const fetchCarouselData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/aboutcarousel');
            if (response.ok) {
                const data = await response.json();
                setCarouselData(data);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to fetch carousel data.',
                confirmButtonColor: '#1976d2'
            });
        }
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
            if (result.isConfirmed) {
                addCarouselItem(result.value);
            }
        });
    };

    const addCarouselItem = async (itemData) => {
        try {
            // Construct the image path from the filename
            const imagePath = `/src/assets/${itemData.imageFile.name}`;

            const carouselData = {
                name: itemData.name,
                image: imagePath
            };

            const response = await fetch('http://localhost:5000/api/aboutcarousel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(carouselData),
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Carousel item added successfully!',
                    confirmButtonColor: '#1976d2',
                    timer: 2000,
                    showConfirmButton: false
                });
                fetchCarouselData(); // Refresh the list
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Failed to add carousel item.',
                    confirmButtonColor: '#1976d2'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to add carousel item.',
                confirmButtonColor: '#1976d2'
            });
        }
    };

    const handleRefreshCarousel = () => {
        fetchCarouselData();
        Swal.fire({
            icon: 'info',
            title: 'Refreshed!',
            text: 'Carousel data has been refreshed.',
            confirmButtonColor: '#1976d2',
            timer: 2000,
            showConfirmButton: false
        });
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
            if (result.isConfirmed) {
                updateCarouselItem(item.id, result.value);
            }
        });
    };

    const updateCarouselItem = async (id, itemData) => {
        try {
            // If a new image file is selected, construct the new path
            // Otherwise, keep the existing image path
            let imagePath = itemData.imageFile ? `/src/assets/${itemData.imageFile.name}` : undefined;

            const carouselData = {
                name: itemData.name
            };

            // Only include image if a new one was selected
            if (imagePath) {
                carouselData.image = imagePath;
            }

            const response = await fetch(`http://localhost:5000/api/aboutcarousel/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(carouselData),
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Carousel item updated successfully!',
                    confirmButtonColor: '#1976d2',
                    timer: 2000,
                    showConfirmButton: false
                });
                fetchCarouselData(); // Refresh the list
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Failed to update carousel item.',
                    confirmButtonColor: '#1976d2'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to update carousel item.',
                confirmButtonColor: '#1976d2'
            });
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
                const response = await fetch(`http://localhost:5000/api/aboutcarousel/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'Carousel item has been deleted.',
                        confirmButtonColor: '#1976d2',
                        timer: 2000,
                        showConfirmButton: false
                    });
                    fetchCarouselData(); // Refresh the list
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'Failed to delete carousel item.',
                        confirmButtonColor: '#1976d2'
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Failed to delete carousel item.',
                    confirmButtonColor: '#1976d2'
                });
            }
        }
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


                                {/* Show existing carousel items */}
                                {carouselData.map((item, index) => (
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
                                            <div className="image-fallback" style={{ display: 'none' }}>
                                                No Image
                                            </div>
                                            {/* Delete button for existing images */}
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
                                ))}

                                {/* Show empty placeholders for remaining slots (up to 8 total) */}
                                {Array.from({ length: Math.max(0, 8 - carouselData.length) }, (_, index) => (
                                    <div key={`empty-${index}`} className="carousel-placeholder">
                                        <div className="placeholder-number">#{carouselData.length + index + 1}</div>
                                        <div className="placeholder-icon">🖼️</div>
                                        <div className="placeholder-text">
                                            <span className="click-upload">Click to upload</span>
                                            <span className="drag-drop">or drag and drop</span>
                                        </div>
                                        {/* Browse button for empty placeholders */}
                                        <button
                                            type="button"
                                            onClick={handleAddCarouselItem}
                                            className="placeholder-action-btn browse-btn"
                                            title="Browse image"
                                        >
                                            📁
                                        </button>
                                    </div>
                                ))}
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
