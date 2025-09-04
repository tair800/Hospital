import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import adminDeleteIcon from '../../assets/admin-delete.png'
import adminBrowseIcon from '../../assets/admin-browse.png'
import Pagination from '../../components/ui/Pagination'
import usePagination from '../../hooks/usePagination'
import './AdminSponsors.css'

function AdminSponsors() {
    const [logos, setLogos] = useState([]);
    const [logoData, setLogoData] = useState({
        name: '',
        image: ''
    });
    const [loading, setLoading] = useState(false);
    const [editingLogos, setEditingLogos] = useState({});
    const [showModal, setShowModal] = useState(false);

    // Pagination hook
    const {
        currentPage,
        totalPages,
        currentItems: currentLogos,
        startIndex,
        endIndex,
        handlePageChange,
        handlePreviousPage,
        handleNextPage,
        resetPagination
    } = usePagination(logos, 1);

    // Fetch all logos on component mount
    useEffect(() => {
        fetchLogos();
    }, []);

    // Reset pagination when logos change
    useEffect(() => {
        resetPagination();
    }, [logos, resetPagination]);

    // Fetch all logos from API
    const fetchLogos = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/logos');
            if (response.ok) {
                const data = await response.json();


                // Sort logos by ID
                const sortedData = data.sort((a, b) => a.id - b.id);
                setLogos(sortedData);

                // Initialize editing state for all logos
                const initialEditingState = {};
                sortedData.forEach(logo => {
                    initialEditingState[logo.id] = { ...logo };
                });
                setEditingLogos(initialEditingState);
            } else {
                showAlert('error', 'Error!', 'Failed to fetch logos.');
            }
        } catch (error) {
            console.error('Fetch logos error:', error);
            showAlert('error', 'Error!', 'Failed to fetch logos.');
        } finally {
            setLoading(false);
        }
    };

    // Helper function to get correct image path
    const getImagePath = (imageName) => {
        if (!imageName) return '';
        if (imageName.startsWith('/src/assets/')) return imageName;
        return `/src/assets/${imageName}`;
    };

    // Handle input changes for inline editing
    const handleInlineInputChange = (logoId, field, value) => {

        setEditingLogos(prev => ({
            ...prev,
            [logoId]: {
                ...prev[logoId],
                [field]: value
            }
        }));
    };

    // Save logo changes
    const saveLogo = async (logoId) => {
        try {
            setLoading(true);
            const editedData = editingLogos[logoId];



            const response = await fetch(`http://localhost:5000/api/logos/${logoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedData),
            });

            if (response.ok) {
                showAlert('success', 'Success!', 'Logo updated successfully!');
                // Don't refresh the list immediately to avoid disrupting user input
                // The user can manually refresh if needed
            } else {
                const errorText = await response.text();
                console.error('API Error:', response.status, errorText);
                showAlert('error', 'Error!', `Failed to update logo. Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Save error:', error);
            showAlert('error', 'Error!', 'Failed to save logo data.');
        } finally {
            setLoading(false);
        }
    };

    // Reset form to initial state
    const resetForm = () => {
        setLogoData({
            name: '',
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
    const handleImageBrowse = (field) => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                setLogoData(prev => ({ ...prev, [field]: file.name }));
                showAlert('success', 'Image Selected!', `Image "${file.name}" selected for ${field}. Don't forget to save changes!`);
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
                setLogoData(prev => ({ ...prev, [field]: '' }));
                showAlert('success', 'Deleted!', 'Image has been removed.');
            }
        });
    };

    // Handle inline image browse for existing logos
    const handleInlineImageBrowse = (logoId, field) => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                handleInlineInputChange(logoId, field, file.name);
                showAlert('success', 'Image Selected!', `Image "${file.name}" selected for ${field}. Don't forget to save changes!`);
            }
        };

        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    };

    // Handle inline image delete for existing logos
    const handleInlineImageDelete = (logoId, field) => {
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
                handleInlineInputChange(logoId, field, '');
                showAlert('success', 'Deleted!', 'Image has been removed.');
            }
        });
    };

    // Show alert messages
    const showAlert = (icon, title, text) => {
        Swal.fire({ icon, title, text, confirmButtonColor: '#1976d2', timer: 2000, showConfirmButton: false });
    };

    // Handle form submission (create new logo)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);



            const response = await fetch('http://localhost:5000/api/logos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(logoData),
            });

            if (response.ok) {
                const createdLogo = await response.json();

                showAlert('success', 'Success!', 'Logo created successfully!');
                closeModal();
                fetchLogos();
            } else {
                const errorText = await response.text();
                console.error('Create logo error:', errorText);
                showAlert('error', 'Error!', 'Failed to create logo.');
            }
        } catch (error) {
            console.error('Create logo error:', error);
            showAlert('error', 'Error!', 'Failed to save logo data.');
        } finally {
            setLoading(false);
        }
    };

    // Handle delete logo
    const handleDelete = async (logoId) => {
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
                    const response = await fetch(`http://localhost:5000/api/logos/${logoId}`, {
                        method: 'DELETE',
                    });

                    if (response.ok) {
                        showAlert('success', 'Deleted!', 'Logo has been deleted.');
                        fetchLogos();
                    } else {
                        showAlert('error', 'Error!', 'Failed to delete logo.');
                    }
                } catch (error) {
                    showAlert('error', 'Error!', 'Failed to delete logo.');
                }
            }
        });
    };

    if (loading) return <div className="admin-sponsors-loading">Loading...</div>;

    return (
        <div className="admin-sponsors-page">
            <div className="admin-sponsors-container">
                {/* Header with Create Button */}
                <div className="admin-sponsors-header">
                    <h1>Sponsor Logo Management</h1>
                    <div className="admin-sponsors-header-actions">
                        <button
                            className="admin-sponsors-create-btn"
                            onClick={openCreateModal}
                            title="Create new logo"
                        >
                            Create Logo
                        </button>
                    </div>
                </div>

                {/* Logos List */}
                <div className="admin-sponsors-list-section">
                    {logos.length === 0 ? (
                        <div className="admin-sponsors-no-logos">
                            <h3>No logos found</h3>
                            <p>Create your first sponsor logo to get started!</p>
                            <button
                                className="admin-sponsors-create-first-btn"
                                onClick={openCreateModal}
                            >
                                Create First Logo
                            </button>
                        </div>
                    ) : (
                        currentLogos.map((logo, index) => {
                            const currentData = editingLogos[logo.id] || logo;

                            return (
                                <div key={logo.id} className="admin-sponsors-card">
                                    <div className="admin-sponsors-card-header">
                                        <h2>Logo #{index + 1}</h2>
                                    </div>

                                    <div className="admin-sponsors-form">
                                        <div className="admin-sponsors-form-fields-left">
                                            <div className="admin-sponsors-form-group">
                                                <label>Logo Name</label>
                                                <input
                                                    type="text"
                                                    className="admin-sponsors-form-input"
                                                    value={currentData.name || ''}
                                                    onChange={(e) => handleInlineInputChange(logo.id, 'name', e.target.value)}
                                                    maxLength={100}
                                                    placeholder="Logo name"
                                                />
                                            </div>
                                        </div>

                                        <div className="admin-sponsors-image-section-right">
                                            <div className="admin-sponsors-image-section">
                                                <h3>Logo Image</h3>
                                                <div className="admin-sponsors-image-placeholder">
                                                    {currentData.image ? (
                                                        <img
                                                            src={getImagePath(currentData.image)}
                                                            alt="Logo image"
                                                            className="admin-sponsors-current-image"
                                                        />
                                                    ) : (
                                                        <div className="admin-sponsors-image-placeholder-text">No logo image</div>
                                                    )}
                                                    <div className="admin-sponsors-image-actions">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleInlineImageDelete(logo.id, 'image')}
                                                            className="admin-sponsors-action-btn admin-sponsors-delete-btn"
                                                            title="Delete logo image"
                                                        >
                                                            <img src={adminDeleteIcon} alt="Delete" className="admin-sponsors-action-icon" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleInlineImageBrowse(logo.id, 'image')}
                                                            className="admin-sponsors-action-btn admin-sponsors-browse-btn"
                                                            title="Browse logo image"
                                                        >
                                                            <img src={adminBrowseIcon} alt="Browse" className="admin-sponsors-action-icon" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="admin-sponsors-image-info">
                                                *Yüklənən şəkillər 318 x 387 ölçüsündə olmalıdır
                                            </div>
                                        </div>
                                    </div>

                                    <div className="admin-sponsors-form-actions">
                                        <button
                                            className="admin-sponsors-save-btn"
                                            onClick={() => saveLogo(logo.id)}
                                            disabled={loading}
                                            title="Save changes"
                                        >
                                            {loading ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                            className="admin-sponsors-delete-btn"
                                            onClick={() => handleDelete(logo.id)}
                                            title="Delete logo"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Pagination */}
                {logos.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        onPreviousPage={handlePreviousPage}
                        onNextPage={handleNextPage}
                        startIndex={startIndex}
                        endIndex={endIndex}
                        totalItems={logos.length}
                        itemsPerPage={1}
                        showInfo={true}
                        className="admin-sponsors-pagination"
                    />
                )}
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="admin-sponsors-modal-overlay" onClick={closeModal}>
                    <div className="admin-sponsors-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-sponsors-modal-header">
                            <h2>Create New Logo</h2>
                            <button
                                className="admin-sponsors-modal-close"
                                onClick={closeModal}
                            >
                                ×
                            </button>
                        </div>

                        <form className="admin-sponsors-modal-form" onSubmit={handleSubmit}>
                            <div className="admin-sponsors-modal-fields">
                                <div className="admin-sponsors-modal-left">
                                    <div className="admin-sponsors-form-group">
                                        <label htmlFor="name">Logo Name *</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            className="admin-sponsors-form-input"
                                            value={logoData.name}
                                            onChange={(e) => setLogoData(prev => ({ ...prev, name: e.target.value }))}
                                            maxLength={100}
                                            required
                                            placeholder="Enter logo name"
                                        />
                                    </div>
                                </div>

                                <div className="admin-sponsors-modal-right">
                                    {/* Image Section */}
                                    <div className="admin-sponsors-modal-image-section">
                                        <h3>Logo Image</h3>

                                        <div className="admin-sponsors-image-group">
                                            <label>Logo Image</label>
                                            <div className="admin-sponsors-image-placeholder">
                                                {logoData.image ? (
                                                    <img
                                                        src={getImagePath(logoData.image)}
                                                        alt="Logo image"
                                                        className="admin-sponsors-current-image"
                                                    />
                                                ) : (
                                                    <div className="admin-sponsors-image-placeholder-text">No logo image</div>
                                                )}
                                                <div className="admin-sponsors-image-actions">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleImageDelete('image')}
                                                        className="admin-sponsors-action-btn admin-sponsors-delete-btn"
                                                        title="Delete logo image"
                                                    >
                                                        <img src={adminDeleteIcon} alt="Delete" className="admin-sponsors-action-icon" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleImageBrowse('image')}
                                                        className="admin-sponsors-action-btn admin-sponsors-refresh-btn"
                                                        title="Browse logo image"
                                                    >
                                                        <img src={adminBrowseIcon} alt="Browse" className="admin-sponsors-action-icon" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="admin-sponsors-image-info">
                                            *Yüklənən şəkillər 318 x 387 ölçüsündə olmalıdır
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="admin-sponsors-modal-actions">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="admin-sponsors-cancel-btn"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="admin-sponsors-submit-btn"
                                >
                                    {loading ? 'Saving...' : 'Create Logo'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminSponsors;
