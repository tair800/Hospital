import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getImagePath } from '../../utils/imageUtils';
import './AdminContact.css';

const AdminContact = () => {
    const [contactData, setContactData] = useState({
        phone: '',
        location: '',
        email: ''
    });

    const [socialMediaData, setSocialMediaData] = useState({
        whatsapp: '',
        facebook: '',
        instagram: '',
        telegram: '',
        youtube: ''
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Configuration for all contact types
    const contactConfig = {
        phone: { icon: 'phone-icon.png', label: 'Telehone', placeholder: '+(994) 50 xxx xx xx' },
        location: { icon: 'location-icon.png', label: 'Location', placeholder: 'Bakı, Azərbaycan' },
        email: { icon: 'mail-icon.png', label: 'Mail', placeholder: 'example@gmail.com' },
        whatsapp: { icon: 'whatsapp-icon.png', label: 'WhatsApp', placeholder: '+(994) 50 xxx xx xx' },
        facebook: { icon: 'facebook.png', label: 'Facebook', placeholder: 'link' },
        instagram: { icon: 'instagram.png', label: 'Instagram', placeholder: 'link' },
        telegram: { icon: 'telegram.png', label: 'Telegram', placeholder: 'link' },
        youtube: { icon: 'youtube.png', label: 'Youtube', placeholder: 'link' }
    };

    useEffect(() => {
        fetchAllContactData();
    }, []);

    const fetchAllContactData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/Contact');
            if (response.ok) {
                const contacts = await response.json();

                // Map contacts to state
                const mappedContactData = { phone: '', location: '', email: '' };
                const mappedSocialMediaData = { whatsapp: '', facebook: '', instagram: '', telegram: '', youtube: '' };

                contacts.forEach(contact => {
                    const type = contact.type?.toLowerCase();
                    if (mappedContactData.hasOwnProperty(type)) {
                        mappedContactData[type] = contact.value;
                    } else if (mappedSocialMediaData.hasOwnProperty(type)) {
                        mappedSocialMediaData[type] = contact.value;
                    }
                });

                setContactData(mappedContactData);
                setSocialMediaData(mappedSocialMediaData);
            }
        } catch (error) {
            // Error fetching contact data
        } finally {
            setLoading(false);
        }
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Get existing contacts
            const response = await fetch('http://localhost:5000/api/Contact');
            const existingContacts = await response.json();
            const existingMap = {};
            existingContacts.forEach(contact => {
                existingMap[contact.type] = contact;
            });

            let successCount = 0;
            let errorCount = 0;

            // Process all contact types
            const allContacts = { ...contactData, ...socialMediaData };

            for (const [type, value] of Object.entries(allContacts)) {
                if (!value) continue;

                const config = contactConfig[type];
                const existing = existingMap[type];
                const method = existing ? 'PUT' : 'POST';
                const url = existing ? `http://localhost:5000/api/Contact/${existing.id}` : 'http://localhost:5000/api/Contact';
                const body = existing
                    ? { id: existing.id, type, value, icon: config.icon }
                    : { type, value, icon: config.icon };

                try {
                    const apiResponse = await fetch(url, {
                        method,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body)
                    });

                    if (apiResponse.ok) {
                        successCount++;
                    } else {
                        errorCount++;
                    }
                } catch (error) {
                    errorCount++;
                }
            }

            // Show result
            if (errorCount === 0) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: `All information updated successfully. ${successCount} items processed.`
                });
                fetchAllContactData();
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Partial Success',
                    text: `${successCount} items updated successfully, ${errorCount} items failed.`
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to update information.'
            });
        } finally {
            setSubmitting(false);
        }
    };

    const renderInputField = (type, value, onChange, isContact = true) => {
        const config = contactConfig[type];
        const data = isContact ? contactData : socialMediaData;
        const setData = isContact ? setContactData : setSocialMediaData;

        return (
            <div className="form-group" key={type}>
                <label htmlFor={type}>{config.label}</label>
                <div className="input-container">
                    <input
                        type={type === 'email' ? 'email' : 'text'}
                        id={type}
                        className="form-input"
                        placeholder={config.placeholder}
                        value={value}
                        onChange={(e) => setData({ ...data, [type]: e.target.value })}
                        style={type === 'location' ? { fontFamily: 'Arial, sans-serif' } : {}}
                    />
                </div>
            </div>
        );
    };

    if (loading) {
        return <div className="admin-contact-loading">Loading contact information...</div>;
    }

    return (
        <div className="admin-contact-page">
            <div className="admin-contact-container">
                <div className="admin-contact-card">
                    <div className="admin-contact-header">
                        <h2>Contact</h2>
                    </div>

                    <form className="admin-contact-form" onSubmit={handleContactSubmit}>
                        <div className="form-fields-left">


                            {renderInputField('phone', contactData.phone, setContactData, true)}
                            {renderInputField('location', contactData.location, setContactData, true)}
                            {renderInputField('email', contactData.email, setContactData, true)}
                            {renderInputField('telegram', socialMediaData.telegram, setSocialMediaData, false)}
                        </div>

                        <div className="image-section-right">


                            {renderInputField('whatsapp', socialMediaData.whatsapp, setSocialMediaData, false)}
                            {renderInputField('facebook', socialMediaData.facebook, setSocialMediaData, false)}
                            {renderInputField('instagram', socialMediaData.instagram, setSocialMediaData, false)}
                            {renderInputField('youtube', socialMediaData.youtube, setSocialMediaData, false)}
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="submit-btn" disabled={submitting}>
                                {submitting ? 'Updating...' : 'Update All Information'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminContact;
