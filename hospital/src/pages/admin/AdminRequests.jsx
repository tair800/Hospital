import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { requestService } from '../../services/requestService';
import Pagination from '../../components/ui/Pagination';
import usePagination from '../../hooks/usePagination';
import './AdminRequests.css';

function AdminRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'completed'

    // Filter requests based on status
    const getFilteredRequests = () => {
        return requests.filter(request => request.status === activeTab);
    };

    // Get statistics
    const getStats = () => {
        const pending = requests.filter(r => r.status === 'pending').length;
        const completed = requests.filter(r => r.status === 'completed').length;
        return { pending, completed, total: requests.length };
    };

    // Get filtered requests for current tab
    const filteredRequests = getFilteredRequests();
    const stats = getStats();

    // Pagination hook
    const {
        currentPage,
        totalPages,
        currentItems: currentRequests,
        startIndex,
        endIndex,
        handlePageChange,
        handlePreviousPage,
        handleNextPage,
        resetPagination
    } = usePagination(filteredRequests, 1);

    // Fetch all requests on component mount
    useEffect(() => {
        fetchRequests();
    }, []);

    // Reset pagination when requests or activeTab change
    useEffect(() => {
        resetPagination();
    }, [requests, activeTab, resetPagination]);

    // Fetch all requests from API
    const fetchRequests = async () => {
        try {
            setLoading(true);
            const data = await requestService.getAllRequests();

            // Add status field if not present (for backward compatibility)
            const requestsWithStatus = data.map(request => ({
                ...request,
                status: request.status || 'pending' // Default to pending if no status
            }));

            // Sort requests by creation date (newest first)
            const sortedData = requestsWithStatus.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setRequests(sortedData);
        } catch (error) {
            console.error('Fetch requests error:', error);
            showAlert('error', 'Error!', 'Failed to fetch requests.');
        } finally {
            setLoading(false);
        }
    };

    // Show alert messages
    const showAlert = (icon, title, text) => {
        Swal.fire({
            icon,
            title,
            text,
            confirmButtonColor: '#1B1B3F',
            timer: 2000,
            showConfirmButton: false
        });
    };

    // Handle mark as done
    const handleMarkAsDone = async (requestId) => {
        try {
            const result = await Swal.fire({
                title: 'Mark as Done?',
                text: "This will mark the request as completed.",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#10b981',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Yes, mark as done!'
            });

            if (result.isConfirmed) {
                setLoading(true);

                // Update the request status in the database
                await requestService.updateRequestStatus(requestId, 'completed');

                // Update the local state
                const updatedRequests = requests.map(request =>
                    request.id === requestId
                        ? { ...request, status: 'completed', updatedAt: new Date().toISOString() }
                        : request
                );

                setRequests(updatedRequests);
                showAlert('success', 'Marked as Done!', 'Request has been marked as completed.');
            }
        } catch (error) {
            console.error('Mark as done error:', error);
            showAlert('error', 'Error!', 'Failed to mark request as done.');
        } finally {
            setLoading(false);
        }
    };

    // Handle mark as pending (for completed requests)
    const handleMarkAsPending = async (requestId) => {
        try {
            const result = await Swal.fire({
                title: 'Mark as Pending?',
                text: "This will move the request back to pending status.",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#f59e0b',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Yes, mark as pending!'
            });

            if (result.isConfirmed) {
                setLoading(true);

                // Update the request status in the database
                await requestService.updateRequestStatus(requestId, 'pending');

                // Update the local state
                const updatedRequests = requests.map(request =>
                    request.id === requestId
                        ? { ...request, status: 'pending', updatedAt: new Date().toISOString() }
                        : request
                );

                setRequests(updatedRequests);
                showAlert('success', 'Marked as Pending!', 'Request has been moved back to pending.');
            }
        } catch (error) {
            console.error('Mark as pending error:', error);
            showAlert('error', 'Error!', 'Failed to mark request as pending.');
        } finally {
            setLoading(false);
        }
    };

    // Handle delete request
    const handleDeleteRequest = async (requestId) => {
        try {
            const result = await Swal.fire({
                title: 'Delete Request?',
                text: "This will permanently delete the request. This action cannot be undone.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                setLoading(true);

                // Delete the request from the database
                await requestService.deleteRequest(requestId);

                // Update the local state by removing the deleted request
                const updatedRequests = requests.filter(request => request.id !== requestId);
                setRequests(updatedRequests);

                showAlert('success', 'Deleted!', 'Request has been permanently deleted.');
            }
        } catch (error) {
            console.error('Delete request error:', error);
            showAlert('error', 'Error!', 'Failed to delete request.');
        } finally {
            setLoading(false);
        }
    };


    // Format date for display
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('az-AZ', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    return (
        <div className="admin-requests">
            <div className="admin-requests-header">
                <div className="admin-requests-title-section">
                    <h1>Call Center - Requests Management</h1>
                    <div className="admin-requests-stats">
                        <div className="stat-item pending">
                            <span className="stat-number">{stats.pending}</span>
                            <span className="stat-label">Pending</span>
                        </div>
                        <div className="stat-item completed">
                            <span className="stat-number">{stats.completed}</span>
                            <span className="stat-label">Completed</span>
                        </div>
                        <div className="stat-item total">
                            <span className="stat-number">{stats.total}</span>
                            <span className="stat-label">Total</span>
                        </div>
                    </div>
                </div>

                <div className="admin-requests-tabs">
                    <button
                        className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
                        onClick={() => setActiveTab('pending')}
                    >
                        <span className="tab-icon">⏳</span>
                        Pending ({stats.pending})
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
                        onClick={() => setActiveTab('completed')}
                    >
                        <span className="tab-icon">✅</span>
                        Completed ({stats.completed})
                    </button>
                </div>
            </div>

            <div className="admin-requests-content">
                {loading ? (
                    <div className="admin-requests-loading">Loading...</div>
                ) : currentRequests.length === 0 ? (
                    <div className="admin-requests-empty">No requests found</div>
                ) : (
                    currentRequests.map((request, index) => {
                        return (
                            <div key={request.id} className="admin-requests-card">
                                <div className="admin-requests-card-header">
                                    <div className="request-header-left">
                                        <h2>Request #{startIndex + index + 1}</h2>
                                        <div className={`request-status-badge ${request.status}`}>
                                            {request.status === 'pending' ? '⏳ Pending' : '✅ Completed'}
                                        </div>
                                    </div>
                                    <div className="admin-requests-card-actions">
                                        {request.status === 'pending' ? (
                                            <button
                                                className="admin-requests-done-btn"
                                                onClick={() => handleMarkAsDone(request.id)}
                                                disabled={loading}
                                            >
                                                Mark as Done
                                            </button>
                                        ) : (
                                            <div className="admin-requests-completed-actions">
                                                <button
                                                    className="admin-requests-pending-btn"
                                                    onClick={() => handleMarkAsPending(request.id)}
                                                    disabled={loading}
                                                >
                                                    Mark as Pending
                                                </button>
                                                <button
                                                    className="admin-requests-delete-btn"
                                                    onClick={() => handleDeleteRequest(request.id)}
                                                    disabled={loading}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="admin-requests-info">
                                    <div className="request-info-left">
                                        <div className="request-info-item">
                                            <label>Name:</label>
                                            <span>{request.name}</span>
                                        </div>
                                        <div className="request-info-item">
                                            <label>Surname:</label>
                                            <span>{request.surname}</span>
                                        </div>
                                        <div className="request-info-item">
                                            <label>Email:</label>
                                            <span>{request.email}</span>
                                        </div>
                                        <div className="request-info-item">
                                            <label>Phone:</label>
                                            <span>{request.phone}</span>
                                        </div>
                                    </div>

                                    <div className="request-info-right">
                                        <div className="request-info-item">
                                            <label>Fin Code:</label>
                                            <span>{request.finCode}</span>
                                        </div>
                                        <div className="request-info-item">
                                            <label>Vezife:</label>
                                            <span>{request.vezife}</span>
                                        </div>
                                        <div className="request-info-item">
                                            <label>Created At:</label>
                                            <span>{formatDate(request.createdAt)}</span>
                                        </div>
                                       
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Pagination */}
            {currentRequests.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    onPreviousPage={handlePreviousPage}
                    onNextPage={handleNextPage}
                    startIndex={startIndex}
                    endIndex={endIndex}
                    totalItems={filteredRequests.length}
                    itemsPerPage={1}
                    showInfo={true}
                    className="admin-requests-pagination"
                />
            )}
        </div>
    );
}

export default AdminRequests;
