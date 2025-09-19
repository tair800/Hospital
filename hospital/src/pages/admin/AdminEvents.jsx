import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import { getContextualImagePath } from '../../utils/imageUtils'
const adminDeleteIcon = '/assets/admin-delete.png'
const adminBrowseIcon = '/assets/admin-browse.png'
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
        region: '',
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
    const [showEditTimelineModal, setShowEditTimelineModal] = useState(false);
    const [showEditSpeakerModal, setShowEditSpeakerModal] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [newSpeaker, setNewSpeaker] = useState({ name: '', title: '', image: '' });
    const [newTimelineSlot, setNewTimelineSlot] = useState({
        startTime: '',
        endTime: '',
        title: '',
        description: '',
        info: ''
    });
    const [editingTimelineSlot, setEditingTimelineSlot] = useState(null);
    const [editingSpeaker, setEditingSpeaker] = useState(null);
    const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');

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
                    event.region?.toLowerCase().includes(searchLower) ||
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
            const response = await fetch('https://localhost:5000/api/events');
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

                // Load related data for all events
                await loadAllEventRelatedData(sortedData);
            } else {
                showAlert('error', 'Error!', 'Failed to fetch events.');
            }
        } catch (error) {
            showAlert('error', 'Error!', 'Failed to fetch events.');
        } finally {
            setLoading(false);
        }
    };

    // Load all related data for events (speakers, timeline, employees)
    const loadAllEventRelatedData = async (events) => {
        try {
            // Create promises for all related data
            const promises = events.map(async (event) => {
                const [speakersResponse, timelineResponse, employeesResponse] = await Promise.all([
                    fetch(`https://localhost:5000/api/eventspeakers/event/${event.id}`),
                    fetch(`https://localhost:5000/api/eventtimeline/event/${event.id}`),
                    fetch(`https://localhost:5000/api/eventemployees/event/${event.id}`)
                ]);

                const speakersData = speakersResponse.ok ? await speakersResponse.json() : [];
                const timelineData = timelineResponse.ok ? await timelineResponse.json() : [];
                const employeesData = employeesResponse.ok ? await employeesResponse.json() : [];

                return {
                    eventId: event.id,
                    speakers: speakersData,
                    timeline: timelineData,
                    employees: employeesData
                };
            });

            // Wait for all promises to resolve
            const results = await Promise.all(promises);

            // Update state with all the data
            const speakersData = {};
            const timelineData = {};
            const employeesData = {};

            results.forEach(({ eventId, speakers, timeline, employees }) => {
                speakersData[eventId] = speakers;
                timelineData[eventId] = timeline;
                employeesData[eventId] = employees;
            });

            setEventSpeakers(speakersData);
            setEventTimeline(timelineData);
            setEventEmployees(employeesData);
        } catch (error) {
            console.error('Failed to load event related data:', error);
        }
    };

    // Fetch all employees
    const fetchAllEmployees = async () => {
        try {
            const response = await fetch('https://localhost:5000/api/employees');
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
            const response = await fetch(`https://localhost:5000/api/eventspeakers/event/${eventId}`);
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
            const response = await fetch(`https://localhost:5000/api/eventtimeline/event/${eventId}`);
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
            const response = await fetch(`https://localhost:5000/api/eventemployees/event/${eventId}`);
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
            let speakerData = { ...newSpeaker, eventId };

            // If there's an image file, upload it first
            if (newSpeaker.image && typeof newSpeaker.image === 'object') {
                const formData = new FormData();
                formData.append('file', newSpeaker.image);

                const uploadResponse = await fetch('https://localhost:5000/api/ImageUpload/event/speaker', {
                    method: 'POST',
                    body: formData
                });

                if (!uploadResponse.ok) {
                    showAlert('error', 'Upload Failed!', 'Failed to upload speaker image.');
                    return;
                }

                const uploadResult = await uploadResponse.json();
                if (!uploadResult.success) {
                    showAlert('error', 'Upload Failed!', uploadResult.message || 'Failed to upload speaker image.');
                    return;
                }

                // Add timestamp to force image reload
                speakerData.image = `${uploadResult.filePath}?t=${Date.now()}`;
            }

            const response = await fetch('https://localhost:5000/api/eventspeakers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(speakerData)
            });

            if (response.ok) {
                showAlert('success', 'Success!', 'Speaker added successfully!');
                fetchEventSpeakers(eventId);
                setNewSpeaker({ name: '', title: '', image: '' });
            } else {
                showAlert('error', 'Error!', 'Failed to add speaker.');
            }
        } catch (error) {
            console.error('Add speaker error:', error);
            showAlert('error', 'Error!', 'Failed to add speaker.');
        }
    };

    // Add new timeline slot
    const addTimelineSlot = async (eventId) => {
        try {
            // Check for time conflicts
            const existingSlots = eventTimeline[eventId] || [];
            const hasConflict = existingSlots.some(slot =>
                (newTimelineSlot.startTime >= slot.startTime && newTimelineSlot.startTime < slot.endTime) ||
                (newTimelineSlot.endTime > slot.startTime && newTimelineSlot.endTime <= slot.endTime) ||
                (newTimelineSlot.startTime <= slot.startTime && newTimelineSlot.endTime >= slot.endTime)
            );

            if (hasConflict) {
                showAlert('error', 'Xəta!', 'Bu vaxt aralığı artıq mövcuddur. Başqa vaxt seçin.');
                return;
            }

            // Validate that start time is before end time
            if (newTimelineSlot.startTime >= newTimelineSlot.endTime) {
                showAlert('error', 'Xəta!', 'Başlama vaxtı bitmə vaxtından əvvəl olmalıdır.');
                return;
            }

            const response = await fetch('https://localhost:5000/api/eventtimeline', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newTimelineSlot, eventId })
            });

            if (response.ok) {
                showAlert('success', 'Uğur!', 'Timeline slot uğurla əlavə edildi!');
                fetchEventTimeline(eventId);
                setNewTimelineSlot({
                    startTime: '',
                    endTime: '',
                    title: '',
                    description: '',
                    info: ''
                });
            } else {
                showAlert('error', 'Xəta!', 'Timeline slot əlavə edilə bilmədi.');
            }
        } catch (error) {
            showAlert('error', 'Xəta!', 'Timeline slot əlavə edilə bilmədi.');
        }
    };

    // Add employee to event
    const addEmployeeToEvent = async (eventId, employeeId) => {
        try {
            const response = await fetch('https://localhost:5000/api/eventemployees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventId, employeeId })
            });

            if (response.ok) {
                showAlert('success', 'Uğur!', 'Üzv tədbirə əlavə edildi!');
                fetchEventEmployees(eventId);
            } else {
                showAlert('error', 'Xəta!', 'Üzv tədbirə əlavə edilə bilmədi.');
            }
        } catch (error) {
            showAlert('error', 'Xəta!', 'Üzv tədbirə əlavə edilə bilmədi.');
        }
    };

    // Update speaker
    const updateSpeaker = async (speakerId, eventId) => {
        try {
            let speakerData = { ...editingSpeaker };

            // If there's a new image file, upload it first
            if (editingSpeaker.image && typeof editingSpeaker.image === 'object') {
                const formData = new FormData();
                formData.append('file', editingSpeaker.image);

                const uploadResponse = await fetch('https://localhost:5000/api/ImageUpload/event/speaker', {
                    method: 'POST',
                    body: formData
                });

                if (!uploadResponse.ok) {
                    showAlert('error', 'Upload Failed!', 'Failed to upload speaker image.');
                    return;
                }

                const uploadResult = await uploadResponse.json();
                if (!uploadResult.success) {
                    showAlert('error', 'Upload Failed!', uploadResult.message || 'Failed to upload speaker image.');
                    return;
                }

                // Add timestamp to force image reload
                speakerData.image = `${uploadResult.filePath}?t=${Date.now()}`;
            }

            const response = await fetch(`https://localhost:5000/api/eventspeakers/${speakerId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(speakerData)
            });

            if (response.ok) {
                showAlert('success', 'Uğur!', 'Speaker uğurla yeniləndi!');
                fetchEventSpeakers(eventId);
                setEditingSpeaker(null);
                setShowEditSpeakerModal(false);
            } else {
                showAlert('error', 'Xəta!', 'Speaker yenilənə bilmədi.');
            }
        } catch (error) {
            console.error('Update speaker error:', error);
            showAlert('error', 'Xəta!', 'Speaker yenilənə bilmədi.');
        }
    };

    // Remove speaker
    const removeSpeaker = async (speakerId, eventId) => {
        try {
            const response = await fetch(`https://localhost:5000/api/eventspeakers/${speakerId}`, {
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

    // Update timeline slot
    const updateTimelineSlot = async (timelineId, eventId) => {
        try {
            // Get fresh timeline data from API
            const response = await fetch(`https://localhost:5000/api/eventtimeline/event/${eventId}`);
            const freshTimelineData = response.ok ? await response.json() : [];

            // Only check for time conflicts if the time has actually changed
            const originalSlot = freshTimelineData.find(slot => slot.id == timelineId);
            const timeChanged = originalSlot && (
                originalSlot.startTime !== editingTimelineSlot.startTime ||
                originalSlot.endTime !== editingTimelineSlot.endTime
            );

            if (timeChanged) {
                // Check for time conflicts only if time was changed
                const hasConflict = freshTimelineData.some(slot => {
                    return slot.id != timelineId && (
                        (editingTimelineSlot.startTime >= slot.startTime && editingTimelineSlot.startTime < slot.endTime) ||
                        (editingTimelineSlot.endTime > slot.startTime && editingTimelineSlot.endTime <= slot.endTime) ||
                        (editingTimelineSlot.startTime <= slot.startTime && editingTimelineSlot.endTime >= slot.endTime)
                    );
                });

                if (hasConflict) {
                    showAlert('error', 'Xəta!', 'Bu vaxt aralığı artıq mövcuddur. Başqa vaxt seçin.');
                    return;
                }
            }

            // Validate that start time is before end time
            if (editingTimelineSlot.startTime >= editingTimelineSlot.endTime) {
                showAlert('error', 'Xəta!', 'Başlama vaxtı bitmə vaxtından əvvəl olmalıdır.');
                return;
            }

            const updateResponse = await fetch(`https://localhost:5000/api/eventtimeline/${timelineId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingTimelineSlot)
            });

            if (updateResponse.ok) {
                showAlert('success', 'Uğur!', 'Timeline slot uğurla yeniləndi!');
                fetchEventTimeline(eventId);
                setEditingTimelineSlot(null);
                setShowEditTimelineModal(false);
            } else {
                showAlert('error', 'Xəta!', 'Timeline slot yenilənə bilmədi.');
            }
        } catch (error) {
            showAlert('error', 'Xəta!', 'Timeline slot yenilənə bilmədi.');
        }
    };

    // Remove timeline slot
    const removeTimelineSlot = async (timelineId, eventId) => {
        try {
            const response = await fetch(`https://localhost:5000/api/eventtimeline/${timelineId}`, {
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
            const response = await fetch(`https://localhost:5000/api/eventemployees/${eventEmployeeId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                showAlert('success', 'Uğur!', 'Üzv tədbirdən silindi!');
                fetchEventEmployees(eventId);
            } else {
                showAlert('error', 'Xəta!', 'Üzv tədbirdən silinə bilmədi.');
            }
        } catch (error) {
            showAlert('error', 'Xəta!', 'Üzv tədbirdən silinə bilmədi.');
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



            const response = await fetch(`https://localhost:5000/api/events/${eventId}`, {
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

                    const response = await fetch('https://localhost:5000/api/ImageUpload/event', {
                        method: 'POST',
                        body: formData
                    });

                    if (response.ok) {
                        const result = await response.json();
                        if (result.success) {
                            // Add timestamp to force image reload
                            const imagePathWithTimestamp = `${result.filePath}?t=${Date.now()}`;
                            setEventData(prev => ({ ...prev, [field]: imagePathWithTimestamp }));
                            showAlert('success', 'Image Uploaded!', `Image "${file.name}" uploaded successfully!`);
                        } else {
                            showAlert('error', 'Upload Failed!', result.message || 'Failed to upload image.');
                        }
                    } else {
                        showAlert('error', 'Upload Failed!', 'Failed to upload image to server.');
                    }
                } catch (error) {
                    console.error('Upload error:', error);
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

        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const formData = new FormData();
                    formData.append('file', file);

                    const response = await fetch('https://localhost:5000/api/ImageUpload/event', {
                        method: 'POST',
                        body: formData
                    });

                    if (response.ok) {
                        const result = await response.json();
                        if (result.success) {
                            // Add timestamp to force image reload
                            const imagePathWithTimestamp = `${result.filePath}?t=${Date.now()}`;
                            handleInlineInputChange(eventId, field, imagePathWithTimestamp);
                            showAlert('success', 'Image Uploaded!', `Image "${file.name}" uploaded successfully!`);
                        } else {
                            showAlert('error', 'Upload Failed!', result.message || 'Failed to upload image.');
                        }
                    } else {
                        showAlert('error', 'Upload Failed!', 'Failed to upload image to server.');
                    }
                } catch (error) {
                    console.error('Upload error:', error);
                    showAlert('error', 'Upload Failed!', 'Failed to upload image. Please try again.');
                }
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



            const response = await fetch('https://localhost:5000/api/events', {
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
                    const response = await fetch(`https://localhost:5000/api/events/${eventId}`, {
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
            const response = await fetch(`https://localhost:5000/api/events/${eventId}/toggle-main`, {
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
        setShowEditTimelineModal(false);
        setShowEditSpeakerModal(false);
        setSelectedEventId(null);
        setEmployeeSearchTerm('');
        setEditingTimelineSlot(null);
        setEditingSpeaker(null);
    };

    // Start editing timeline slot
    const startEditingTimelineSlot = (slot) => {
        setEditingTimelineSlot({ ...slot });
        setShowEditTimelineModal(true);
    };

    // Cancel editing timeline slot
    const cancelEditingTimelineSlot = () => {
        setEditingTimelineSlot(null);
        setShowEditTimelineModal(false);
    };

    // Start editing speaker
    const startEditingSpeaker = (speaker) => {
        setEditingSpeaker({ ...speaker });
        setShowEditSpeakerModal(true);
    };

    // Cancel editing speaker
    const cancelEditingSpeaker = () => {
        setEditingSpeaker(null);
        setShowEditSpeakerModal(false);
    };

    // Filter employees based on search term and exclude already assigned employees
    const getFilteredEmployees = () => {
        // Get employees already assigned to the current event
        const assignedEmployeeIds = eventEmployees[selectedEventId]?.map(emp => emp.id) || [];

        // Filter out assigned employees first
        const availableEmployees = allEmployees.filter(employee =>
            !assignedEmployeeIds.includes(employee.id)
        );

        // Then apply search filter
        if (!employeeSearchTerm.trim()) {
            return availableEmployees;
        }
        const searchLower = employeeSearchTerm.toLowerCase();
        return availableEmployees.filter(employee =>
            employee.fullname?.toLowerCase().includes(searchLower) ||
            employee.field?.toLowerCase().includes(searchLower) ||
            employee.clinic?.toLowerCase().includes(searchLower)
        );
    };



    if (loading) return <div className="admin-events-loading">Yüklənir...</div>;

    return (
        <div className="admin-events-page">
            <div className="admin-events-container">
                {/* Başlıq və Yarat düyməsi */}
                <div className="admin-events-header">
                    <h1>Tədbirlərin İdarə Edilməsi</h1>
                    <div className="admin-events-header-actions">
                        <div className="admin-events-search-container">
                            <input
                                type="text"
                                placeholder="Tədbir axtar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="admin-events-search-input"
                            />
                        </div>
                        <Link
                            to="/admin/requests"
                            className="admin-events-requests-btn"
                            title="Müraciətləri gör"
                        >
                            Müraciətləri Gör
                        </Link>
                        <button
                            className="admin-events-create-btn"
                            onClick={openCreateModal}
                            title="Yeni tədbir yarat"
                        >
                            Tədbir yarat
                        </button>
                    </div>
                </div>

                {/* Events List */}
                <div className="admin-events-list-section">
                    {filteredEvents.length === 0 ? (
                        <div className="admin-events-no-events">
                            <h3>Heç bir tədbir tapılmadı</h3>
                            <p>Başlamaq üçün ilk tədbirinizi yaradın!</p>
                            <button
                                className="admin-events-create-first-btn"
                                onClick={openCreateModal}
                            >
                                İlk Tədbiri Yarat
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

                            // Determine display index relative to the current filtered list (stable across search)
                            const displayIndex = (filteredEvents.findIndex(e => e.id === event.id) !== -1)
                                ? filteredEvents.findIndex(e => e.id === event.id) + 1
                                : (startIndex + index + 1);

                            return (
                                <div key={event.id} className="admin-events-card">
                                    <div className="admin-events-card-header">
                                        <h2>Tədbir #{(event && event.id != null) ? event.id : displayIndex}</h2>
                                        <div className="admin-events-status-buttons">
                                            <button
                                                className="admin-events-management-btn speakers-btn"
                                                onClick={() => openSpeakersModal(event.id)}
                                                title="Spikerləri idarə et"
                                            >
                                                Spikerlər ({eventSpeakers[event.id]?.length || 0})
                                            </button>
                                            <button
                                                className="admin-events-management-btn timeline-btn"
                                                onClick={() => openTimelineModal(event.id)}
                                                title="Zaman cədvəlini idarə et"
                                            >
                                                Zaman cədvəli ({eventTimeline[event.id]?.length || 0})
                                            </button>
                                            <button
                                                className="admin-events-management-btn employees-btn"
                                                onClick={() => openEmployeesModal(event.id)}
                                                title="Üzvləri idarə et"
                                            >
                                                Üzvlər ({eventEmployees[event.id]?.length || 0})
                                            </button>
                                            <button
                                                className={`admin-events-status-btn ${currentData.isMain ? 'active' : ''}`}
                                                onClick={() => toggleMainStatus(event.id)}
                                                title={currentData.isMain ? 'Əsasdan çıxar' : 'Əsas et'}
                                            >
                                                {currentData.isMain ? 'Əsas Tədbir' : 'Əsas et'}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="admin-events-form">
                                        <div className="form-fields-left">
                                            <div className="form-group">
                                                <label>Tədbirin Başlığı</label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    value={currentData.title || ''}
                                                    onChange={(e) => handleInlineInputChange(event.id, 'title', e.target.value)}
                                                    maxLength={200}
                                                    placeholder="Tədbirin başlığı"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Alt başlıq</label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    value={currentData.subtitle || ''}
                                                    onChange={(e) => handleInlineInputChange(event.id, 'subtitle', e.target.value)}
                                                    maxLength={300}
                                                    placeholder="Tədbirin alt başlığı"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Tarix</label>
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
                                                <label>Saat</label>
                                                <input
                                                    type="time"
                                                    className="form-input"
                                                    value={currentData.time || ''}
                                                    onChange={(e) => handleInlineInputChange(event.id, 'time', e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Məkan</label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    value={currentData.venue || ''}
                                                    onChange={(e) => handleInlineInputChange(event.id, 'venue', e.target.value)}
                                                    maxLength={200}
                                                    placeholder="Tədbir məkanı"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Təlimçi</label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    value={currentData.trainer || ''}
                                                    onChange={(e) => handleInlineInputChange(event.id, 'trainer', e.target.value)}
                                                    maxLength={100}
                                                    placeholder="Tədbir təlimçisi"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Region</label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    value={currentData.region || ''}
                                                    onChange={(e) => handleInlineInputChange(event.id, 'region', e.target.value)}
                                                    maxLength={100}
                                                    placeholder="Tədbir regionu"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Qiymət</label>
                                                <div className="price-input-group">
                                                    <input
                                                        type="number"
                                                        className="form-input price-input"
                                                        value={currentData.price || 0}
                                                        onChange={(e) => handleInlineInputChange(event.id, 'price', parseInt(e.target.value) || 0)}
                                                        min="0"
                                                        step="1"
                                                        placeholder="Tədbirin qiyməti"
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
                                                <label>Təsvir</label>
                                                <textarea
                                                    className="form-textarea"
                                                    value={currentData.description || ''}
                                                    onChange={(e) => handleInlineInputChange(event.id, 'description', e.target.value)}
                                                    maxLength={1000}
                                                    placeholder="Tədbirin təsviri"
                                                    rows={4}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Ətraflı Təsvir</label>
                                                <textarea
                                                    className="form-textarea"
                                                    value={currentData.longDescription || ''}
                                                    onChange={(e) => handleInlineInputChange(event.id, 'longDescription', e.target.value)}
                                                    placeholder="Tədbirin ətraflı təsviri"
                                                    rows={4}
                                                />
                                            </div>
                                        </div>

                                        <div className="image-section-right">
                                            <div className="image-section">
                                                <h3>Əsas Şəkil</h3>
                                                <div className="image-placeholder">
                                                    {currentData.mainImage ? (
                                                        <img
                                                            src={getContextualImagePath(currentData.mainImage, 'admin')}
                                                            alt="Əsas şəkil"
                                                            className="current-image"
                                                            key={currentData.mainImage}
                                                        />
                                                    ) : (
                                                        <div className="image-placeholder-text">Əsas şəkil yoxdur</div>
                                                    )}
                                                    <div className="image-actions">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleInlineImageDelete(event.id, 'mainImage')}
                                                            className="action-btn delete-btn"
                                                            title="Əsas şəkli sil"
                                                        >
                                                            <img src={adminDeleteIcon} alt="Delete" className="action-icon" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleInlineImageBrowse(event.id, 'mainImage')}
                                                            className="action-btn refresh-btn"
                                                            title="Əsas şəkli seç"
                                                        >
                                                            <img src={adminBrowseIcon} alt="Browse" className="action-icon" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="image-section">
                                                <h3>Detallı Şəkillər</h3>
                                                <div className="detail-images-grid">
                                                    <div className="detail-image-item">
                                                        <label>Sol Şəkil</label>
                                                        <div className="image-placeholder small">
                                                            {currentData.detailImageLeft ? (
                                                                <img
                                                                    src={getContextualImagePath(currentData.detailImageLeft, 'admin')}
                                                                    alt="Sol detal şəkli"
                                                                    className="current-image"
                                                                    key={currentData.detailImageLeft}
                                                                />
                                                            ) : (
                                                                <div className="image-placeholder-text">Şəkil yoxdur</div>
                                                            )}
                                                            <div className="image-actions">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleInlineImageDelete(event.id, 'detailImageLeft')}
                                                                    className="action-btn delete-btn small"
                                                                    title="Sol şəkli sil"
                                                                >
                                                                    <img src={adminDeleteIcon} alt="Delete" className="action-icon" />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleInlineImageBrowse(event.id, 'detailImageLeft')}
                                                                    className="action-btn refresh-btn small"
                                                                    title="Sol şəkli seç"
                                                                >
                                                                    <img src={adminBrowseIcon} alt="Browse" className="action-icon" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="detail-image-item">
                                                        <label>Əsas Detal Şəkli</label>
                                                        <div className="image-placeholder small">
                                                            {currentData.detailImageMain ? (
                                                                <img
                                                                    src={getContextualImagePath(currentData.detailImageMain, 'admin')}
                                                                    alt="Əsas detal şəkli"
                                                                    className="current-image"
                                                                    key={currentData.detailImageMain}
                                                                />
                                                            ) : (
                                                                <div className="image-placeholder-text">Şəkil yoxdur</div>
                                                            )}
                                                            <div className="image-actions">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleInlineImageDelete(event.id, 'detailImageMain')}
                                                                    className="action-btn delete-btn small"
                                                                    title="Əsas detal şəkli sil"
                                                                >
                                                                    <img src={adminDeleteIcon} alt="Delete" className="action-icon" />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleInlineImageBrowse(event.id, 'detailImageMain')}
                                                                    className="action-btn refresh-btn small"
                                                                    title="Əsas detal şəkli seç"
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
                                                                    src={getContextualImagePath(currentData.detailImageRight, 'admin')}
                                                                    alt="Right detail image"
                                                                    className="current-image"
                                                                    key={currentData.detailImageRight}
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
                                        <label htmlFor="region">Region</label>
                                        <input
                                            type="text"
                                            id="region"
                                            name="region"
                                            className="admin-events-form-input"
                                            value={eventData.region}
                                            onChange={(e) => setEventData(prev => ({ ...prev, region: e.target.value }))}
                                            maxLength={100}
                                            placeholder="Enter event region"
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
                                        <label htmlFor="isMain">Əsas tədbir </label>
                                        <div className="checkbox-group">
                                            <input
                                                type="checkbox"
                                                id="isMain"
                                                name="isMain"
                                                checked={eventData.isMain}
                                                onChange={(e) => setEventData(prev => ({ ...prev, isMain: e.target.checked }))}
                                            />
                                            <label htmlFor="isMain">Əsas tədbir et</label>
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
                                                        src={getContextualImagePath(eventData.mainImage, 'admin')}
                                                        alt="Main image"
                                                        className="admin-events-current-image"
                                                        key={eventData.mainImage}
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

                                        {/* Detail Images Section */}
                                        <div className="admin-events-detail-images-section">
                                            <h4>Detallı Şəkillər</h4>
                                            <div className="admin-events-detail-images-grid">
                                                <div className="admin-events-detail-image-item">
                                                    <label>Sol Şəkil</label>
                                                    <div className="admin-events-image-placeholder small">
                                                        {eventData.detailImageLeft ? (
                                                            <img
                                                                src={getContextualImagePath(eventData.detailImageLeft, 'admin')}
                                                                alt="Sol detal şəkli"
                                                                className="admin-events-current-image"
                                                                key={eventData.detailImageLeft}
                                                            />
                                                        ) : (
                                                            <div className="admin-events-image-placeholder-text">Şəkil yoxdur</div>
                                                        )}
                                                        <div className="admin-events-image-actions">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleImageDelete('detailImageLeft')}
                                                                className="admin-events-action-btn admin-events-delete-btn small"
                                                                title="Sol şəkli sil"
                                                            >
                                                                <img src={adminDeleteIcon} alt="Delete" className="admin-events-action-icon" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleImageBrowse('detailImageLeft')}
                                                                className="admin-events-action-btn admin-events-refresh-btn small"
                                                                title="Sol şəkli seç"
                                                            >
                                                                <img src={adminBrowseIcon} alt="Browse" className="admin-events-action-icon" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="admin-events-detail-image-item">
                                                    <label>Əsas Detal Şəkli</label>
                                                    <div className="admin-events-image-placeholder small">
                                                        {eventData.detailImageMain ? (
                                                            <img
                                                                src={getContextualImagePath(eventData.detailImageMain, 'admin')}
                                                                alt="Əsas detal şəkli"
                                                                className="admin-events-current-image"
                                                                key={eventData.detailImageMain}
                                                            />
                                                        ) : (
                                                            <div className="admin-events-image-placeholder-text">Şəkil yoxdur</div>
                                                        )}
                                                        <div className="admin-events-image-actions">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleImageDelete('detailImageMain')}
                                                                className="admin-events-action-btn admin-events-delete-btn small"
                                                                title="Əsas detal şəkli sil"
                                                            >
                                                                <img src={adminDeleteIcon} alt="Delete" className="admin-events-action-icon" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleImageBrowse('detailImageMain')}
                                                                className="admin-events-action-btn admin-events-refresh-btn small"
                                                                title="Əsas detal şəkli seç"
                                                            >
                                                                <img src={adminBrowseIcon} alt="Browse" className="admin-events-action-icon" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="admin-events-detail-image-item">
                                                    <label>Sağ Şəkil</label>
                                                    <div className="admin-events-image-placeholder small">
                                                        {eventData.detailImageRight ? (
                                                            <img
                                                                src={getContextualImagePath(eventData.detailImageRight, 'admin')}
                                                                alt="Sağ detal şəkli"
                                                                className="admin-events-current-image"
                                                                key={eventData.detailImageRight}
                                                            />
                                                        ) : (
                                                            <div className="admin-events-image-placeholder-text">Şəkil yoxdur</div>
                                                        )}
                                                        <div className="admin-events-image-actions">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleImageDelete('detailImageRight')}
                                                                className="admin-events-action-btn admin-events-delete-btn small"
                                                                title="Sağ şəkli sil"
                                                            >
                                                                <img src={adminDeleteIcon} alt="Delete" className="admin-events-action-icon" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleImageBrowse('detailImageRight')}
                                                                className="admin-events-action-btn admin-events-refresh-btn small"
                                                                title="Sağ şəkli seç"
                                                            >
                                                                <img src={adminBrowseIcon} alt="Browse" className="admin-events-action-icon" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="admin-events-image-info">
                                                *Detal şəkillər 347 x 224 ölçüsündə olmalıdır
                                            </div>
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
                                <div className="speaker-form-header">
                                    <h3>Yeni Speaker Əlavə Et</h3>
                                    <p className="speaker-form-subtitle">Speaker məlumatlarını doldurun</p>
                                </div>

                                <div className="speaker-form-body">
                                    <div className="speaker-basic-section">
                                        <h4 className="section-title">Əsas Məlumatlar</h4>
                                        <div className="admin-events-form-group">
                                            <label>Speaker Adı</label>
                                            <input
                                                type="text"
                                                placeholder="Speaker adını daxil edin"
                                                value={newSpeaker.name}
                                                onChange={(e) => setNewSpeaker(prev => ({ ...prev, name: e.target.value }))}
                                                className="admin-events-form-input"
                                                required
                                            />
                                        </div>
                                        <div className="admin-events-form-group">
                                            <label>Speaker Vəzifəsi</label>
                                            <input
                                                type="text"
                                                placeholder="Speaker vəzifəsini daxil edin"
                                                value={newSpeaker.title}
                                                onChange={(e) => setNewSpeaker(prev => ({ ...prev, title: e.target.value }))}
                                                className="admin-events-form-input"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="speaker-media-section">
                                        <h4 className="section-title">Media Faylı</h4>
                                        <div className="admin-events-form-group">
                                            <label>Şəkil Seçin</label>
                                            <div className="file-input-container">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            setNewSpeaker(prev => ({ ...prev, image: file }));
                                                        }
                                                    }}
                                                    className="file-input"
                                                    id="speaker-image-upload"
                                                    key={`new-speaker-${newSpeaker.name || 'default'}`}
                                                />
                                                <label htmlFor="speaker-image-upload" className="file-input-label">
                                                    <span className="file-input-icon">📁</span>
                                                    <span className="file-input-text">
                                                        {newSpeaker.image ? (typeof newSpeaker.image === 'string' ? 'Şəkil seçildi' : newSpeaker.image.name) : 'Şəkil faylını seçin'}
                                                    </span>
                                                </label>
                                            </div>
                                            {newSpeaker.image && (
                                                <div className="image-preview">
                                                    <img
                                                        src={typeof newSpeaker.image === 'string' ? getContextualImagePath(newSpeaker.image, 'admin') : URL.createObjectURL(newSpeaker.image)}
                                                        alt="Speaker preview"
                                                        className="preview-image"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="remove-image-btn"
                                                        onClick={() => setNewSpeaker(prev => ({ ...prev, image: '' }))}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            )}
                                            <small className="input-hint">JPG, PNG və ya GIF formatında şəkil seçin</small>
                                        </div>
                                    </div>
                                </div>

                                <div className="speaker-form-footer">
                                    <button
                                        className="admin-events-submit-btn"
                                        onClick={() => addSpeaker(selectedEventId)}
                                        disabled={!newSpeaker.name || !newSpeaker.title}
                                    >
                                        Speaker Əlavə Et
                                    </button>
                                </div>
                            </div>


                            <div className="admin-events-list-section">
                                <h3>Current Speakers</h3>
                                {eventSpeakers[selectedEventId]?.map((speaker, index) => (
                                    <div key={speaker.id} className="admin-events-item-card">
                                        <div className="admin-events-item-info">
                                            <div className="speaker-image-container">
                                                {speaker.image ? (
                                                    <img
                                                        src={getContextualImagePath(speaker.image, 'admin')}
                                                        alt={speaker.name}
                                                        className="speaker-thumbnail"
                                                    />
                                                ) : (
                                                    <div className="speaker-thumbnail-placeholder">
                                                        <span>📷</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="speaker-details">
                                                <strong>{speaker.name}</strong>
                                                <span>{speaker.title}</span>
                                            </div>
                                        </div>
                                        <div className="admin-events-item-actions">
                                            <button
                                                className="admin-events-edit-btn"
                                                onClick={() => startEditingSpeaker(speaker)}
                                                title="Edit speaker"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="admin-events-delete-btn"
                                                onClick={() => removeSpeaker(speaker.id, selectedEventId)}
                                                title="Remove speaker"
                                            >
                                                Remove
                                            </button>
                                        </div>
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
                            <h2>Timeline İdarə Et</h2>
                            <button className="admin-events-modal-close" onClick={closeModals}>×</button>
                        </div>
                        <div className="admin-events-modal-content">
                            <div className="admin-events-add-section">
                                <div className="timeline-form-header">
                                    <h3>Yeni Timeline Slot Əlavə Et</h3>
                                    <p className="timeline-form-subtitle">Timeline slot məlumatlarını doldurun</p>
                                </div>

                                <div className="timeline-form-body">
                                    <div className="timeline-time-section">
                                        <h4 className="section-title">Vaxt Aralığı</h4>
                                        <div className="time-inputs-row">
                                            <div className="admin-events-form-group">
                                                <label>Başlama Vaxtı</label>
                                                <input
                                                    type="text"
                                                    placeholder="09:00"
                                                    value={newTimelineSlot.startTime}
                                                    onChange={(e) => {
                                                        let value = e.target.value;

                                                        // Auto-insert colon after 2 digits
                                                        if (value.length === 2 && !value.includes(':')) {
                                                            value = value + ':';
                                                        }

                                                        // Only allow numbers and colon
                                                        value = value.replace(/[^0-9:]/g, '');

                                                        // Limit to HH:MM format
                                                        if (value.length > 5) {
                                                            value = value.substring(0, 5);
                                                        }

                                                        setNewTimelineSlot(prev => ({ ...prev, startTime: value }));
                                                    }}
                                                    className="admin-events-form-input"
                                                    maxLength="5"
                                                    required
                                                />
                                                <small className="input-hint">24 saat formatında (HH:MM)</small>
                                            </div>
                                            <div className="admin-events-form-group">
                                                <label>Bitmə Vaxtı</label>
                                                <input
                                                    type="text"
                                                    placeholder="10:15"
                                                    value={newTimelineSlot.endTime}
                                                    onChange={(e) => {
                                                        let value = e.target.value;

                                                        // Auto-insert colon after 2 digits
                                                        if (value.length === 2 && !value.includes(':')) {
                                                            value = value + ':';
                                                        }

                                                        // Only allow numbers and colon
                                                        value = value.replace(/[^0-9:]/g, '');

                                                        // Limit to HH:MM format
                                                        if (value.length > 5) {
                                                            value = value.substring(0, 5);
                                                        }

                                                        setNewTimelineSlot(prev => ({ ...prev, endTime: value }));
                                                    }}
                                                    className="admin-events-form-input"
                                                    maxLength="5"
                                                    required
                                                />
                                                <small className="input-hint">24 saat formatında (HH:MM)</small>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="timeline-content-section">
                                        <h4 className="section-title">Məzmun Məlumatları</h4>
                                        <div className="admin-events-form-group">
                                            <label>Başlıq</label>
                                            <input
                                                type="text"
                                                placeholder="Timeline slot başlığı"
                                                value={newTimelineSlot.title}
                                                onChange={(e) => setNewTimelineSlot(prev => ({ ...prev, title: e.target.value }))}
                                                className="admin-events-form-input"
                                                required
                                            />
                                        </div>
                                        <div className="admin-events-form-group">
                                            <label>Təsvir</label>
                                            <textarea
                                                placeholder="Timeline slot haqqında ətraflı məlumat"
                                                value={newTimelineSlot.description}
                                                onChange={(e) => setNewTimelineSlot(prev => ({ ...prev, description: e.target.value }))}
                                                className="admin-events-form-textarea"
                                                rows={3}
                                                required
                                            />
                                        </div>
                                        <div className="admin-events-form-group">
                                            <label>Əlavə Məlumat</label>
                                            <textarea
                                                placeholder="Əlavə qeydlər və məlumatlar"
                                                value={newTimelineSlot.info}
                                                onChange={(e) => setNewTimelineSlot(prev => ({ ...prev, info: e.target.value }))}
                                                className="admin-events-form-textarea"
                                                rows={3}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="timeline-form-footer">
                                    <button
                                        className="admin-events-submit-btn"
                                        onClick={() => addTimelineSlot(selectedEventId)}
                                        disabled={!newTimelineSlot.startTime || !newTimelineSlot.endTime || !newTimelineSlot.title}
                                    >
                                        Timeline Slot Əlavə Et
                                    </button>
                                </div>
                            </div>


                            <div className="admin-events-list-section">
                                <h3>Cari Timeline</h3>
                                {eventTimeline[selectedEventId]?.sort((a, b) => a.startTime.localeCompare(b.startTime)).map((slot, index) => (
                                    <div key={slot.id} className="admin-events-item-card">
                                        <div className="admin-events-item-info">
                                            <strong>{slot.startTime} - {slot.endTime}</strong>
                                            <span>{slot.title}</span>
                                            <p>{slot.description}</p>
                                        </div>
                                        <div className="admin-events-item-actions">
                                            <button
                                                className="admin-events-edit-btn"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    startEditingTimelineSlot(slot);
                                                }}
                                                title="Edit timeline slot"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="admin-events-delete-btn"
                                                onClick={() => removeTimelineSlot(slot.id, selectedEventId)}
                                                title="Remove timeline slot"
                                            >
                                                Remove
                                            </button>
                                        </div>
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
                            <h2>Üzvləri İdarə Et</h2>
                            <button className="admin-events-modal-close" onClick={closeModals}>×</button>
                        </div>
                        <div className="admin-events-modal-content">
                            <div className="admin-events-add-section">
                                <div className="employee-form-header">
                                    <h3>Tədbirə Üzv Əlavə Et</h3>
                                    <p className="employee-form-subtitle">Mövcud üzvlərdən seçin və tədbirə əlavə edin</p>
                                </div>

                                <div className="employee-form-body">
                                    <div className="employee-search-section">
                                        <h4 className="section-title">Üzv Axtarışı</h4>
                                        <div className="admin-events-form-group">
                                            <label>Axtarış</label>
                                            <input
                                                type="text"
                                                placeholder="Ad, sahə və ya klinika ilə axtarın..."
                                                value={employeeSearchTerm}
                                                onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                                                className="admin-events-form-input"
                                            />
                                            <small className="input-hint">Üzv adı, sahə və ya klinika ilə axtarın</small>
                                        </div>
                                    </div>

                                    <div className="employee-selection-section">
                                        <h4 className="section-title">Üzv Seçimi</h4>
                                        <div className="admin-events-form-group">
                                            <label>Üzv Seçin</label>
                                            <select
                                                className="admin-events-form-input"
                                                onChange={(e) => {
                                                    if (e.target.value) {
                                                        addEmployeeToEvent(selectedEventId, parseInt(e.target.value));
                                                        e.target.value = '';
                                                    }
                                                }}
                                            >
                                                <option value="">Üzv seçin...</option>
                                                {getFilteredEmployees().map(employee => (
                                                    <option key={employee.id} value={employee.id}>
                                                        {employee.fullname} - {employee.field} ({employee.clinic})
                                                    </option>
                                                ))}
                                            </select>
                                            <small className="input-hint">
                                                {getFilteredEmployees().length} üzv tapıldı
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="admin-events-list-section">
                                <h3>Cari Üzvlər</h3>
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
                                            Sil
                                        </button>
                                    </div>
                                )) || <p>Heç bir üzv təyin edilməyib</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Timeline Modal */}
            {showEditTimelineModal && editingTimelineSlot && (
                <div className="admin-events-modal-overlay edit-modal-overlay" onClick={cancelEditingTimelineSlot}>
                    <div className="admin-events-modal edit-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-events-modal-header">
                            <h2>Timeline Slot Redaktə Et</h2>
                            <button className="admin-events-modal-close" onClick={cancelEditingTimelineSlot}>×</button>
                        </div>
                        <div className="admin-events-modal-content">
                            <div className="timeline-form-header">
                                <h3>Timeline Slot Məlumatlarını Yeniləyin</h3>
                                <p className="timeline-form-subtitle">Timeline slot məlumatlarını düzəldin</p>
                            </div>

                            <div className="timeline-form-body">
                                <div className="timeline-time-section">
                                    <h4 className="section-title">Vaxt Aralığı</h4>
                                    <div className="time-inputs-row">
                                        <div className="admin-events-form-group">
                                            <label>Başlama Vaxtı</label>
                                            <input
                                                type="text"
                                                placeholder="09:00"
                                                value={editingTimelineSlot.startTime}
                                                onChange={(e) => {
                                                    let value = e.target.value;
                                                    if (value.length === 2 && !value.includes(':')) {
                                                        value = value + ':';
                                                    }
                                                    value = value.replace(/[^0-9:]/g, '');
                                                    if (value.length > 5) {
                                                        value = value.substring(0, 5);
                                                    }
                                                    setEditingTimelineSlot(prev => ({ ...prev, startTime: value }));
                                                }}
                                                className="admin-events-form-input"
                                                maxLength="5"
                                                required
                                            />
                                            <small className="input-hint">24 saat formatında (HH:MM)</small>
                                        </div>
                                        <div className="admin-events-form-group">
                                            <label>Bitmə Vaxtı</label>
                                            <input
                                                type="text"
                                                placeholder="10:15"
                                                value={editingTimelineSlot.endTime}
                                                onChange={(e) => {
                                                    let value = e.target.value;
                                                    if (value.length === 2 && !value.includes(':')) {
                                                        value = value + ':';
                                                    }
                                                    value = value.replace(/[^0-9:]/g, '');
                                                    if (value.length > 5) {
                                                        value = value.substring(0, 5);
                                                    }
                                                    setEditingTimelineSlot(prev => ({ ...prev, endTime: value }));
                                                }}
                                                className="admin-events-form-input"
                                                maxLength="5"
                                                required
                                            />
                                            <small className="input-hint">24 saat formatında (HH:MM)</small>
                                        </div>
                                    </div>
                                </div>

                                <div className="timeline-content-section">
                                    <h4 className="section-title">Məzmun Məlumatları</h4>
                                    <div className="admin-events-form-group">
                                        <label>Başlıq</label>
                                        <input
                                            type="text"
                                            placeholder="Timeline slot başlığı"
                                            value={editingTimelineSlot.title}
                                            onChange={(e) => setEditingTimelineSlot(prev => ({ ...prev, title: e.target.value }))}
                                            className="admin-events-form-input"
                                            required
                                        />
                                    </div>
                                    <div className="admin-events-form-group">
                                        <label>Təsvir</label>
                                        <textarea
                                            placeholder="Timeline slot haqqında ətraflı məlumat"
                                            value={editingTimelineSlot.description}
                                            onChange={(e) => setEditingTimelineSlot(prev => ({ ...prev, description: e.target.value }))}
                                            className="admin-events-form-textarea"
                                            rows={3}
                                            required
                                        />
                                    </div>
                                    <div className="admin-events-form-group">
                                        <label>Əlavə Məlumat</label>
                                        <textarea
                                            placeholder="Əlavə qeydlər və məlumatlar"
                                            value={editingTimelineSlot.info}
                                            onChange={(e) => setEditingTimelineSlot(prev => ({ ...prev, info: e.target.value }))}
                                            className="admin-events-form-textarea"
                                            rows={3}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="timeline-form-footer">
                                <button
                                    className="admin-events-cancel-btn"
                                    onClick={cancelEditingTimelineSlot}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="admin-events-submit-btn"
                                    onClick={() => updateTimelineSlot(editingTimelineSlot.id, selectedEventId)}
                                    disabled={!editingTimelineSlot.startTime || !editingTimelineSlot.endTime || !editingTimelineSlot.title}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Speaker Modal */}
            {showEditSpeakerModal && editingSpeaker && (
                <div className="admin-events-modal-overlay edit-modal-overlay" onClick={cancelEditingSpeaker}>
                    <div className="admin-events-modal edit-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-events-modal-header">
                            <h2>Speaker Redaktə Et</h2>
                            <button className="admin-events-modal-close" onClick={cancelEditingSpeaker}>×</button>
                        </div>
                        <div className="admin-events-modal-content">
                            <div className="speaker-form-header">
                                <h3>Speaker Məlumatlarını Yeniləyin</h3>
                                <p className="speaker-form-subtitle">Speaker məlumatlarını düzəldin</p>
                            </div>

                            <div className="speaker-form-body">
                                <div className="speaker-basic-section">
                                    <h4 className="section-title">Əsas Məlumatlar</h4>
                                    <div className="admin-events-form-group">
                                        <label>Speaker Adı</label>
                                        <input
                                            type="text"
                                            placeholder="Speaker adını daxil edin"
                                            value={editingSpeaker.name}
                                            onChange={(e) => setEditingSpeaker(prev => ({ ...prev, name: e.target.value }))}
                                            className="admin-events-form-input"
                                            required
                                        />
                                    </div>
                                    <div className="admin-events-form-group">
                                        <label>Speaker Vəzifəsi</label>
                                        <input
                                            type="text"
                                            placeholder="Speaker vəzifəsini daxil edin"
                                            value={editingSpeaker.title}
                                            onChange={(e) => setEditingSpeaker(prev => ({ ...prev, title: e.target.value }))}
                                            className="admin-events-form-input"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="speaker-media-section">
                                    <h4 className="section-title">Media Faylı</h4>
                                    <div className="admin-events-form-group">
                                        <label>Şəkil Seçin</label>
                                        <div className="file-input-container">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        setEditingSpeaker(prev => ({ ...prev, image: file }));
                                                    }
                                                }}
                                                className="file-input"
                                                id="edit-speaker-image-upload-modal"
                                                key={`edit-speaker-${editingSpeaker?.id || 'default'}`}
                                            />
                                            <label htmlFor="edit-speaker-image-upload-modal" className="file-input-label">
                                                <span className="file-input-icon">📁</span>
                                                <span className="file-input-text">
                                                    {editingSpeaker.image ? (typeof editingSpeaker.image === 'string' ? 'Şəkil seçildi' : editingSpeaker.image.name) : 'Şəkil faylını seçin'}
                                                </span>
                                            </label>
                                        </div>
                                        {editingSpeaker.image && (
                                            <div className="image-preview">
                                                <img
                                                    src={typeof editingSpeaker.image === 'string' ? getContextualImagePath(editingSpeaker.image, 'admin') : URL.createObjectURL(editingSpeaker.image)}
                                                    alt="Speaker preview"
                                                    className="preview-image"
                                                />
                                                <button
                                                    type="button"
                                                    className="remove-image-btn"
                                                    onClick={() => setEditingSpeaker(prev => ({ ...prev, image: '' }))}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        )}
                                        <small className="input-hint">JPG, PNG və ya GIF formatında şəkil seçin</small>
                                    </div>
                                </div>
                            </div>

                            <div className="speaker-form-footer">
                                <button
                                    className="admin-events-cancel-btn"
                                    onClick={cancelEditingSpeaker}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="admin-events-submit-btn"
                                    onClick={() => updateSpeaker(editingSpeaker.id, selectedEventId)}
                                    disabled={!editingSpeaker.name || !editingSpeaker.title}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminEvents;
