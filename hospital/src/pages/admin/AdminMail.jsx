import React, { useState, useEffect } from 'react';
import { mailService } from '../../services/mailService';
import Swal from 'sweetalert2';
import './AdminMail.css';

const AdminMail = () => {
    const [mails, setMails] = useState([]);
    const [filteredMails, setFilteredMails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [mailCounts, setMailCounts] = useState({ total: 0, unread: 0, contacted: 0 });

    useEffect(() => {
        loadMails();
        loadMailCounts();
    }, []);

    useEffect(() => {
        filterMails();
    }, [mails, statusFilter]);

    const loadMails = async () => {
        try {
            setLoading(true);
            console.log('Loading mails...');
            const response = await mailService.getAllMails();
            console.log('Mail API response:', response);
            setMails(response || []);
        } catch (error) {
            console.error('Error loading mails:', error);
            Swal.fire({
                title: 'Xəta',
                text: 'Poçtları yükləmək mümkün olmadı',
                icon: 'error',
                showConfirmButton: false,
                timer: 3000
            });
            setMails([]);
        } finally {
            setLoading(false);
        }
    };

    const loadMailCounts = async () => {
        try {
            const response = await mailService.getMailCounts();
            const counts = response || { total: 0, unread: 0, read: 0, replied: 0, archived: 0 };
            // Convert to simplified counts: unread, contacted (read + replied), total
            setMailCounts({
                total: counts.total || 0,
                unread: counts.unread || 0,
                contacted: (counts.read || 0) + (counts.replied || 0)
            });
        } catch (error) {
            console.error('Error loading mail counts:', error);
            setMailCounts({ total: 0, unread: 0, contacted: 0 });
        }
    };

    const filterMails = () => {
        if (!mails || mails.length === 0) {
            setFilteredMails([]);
            return;
        }

        if (statusFilter === 'all') {
            setFilteredMails(mails);
        } else if (statusFilter === 'unread') {
            setFilteredMails(mails.filter(mail => mail.status === 'unread'));
        } else if (statusFilter === 'contacted') {
            setFilteredMails(mails.filter(mail => mail.status === 'read' || mail.status === 'replied'));
        }
    };

    const handleStatusChange = async (mailId, newStatus) => {
        try {
            await mailService.updateMailStatus(mailId, newStatus);
            await loadMails();
            await loadMailCounts();
            Swal.fire({
                title: 'Uğurlu',
                text: 'Poçt statusu uğurla yeniləndi',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000
            });
        } catch (error) {
            console.error('Error updating mail status:', error);
            Swal.fire({
                title: 'Xəta',
                text: 'Poçt statusunu yeniləmək mümkün olmadı',
                icon: 'error',
                showConfirmButton: false,
                timer: 3000
            });
        }
    };


    const handleDeleteMail = async (mailId) => {
        const result = await Swal.fire({
            title: 'Əminsiniz?',
            text: 'Bu poçt həmişəlik silinəcək!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Bəli, sil!'
        });

        if (result.isConfirmed) {
            try {
                await mailService.deleteMail(mailId);
                await loadMails();
                await loadMailCounts();
                Swal.fire({
                    title: 'Silindi!',
                    text: 'Poçt silindi.',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 2000
                });
            } catch (error) {
                console.error('Error deleting mail:', error);
                Swal.fire({
                    title: 'Xəta',
                    text: 'Poçtu silmək mümkün olmadı',
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 3000
                });
            }
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'unread': return 'status-badge unread';
            case 'read': return 'status-badge read';
            case 'replied': return 'status-badge replied';
            case 'archived': return 'status-badge archived';
            default: return 'status-badge';
        }
    };

    if (loading) {
        return (
            <div className="admin-mail-container">
                <div className="loading">Loading mails...</div>
            </div>
        );
    }

    return (
        <div className="admin-mail">
            <div className="admin-mail-header">
                <div className="admin-mail-title-section">
                    <h1>Poçt İdarəetməsi</h1>
                    <div className="admin-mail-stats">
                        <div className="stat-item unread">
                            <span className="stat-number">{mailCounts.unread}</span>
                            <span className="stat-label">Oxunmayan</span>
                        </div>
                        <div className="stat-item contacted">
                            <span className="stat-number">{mailCounts.contacted}</span>
                            <span className="stat-label">Əlaqə Saxlanılan</span>
                        </div>
                        <div className="stat-item total">
                            <span className="stat-number">{mailCounts.total}</span>
                            <span className="stat-label">Ümumi</span>
                        </div>
                    </div>
                </div>

                <div className="admin-mail-tabs">
                    <button
                        className={`tab-button ${statusFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('all')}
                    >
                        <span className="tab-icon">📧</span>
                        Bütün Poçtlar ({mailCounts.total})
                    </button>
                    <button
                        className={`tab-button ${statusFilter === 'unread' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('unread')}
                    >
                        <span className="tab-icon">⏳</span>
                        Oxunmayan ({mailCounts.unread})
                    </button>
                    <button
                        className={`tab-button ${statusFilter === 'contacted' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('contacted')}
                    >
                        <span className="tab-icon">✅</span>
                        Əlaqə Saxlanılan ({mailCounts.contacted})
                    </button>
                </div>
            </div>

            <div className="admin-mail-content">
                {loading ? (
                    <div className="admin-mail-loading">Yüklənir...</div>
                ) : !filteredMails || filteredMails.length === 0 ? (
                    <div className="admin-mail-empty">Poçt tapılmadı</div>
                ) : (
                    filteredMails.map((mail, index) => (
                        <div key={mail.id} className="admin-mail-card">
                            <div className="admin-mail-card-header">
                                <div className="mail-header-left">
                                    <h2>Poçt #{index + 1}</h2>
                                    <div className={`mail-status-badge ${mail.status === 'unread' ? 'unread' : 'contacted'}`}>
                                        {mail.status === 'unread' ? '⏳ Oxunmayan' : '✅ Əlaqə Saxlanılan'}
                                    </div>
                                </div>
                                <div className="admin-mail-card-actions">
                                    <div className="mail-status-select">
                                        <select
                                            value={mail.status}
                                            onChange={(e) => handleStatusChange(mail.id, e.target.value)}
                                            className="status-select"
                                        >
                                            <option value="unread">Oxunmayan</option>
                                            <option value="read">Əlaqə Saxlanılan</option>
                                        </select>
                                    </div>
                                    <div className="mail-action-buttons">
                                        <button
                                            onClick={() => handleDeleteMail(mail.id)}
                                            className="admin-mail-delete-btn"
                                            disabled={loading}
                                        >
                                            Sil
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="admin-mail-info">
                                <div className="mail-info-left">
                                    <div className="mail-info-item">
                                        <label>Ad:</label>
                                        <span>{mail.name}</span>
                                    </div>
                                    <div className="mail-info-item">
                                        <label>Soyad:</label>
                                        <span>{mail.surname}</span>
                                    </div>
                                    <div className="mail-info-item">
                                        <label>E-poçt:</label>
                                        <span>{mail.email}</span>
                                    </div>
                                    <div className="mail-info-item">
                                        <label>Telefon:</label>
                                        <span>{mail.phone}</span>
                                    </div>
                                </div>

                                <div className="mail-info-right">
                                    <div className="mail-info-item">
                                        <label>Mesaj:</label>
                                        <span className="mail-message-text">{mail.message}</span>
                                    </div>
                                    <div className="mail-info-item">
                                        <label>Yaradılma Tarixi:</label>
                                        <span>{formatDate(mail.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
};

export default AdminMail;
