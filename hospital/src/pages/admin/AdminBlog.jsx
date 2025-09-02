import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import adminDeleteIcon from '../../assets/admin-delete.png'
import adminBrowseIcon from '../../assets/admin-browse.png'
import blog1Image from '../../assets/blog1.png'
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

    // Fetch all blogs on component mount
    useEffect(() => {
        fetchBlogs();
    }, []);

    // Fetch all blogs from API
    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/blogs');
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



            const response = await fetch(`http://localhost:5000/api/blogs/${blogId}`, {
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
                        console.error('Failed to parse JSON response:', parseError);
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
                const errorText = await response.text();
                console.error('API Error Status:', response.status);
                console.error('API Error Response:', errorText);
                showAlert('error', 'Error!', `Failed to update blog. Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Save error:', error);
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
    const handleImageBrowse = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                setBlogData(prev => ({ ...prev, image: file.name }));
                showAlert('success', 'Image Selected!', `Image "${file.name}" selected. Don't forget to save changes!`);
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

        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {

                handleInlineInputChange(blogId, 'image', file.name);

                showAlert('success', 'Image Selected!', `Image "${file.name}" selected. Don't forget to save changes!`);
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



            const response = await fetch('http://localhost:5000/api/blogs', {
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
                const errorText = await response.text();
                console.error('Create blog error:', errorText);
                showAlert('error', 'Error!', 'Failed to create blog.');
            }
        } catch (error) {
            console.error('Create blog error:', error);
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
                    const response = await fetch(`http://localhost:5000/api/blogs/${blogId}`, {
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
                    {blogs.length === 0 ? (
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
                        blogs.map((blog) => {
                            const currentData = editingBlogs[blog.id] || blog;

                            return (
                                <div key={blog.id} className="admin-blog-card">
                                    <div className="admin-blog-header">
                                        <h2>Blog #{currentData.number}</h2>
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
                                                        src={currentData.image === 'blog1.png' ? blog1Image : `/src/assets/${currentData.image}`}
                                                        alt="Blog image"
                                                        className="current-image"
                                                        onError={(e) => {

                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="image-placeholder-text">
                                                        No image (API: {currentData.image || 'null'})
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
                                                    src={blogData.image === 'blog1.png' ? blog1Image : `/src/assets/${blogData.image}`}
                                                    alt="Blog image"
                                                    className="admin-blog-current-image"
                                                    onError={(e) => {

                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <div className="admin-blog-image-placeholder-text">
                                                    No image (Form: {blogData.image || 'null'})
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
