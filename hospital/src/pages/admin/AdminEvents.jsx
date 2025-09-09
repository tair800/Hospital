import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import { getImagePath } from '../../utils/imageUtils'
import adminDeleteIcon from '../../assets/admin-delete.png'
import adminBrowseIcon from '../../assets/admin-browse.png'
import Pagination from '../../components/ui/Pagination'
import usePagination from '../../hooks/usePagination'
import './AdminEvents.css'

function AdminEvents() {
    const [events, setEvents] = useState([]);
    const [eventData, setEventData] = useState({
        title: '',
        subtitle: '',
        description: '',
        longDescription: '',
        eventDate: '',
        time: '',
        venue: '',
        trainer: '',
        price: 0,
        currency: 'AZN',
        mainImage: '',
        detailImageLeft: '',
        detailImageMain: '',
        detailImageRight: '',
        isMain: false
    });
    const [loading, setLoading] = useState(false);
    const [editingEvents, setEditingEvents] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEvents, setFilteredEvents] = useState([]);

    // New state for event-related data
    const [eventSpeakers, setEventSpeakers] = useState({});
    const [eventTimeline, setEventTimeline] = useState({});
    const [eventEmployees, setEventEmployees] = useState({});
    const [allEmployees, setAllEmployees] = useState([]);
    const [showSpeakersModal, setShowSpeakersModal] = useState(false);
    const [showTimelineModal, setShowTimelineModal] = useState(false);
    const [showEmployeesModal, setShowEmployeesModal] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [newSpeaker, setNewSpeaker] = useState({ name: '', title: '', image: '' });
    const [newTimelineSlot, setNewTimelineSlot] = useState({
        startTime: '',
        endTime: '',
        title: '',
        description: '',
        info: '',
        orderIndex: 1
    });

    // Pagination hook
    const {
        currentPage,
        totalPages,
        currentItems: currentEvents,
        startIndex,
        endIndex,
        handlePageChange,
        handlePreviousPage,
        handleNextPage,
        resetPagination
    } = usePagination(filteredEvents, 1);

    // Fetch all events on component mount
    useEffect(() => {
        fetchEvents();
        fetchAllEmployees();
    }, []);

    // Filter events based on search term
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredEvents(events);
        } else {
            const searchLower = searchTerm.toLowerCase();

            // First, get events whose titles start with the search term
            const startsWithTitle = events.filter(event =>
                event.title?.toLowerCase().startsWith(searchLower)
            );

            // Then, get events whose titles contain the search term (but don't start with it)
            const containsTitle = events.filter(event =>
                event.title?.toLowerCase().includes(searchLower) &&
                !event.title?.toLowerCase().startsWith(searchLower)
            );

            // Finally, get events where other fields contain the search term
            const otherFields = events.filter(event =>
                !event.title?.toLowerCase().includes(searchLower) && (
                    event.subtitle?.toLowerCase().includes(searchLower) ||
                    event.description?.toLowerCase().includes(searchLower) ||
                    event.longDescription?.toLowerCase().includes(searchLower) ||
                    event.venue?.toLowerCase().includes(searchLower) ||
                    event.trainer?.toLowerCase().includes(searchLower) ||
                    event.eventDate?.toLowerCase().includes(searchLower) ||
                    event.time?.toLowerCase().includes(searchLower)
                )
            );

            // Combine results in priority order: starts with title, contains title, other fields
            const filtered = [...startsWithTitle, ...containsTitle, ...otherFields];
            setFilteredEvents(filtered);
        }
    }, [events, searchTerm]);

    // Reset pagination when filtered events change
    useEffect(() => {
        resetPagination();
    }, [filteredEvents, resetPagination]);

    // Fetch all events from API
    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/events');
            if (response.ok) {
                const data = await response.json();


                // Sort events by event date (newest first)
                const sortedData = data.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
                setEvents(sortedData);

                // Initialize editing state for all events
                const initialEditingState = {};
                sortedData.forEach(event => {
                    initialEditingState[event.id] = { ...event };
                });
                setEditingEvents(initialEditingState);
            } else {
                showAlert('error', 'Error!', 'Failed to fetch events.');
            }
        } catch (error) {
            showAlert('error', 'Error!', 'Failed to fetch events.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch all employees
    const fetchAllEmployees = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/employees');
            if (response.ok) {
                const data = await response.json();
                setAllEmployees(data);
            }
        } catch (error) {
            console.error('Failed to fetch employees:', error);
        }
    };

    // Fetch event speakers
    const fetchEventSpeakers = async (eventId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/eventspeakers/event/${eventId}`);
            if (response.ok) {
                const data = await response.json();
                setEventSpeakers(prev => ({ ...prev, [eventId]: data }));
            }
        } catch (error) {
            console.error('Failed to fetch speakers:', error);
        }
    };

    // Fetch event timeline
    const fetchEventTimeline = async (eventId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/eventtimeline/event/${eventId}`);
            if (response.ok) {
                const data = await response.json();
                setEventTimeline(prev => ({ ...prev, [eventId]: data }));
            }
        } catch (error) {
            console.error('Failed to fetch timeline:', error);
        }
    };

    // Fetch event employees
    const fetchEventEmployees = async (eventId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/eventemployees/event/${eventId}`);
            if (response.ok) {
                const data = await response.json();
                setEventEmployees(prev => ({ ...prev, [eventId]: data }));
            }
        } catch (error) {
            console.error('Failed to fetch employees:', error);
        }
    };

    // Add new speaker
    const addSpeaker = async (eventId) => {
        try {
            const response = await fetch('http://localhost:5000/api/eventspeakers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newSpeaker, eventId })
            });

            if (response.ok) {
                showAlert('success', 'Success!', 'Speaker added successfully!');
                fetchEventSpeakers(eventId);
                setNewSpeaker({ name: '', title: '', image: '' });
            } else {
                showAlert('error', 'Error!', 'Failed to add speaker.');
            }
        } catch (error) {
            showAlert('error', 'Error!', 'Failed to add speaker.');
        }
    };

    // Add new timeline slot
    const addTimelineSlot = async (eventId) => {
        try {
            const response = await fetch('http://localhost:5000/api/eventtimeline', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newTimelineSlot, eventId })
            });

            if (response.ok) {
                showAlert('success', 'Success!', 'Timeline slot added successfully!');
                fetchEventTimeline(eventId);
                setNewTimelineSlot({
                    startTime: '',
                    endTime: '',
                    title: '',
                    description: '',
                    info: '',
                    orderIndex: 1
                });
            } else {
                showAlert('error', 'Error!', 'Failed to add timeline slot.');
            }
        } catch (error) {
            showAlert('error', 'Error!', 'Failed to add timeline slot.');
        }
    };

    // Add employee to event
    const addEmployeeToEvent = async (eventId, employeeId) => {
        try {
            const response = await fetch('http://localhost:5000/api/eventemployees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventId, employeeId })
            });

            if (response.ok) {
                showAlert('success', 'Success!', 'Employee added to event!');
                fetchEventEmployees(eventId);
            } else {
                showAlert('error', 'Error!', 'Failed to add employee to event.');
            }
        } catch (error) {
            showAlert('error', 'Error!', 'Failed to add employee to event.');
        }
    };

    // Remove speaker
    const removeSpeaker = async (speakerId, eventId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/eventspeakers/${speakerId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                showAlert('success', 'Success!', 'Speaker removed successfully!');
                fetchEventSpeakers(eventId);
            } else {
                showAlert('error', 'Error!', 'Failed to remove speaker.');
            }
        } catch (error) {
            showAlert('error', 'Error!', 'Failed to remove speaker.');
        }
    };

    // Remove timeline slot
    const removeTimelineSlot = async (timelineId, eventId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/eventtimeline/${timelineId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                showAlert('success', 'Success!', 'Timeline slot removed successfully!');
                fetchEventTimeline(eventId);
            } else {
                showAlert('error', 'Error!', 'Failed to remove timeline slot.');
            }
        } catch (error) {
            showAlert('error', 'Error!', 'Failed to remove timeline slot.');
        }
    };

    // Remove employee from event
    const removeEmployeeFromEvent = async (eventEmployeeId, eventId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/eventemployees/${eventEmployeeId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                showAlert('success', 'Success!', 'Employee removed from event!');
                fetchEventEmployees(eventId);
            } else {
                showAlert('error', 'Error!', 'Failed to remove employee from event.');
            }
        } catch (error) {
            showAlert('error', 'Error!', 'Failed to remove employee from event.');
        }
    };

    // Helper function to safely format date
    const formatDateSafely = (dateString, timeString = '00:00') => {
        try {
            if (!dateString) return '';
            const dateToFormat = dateString.includes('T') ? dateString : `${dateString}T${timeString}`;
            const date = new Date(dateToFormat);
            if (isNaN(date.getTime())) return '';
            return date.toISOString().split('T')[0];
        } catch (error) {
            return '';
        }
    };


    // Handle input changes for inline editing
    const handleInlineInputChange = (eventId, field, value) => {

        setEditingEvents(prev => ({
            ...prev,
            [eventId]: {
                ...prev[eventId],
                [field]: value
            }
        }));
    };

    // Save event changes
    const saveEvent = async (eventId) => {
        try {
            setLoading(true);
            const editedData = editingEvents[eventId];

            // Format the date safely
            let dataToSend = { ...editedData };
            if (editedData.eventDate) {
                try {
                    const dateToFormat = editedData.eventDate.includes('T') ? editedData.eventDate : `${editedData.eventDate}T${editedData.time || '00:00'}`;
                    const formattedDate = new Date(dateToFormat);
                    if (!isNaN(formattedDate.getTime())) {
                        dataToSend.eventDate = formattedDate.toISOString();
                    }
                } catch (error) {
                    // Keep original date if formatting fails
                }
            }



            const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                showAlert('success', 'Success!', 'Event updated successfully!');
            } else {
                showAlert('error', 'Error!', `Failed to update event. Status: ${response.status}`);
            }
        } catch (error) {
            showAlert('error', 'Error!', 'Failed to save event data.');
        } finally {
            setLoading(false);
        }
    };

    // Reset form to initial state
    const resetForm = () => {
        setEventData({
            title: '',
            subtitle: '',
            description: '',
            longDescription: '',
            eventDate: '',
            time: '',
            venue: '',
            trainer: '',
            price: 0,
            currency: 'AZN',
            mainImage: '',
            detailImageLeft: '',
            detailImageMain: '',
            detailImageRight: '',
            isMain: false
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
                setEventData(prev => ({ ...prev, [field]: file.name }));
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
                setEventData(prev => ({ ...prev, [field]: '' }));
                showAlert('success', 'Deleted!', 'Image has been removed.');
            }
        });
    };

    // Handle inline image browse for existing events
    const handleInlineImageBrowse = (eventId, field) => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                handleInlineInputChange(eventId, field, file.name);
                showAlert('success', 'Image Selected!', `Image "${file.name}" selected for ${field}. Don't forget to save changes!`);
            }
        };

        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    };

    // Handle inline image delete for existing events
    const handleInlineImageDelete = (eventId, field) => {
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
                handleInlineInputChange(eventId, field, '');
                showAlert('success', 'Deleted!', 'Image has been removed.');
            }
        });
    };

    // Show alert messages
    const showAlert = (icon, title, text) => {
        Swal.fire({ icon, title, text, confirmButtonColor: '#1976d2', timer: 2000, showConfirmButton: false });
    };

    // Handle form submission (create new event)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            // Format the date and time safely
            let eventDateToSend = '';
            try {
                if (eventData.eventDate && eventData.time) {
                    const combinedDateTime = `${eventData.eventDate.split('T')[0]}T${eventData.time}`;
                    const date = new Date(combinedDateTime);
                    if (!isNaN(date.getTime())) {
                        eventDateToSend = date.toISOString();
                    }
                }
            } catch (error) {
                // Date formatting failed, keep original
            }

            const eventDataToSend = {
                ...eventData,
                eventDate: eventDateToSend
            };



            const response = await fetch('http://localhost:5000/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventDataToSend),
            });

            if (response.ok) {
                const createdEvent = await response.json();

                showAlert('success', 'Success!', 'Event created successfully!');
                closeModal();
                fetchEvents();
            } else {
                showAlert('error', 'Error!', 'Failed to create event.');
            }
        } catch (error) {
            showAlert('error', 'Error!', 'Failed to save event data.');
        } finally {
            setLoading(false);
        }
    };

    // Handle delete event
    const handleDelete = async (eventId) => {
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
                    const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
                        method: 'DELETE',
                    });

                    if (response.ok) {
                        showAlert('success', 'Deleted!', 'Event has been deleted.');
                        fetchEvents();
                    } else {
                        showAlert('error', 'Error!', 'Failed to delete event.');
                    }
                } catch (error) {
                    showAlert('error', 'Error!', 'Failed to delete event.');
                }
            }
        });
    };

    // Toggle main status
    const toggleMainStatus = async (eventId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/events/${eventId}/toggle-main`, {
                method: 'PATCH',
            });

            if (response.ok) {
                const result = await response.json();
                showAlert('success', 'Success!', `Event ${result.isMain ? 'marked as main' : 'unmarked as main'}.`);
                fetchEvents();
            } else {
                showAlert('error', 'Error!', 'Failed to toggle main status.');
            }
        } catch (error) {
            showAlert('error', 'Error!', 'Failed to toggle main status.');
        }
    };

    // Open management modals
    const openSpeakersModal = (eventId) => {
        setSelectedEventId(eventId);
        fetchEventSpeakers(eventId);
        setShowSpeakersModal(true);
    };

    const openTimelineModal = (eventId) => {
        setSelectedEventId(eventId);
        fetchEventTimeline(eventId);
        setShowTimelineModal(true);
    };

    const openEmployeesModal = (eventId) => {
        setSelectedEventId(eventId);
        fetchEventEmployees(eventId);
        setShowEmployeesModal(true);
    };

    const closeModals = () => {
        setShowSpeakersModal(false);
        setShowTimelineModal(false);
        setShowEmployeesModal(false);
        setSelectedEventId(null);
    };



    if (loading) return <div className="admin-events-loading">Loading...</div>;

    return (
        <div className="admin-events-page">
            <div className="admin-events-container">
                {/* Header with Create Button */}
                <div className="admin-events-header">
                    <h1>Event Management</h1>
                    <div className="admin-events-header-actions">
                        <div className="admin-events-search-container">
                            <input
                                type="text"
                                placeholder="Search events..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="admin-events-search-input"
                            />
                        </div>
                        <Link
                            to="/admin/requests"
                            className="admin-events-requests-btn"
                            title="View requests"
                        >
                            View Requests
                        </Link>
                        <button
                            className="admin-events-create-btn"
                            onClick={openCreateModal}
                            title="Create new event"
                        >
                            Create Event
                        </button>
                    </div>
                </div>

                {/* Events List */}
                <div className="admin-events-list-section">
                    {filteredEvents.length === 0 ? (
                        <div className="admin-events-no-events">
                            <h3>No events found</h3>
                            <p>Create your first event to get started!</p>
                            <button
                                className="admin-events-create-first-btn"
                                onClick={openCreateModal}
                            >
                                Create First Event
                            </button>
                        </div>
                    ) : (
                        currentEvents.map((event, index) => {
                            const currentData = editingEvents[event.id] || event;
                            // Safely create date object with fallback
                            let eventDate;
                            try {
                                eventDate = new Date(currentData.eventDate);
                                if (isNaN(eventDate.getTime())) {
                                    eventDate = new Date(); // Fallback to current date if invalid
                                }
                            } catch (error) {
                                eventDate = new Date(); // Fallback to current date if error
                            }

                            return (
                                <div key={event.id} className="admin-events-card">
                                    <div className="admin-events-card-header">
                                        <h2>Event #{index + 1}</h2>
                                        <div className="admin-events-status-buttons">
                                            <button
                                                className="admin-events-management-btn speakers-btn"
                                                onClick={() => openSpeakersModal(event.id)}
                                                title="Manage speakers"
                                            >
                                                Speakers ({eventSpeakers[event.id]?.length || 0})
                                            </button>
                                            <button
                                                className="admin-events-management-btn timeline-btn"
                                                onClick={() => openTimelineModal(event.id)}
                                                title="Manage timeline"
                                            >
                                                Timeline ({eventTimeline[event.id]?.length || 0})
                                            </button>
                                            <button
                                                className="admin-events-management-btn employees-btn"
                                                onClick={() => openEmployeesModal(event.id)}
                                                title="Manage employees"
                                            >
                                                Employees ({eventEmployees[event.id]?.length || 0})
                                            </button>
                                            <button
                                                className={`admin-events-status-btn ${currentData.isMain ? 'active' : ''}`}
                                                onClick={() => toggleMainStatus(event.id)}
                                                title={currentData.isMain ? 'Unmark as main' : 'Mark as main'}
                                            >
                                                {currentData.isMain ? 'Main Event' : 'Mark as Main'}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="admin-events-form">
                                        <div className="form-fields-left">
                                            <div className="form-group">
                                                <label>Event Title</label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    value={currentData.title || ''}
                                                    onChange={(e) => handleInlineInputChange(event.id, 'title', e.target.value)}
                                                    maxLength={200}
                                                    placeholder="Event title"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Subtitle</label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    value={currentData.subtitle || ''}
                                                    onChange={(e) => handleInlineInputChange(event.id, 'subtitle', e.target.value)}
                                                    maxLength={300}
                                                    placeholder="Event subtitle"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Event Date</label>
                                                <input
                                                    type="date"
                                                    className="form-input"
                                                    value={(() => {
                                                        // For editing, use the raw date value to avoid reformatting issues
                                                        if (currentData.eventDate) {
                                                            if (currentData.eventDate.includes('T')) {
                                                                return currentData.eventDate.split('T')[0];
                                                            }
                                                            return currentData.eventDate;
                                                        }
                                                        return '';
                                                    })()}
                                                    onChange={(e) => {

                                                        const currentTime = currentData.time || '00:00';
                                                        const newDateTime = `${e.target.value}T${currentTime}`;

                                                        handleInlineInputChange(event.id, 'eventDate', newDateTime);
                                                    }}
                                                    required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Event Time</label>
                                                <input
                                                    type="time"
                                                    className="form-input"
                                                    value={currentData.time || ''}
                                                    onChange={(e) => handleInlineInputChange(event.id, 'time', e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Venue</label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    value={currentData.venue || ''}
                                                    onChange={(e) => handleInlineInputChange(event.id, 'venue', e.target.value)}
                                                    maxLength={200}
                                                    placeholder="Event venue"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Trainer</label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    value={currentData.trainer || ''}
                                                    onChange={(e) => handleInlineInputChange(event.id, 'trainer', e.target.value)}
                                                    maxLength={100}
                                                    placeholder="Event trainer"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Price</label>
                                                <div className="price-input-group">
                                                    <input
                                                        type="number"
                                                        className="form-input price-input"
                                                        value={currentData.price || 0}
                                                        onChange={(e) => handleInlineInputChange(event.id, 'price', parseInt(e.target.value) || 0)}
                                                        min="0"
                                                        step="1"
                                                        placeholder="Event price"
                                                    />
                                                    <select
                                                        className="currency-select"
                                                        value={currentData.currency || 'AZN'}
                                                        onChange={(e) => handleInlineInputChange(event.id, 'currency', e.target.value)}
                                                    >
                                                        <option value="AZN">AZN</option>
                                                        <option value="USD">USD</option>
                                                        <option value="EUR">EUR</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Description</label>
                                                <textarea
                                                    className="form-textarea"
                                                    value={currentData.description || ''}
                                                    onChange={(e) => handleInlineInputChange(event.id, 'description', e.target.value)}
                                                    maxLength={1000}
                                                    placeholder="Event description"
                                                    rows={4}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Long Description</label>
                                                <textarea
                                                    className="form-textarea"
                                                    value={currentData.longDescription || ''}
                                                    onChange={(e) => handleInlineInputChange(event.id, 'longDescription', e.target.value)}
                                                    placeholder="Detailed event description"
                                                    rows={4}
                                                />
                                            </div>
                                        </div>

                                        <div className="image-section-right">
                                            <div className="image-section">
                                                <h3>Main Image</h3>
                                                <div className="image-placeholder">
                                                    {currentData.mainImage ? (
                                                        <img
                                                            src={getImagePath(currentData.mainImage)}
                                                            alt="Main image"
                                                            className="current-image"
                                                        />
                                                    ) : (
                                                        <div className="image-placeholder-text">No main image</div>
                                                    )}
                                                    <div className="image-actions">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleInlineImageDelete(event.id, 'mainImage')}
                                                            className="action-btn delete-btn"
                                                            title="Delete main image"
                                                        >
                                                            <img src={adminDeleteIcon} alt="Delete" className="action-icon" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleInlineImageBrowse(event.id, 'mainImage')}
                                                            className="action-btn refresh-btn"
                                                            title="Browse main image"
                                                        >
                                                            <img src={adminBrowseIcon} alt="Browse" className="action-icon" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="image-section">
                                                <h3>Detail Images</h3>
                                                <div className="detail-images-grid">
                                                    <div className="detail-image-item">
                                                        <label>Left Image</label>
                                                        <div className="image-placeholder small">
                                                            {currentData.detailImageLeft ? (
                                                                <img
                                                                    src={getImagePath(currentData.detailImageLeft)}
                                                                    alt="Left detail image"
                                                                    className="current-image"
                                                                />
                                                            ) : (
                                                                <div className="image-placeholder-text">No image</div>
                                                            )}
                                                            <div className="image-actions">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleInlineImageDelete(event.id, 'detailImageLeft')}
                                                                    className="action-btn delete-btn small"
                                                                    title="Delete left image"
                                                                >
                                                                    <img src={adminDeleteIcon} alt="Delete" className="action-icon" />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleInlineImageBrowse(event.id, 'detailImageLeft')}
                                                                    className="action-btn refresh-btn small"
                                                                    title="Browse left image"
                                                                >
                                                                    <img src={adminBrowseIcon} alt="Browse" className="action-icon" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="detail-image-item">
                                                        <label>Main Detail Image</label>
                                                        <div className="image-placeholder small">
                                                            {currentData.detailImageMain ? (
                                                                <img
                                                                    src={getImagePath(currentData.detailImageMain)}
                                                                    alt="Main detail image"
                                                                    className="current-image"
                                                                />
                                                            ) : (
                                                                <div className="image-placeholder-text">No image</div>
                                                            )}
                                                            <div className="image-actions">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleInlineImageDelete(event.id, 'detailImageMain')}
                                                                    className="action-btn delete-btn small"
                                                                    title="Delete main detail image"
                                                                >
                                                                    <img src={adminDeleteIcon} alt="Delete" className="action-icon" />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleInlineImageBrowse(event.id, 'detailImageMain')}
                                                                    className="action-btn refresh-btn small"
                                                                    title="Browse main detail image"
                                                                >
                                                                    <img src={adminBrowseIcon} alt="Browse" className="action-icon" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="detail-image-item">
                                                        <label>Right Image</label>
                                                        <div className="image-placeholder small">
                                                            {currentData.detailImageRight ? (
                                                                <img
                                                                    src={getImagePath(currentData.detailImageRight)}
                                                                    alt="Right detail image"
                                                                    className="current-image"
                                                                />
                                                            ) : (
                                                                <div className="image-placeholder-text">No image</div>
                                                            )}
                                                            <div className="image-actions">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleInlineImageDelete(event.id, 'detailImageRight')}
                                                                    className="action-btn delete-btn small"
                                                                    title="Delete right image"
                                                                >
                                                                    <img src={adminDeleteIcon} alt="Delete" className="action-icon" />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleInlineImageBrowse(event.id, 'detailImageRight')}
                                                                    className="action-btn refresh-btn small"
                                                                    title="Browse right image"
                                                                >
                                                                    <img src={adminBrowseIcon} alt="Browse" className="action-icon" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="image-info">
                                                *Yüklənən şəkillər 318 x 387 ölçüsündə olmalıdır
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-actions">
                                        <button
                                            className="admin-events-save-btn"
                                            onClick={() => saveEvent(event.id)}
                                            disabled={loading}
                                            title="Save changes"
                                        >
                                            {loading ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                            className="admin-events-delete-btn"
                                            onClick={() => handleDelete(event.id)}
                                            title="Delete event"
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
                {filteredEvents.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        onPreviousPage={handlePreviousPage}
                        onNextPage={handleNextPage}
                        startIndex={startIndex}
                        endIndex={endIndex}
                        totalItems={filteredEvents.length}
                        itemsPerPage={1}
                        showInfo={true}
                        className="admin-events-pagination"
                    />
                )}
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="admin-events-modal-overlay" onClick={closeModal}>
                    <div className="admin-events-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-events-modal-header">
                            <h2>Create New Event</h2>
                            <button
                                className="admin-events-modal-close"
                                onClick={closeModal}
                            >
                                ×
                            </button>
                        </div>

                        <form className="admin-events-modal-form" onSubmit={handleSubmit}>
                            <div className="admin-events-modal-fields">
                                <div className="admin-events-modal-left">
                                    <div className="admin-events-form-group">
                                        <label htmlFor="title">Event Title *</label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            className="admin-events-form-input"
                                            value={eventData.title}
                                            onChange={(e) => setEventData(prev => ({ ...prev, title: e.target.value }))}
                                            maxLength={200}
                                            required
                                            placeholder="Enter event title"
                                        />
                                    </div>

                                    <div className="admin-events-form-group">
                                        <label htmlFor="subtitle">Subtitle</label>
                                        <input
                                            type="text"
                                            id="subtitle"
                                            name="subtitle"
                                            className="admin-events-form-input"
                                            value={eventData.subtitle}
                                            onChange={(e) => setEventData(prev => ({ ...prev, subtitle: e.target.value }))}
                                            maxLength={300}
                                            placeholder="Enter event subtitle"
                                        />
                                    </div>

                                    <div className="admin-events-form-group">
                                        <label htmlFor="eventDate">Event Date *</label>
                                        <input
                                            type="date"
                                            id="eventDate"
                                            name="eventDate"
                                            className="admin-events-form-input"
                                            value={eventData.eventDate ? eventData.eventDate.split('T')[0] : ''}
                                            onChange={(e) => {
                                                const currentTime = eventData.time || '00:00';
                                                const newDateTime = `${e.target.value}T${currentTime}`;
                                                setEventData(prev => ({ ...prev, eventDate: newDateTime }));
                                            }}
                                            required
                                        />
                                    </div>

                                    <div className="admin-events-form-group">
                                        <label htmlFor="time">Event Time *</label>
                                        <input
                                            type="time"
                                            id="time"
                                            name="time"
                                            className="admin-events-form-input"
                                            value={eventData.time || ''}
                                            onChange={(e) => setEventData(prev => ({ ...prev, time: e.target.value }))}
                                            required
                                        />
                                    </div>

                                    <div className="admin-events-form-group">
                                        <label htmlFor="venue">Venue</label>
                                        <input
                                            type="text"
                                            id="venue"
                                            name="venue"
                                            className="admin-events-form-input"
                                            value={eventData.venue}
                                            onChange={(e) => setEventData(prev => ({ ...prev, venue: e.target.value }))}
                                            maxLength={200}
                                            placeholder="Enter event venue"
                                        />
                                    </div>

                                    <div className="admin-events-form-group">
                                        <label htmlFor="trainer">Trainer</label>
                                        <input
                                            type="text"
                                            id="trainer"
                                            name="trainer"
                                            className="admin-events-form-input"
                                            value={eventData.trainer}
                                            onChange={(e) => setEventData(prev => ({ ...prev, trainer: e.target.value }))}
                                            maxLength={100}
                                            placeholder="Enter event trainer"
                                        />
                                    </div>



                                    <div className="admin-events-form-group">
                                        <label htmlFor="price">Price</label>
                                        <div className="price-input-group">
                                            <input
                                                type="number"
                                                id="price"
                                                name="price"
                                                className="admin-events-form-input price-input"
                                                value={eventData.price}
                                                onChange={(e) => setEventData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                                                min="0"
                                                step="1"
                                                placeholder="Enter event price"
                                            />
                                            <select
                                                className="currency-select"
                                                value={eventData.currency}
                                                onChange={(e) => setEventData(prev => ({ ...prev, currency: e.target.value }))}
                                            >
                                                <option value="AZN">AZN</option>
                                                <option value="USD">USD</option>
                                                <option value="EUR">EUR</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="admin-events-form-group">
                                        <label htmlFor="isMain">Main Event</label>
                                        <div className="checkbox-group">
                                            <input
                                                type="checkbox"
                                                id="isMain"
                                                name="isMain"
                                                checked={eventData.isMain}
                                                onChange={(e) => setEventData(prev => ({ ...prev, isMain: e.target.checked }))}
                                            />
                                            <label htmlFor="isMain">Mark as main event</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="admin-events-modal-right">
                                    <div className="admin-events-form-group">
                                        <label htmlFor="description">Description</label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            className="admin-events-form-textarea"
                                            value={eventData.description}
                                            onChange={(e) => setEventData(prev => ({ ...prev, description: e.target.value }))}
                                            maxLength={1000}
                                            rows={4}
                                            placeholder="Enter event description"
                                        />
                                    </div>

                                    <div className="admin-events-form-group">
                                        <label htmlFor="longDescription">Long Description</label>
                                        <textarea
                                            id="longDescription"
                                            name="longDescription"
                                            className="admin-events-form-textarea"
                                            value={eventData.longDescription}
                                            onChange={(e) => setEventData(prev => ({ ...prev, longDescription: e.target.value }))}
                                            rows={4}
                                            placeholder="Enter detailed event description"
                                        />
                                    </div>

                                    {/* Image Section */}
                                    <div className="admin-events-modal-image-section">
                                        <h3>Event Images</h3>

                                        <div className="admin-events-image-group">
                                            <label>Main Image</label>
                                            <div className="admin-events-image-placeholder">
                                                {eventData.mainImage ? (
                                                    <img
                                                        src={getImagePath(eventData.mainImage)}
                                                        alt="Main image"
                                                        className="admin-events-current-image"
                                                    />
                                                ) : (
                                                    <div className="admin-events-image-placeholder-text">No main image</div>
                                                )}
                                                <div className="admin-events-image-actions">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleImageDelete('mainImage')}
                                                        className="admin-events-action-btn admin-events-delete-btn"
                                                        title="Delete main image"
                                                    >
                                                        <img src={adminDeleteIcon} alt="Delete" className="admin-events-action-icon" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleImageBrowse('mainImage')}
                                                        className="admin-events-action-btn admin-events-refresh-btn"
                                                        title="Browse main image"
                                                    >
                                                        <img src={adminBrowseIcon} alt="Browse" className="admin-events-action-icon" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="admin-events-image-info">
                                            *Yüklənən şəkillər 318 x 387 ölçüsündə olmalıdır
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="admin-events-modal-actions">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="admin-events-cancel-btn"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="admin-events-submit-btn"
                                >
                                    {loading ? 'Saving...' : 'Create Event'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Speakers Management Modal */}
            {showSpeakersModal && (
                <div className="admin-events-modal-overlay" onClick={closeModals}>
                    <div className="admin-events-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-events-modal-header">
                            <h2>Manage Speakers</h2>
                            <button className="admin-events-modal-close" onClick={closeModals}>×</button>
                        </div>
                        <div className="admin-events-modal-content">
                            <div className="admin-events-add-section">
                                <h3>Add New Speaker</h3>
                                <div className="admin-events-form-group">
                                    <input
                                        type="text"
                                        placeholder="Speaker Name"
                                        value={newSpeaker.name}
                                        onChange={(e) => setNewSpeaker(prev => ({ ...prev, name: e.target.value }))}
                                        className="admin-events-form-input"
                                    />
                                </div>
                                <div className="admin-events-form-group">
                                    <input
                                        type="text"
                                        placeholder="Speaker Title"
                                        value={newSpeaker.title}
                                        onChange={(e) => setNewSpeaker(prev => ({ ...prev, title: e.target.value }))}
                                        className="admin-events-form-input"
                                    />
                                </div>
                                <div className="admin-events-form-group">
                                    <input
                                        type="text"
                                        placeholder="Image Path (e.g., /src/assets/speaker1.png)"
                                        value={newSpeaker.image}
                                        onChange={(e) => setNewSpeaker(prev => ({ ...prev, image: e.target.value }))}
                                        className="admin-events-form-input"
                                    />
                                </div>
                                <button
                                    className="admin-events-submit-btn"
                                    onClick={() => addSpeaker(selectedEventId)}
                                    disabled={!newSpeaker.name || !newSpeaker.title}
                                >
                                    Add Speaker
                                </button>
                            </div>

                            <div className="admin-events-list-section">
                                <h3>Current Speakers</h3>
                                {eventSpeakers[selectedEventId]?.map((speaker, index) => (
                                    <div key={speaker.id} className="admin-events-item-card">
                                        <div className="admin-events-item-info">
                                            <strong>{speaker.name}</strong>
                                            <span>{speaker.title}</span>
                                        </div>
                                        <button
                                            className="admin-events-delete-btn"
                                            onClick={() => removeSpeaker(speaker.id, selectedEventId)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )) || <p>No speakers found</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Timeline Management Modal */}
            {showTimelineModal && (
                <div className="admin-events-modal-overlay" onClick={closeModals}>
                    <div className="admin-events-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-events-modal-header">
                            <h2>Manage Timeline</h2>
                            <button className="admin-events-modal-close" onClick={closeModals}>×</button>
                        </div>
                        <div className="admin-events-modal-content">
                            <div className="admin-events-add-section">
                                <h3>Add New Timeline Slot</h3>
                                <div className="admin-events-form-group">
                                    <input
                                        type="time"
                                        placeholder="Start Time"
                                        value={newTimelineSlot.startTime}
                                        onChange={(e) => setNewTimelineSlot(prev => ({ ...prev, startTime: e.target.value }))}
                                        className="admin-events-form-input"
                                    />
                                </div>
                                <div className="admin-events-form-group">
                                    <input
                                        type="time"
                                        placeholder="End Time"
                                        value={newTimelineSlot.endTime}
                                        onChange={(e) => setNewTimelineSlot(prev => ({ ...prev, endTime: e.target.value }))}
                                        className="admin-events-form-input"
                                    />
                                </div>
                                <div className="admin-events-form-group">
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        value={newTimelineSlot.title}
                                        onChange={(e) => setNewTimelineSlot(prev => ({ ...prev, title: e.target.value }))}
                                        className="admin-events-form-input"
                                    />
                                </div>
                                <div className="admin-events-form-group">
                                    <textarea
                                        placeholder="Description"
                                        value={newTimelineSlot.description}
                                        onChange={(e) => setNewTimelineSlot(prev => ({ ...prev, description: e.target.value }))}
                                        className="admin-events-form-textarea"
                                        rows={3}
                                    />
                                </div>
                                <div className="admin-events-form-group">
                                    <textarea
                                        placeholder="Info"
                                        value={newTimelineSlot.info}
                                        onChange={(e) => setNewTimelineSlot(prev => ({ ...prev, info: e.target.value }))}
                                        className="admin-events-form-textarea"
                                        rows={3}
                                    />
                                </div>
                                <div className="admin-events-form-group">
                                    <input
                                        type="number"
                                        placeholder="Order Index"
                                        value={newTimelineSlot.orderIndex}
                                        onChange={(e) => setNewTimelineSlot(prev => ({ ...prev, orderIndex: parseInt(e.target.value) || 1 }))}
                                        className="admin-events-form-input"
                                        min="1"
                                    />
                                </div>
                                <button
                                    className="admin-events-submit-btn"
                                    onClick={() => addTimelineSlot(selectedEventId)}
                                    disabled={!newTimelineSlot.startTime || !newTimelineSlot.endTime || !newTimelineSlot.title}
                                >
                                    Add Timeline Slot
                                </button>
                            </div>

                            <div className="admin-events-list-section">
                                <h3>Current Timeline</h3>
                                {eventTimeline[selectedEventId]?.map((slot, index) => (
                                    <div key={slot.id} className="admin-events-item-card">
                                        <div className="admin-events-item-info">
                                            <strong>{slot.startTime} - {slot.endTime}</strong>
                                            <span>{slot.title}</span>
                                            <p>{slot.description}</p>
                                        </div>
                                        <button
                                            className="admin-events-delete-btn"
                                            onClick={() => removeTimelineSlot(slot.id, selectedEventId)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )) || <p>No timeline slots found</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Employees Management Modal */}
            {showEmployeesModal && (
                <div className="admin-events-modal-overlay" onClick={closeModals}>
                    <div className="admin-events-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-events-modal-header">
                            <h2>Manage Employees</h2>
                            <button className="admin-events-modal-close" onClick={closeModals}>×</button>
                        </div>
                        <div className="admin-events-modal-content">
                            <div className="admin-events-add-section">
                                <h3>Add Employee to Event</h3>
                                <div className="admin-events-form-group">
                                    <select
                                        className="admin-events-form-input"
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                addEmployeeToEvent(selectedEventId, parseInt(e.target.value));
                                                e.target.value = '';
                                            }
                                        }}
                                    >
                                        <option value="">Select an employee...</option>
                                        {allEmployees.map(employee => (
                                            <option key={employee.id} value={employee.id}>
                                                {employee.fullname} - {employee.field}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="admin-events-list-section">
                                <h3>Current Employees</h3>
                                {eventEmployees[selectedEventId]?.map((employee, index) => (
                                    <div key={employee.id} className="admin-events-item-card">
                                        <div className="admin-events-item-info">
                                            <strong>{employee.fullname}</strong>
                                            <span>{employee.field}</span>
                                        </div>
                                        <button
                                            className="admin-events-delete-btn"
                                            onClick={() => removeEmployeeFromEvent(employee.id, selectedEventId)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )) || <p>No employees assigned</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminEvents;
