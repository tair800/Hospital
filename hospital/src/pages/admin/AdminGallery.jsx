import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { getContextualImagePath } from '../../utils/imageUtils'
const adminDeleteIcon = '/assets/admin-delete.png'
const adminBrowseIcon = '/assets/admin-browse.png'
import './AdminGallery.css'

function AdminGallery() {
    const [galleryData, setGalleryData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingGallery, setEditingGallery] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: ''
    });

    // Fetch all gallery items on component mount
    useEffect(() => {
        fetchGalleryData();
    }, []);

    // Fetch all gallery items from API
    const fetchGalleryData = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://ahpbca-api.webonly.io/api/gallery');
            if (response.ok) {
                const data = await response.json();


                // Sort by ID
                const sortedData = data.sort((a, b) => a.id - b.id);
                setGalleryData(sortedData);

                // Initialize editing state for all gallery items
                const initialEditingState = {};
                sortedData.forEach(item => {
                    initialEditingState[item.id] = { ...item };
                });
                setEditingGallery(initialEditingState);
            } else {
                showAlert('error', 'Error!', 'Failed to fetch gallery data.');
            }
        } catch (error) {
            showAlert('error', 'Error!', 'Failed to fetch gallery data.');
        } finally {
            setLoading(false);
        }
    };

    // Import the centralized image utility
    // getContextualImagePath is now imported from utils/imageUtils



    // Handle input changes for inline editing
    const handleInlineInputChange = (itemId, field, value) => {


        setEditingGallery(prev => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                [field]: value
            }
        }));
    };

    // Save gallery item changes
    const saveGalleryItem = async (itemId) => {
        try {
            setLoading(true);
            const editedData = editingGallery[itemId];



            const response = await fetch(`https://ahpbca-api.webonly.io/api/gallery/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedData),
            });

            if (response.ok) {
                showAlert('success', 'Success!', 'Gallery item updated successfully!');
                fetchGalleryData(); // Refresh the list
            } else {
                showAlert('error', 'Error!', `Failed to update gallery item. Status: ${response.status}`);
            }
        } catch (error) {
            showAlert('error', 'Error!', 'Failed to save gallery item data.');
        } finally {
            setLoading(false);
        }
    };

    // Reset form to initial state
    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            image: ''
        });
    };

    // Open create modal
    const openCreateModal = () => {
        resetForm();
        setShowModal(true);
    };

    // Close modal
    const closeModal = () => {
        setShowModal(false);
        resetForm();
    };

    // Handle image browse
    const handleImageBrowse = async (field) => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const formData = new FormData();
                    formData.append('file', file);

                    const response = await fetch('https://ahpbca-api.webonly.io/api/ImageUpload/gallery', {
                        method: 'POST',
                        body: formData
                    });

                    if (response.ok) {
                        const result = await response.json();
                        if (result.success) {
                            const imagePathWithTimestamp = `${result.filePath}?t=${Date.now()}`;
                            setFormData(prev => ({ ...prev, [field]: imagePathWithTimestamp }));
                            showAlert('success', 'Image Uploaded!', `Image "${file.name}" uploaded successfully!`);
                        } else {
                            showAlert('error', 'Upload Failed!', result.message || 'Failed to upload image.');
                        }
                    } else {
                        showAlert('error', 'Upload Failed!', 'Failed to upload image to server.');
                    }
                } catch (error) {
                    showAlert('error', 'Upload Failed!', 'Failed to upload image. Please try again.');
                }
            }
        };

        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    };

    // Handle image delete
    const handleImageDelete = (field) => {
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
                setFormData(prev => ({ ...prev, [field]: '' }));
                showAlert('success', 'Deleted!', 'Image has been removed.');
            }
        });
    };

    // Handle inline image browse for existing gallery items
    const handleInlineImageBrowse = (itemId, field) => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const formData = new FormData();
                    formData.append('file', file);

                    const response = await fetch('https://ahpbca-api.webonly.io/api/ImageUpload/gallery', {
                        method: 'POST',
                        body: formData
                    });

                    if (response.ok) {
                        const result = await response.json();
                        if (result.success) {
                            const imagePathWithTimestamp = `${result.filePath}?t=${Date.now()}`;
                            handleInlineInputChange(itemId, field, imagePathWithTimestamp);
                            showAlert('success', 'Image Uploaded!', `Image "${file.name}" uploaded successfully!`);
                        } else {
                            showAlert('error', 'Upload Failed!', result.message || 'Failed to upload image.');
                        }
                    } else {
                        showAlert('error', 'Upload Failed!', 'Failed to upload image to server.');
                    }
                } catch (error) {
                    showAlert('error', 'Upload Failed!', 'Failed to upload image. Please try again.');
                }
            }
        };

        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    };

    // Handle inline image delete for existing gallery items
    const handleInlineImageDelete = (itemId, field) => {
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
                handleInlineInputChange(itemId, field, '');
                showAlert('success', 'Deleted!', 'Image has been removed.');
            }
        });
    };

    // Show alert messages
    const showAlert = (icon, title, text) => {
        Swal.fire({ icon, title, text, confirmButtonColor: '#1976d2', timer: 2000, showConfirmButton: false });
    };

    // Handle form submission (create new gallery item)
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);



            const response = await fetch('https://ahpbca-api.webonly.io/api/gallery', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const createdItem = await response.json();

                showAlert('success', 'Success!', 'Gallery item created successfully!');
                closeModal();
                fetchGalleryData();
            } else {
                showAlert('error', 'Error!', 'Failed to create gallery item.');
            }
        } catch (error) {
            showAlert('error', 'Error!', 'Failed to save gallery item data.');
        } finally {
            setLoading(false);
        }
    };

    // Handle delete gallery item
    const handleDelete = async (itemId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`https://ahpbca-api.webonly.io/api/gallery/${itemId}`, {
                        method: 'DELETE',
                    });

                    if (response.ok) {
                        showAlert('success', 'Deleted!', 'Gallery item has been deleted.');
                        fetchGalleryData();
                    } else {
                        showAlert('error', 'Error!', 'Failed to delete gallery item.');
                    }
                } catch (error) {
                    showAlert('error', 'Error!', 'Failed to delete gallery item.');
                }
            }
        });
    };



    if (loading && galleryData.length === 0) return <div className="admin-gallery-loading">Loading...</div>;

    return (
        <div className="admin-gallery-page">
            <div className="admin-gallery-container">
                {/* Header with Create Button */}
                <div className="admin-gallery-header">
                    <h1>Gallery Management</h1>
                    <div className="admin-gallery-header-actions">
                        <button
                            className="admin-gallery-create-btn"
                            onClick={openCreateModal}
                            title="Create new gallery item"
                        >
                            Create Gallery Item
                        </button>
                    </div>
                </div>

                {/* Gallery Items List */}
                <div className="admin-gallery-list-section">
                    {galleryData.length === 0 ? (
                        <div className="admin-gallery-no-items">
                            <h3>No gallery items found</h3>
                            <p>Create your first gallery item to get started!</p>
                            <button
                                className="admin-gallery-create-first-btn"
                                onClick={openCreateModal}
                            >
                                Create First Item
                            </button>
                        </div>
                    ) : (
                        galleryData.map((item, index) => {
                            const currentData = editingGallery[item.id] || item;

                            return (
                                <div key={item.id} className="admin-gallery-card">
                                    <div className="admin-gallery-card-header">
                                        <h2>Gallery Item #{index + 1}</h2>
                                    </div>

                                    <div className="admin-gallery-form">
                                        <div className="admin-gallery-form-fields-left">
                                            <div className="admin-gallery-form-group">
                                                <label>Title</label>
                                                <input
                                                    type="text"
                                                    className="admin-gallery-form-input"
                                                    value={currentData.title || ''}
                                                    onChange={(e) => handleInlineInputChange(item.id, 'title', e.target.value)}
                                                    maxLength={200}
                                                    placeholder="Gallery item title"
                                                />
                                            </div>

                                            <div className="admin-gallery-form-group">
                                                <label>Description</label>
                                                <textarea
                                                    className="admin-gallery-form-textarea"
                                                    value={currentData.description || ''}
                                                    onChange={(e) => handleInlineInputChange(item.id, 'description', e.target.value)}
                                                    maxLength={500}
                                                    placeholder="Gallery item description"
                                                    rows={3}
                                                />
                                            </div>


                                        </div>

                                        <div className="admin-gallery-image-section-right">
                                            <div className="admin-gallery-image-section">
                                                <h3>Gallery Image</h3>
                                                <div className="admin-gallery-image-placeholder">
                                                    {currentData.image ? (
                                                        <img
                                                            src={getContextualImagePath(currentData.image, 'admin')}
                                                            alt="Gallery image"
                                                            className="admin-gallery-current-image"
                                                            key={currentData.image}
                                                        />
                                                    ) : (
                                                        <div className="admin-gallery-image-placeholder-text">No gallery image</div>
                                                    )}
                                                    <div className="admin-gallery-image-actions">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleInlineImageDelete(item.id, 'image')}
                                                            className="admin-gallery-action-btn admin-gallery-delete-btn"
                                                            title="Delete gallery image"
                                                        >
                                                            <img src={adminDeleteIcon} alt="Delete" className="admin-gallery-action-icon" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleInlineImageBrowse(item.id, 'image')}
                                                            className="admin-gallery-action-btn admin-gallery-browse-btn"
                                                            title="Browse gallery image"
                                                        >
                                                            <img src={adminBrowseIcon} alt="Browse" className="admin-gallery-action-icon" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="admin-gallery-image-info">
                                                *Yüklənən şəkillər 318 x 387 ölçüsündə olmalıdır
                                            </div>
                                        </div>
                                    </div>

                                    <div className="admin-gallery-form-actions">
                                        <button
                                            className="admin-gallery-save-btn"
                                            onClick={() => saveGalleryItem(item.id)}
                                            disabled={loading}
                                            title="Save changes"
                                        >
                                            {loading ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                            className="admin-gallery-delete-btn"
                                            onClick={() => handleDelete(item.id)}
                                            title="Delete gallery item"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="admin-gallery-modal-overlay" onClick={closeModal}>
                    <div className="admin-gallery-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-gallery-modal-header">
                            <h2>Create New Gallery Item</h2>
                            <button
                                className="admin-gallery-modal-close"
                                onClick={closeModal}
                            >
                                ×
                            </button>
                        </div>

                        <form className="admin-gallery-modal-form" onSubmit={handleSubmit}>
                            <div className="admin-gallery-modal-fields">
                                <div className="admin-gallery-modal-left">
                                    <div className="admin-gallery-form-group">
                                        <label htmlFor="title">Title *</label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            className="admin-gallery-form-input"
                                            value={formData.title}
                                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                            maxLength={200}
                                            required
                                            placeholder="Enter gallery item title"
                                        />
                                    </div>

                                    <div className="admin-gallery-form-group">
                                        <label htmlFor="description">Description</label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            className="admin-gallery-form-textarea"
                                            value={formData.description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                            maxLength={500}
                                            placeholder="Enter gallery item description"
                                            rows={3}
                                        />
                                    </div>




                                </div>

                                <div className="admin-gallery-modal-right">
                                    {/* Image Section */}
                                    <div className="admin-gallery-modal-image-section">
                                        <h3>Gallery Image</h3>

                                        <div className="admin-gallery-image-group">
                                            <label>Gallery Image *</label>
                                            <div className="admin-gallery-image-placeholder">
                                                {formData.image ? (
                                                    <img
                                                        src={getContextualImagePath(formData.image, 'admin')}
                                                        alt="Gallery image"
                                                        className="admin-gallery-current-image"
                                                        key={formData.image}
                                                    />
                                                ) : (
                                                    <div className="admin-gallery-image-placeholder-text">No gallery image</div>
                                                )}
                                                <div className="admin-gallery-image-actions">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleImageDelete('image')}
                                                        className="admin-gallery-action-btn admin-gallery-delete-btn"
                                                        title="Delete gallery image"
                                                    >
                                                        <img src={adminDeleteIcon} alt="Delete" className="admin-gallery-action-icon" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleImageBrowse('image')}
                                                        className="admin-gallery-action-btn admin-gallery-browse-btn"
                                                        title="Browse gallery image"
                                                    >
                                                        <img src={adminBrowseIcon} alt="Browse" className="admin-gallery-action-icon" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="admin-gallery-image-info">
                                            *Yüklənən şəkillər 318 x 387 ölçüsündə olmalıdır
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="admin-gallery-modal-actions">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="admin-gallery-cancel-btn"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !formData.title || !formData.image}
                                    className="admin-gallery-submit-btn"
                                >
                                    {loading ? 'Saving...' : 'Create Gallery Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminGallery;
