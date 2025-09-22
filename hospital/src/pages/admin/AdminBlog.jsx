import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { getContextualImagePath } from '../../utils/imageUtils'
const adminDeleteIcon = '/assets/admin-delete.png'
const adminBrowseIcon = '/assets/admin-browse.png'
import Pagination from '../../components/ui/Pagination'
import usePagination from '../../hooks/usePagination'
import './AdminBlog.css'

function AdminBlog() {
    const [blogs, setBlogs] = useState([]);
    const [blogData, setBlogData] = useState({
        title: '',
        description: '',
        date: '',
        visitors: 0,
        secondDescTitle: '',
        secondDescBody: '',
        thirdTextTitle: '',
        thirdTextBody: '',
        image: ''
    });
    const [loading, setLoading] = useState(false);
    const [editingBlogs, setEditingBlogs] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredBlogs, setFilteredBlogs] = useState([]);

    // Pagination hook
    const {
        currentPage,
        totalPages,
        currentItems: currentBlogs,
        startIndex,
        endIndex,
        handlePageChange,
        handlePreviousPage,
        handleNextPage,
        resetPagination
    } = usePagination(filteredBlogs, 1);

    // Fetch all blogs on component mount
    useEffect(() => {
        fetchBlogs();
    }, []);

    // Filter blogs based on search term
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredBlogs(blogs);
        } else {
            const searchLower = searchTerm.toLowerCase();

            // First, get blogs whose titles start with the search term
            const startsWithTitle = blogs.filter(blog =>
                blog.title?.toLowerCase().startsWith(searchLower)
            );

            // Then, get blogs whose titles contain the search term (but don't start with it)
            const containsTitle = blogs.filter(blog =>
                blog.title?.toLowerCase().includes(searchLower) &&
                !blog.title?.toLowerCase().startsWith(searchLower)
            );

            // Finally, get blogs where other fields contain the search term
            const otherFields = blogs.filter(blog =>
                !blog.title?.toLowerCase().includes(searchLower) && (
                    blog.description?.toLowerCase().includes(searchLower) ||
                    blog.secondDescTitle?.toLowerCase().includes(searchLower) ||
                    blog.secondDescBody?.toLowerCase().includes(searchLower) ||
                    blog.thirdTextTitle?.toLowerCase().includes(searchLower) ||
                    blog.thirdTextBody?.toLowerCase().includes(searchLower) ||
                    blog.date?.toLowerCase().includes(searchLower)
                )
            );

            // Combine results in priority order: starts with title, contains title, other fields
            const filtered = [...startsWithTitle, ...containsTitle, ...otherFields];
            setFilteredBlogs(filtered);
        }
    }, [blogs, searchTerm]);

    // Reset pagination only when search term changes (not when blogs are updated)
    useEffect(() => {
        resetPagination();
    }, [searchTerm, resetPagination]);

    // Fetch all blogs from API
    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://localhost:5000/api/blogs');
            if (response.ok) {
                const data = await response.json();

                // Sort blogs by Number field numerically
                const sortedData = data.sort((a, b) => {
                    const numA = parseInt(a.number);
                    const numB = parseInt(b.number);
                    return numA - numB;
                });

                setBlogs(sortedData);
                // Initialize editing state for all blogs
                const initialEditingState = {};
                sortedData.forEach(blog => {
                    initialEditingState[blog.id] = { ...blog };
                });
                setEditingBlogs(initialEditingState);
            } else {
                showAlert('error', 'Error!', 'Failed to fetch blogs.');
            }
        } catch (error) {
            showAlert('error', 'Error!', 'Failed to fetch blogs.');
        } finally {
            setLoading(false);
        }
    };

    // Handle input changes for inline editing
    const handleInlineInputChange = (blogId, field, value) => {
        setEditingBlogs(prev => ({
            ...prev,
            [blogId]: {
                ...prev[blogId],
                [field]: value
            }
        }));
    };

    // Save blog changes
    const saveBlog = async (blogId) => {
        try {
            setLoading(true);
            const editedData = editingBlogs[blogId];

            // Format the date if it's a datetime-local value
            let dataToSend = { ...editedData };
            if (editedData.date && editedData.date.includes('T')) {
                dataToSend.date = formatDateToLetters(editedData.date);
            }



            const response = await fetch(`https://localhost:5000/api/blogs/${blogId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });



            if (response.ok) {
                // Check if response has content
                const responseText = await response.text();


                let responseData;
                if (responseText.trim()) {
                    try {
                        responseData = JSON.parse(responseText);

                    } catch (parseError) {
                        responseData = dataToSend; // Use the data we sent as fallback
                    }
                } else {

                    responseData = dataToSend;
                }

                showAlert('success', 'Success!', 'Blog updated successfully!');
                // Update the blogs state with the edited data
                setBlogs(prev => prev.map(blog =>
                    blog.id === blogId ? responseData : blog
                ));

                // Also update editingBlogs to sync with the response
                setEditingBlogs(prev => ({
                    ...prev,
                    [blogId]: responseData
                }));
            } else {
                showAlert('error', 'Error!', `Failed to update blog. Status: ${response.status}`);
            }
        } catch (error) {
            showAlert('error', 'Error!', 'Failed to save blog data.');
        } finally {
            setLoading(false);
        }
    };

    // Reset form to initial state
    const resetForm = () => {
        setBlogData({
            title: '',
            description: '',
            date: '',
            visitors: 0,
            secondDescTitle: '',
            secondDescBody: '',
            thirdTextTitle: '',
            thirdTextBody: '',
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
    const handleImageBrowse = async () => {
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

                    const response = await fetch('https://localhost:5000/api/ImageUpload/blog', {
                        method: 'POST',
                        body: formData
                    });

                    if (response.ok) {
                        const result = await response.json();
                        if (result.success) {
                            const imagePathWithTimestamp = `${result.filePath}?t=${Date.now()}`;
                            setBlogData(prev => ({ ...prev, image: imagePathWithTimestamp }));
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
    const handleImageDelete = () => {
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
                setBlogData(prev => ({ ...prev, image: '' }));
                showAlert('success', 'Deleted!', 'Image has been removed.');
            }
        });
    };

    // Handle inline image browse for existing blogs
    const handleInlineImageBrowse = (blogId) => {
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

                    const response = await fetch('https://localhost:5000/api/ImageUpload/blog', {
                        method: 'POST',
                        body: formData
                    });

                    if (response.ok) {
                        const result = await response.json();
                        if (result.success) {
                            const imagePathWithTimestamp = `${result.filePath}?t=${Date.now()}`;
                            handleInlineInputChange(blogId, 'image', imagePathWithTimestamp);
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

    // Handle inline image delete for existing blogs
    const handleInlineImageDelete = (blogId) => {
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
                handleInlineInputChange(blogId, 'image', '');
                showAlert('success', 'Deleted!', 'Image has been removed.');
            }
        });
    };

    // Show alert messages
    const showAlert = (icon, title, text) => {
        Swal.fire({ icon, title, text, confirmButtonColor: '#1976d2', timer: 2000, showConfirmButton: false });
    };

    // Format date to show month in letters (e.g., "14 January 2024")
    const formatDateToLetters = (dateTimeString) => {
        if (!dateTimeString) return '';

        const date = new Date(dateTimeString);
        const day = date.getDate();
        const month = date.toLocaleDateString('en-US', { month: 'long' });
        const year = date.getFullYear();

        return `${day} ${month} ${year}`;
    };

    // Handle form submission (create new blog)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            // Format the date to show month in letters
            const formattedDate = formatDateToLetters(blogData.date);

            // Ensure all blog fields including image are included
            const blogDataToSend = {
                ...blogData,
                date: formattedDate, // Use formatted date
                image: blogData.image || null // Ensure image field is included
            };



            const response = await fetch('https://localhost:5000/api/blogs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(blogDataToSend),
            });

            if (response.ok) {
                const createdBlog = await response.json();

                showAlert('success', 'Success!', 'Blog created successfully!');
                closeModal();
                fetchBlogs();
            } else {
                showAlert('error', 'Error!', 'Failed to create blog.');
            }
        } catch (error) {
            showAlert('error', 'Error!', 'Failed to save blog data.');
        } finally {
            setLoading(false);
        }
    };

    // Handle delete blog
    const handleDelete = async (blogId) => {
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
                    const response = await fetch(`https://localhost:5000/api/blogs/${blogId}`, {
                        method: 'DELETE',
                    });

                    if (response.ok) {
                        showAlert('success', 'Deleted!', 'Blog has been deleted.');
                        fetchBlogs();
                    } else {
                        showAlert('error', 'Error!', 'Failed to delete blog.');
                    }
                } catch (error) {
                    showAlert('error', 'Error!', 'Failed to delete blog.');
                }
            }
        });
    };

    if (loading) return <div className="admin-blog-loading">Loading...</div>;

    return (
        <div className="admin-blog-page">
            <div className="admin-blog-container">
                {/* Header with Create Button */}
                <div className="admin-blog-header">
                    <h1>Blog Management</h1>
                    <div className="admin-blog-header-actions">
                        <div className="admin-blog-search-container">
                            <input
                                type="text"
                                placeholder="Search blogs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="admin-blog-search-input"
                            />
                        </div>
                        <button
                            className="admin-blog-create-btn"
                            onClick={openCreateModal}
                            title="Create new blog"
                        >
                            Create Blog
                        </button>
                    </div>
                </div>

                {/* Blogs List */}
                <div className="admin-blog-list-section">
                    {filteredBlogs.length === 0 ? (
                        <div className="admin-blog-no-blogs">
                            <h3>No blogs found</h3>
                            <p>Create your first blog to get started!</p>
                            <button
                                className="admin-blog-create-first-btn"
                                onClick={openCreateModal}
                            >
                                Create First Blog
                            </button>
                        </div>
                    ) : (
                        currentBlogs.map((blog, index) => {
                            const currentData = editingBlogs[blog.id] || blog;
                            const blogNumber = startIndex + index + 1;

                            return (
                                <div key={blog.id} className="admin-blog-card">
                                    <div className="admin-blog-header">
                                        <h2>Blog #{blogNumber}</h2>
                                        <input
                                            type="text"
                                            className="admin-blog-inline-input"
                                            value={currentData.title || ''}
                                            onChange={(e) => handleInlineInputChange(blog.id, 'title', e.target.value)}
                                            maxLength={300}
                                            placeholder="Blog title"
                                        />
                                    </div>

                                    <div className="admin-blog-form">
                                        <div className="form-fields-left">
                                            <div className="form-group">
                                                <label>Blog Title</label>
                                                <div className="input-container">
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        value={currentData.title || ''}
                                                        onChange={(e) => handleInlineInputChange(blog.id, 'title', e.target.value)}
                                                        maxLength={300}
                                                        placeholder="Blog title"
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Publication Date & Time</label>
                                                <div className="input-container">
                                                    <input
                                                        type="datetime-local"
                                                        className="form-input"
                                                        value={currentData.date || ''}
                                                        onChange={(e) => handleInlineInputChange(blog.id, 'date', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Visitor Count</label>
                                                <div className="input-container">
                                                    <input
                                                        type="number"
                                                        className="form-input"
                                                        value={currentData.visitors}
                                                        onChange={(e) => handleInlineInputChange(blog.id, 'visitors', parseInt(e.target.value) || 0)}
                                                        min="0"
                                                        placeholder="Visitor count"
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Blog Description</label>
                                                <textarea
                                                    className="form-textarea"
                                                    value={currentData.description || ''}
                                                    onChange={(e) => handleInlineInputChange(blog.id, 'description', e.target.value)}
                                                    maxLength={500}
                                                    placeholder="Blog description"
                                                    rows={4}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Second Description Title</label>
                                                <div className="input-container">
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        value={currentData.secondDescTitle || ''}
                                                        onChange={(e) => handleInlineInputChange(blog.id, 'secondDescTitle', e.target.value)}
                                                        maxLength={200}
                                                        placeholder="Second description title"
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Second Description Body</label>
                                                <textarea
                                                    className="form-textarea"
                                                    value={currentData.secondDescBody || ''}
                                                    onChange={(e) => handleInlineInputChange(blog.id, 'secondDescBody', e.target.value)}
                                                    maxLength={1000}
                                                    placeholder="Second description body"
                                                    rows={4}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Third Text Title</label>
                                                <div className="input-container">
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        value={currentData.thirdTextTitle || ''}
                                                        onChange={(e) => handleInlineInputChange(blog.id, 'thirdTextTitle', e.target.value)}
                                                        maxLength={200}
                                                        placeholder="Third text title"
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Third Text Body</label>
                                                <textarea
                                                    className="form-textarea"
                                                    value={currentData.thirdTextBody || ''}
                                                    onChange={(e) => handleInlineInputChange(blog.id, 'thirdTextBody', e.target.value)}
                                                    maxLength={1000}
                                                    placeholder="Third text body"
                                                    rows={4}
                                                />
                                            </div>
                                        </div>

                                        <div className="image-section-right">
                                            <div className="image-placeholder">
                                                {currentData.image ? (
                                                    <img
                                                        src={getContextualImagePath(currentData.image, 'admin')}
                                                        alt="Blog image"
                                                        className="current-image"
                                                        key={currentData.image}
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="image-placeholder-text">
                                                        No image
                                                    </div>
                                                )}

                                                <div className="admin-blog-image-bottom-left-content">
                                                    <div className="image-actions">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleInlineImageDelete(blog.id)}
                                                            className="action-btn delete-btn"
                                                            title="Delete image"
                                                        >
                                                            <img src={adminDeleteIcon} alt="Delete" className="action-icon" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleInlineImageBrowse(blog.id)}
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
                                            className="admin-blog-save-btn"
                                            onClick={() => saveBlog(blog.id)}
                                            disabled={loading}
                                            title="Save changes"
                                        >
                                            {loading ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                            className="admin-blog-delete-btn"
                                            onClick={() => handleDelete(blog.id)}
                                            title="Delete blog"
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
                {filteredBlogs.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        onPreviousPage={handlePreviousPage}
                        onNextPage={handleNextPage}
                        startIndex={startIndex}
                        endIndex={endIndex}
                        totalItems={filteredBlogs.length}
                        itemsPerPage={1}
                        showInfo={true}
                        className="admin-blog-pagination"
                    />
                )}
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="admin-blog-modal-overlay" onClick={closeModal}>
                    <div className="admin-blog-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-blog-modal-header">
                            <h2>Create New Blog</h2>
                            <button
                                className="admin-blog-modal-close"
                                onClick={closeModal}
                            >
                                ×
                            </button>
                        </div>

                        <form className="admin-blog-modal-form" onSubmit={handleSubmit}>
                            <div className="admin-blog-modal-fields">
                                <div className="admin-blog-modal-left">
                                    {/* Basic Information */}
                                    <div className="admin-blog-form-group">
                                        <label htmlFor="title">Blog Title</label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            className="admin-blog-form-input"
                                            value={blogData.title}
                                            onChange={(e) => setBlogData(prev => ({ ...prev, title: e.target.value }))}
                                            maxLength={300}
                                            required
                                            placeholder="Enter blog title"
                                        />
                                    </div>

                                    <div className="admin-blog-form-group">
                                        <label htmlFor="date">Publication Date & Time</label>
                                        <input
                                            type="datetime-local"
                                            id="date"
                                            name="date"
                                            className="admin-blog-form-input"
                                            value={blogData.date}
                                            onChange={(e) => setBlogData(prev => ({ ...prev, date: e.target.value }))}
                                            required
                                        />
                                    </div>

                                    <div className="admin-blog-form-group">
                                        <label htmlFor="visitors">Visitor Count</label>
                                        <input
                                            type="number"
                                            id="visitors"
                                            name="visitors"
                                            className="admin-blog-form-input"
                                            value={blogData.visitors}
                                            onChange={(e) => setBlogData(prev => ({ ...prev, visitors: parseInt(e.target.value) || 0 }))}
                                            min="0"
                                            placeholder="Enter visitor count"
                                        />
                                    </div>

                                    <div className="admin-blog-form-group">
                                        <label htmlFor="description">Blog Description</label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            className="admin-blog-form-textarea"
                                            value={blogData.description}
                                            onChange={(e) => setBlogData(prev => ({ ...prev, description: e.target.value }))}
                                            maxLength={500}
                                            rows={4}
                                            placeholder="Enter blog description"
                                        />
                                    </div>
                                </div>

                                <div className="admin-blog-modal-right">
                                    {/* Second Description Section */}
                                    <div className="admin-blog-form-group">
                                        <label htmlFor="secondDescTitle">Second Description Title</label>
                                        <input
                                            type="text"
                                            id="secondDescTitle"
                                            name="secondDescTitle"
                                            className="admin-blog-form-input"
                                            value={blogData.secondDescTitle}
                                            onChange={(e) => setBlogData(prev => ({ ...prev, secondDescTitle: e.target.value }))}
                                            maxLength={200}
                                            placeholder="Enter second description title"
                                        />
                                    </div>

                                    <div className="admin-blog-form-group">
                                        <label htmlFor="secondDescBody">Second Description Body</label>
                                        <textarea
                                            id="secondDescBody"
                                            name="secondDescBody"
                                            className="admin-blog-form-textarea"
                                            value={blogData.secondDescBody}
                                            onChange={(e) => setBlogData(prev => ({ ...prev, secondDescBody: e.target.value }))}
                                            maxLength={1000}
                                            rows={4}
                                            placeholder="Enter second description body"
                                        />
                                    </div>

                                    {/* Third Text Section */}
                                    <div className="admin-blog-form-group">
                                        <label htmlFor="thirdTextTitle">Third Text Title</label>
                                        <input
                                            type="text"
                                            id="thirdTextTitle"
                                            name="thirdTextTitle"
                                            className="admin-blog-form-input"
                                            value={blogData.thirdTextTitle}
                                            onChange={(e) => setBlogData(prev => ({ ...prev, thirdTextTitle: e.target.value }))}
                                            maxLength={200}
                                            placeholder="Enter third text title"
                                        />
                                    </div>

                                    <div className="admin-blog-form-group">
                                        <label htmlFor="thirdTextBody">Third Text Body</label>
                                        <textarea
                                            id="thirdTextBody"
                                            name="thirdTextBody"
                                            className="admin-blog-form-textarea"
                                            value={blogData.thirdTextBody}
                                            onChange={(e) => setBlogData(prev => ({ ...prev, thirdTextBody: e.target.value }))}
                                            maxLength={1000}
                                            rows={4}
                                            placeholder="Enter third text body"
                                        />
                                    </div>

                                    {/* Image Section */}
                                    <div className="admin-blog-modal-image-section">
                                        <div className="admin-blog-image-placeholder">
                                            {blogData.image ? (
                                                <img
                                                    src={getContextualImagePath(blogData.image, 'admin')}
                                                    alt="Blog image"
                                                    className="admin-blog-current-image"
                                                    key={blogData.image}
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <div className="admin-blog-image-placeholder-text">
                                                    No image
                                                </div>
                                            )}

                                            <div className="admin-blog-image-bottom-left-content">
                                                <div className="admin-blog-image-actions">
                                                    <button
                                                        type="button"
                                                        onClick={handleImageDelete}
                                                        className="admin-blog-action-btn admin-blog-delete-btn"
                                                        title="Delete image"
                                                    >
                                                        <img src={adminDeleteIcon} alt="Delete" className="admin-blog-action-icon" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleImageBrowse}
                                                        className="admin-blog-action-btn admin-blog-refresh-btn"
                                                        title="Browse image"
                                                    >
                                                        <img src={adminBrowseIcon} alt="Browse" className="admin-blog-action-icon" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="admin-blog-image-info">
                                            *Yüklənən şəkil 318 x 387 ölçüsündə olmalıdır
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="admin-blog-modal-actions">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="admin-blog-cancel-btn"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="admin-blog-submit-btn"
                                >
                                    {loading ? 'Saving...' : 'Create Blog'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminBlog;
