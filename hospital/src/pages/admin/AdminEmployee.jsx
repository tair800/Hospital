import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { getContextualImagePath } from '../../utils/imageUtils'
const adminDeleteIcon = '/assets/admin-delete.png'
const adminBrowseIcon = '/assets/admin-browse.png'
const employee1Image = '/assets/employee1.png'
import Pagination from '../../components/ui/Pagination'
import usePagination from '../../hooks/usePagination'
import './AdminEmployee.css'

function AdminEmployee() {
    const [employees, setEmployees] = useState([]);
    const [employeeData, setEmployeeData] = useState({
        fullname: '',
        field: '',
        clinic: '',
        phone: '',
        whatsApp: '',
        email: '',
        location: '',
        image: '',
        detailImage: '',
        firstDesc: '',
        secondDesc: ''
    });
    const [editingCertificates, setEditingCertificates] = useState({});
    const [editingDegrees, setEditingDegrees] = useState({});
    const [certificateEditData, setCertificateEditData] = useState({});
    const [degreeEditData, setDegreeEditData] = useState({});
    const [showCertificateModal, setShowCertificateModal] = useState(false);
    const [showCertificateImagePreview, setShowCertificateImagePreview] = useState(false);
    const [showDegreeModal, setShowDegreeModal] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const [certificateData, setCertificateData] = useState({
        certificateName: '',
        certificateImage: ''
    });
    const [degreeData, setDegreeData] = useState({
        universityName: '',
        startYear: '',
        endYear: ''
    });
    const [loading, setLoading] = useState(false);
    const [editingEmployees, setEditingEmployees] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEmployees, setFilteredEmployees] = useState([]);

    // Pagination hook
    const {
        currentPage,
        totalPages,
        currentItems: currentEmployees,
        startIndex,
        endIndex,
        handlePageChange,
        handlePreviousPage,
        handleNextPage,
        resetPagination
    } = usePagination(filteredEmployees, 1);

    // Fetch all employees on component mount
    useEffect(() => {
        fetchEmployees();
    }, []);

    // Filter employees based on search term
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredEmployees(employees);
        } else {
            const searchLower = searchTerm.toLowerCase();

            // First, get employees whose names start with the search term
            const startsWithName = employees.filter(employee =>
                employee.fullname?.toLowerCase().startsWith(searchLower)
            );

            // Then, get employees whose names contain the search term (but don't start with it)
            const containsName = employees.filter(employee =>
                employee.fullname?.toLowerCase().includes(searchLower) &&
                !employee.fullname?.toLowerCase().startsWith(searchLower)
            );

            // Finally, get employees where other fields contain the search term
            const otherFields = employees.filter(employee =>
                !employee.fullname?.toLowerCase().includes(searchLower) && (
                    employee.field?.toLowerCase().includes(searchLower) ||
                    employee.clinic?.toLowerCase().includes(searchLower) ||
                    employee.phone?.toLowerCase().includes(searchLower) ||
                    employee.whatsApp?.toLowerCase().includes(searchLower) ||
                    employee.email?.toLowerCase().includes(searchLower) ||
                    employee.location?.toLowerCase().includes(searchLower) ||
                    employee.firstDesc?.toLowerCase().includes(searchLower) ||
                    employee.secondDesc?.toLowerCase().includes(searchLower)
                )
            );

            // Combine results in priority order: starts with name, contains name, other fields
            const filtered = [...startsWithName, ...containsName, ...otherFields];
            setFilteredEmployees(filtered);
        }
    }, [employees, searchTerm]);

    // Reset pagination only when search term changes (not when employees are updated)
    useEffect(() => {
        resetPagination();
    }, [searchTerm, resetPagination]);

    // Fetch all employees from API with their certificates and degrees
    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://localhost:5000/api/employees');
            if (response.ok) {
                const employees = await response.json();



                // Fetch full employee data (including certificates and degrees) for each employee
                const employeesWithCredentials = await Promise.all(
                    employees.map(async (employee) => {
                        try {
                            // Fetch full employee data with certificates and degrees
                            const employeeResponse = await fetch(`https://localhost:5000/api/employees/${employee.id}`);
                            if (employeeResponse.ok) {
                                const fullEmployeeData = await employeeResponse.json();

                                return fullEmployeeData;
                            } else {
                                return {
                                    ...employee,
                                    certificates: [],
                                    degrees: []
                                };
                            }
                        } catch (error) {
                            return {
                                ...employee,
                                certificates: [],
                                degrees: []
                            };
                        }
                    })
                );

                setEmployees(employeesWithCredentials);
                // Initialize editing state for all employees
                const initialEditingState = {};
                employeesWithCredentials.forEach(employee => {
                    initialEditingState[employee.id] = { ...employee };
                });
                setEditingEmployees(initialEditingState);
            } else {
                showAlert('error', 'Error!', 'Failed to fetch employees.');
            }
        } catch (error) {
            showAlert('error', 'Error!', 'Failed to fetch employees.');
        } finally {
            setLoading(false);
        }
    };

    // Handle input changes for inline editing
    const handleInlineInputChange = (employeeId, field, value) => {
        setEditingEmployees(prev => ({
            ...prev,
            [employeeId]: {
                ...prev[employeeId],
                [field]: value
            }
        }));
    };

    // Save employee changes
    const saveEmployee = async (employeeId) => {
        try {
            setLoading(true);
            const editedData = editingEmployees[employeeId];



            const response = await fetch(`https://localhost:5000/api/employees/${employeeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedData),
            });



            if (response.ok) {
                // Check if response has content
                const responseText = await response.text();

                let responseData;
                if (responseText.trim()) {
                    try {
                        responseData = JSON.parse(responseText);
                    } catch (parseError) {
                        responseData = editedData; // Use the data we sent as fallback
                    }
                } else {
                    responseData = editedData;
                }

                // Save certificate changes if any
                await saveAllCertificateChanges();
                // Save degree changes if any
                await saveAllDegreeChanges();

                // Update the local state instead of refetching all employees
                // This preserves the current page and pagination state
                setEmployees(prevEmployees =>
                    prevEmployees.map(employee =>
                        employee.id === employeeId
                            ? { ...employee, ...responseData }
                            : employee
                    )
                );

                // Update the editing state to reflect the saved changes
                setEditingEmployees(prev => ({
                    ...prev,
                    [employeeId]: { ...responseData }
                }));

                showAlert('success', 'Success!', 'Employee and credentials updated successfully!');
                return;
            } else {
                showAlert('error', 'Error!', `Failed to update employee. Status: ${response.status}`);
            }
        } catch (error) {
            showAlert('error', 'Error!', 'Failed to save employee data.');
        } finally {
            setLoading(false);
        }
    };

    // Reset form to initial state
    const resetForm = () => {
        setEmployeeData({
            fullname: '',
            field: '',
            clinic: '',
            phone: '',
            whatsApp: '',
            email: '',
            location: '',
            image: '',
            detailImage: '',
            firstDesc: '',
            secondDesc: ''
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
    const handleImageBrowse = async (imageType) => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    // Create FormData for file upload
                    const formData = new FormData();
                    formData.append('file', file);

                    // Upload the file
                    const response = await fetch(`https://localhost:5000/api/ImageUpload/employee${imageType === 'detailImage' ? '/detail' : ''}`, {
                        method: 'POST',
                        body: formData
                    });

                    if (response.ok) {
                        const result = await response.json();
                        if (result.success) {
                            setEmployeeData(prev => ({ ...prev, [imageType]: result.filePath }));
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

    // Handle certificate image browse in modal
    const handleCertificateModalImageBrowse = async () => {
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

                    const response = await fetch('https://localhost:5000/api/ImageUpload/employee/certificate', {
                        method: 'POST',
                        body: formData
                    });

                    if (response.ok) {
                        const result = await response.json();
                        if (result.success) {
                            // Add timestamp to force image reload
                            const imagePathWithTimestamp = `${result.filePath}?t=${Date.now()}`;
                            setCertificateData(prev => ({ ...prev, certificateImage: imagePathWithTimestamp }));
                            showAlert('success', 'Image Uploaded!', `Certificate image "${file.name}" uploaded successfully!`);
                        } else {
                            showAlert('error', 'Upload Failed!', result.message || 'Failed to upload certificate image.');
                        }
                    } else {
                        showAlert('error', 'Upload Failed!', 'Failed to upload certificate image to server.');
                    }
                } catch (error) {
                    showAlert('error', 'Upload Failed!', 'Failed to upload certificate image. Please try again.');
                }
            }
        };

        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    };

    // Handle image delete
    const handleImageDelete = (imageType) => {
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
                setEmployeeData(prev => ({ ...prev, [imageType]: '' }));
                showAlert('success', 'Deleted!', 'Image has been removed.');
            }
        });
    };

    // Handle inline image browse for existing employees
    const handleInlineImageBrowse = async (employeeId, imageType) => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    // Create FormData for file upload
                    const formData = new FormData();
                    formData.append('file', file);

                    // Upload the file
                    const response = await fetch(`https://localhost:5000/api/ImageUpload/employee${imageType === 'detailImage' ? '/detail' : ''}`, {
                        method: 'POST',
                        body: formData
                    });

                    if (response.ok) {
                        const result = await response.json();
                        if (result.success) {
                            // Create a preview URL for the selected file
                            const previewUrl = URL.createObjectURL(file);

                            // Update both the file path and preview URL
                            handleInlineInputChange(employeeId, imageType, result.filePath);
                            handleInlineInputChange(employeeId, `${imageType}Preview`, previewUrl);

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

    // Handle certificate image browse
    const handleCertificateImageBrowse = (certificateId) => {
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

                    const response = await fetch('https://localhost:5000/api/ImageUpload/employee/certificate', {
                        method: 'POST',
                        body: formData
                    });

                    if (response.ok) {
                        const result = await response.json();
                        if (result.success) {
                            // Add timestamp to force image reload
                            const imagePathWithTimestamp = `${result.filePath}?t=${Date.now()}`;

                            // Initialize edit data if it doesn't exist
                            if (!certificateEditData[certificateId]) {
                                const certificate = employees
                                    .flatMap(emp => emp.certificates || [])
                                    .find(cert => cert.id === certificateId);

                                if (certificate) {
                                    setCertificateEditData(prev => ({
                                        ...prev,
                                        [certificateId]: {
                                            certificateName: certificate.certificateName,
                                            certificateImage: imagePathWithTimestamp
                                        }
                                    }));
                                }
                            } else {
                                // Update existing edit data
                                handleCertificateEditChange(certificateId, 'certificateImage', imagePathWithTimestamp);
                            }

                            showAlert('success', 'Image Uploaded!', `Certificate image "${file.name}" uploaded successfully!`);
                        } else {
                            showAlert('error', 'Upload Failed!', result.message || 'Failed to upload certificate image.');
                        }
                    } else {
                        showAlert('error', 'Upload Failed!', 'Failed to upload certificate image to server.');
                    }
                } catch (error) {
                    showAlert('error', 'Upload Failed!', 'Failed to upload certificate image. Please try again.');
                }
            }
        };

        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    };

    // Handle inline image delete for existing employees
    const handleInlineImageDelete = (employeeId, imageType) => {
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
                handleInlineInputChange(employeeId, imageType, '');
                showAlert('success', 'Deleted!', 'Image has been removed.');
            }
        });
    };

    // Show alert messages
    const showAlert = (icon, title, text) => {
        Swal.fire({ icon, title, text, confirmButtonColor: '#1976d2', timer: 2000, showConfirmButton: false });
    };

    // Handle form submission (create new employee)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            // Ensure all employee fields including images are included
            const employeeDataToSend = {
                ...employeeData,
                image: employeeData.image || null,
                detailImage: employeeData.detailImage || null
            };



            const response = await fetch('https://localhost:5000/api/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(employeeDataToSend),
            });

            if (response.ok) {
                const createdEmployee = await response.json();

                showAlert('success', 'Success!', 'Employee created successfully!');
                closeModal();
                fetchEmployees();
            } else {
                showAlert('error', 'Error!', 'Failed to create employee.');
            }
        } catch (error) {
            showAlert('error', 'Error!', 'Failed to save employee data.');
        } finally {
            setLoading(false);
        }
    };

    // Handle delete employee
    const handleDelete = async (employeeId) => {
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
                    const response = await fetch(`https://localhost:5000/api/employees/${employeeId}`, {
                        method: 'DELETE',
                    });

                    if (response.ok) {
                        showAlert('success', 'Deleted!', 'Employee has been deleted.');
                        fetchEmployees();
                    } else {
                        showAlert('error', 'Error!', 'Failed to delete employee.');
                    }
                } catch (error) {
                    showAlert('error', 'Error!', 'Failed to delete employee.');
                }
            }
        });
    };

    // Certificate CRUD Functions
    const openCertificateModal = (employeeId) => {
        setSelectedEmployeeId(employeeId);
        setCertificateData({ certificateName: '', certificateImage: '' });
        setShowCertificateModal(true);
    };

    const closeCertificateModal = () => {
        setShowCertificateModal(false);
        setSelectedEmployeeId(null);
        setCertificateData({ certificateName: '', certificateImage: '' });
    };

    const handleCertificateSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await fetch('https://localhost:5000/api/employee-certificates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...certificateData,
                    employeeId: selectedEmployeeId
                }),
            });

            if (response.ok) {
                showAlert('success', 'Success!', 'Certificate created successfully!');
                closeCertificateModal();
                fetchEmployees();
            } else {
                showAlert('error', 'Error!', 'Failed to create certificate.');
            }
        } catch (error) {
            showAlert('error', 'Error!', 'Failed to save certificate data.');
        } finally {
            setLoading(false);
        }
    };

    const handleCertificateDelete = async (certificateId) => {
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
                    const response = await fetch(`https://localhost:5000/api/employee-certificates/${certificateId}`, {
                        method: 'DELETE',
                    });

                    if (response.ok) {
                        showAlert('success', 'Deleted!', 'Certificate has been deleted.');
                        fetchEmployees();
                    } else {
                        showAlert('error', 'Error!', 'Failed to delete certificate.');
                    }
                } catch (error) {
                    showAlert('error', 'Error!', 'Failed to delete certificate.');
                }
            }
        });
    };

    // Degree CRUD Functions
    const openDegreeModal = (employeeId) => {
        // Check if employee already has 8 degrees
        const employee = employees.find(emp => emp.id === employeeId);
        if (employee && employee.degrees && employee.degrees.length >= 8) {
            Swal.fire({
                title: 'Maximum Degrees Reached',
                text: 'An employee can have a maximum of 8 degrees.',
                icon: 'warning',
                confirmButtonText: 'OK',
                confirmButtonColor: '#1243AC'
            });
            return;
        }

        setSelectedEmployeeId(employeeId);
        setDegreeData({ universityName: '', startYear: '', endYear: '' });
        setShowDegreeModal(true);
    };

    const closeDegreeModal = () => {
        setShowDegreeModal(false);
        setSelectedEmployeeId(null);
        setDegreeData({ universityName: '', startYear: '', endYear: '' });
    };

    const handleDegreeSubmit = async (e) => {
        e.preventDefault();

        // Check if employee already has 8 degrees before submitting
        const employee = employees.find(emp => emp.id === selectedEmployeeId);
        if (employee && employee.degrees && employee.degrees.length >= 8) {
            Swal.fire({
                title: 'Maximum Degrees Reached',
                text: 'An employee can have a maximum of 8 degrees.',
                icon: 'warning',
                confirmButtonText: 'OK',
                confirmButtonColor: '#1243AC'
            });
            return;
        }

        try {
            setLoading(true);
            const response = await fetch('https://localhost:5000/api/employee-degrees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...degreeData,
                    employeeId: selectedEmployeeId,
                    startYear: parseInt(degreeData.startYear),
                    endYear: parseInt(degreeData.endYear)
                }),
            });

            if (response.ok) {
                showAlert('success', 'Success!', 'Degree created successfully!');
                closeDegreeModal();
                fetchEmployees();
            } else {
                showAlert('error', 'Error!', 'Failed to create degree.');
            }
        } catch (error) {
            showAlert('error', 'Error!', 'Failed to save degree data.');
        } finally {
            setLoading(false);
        }
    };

    const handleDegreeDelete = async (degreeId) => {
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
                    const response = await fetch(`https://localhost:5000/api/employee-degrees/${degreeId}`, {
                        method: 'DELETE',
                    });

                    if (response.ok) {
                        showAlert('success', 'Deleted!', 'Degree has been deleted.');
                        fetchEmployees();
                    } else {
                        showAlert('error', 'Error!', 'Failed to delete degree.');
                    }
                } catch (error) {
                    showAlert('error', 'Error!', 'Failed to delete degree.');
                }
            }
        });
    };

    // Inline editing functions for certificates
    const startEditingCertificate = (certificateId, certificate) => {
        setEditingCertificates(prev => ({ ...prev, [certificateId]: true }));
        setCertificateEditData(prev => ({
            ...prev,
            [certificateId]: {
                certificateName: certificate.certificateName,
                certificateImage: certificate.certificateImage
            }
        }));
    };

    const cancelEditingCertificate = (certificateId) => {
        setEditingCertificates(prev => ({ ...prev, [certificateId]: false }));
        setCertificateEditData(prev => {
            const newData = { ...prev };
            delete newData[certificateId];
            return newData;
        });
    };

    const handleCertificateEditChange = (certificateId, field, value) => {
        setCertificateEditData(prev => ({
            ...prev,
            [certificateId]: {
                ...prev[certificateId],
                [field]: value
            }
        }));
    };

    // Cleanup preview URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            // Cleanup any remaining preview URLs when component unmounts
            // (Note: Certificate images are now uploaded directly to server)
        };
    }, [certificateEditData]);

    // Save all certificate changes at once
    const saveAllCertificateChanges = async () => {
        const certificateIds = Object.keys(certificateEditData);

        if (certificateIds.length === 0) {

            return;
        }



        for (const certificateId of certificateIds) {
            try {
                const editData = certificateEditData[certificateId];

                // Get the original certificate data for comparison
                const originalCertificate = employees
                    .flatMap(emp => emp.certificates || [])
                    .find(cert => cert.id === parseInt(certificateId));

                if (!originalCertificate) {

                    continue;
                }

                // Prepare the data with only the fields that have been changed
                const dataToSend = {};
                let hasChanges = false;

                if (editData.certificateName !== undefined && editData.certificateName !== originalCertificate.certificateName) {
                    dataToSend.certificateName = editData.certificateName;
                    hasChanges = true;
                }
                if (editData.certificateImage !== undefined && editData.certificateImage !== originalCertificate.certificateImage) {
                    dataToSend.certificateImage = editData.certificateImage;
                    hasChanges = true;
                }

                if (!hasChanges) {

                    continue;
                }



                const response = await fetch(`https://localhost:5000/api/employee-certificates/${certificateId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataToSend),
                });

                if (response.ok) {

                } else {
                    // Certificate update failed
                }
            } catch (error) {
                // Certificate save error
            }
        }

        // Clear certificate edit data

        // Clear all certificate edit data after saving
        setCertificateEditData({});
    };

    // Save all degree changes at once
    const saveAllDegreeChanges = async () => {
        const degreeIds = Object.keys(degreeEditData);
        if (degreeIds.length === 0) {

            return;
        }



        for (const degreeIdStr of degreeIds) {
            try {
                const degreeId = parseInt(degreeIdStr);
                const editData = degreeEditData[degreeId];

                const original = employees
                    .flatMap(emp => emp.degrees || [])
                    .find(d => d.id === degreeId);

                if (!original) {

                    continue;
                }

                const payload = {};
                let hasChanges = false;

                if (editData.universityName !== undefined && editData.universityName !== original.universityName) {
                    payload.universityName = editData.universityName;
                    hasChanges = true;
                }

                if (editData.startYear !== undefined) {
                    const sy = parseInt(editData.startYear);
                    if (!isNaN(sy) && sy !== original.startYear) {
                        payload.startYear = sy;
                        hasChanges = true;
                    }
                }

                if (editData.endYear !== undefined) {
                    const ey = parseInt(editData.endYear);
                    if (!isNaN(ey) && ey !== original.endYear) {
                        payload.endYear = ey;
                        hasChanges = true;
                    }
                }

                if (!hasChanges) {

                    continue;
                }



                const response = await fetch(`https://localhost:5000/api/employee-degrees/${degreeId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    // Degree update failed
                }
            } catch (error) {
                // Degree save error
            }
        }

        // Clear degree edit data after saving
        setDegreeEditData({});
    };

    const saveCertificate = async (certificateId) => {
        try {
            setLoading(true);
            const editData = certificateEditData[certificateId];

            // Get the original certificate data for comparison
            const originalCertificate = employees
                .flatMap(emp => emp.certificates || [])
                .find(cert => cert.id === certificateId);

            // If no edit data, try to get current values from the form
            if (!editData) {
                showAlert('info', 'Info', 'No changes detected to save.');
                return;
            }

            // Prepare the data with only the fields that have been changed
            const dataToSend = {};
            let hasChanges = false;

            if (editData.certificateName !== undefined && editData.certificateName !== originalCertificate?.certificateName) {
                dataToSend.certificateName = editData.certificateName;
                hasChanges = true;
            }
            if (editData.certificateImage !== undefined && editData.certificateImage !== originalCertificate?.certificateImage) {
                dataToSend.certificateImage = editData.certificateImage;
                hasChanges = true;
            }



            if (!hasChanges) {
                showAlert('info', 'Info', 'No changes detected to save.');
                return;
            }

            const response = await fetch(`https://localhost:5000/api/employee-certificates/${certificateId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });



            if (response.ok) {
                showAlert('success', 'Success!', 'Certificate updated successfully!');
                setEditingCertificates(prev => ({ ...prev, [certificateId]: false }));
                setCertificateEditData(prev => {
                    const newData = { ...prev };
                    delete newData[certificateId];
                    return newData;
                });
                fetchEmployees();
            } else {
                showAlert('error', 'Error!', `Failed to update certificate. Status: ${response.status}`);
            }
        } catch (error) {
            showAlert('error', 'Error!', 'Failed to update certificate.');
        } finally {
            setLoading(false);
        }
    };

    // Inline editing functions for degrees
    const startEditingDegree = (degreeId, degree) => {
        setEditingDegrees(prev => ({ ...prev, [degreeId]: true }));
        setDegreeEditData(prev => ({
            ...prev,
            [degreeId]: {
                universityName: degree.universityName,
                startYear: degree.startYear,
                endYear: degree.endYear
            }
        }));
    };

    const cancelEditingDegree = (degreeId) => {
        setEditingDegrees(prev => ({ ...prev, [degreeId]: false }));
        setDegreeEditData(prev => {
            const newData = { ...prev };
            delete newData[degreeId];
            return newData;
        });
    };

    const handleDegreeEditChange = (degreeId, field, value) => {
        setDegreeEditData(prev => ({
            ...prev,
            [degreeId]: {
                ...prev[degreeId],
                [field]: value
            }
        }));
    };

    const saveDegree = async (degreeId) => {
        try {
            setLoading(true);
            const editData = degreeEditData[degreeId];
            // Build payload with only valid/changed fields
            const payload = {};
            const original = employees.flatMap(emp => emp.degrees || []).find(d => d.id === degreeId);
            if (editData?.universityName !== undefined && editData.universityName !== original?.universityName) {
                payload.universityName = editData.universityName;
            }
            if (editData?.startYear !== undefined) {
                const sy = parseInt(editData.startYear);
                if (!isNaN(sy) && sy !== original?.startYear) payload.startYear = sy;
            }
            if (editData?.endYear !== undefined) {
                const ey = parseInt(editData.endYear);
                if (!isNaN(ey) && ey !== original?.endYear) payload.endYear = ey;
            }

            if (Object.keys(payload).length === 0) {
                showAlert('info', 'Info', 'No degree changes to save.');
                setLoading(false);
                return;
            }

            const response = await fetch(`https://localhost:5000/api/employee-degrees/${degreeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                showAlert('success', 'Success!', 'Degree updated successfully!');
                setEditingDegrees(prev => ({ ...prev, [degreeId]: false }));
                setDegreeEditData(prev => {
                    const newData = { ...prev };
                    delete newData[degreeId];
                    return newData;
                });
                fetchEmployees();
            } else {
                showAlert('error', 'Error!', `Failed to update degree. Status: ${response.status}`);
            }
        } catch (error) {
            showAlert('error', 'Error!', 'Failed to update degree.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="admin-employee-loading">Loading...</div>;

    return (
        <div className="admin-employee-page">
            <div className="admin-employee-container">
                {/* Header with Create Button */}
                <div className="admin-employee-header">
                    <h1>Employee Management</h1>
                    <div className="admin-employee-header-actions">
                        <div className="admin-employee-search-container">
                            <input
                                type="text"
                                placeholder="Search employees..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="admin-employee-search-input"
                            />
                        </div>
                        <button
                            className="admin-employee-create-btn"
                            onClick={openCreateModal}
                            title="Create new employee"
                        >
                            Create Employee
                        </button>
                    </div>
                </div>

                {/* Employees List */}
                <div className="admin-employee-list-section">
                    {filteredEmployees.length === 0 ? (
                        <div className="admin-employee-no-employees">
                            <h3>No employees found</h3>
                            <p>Create your first employee to get started!</p>
                            <button
                                className="admin-employee-create-first-btn"
                                onClick={openCreateModal}
                            >
                                Create First Employee
                            </button>
                        </div>
                    ) : (
                        currentEmployees.map((employee) => {
                            const currentData = editingEmployees[employee.id] || employee;

                            return (
                                <div key={employee.id} className="admin-employee-card">
                                    <div className="admin-employee-card-header">
                                        <h2>Employee #{employee.id}</h2>
                                        <input
                                            type="text"
                                            className="admin-employee-inline-input"
                                            value={currentData.fullname || ''}
                                            onChange={(e) => handleInlineInputChange(employee.id, 'fullname', e.target.value)}
                                            maxLength={200}
                                            placeholder="Employee fullname"
                                        />
                                    </div>

                                    <div className="admin-employee-form">
                                        <div className="form-fields-left">
                                            <div className="form-group">
                                                <label>Full Name</label>
                                                <div className="input-container">
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        value={currentData.fullname || ''}
                                                        onChange={(e) => handleInlineInputChange(employee.id, 'fullname', e.target.value)}
                                                        maxLength={200}
                                                        placeholder="Employee full name"
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Field/Specialization</label>
                                                <div className="input-container">
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        value={currentData.field || ''}
                                                        onChange={(e) => handleInlineInputChange(employee.id, 'field', e.target.value)}
                                                        maxLength={200}
                                                        placeholder="Medical field or specialization"
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Clinic</label>
                                                <div className="input-container">
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        value={currentData.clinic || ''}
                                                        onChange={(e) => handleInlineInputChange(employee.id, 'clinic', e.target.value)}
                                                        maxLength={200}
                                                        placeholder="Clinic name"
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Phone</label>
                                                <div className="input-container">
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        value={currentData.phone || ''}
                                                        onChange={(e) => handleInlineInputChange(employee.id, 'phone', e.target.value)}
                                                        maxLength={50}
                                                        placeholder="Phone number"
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>WhatsApp</label>
                                                <div className="input-container">
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        value={currentData.whatsApp || ''}
                                                        onChange={(e) => handleInlineInputChange(employee.id, 'whatsApp', e.target.value)}
                                                        maxLength={50}
                                                        placeholder="WhatsApp number"
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Email</label>
                                                <div className="input-container">
                                                    <input
                                                        type="email"
                                                        className="form-input"
                                                        value={currentData.email || ''}
                                                        onChange={(e) => handleInlineInputChange(employee.id, 'email', e.target.value)}
                                                        maxLength={200}
                                                        placeholder="Email address"
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Location</label>
                                                <div className="input-container">
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        value={currentData.location || ''}
                                                        onChange={(e) => handleInlineInputChange(employee.id, 'location', e.target.value)}
                                                        maxLength={200}
                                                        placeholder="Location"
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>First Description</label>
                                                <textarea
                                                    className="form-textarea"
                                                    value={currentData.firstDesc || ''}
                                                    onChange={(e) => handleInlineInputChange(employee.id, 'firstDesc', e.target.value)}
                                                    maxLength={1000}
                                                    placeholder="First description about the employee"
                                                    rows={4}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Second Description</label>
                                                <textarea
                                                    className="form-textarea"
                                                    value={currentData.secondDesc || ''}
                                                    onChange={(e) => handleInlineInputChange(employee.id, 'secondDesc', e.target.value)}
                                                    maxLength={1000}
                                                    placeholder="Second description about the employee"
                                                    rows={4}
                                                />
                                            </div>
                                        </div>

                                        <div className="image-section-right">
                                            <div className="image-section">
                                                <h4>Profile Image</h4>
                                                <div className="image-placeholder">
                                                    {currentData.image ? (
                                                        <img
                                                            src={getContextualImagePath(currentData.image, 'admin')}
                                                            alt="Employee profile"
                                                            className="current-image"
                                                            key={currentData.image}
                                                        />
                                                    ) : (
                                                        <div className="image-placeholder-text">
                                                            No profile image
                                                        </div>
                                                    )}

                                                    <div className="admin-employee-image-bottom-left-content">
                                                        <div className="image-actions">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleInlineImageDelete(employee.id, 'image')}
                                                                className="action-btn delete-btn"
                                                                title="Delete profile image"
                                                            >
                                                                <img src={adminDeleteIcon} alt="Delete" className="action-icon" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleInlineImageBrowse(employee.id, 'image')}
                                                                className="action-btn refresh-btn"
                                                                title="Browse profile image"
                                                            >
                                                                <img src={adminBrowseIcon} alt="Browse" className="action-icon" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="image-section">
                                                <h4>Detail Image</h4>
                                                <div className="image-placeholder">
                                                    {currentData.detailImage ? (
                                                        <img
                                                            src={getContextualImagePath(currentData.detailImage, 'admin')}
                                                            alt="Employee detail"
                                                            className="current-image"
                                                            key={currentData.detailImage}
                                                        />
                                                    ) : (
                                                        <div className="image-placeholder-text">
                                                            No detail image
                                                        </div>
                                                    )}

                                                    <div className="admin-employee-image-bottom-left-content">
                                                        <div className="image-actions">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleInlineImageDelete(employee.id, 'detailImage')}
                                                                className="action-btn delete-btn"
                                                                title="Delete detail image"
                                                            >
                                                                <img src={adminDeleteIcon} alt="Delete" className="action-icon" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleInlineImageBrowse(employee.id, 'detailImage')}
                                                                className="action-btn refresh-btn"
                                                                title="Browse detail image"
                                                            >
                                                                <img src={adminBrowseIcon} alt="Browse" className="action-icon" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="image-info">
                                                *Yüklənən şəkillər 318 x 387 ölçüsündə olmalıdır
                                            </div>
                                        </div>
                                    </div>

                                    {/* Certificates & Degrees Section - Full Width */}
                                    <div className="credentials-section">
                                        <div className="section-header">
                                            <h4>Credentials</h4>
                                            <div className="add-buttons">
                                                <button
                                                    type="button"
                                                    className="add-item-btn certificate-btn"
                                                    onClick={() => openCertificateModal(employee.id)}
                                                    title="Add certificate"
                                                >
                                                    + Certificate
                                                </button>
                                                <button
                                                    type="button"
                                                    className="add-item-btn degree-btn"
                                                    onClick={() => openDegreeModal(employee.id)}
                                                    title={employee.degrees && employee.degrees.length >= 8 ? "Maximum 8 degrees allowed" : "Add degree"}
                                                    disabled={employee.degrees && employee.degrees.length >= 8}
                                                >
                                                    + Degree
                                                </button>
                                            </div>
                                        </div>

                                        <div className="credentials-compact-list">
                                            {/* Certificates (Admin-About like grid) */}
                                            <div className="credentials-section-compact">
                                                <h5 className="section-title">Certificates</h5>
                                                <div className="employee-certificates-grid">
                                                    {currentData.certificates && currentData.certificates.length > 0 ? (
                                                        currentData.certificates.map((certificate, index) => {
                                                            return (
                                                                <div key={certificate.id} className="employee-certificate-tile">
                                                                    <div className="employee-certificate-number">#{String(index + 1).padStart(2, '0')}</div>
                                                                    {(() => {
                                                                        const editData = certificateEditData[certificate.id];
                                                                        const currentImage = editData?.certificateImage || certificate.certificateImage;

                                                                        return currentImage ? (
                                                                            <img
                                                                                src={getContextualImagePath(currentImage, 'admin')}
                                                                                alt={certificate.certificateName}
                                                                                className="employee-certificate-image"
                                                                                key={currentImage}
                                                                                onError={(e) => {
                                                                                    e.target.style.display = 'none';
                                                                                    e.target.nextSibling && (e.target.nextSibling.style.display = 'block');
                                                                                }}
                                                                            />
                                                                        ) : null;
                                                                    })()}
                                                                    {(() => {
                                                                        const editData = certificateEditData[certificate.id];
                                                                        const currentImage = editData?.certificateImage || certificate.certificateImage;
                                                                        return !currentImage && (
                                                                            <div className="employee-certificate-fallback">No Image</div>
                                                                        );
                                                                    })()}
                                                                    <div className="employee-certificate-actions">
                                                                        <button
                                                                            type="button"
                                                                            className="employee-cert-action-btn"
                                                                            title="Browse image"
                                                                            onClick={() => handleCertificateImageBrowse(certificate.id)}
                                                                        >📁</button>
                                                                        <button
                                                                            type="button"
                                                                            className="employee-cert-action-btn"
                                                                            title="Delete"
                                                                            onClick={() => handleCertificateDelete(certificate.id)}
                                                                        >✕</button>
                                                                    </div>
                                                                    <input
                                                                        type="text"
                                                                        className="field-input certificate-name-input"
                                                                        value={certificateEditData[certificate.id]?.certificateName || certificate.certificateName || ''}
                                                                        onChange={(e) => handleCertificateEditChange(certificate.id, 'certificateName', e.target.value)}
                                                                        placeholder="Certificate name"
                                                                    />
                                                                    <input
                                                                        type="text"
                                                                        className="field-input certificate-image-input"
                                                                        value={certificateEditData[certificate.id]?.certificateImage || certificate.certificateImage || ''}
                                                                        onChange={(e) => handleCertificateEditChange(certificate.id, 'certificateImage', e.target.value)}
                                                                        placeholder="Image filename"
                                                                    />
                                                                </div>
                                                            );
                                                        })
                                                    ) : (
                                                        <div className="no-items" style={{ gridColumn: '1 / -1' }}>No certificates</div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Degrees */}
                                            <div className="credentials-section-compact">
                                                <h5 className="section-title">Degrees</h5>
                                                {currentData.degrees && currentData.degrees.length > 0 ? (
                                                    currentData.degrees.map((degree, index) => (
                                                        <div key={degree.id} className="credential-item-compact">
                                                            <div className="credential-number">{String(index + 1).padStart(2, '0')}</div>
                                                            <div className="credential-fields">
                                                                <div className="degree-content">
                                                                    <input
                                                                        type="text"
                                                                        className="field-input degree-university-input"
                                                                        value={degreeEditData[degree.id]?.universityName || degree.universityName || ''}
                                                                        onChange={(e) => handleDegreeEditChange(degree.id, 'universityName', e.target.value)}
                                                                        placeholder="University name"
                                                                    />
                                                                    <div className="year-inputs">
                                                                        <input
                                                                            type="number"
                                                                            className="year-input"
                                                                            value={degreeEditData[degree.id]?.startYear || degree.startYear || ''}
                                                                            onChange={(e) => handleDegreeEditChange(degree.id, 'startYear', e.target.value)}
                                                                            placeholder="Start"
                                                                            min="1900"
                                                                            max="2100"
                                                                        />
                                                                        <span>-</span>
                                                                        <input
                                                                            type="number"
                                                                            className="year-input"
                                                                            value={degreeEditData[degree.id]?.endYear || degree.endYear || ''}
                                                                            onChange={(e) => handleDegreeEditChange(degree.id, 'endYear', e.target.value)}
                                                                            placeholder="End"
                                                                            min="0"
                                                                            max="2100"
                                                                        />
                                                                    </div>
                                                                    <div className="action-buttons">
                                                                        <button type="button" className="btn-delete" onClick={() => handleDegreeDelete(degree.id)}>🗑️</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="no-items">No degrees</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-actions">
                                        <button
                                            className="admin-employee-save-btn"
                                            onClick={() => saveEmployee(employee.id)}
                                            disabled={loading}
                                            title="Save changes"
                                        >
                                            {loading ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                            className="admin-employee-delete-btn"
                                            onClick={() => handleDelete(employee.id)}
                                            title="Delete employee"
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
                {filteredEmployees.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        onPreviousPage={handlePreviousPage}
                        onNextPage={handleNextPage}
                        startIndex={startIndex}
                        endIndex={endIndex}
                        totalItems={filteredEmployees.length}
                        itemsPerPage={1}
                        showInfo={true}
                        className="admin-employee-pagination"
                    />
                )}
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="admin-employee-modal-overlay" onClick={closeModal}>
                    <div className="admin-employee-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-employee-modal-header">
                            <h2>Create New Employee</h2>
                            <button
                                className="admin-employee-modal-close"
                                onClick={closeModal}
                            >
                                ×
                            </button>
                        </div>

                        <form className="admin-employee-modal-form" onSubmit={handleSubmit}>
                            <div className="admin-employee-modal-fields">
                                <div className="admin-employee-modal-left">
                                    {/* Basic Information */}
                                    <div className="admin-employee-form-group">
                                        <label htmlFor="fullname">Full Name</label>
                                        <input
                                            type="text"
                                            id="fullname"
                                            name="fullname"
                                            className="admin-employee-form-input"
                                            value={employeeData.fullname}
                                            onChange={(e) => setEmployeeData(prev => ({ ...prev, fullname: e.target.value }))}
                                            maxLength={200}
                                            required
                                            placeholder="Enter employee full name"
                                        />
                                    </div>

                                    <div className="admin-employee-form-group">
                                        <label htmlFor="field">Field/Specialization</label>
                                        <input
                                            type="text"
                                            id="field"
                                            name="field"
                                            className="admin-employee-form-input"
                                            value={employeeData.field}
                                            onChange={(e) => setEmployeeData(prev => ({ ...prev, field: e.target.value }))}
                                            maxLength={200}
                                            required
                                            placeholder="Enter medical field or specialization"
                                        />
                                    </div>

                                    <div className="admin-employee-form-group">
                                        <label htmlFor="clinic">Clinic</label>
                                        <input
                                            type="text"
                                            id="clinic"
                                            name="clinic"
                                            className="admin-employee-form-input"
                                            value={employeeData.clinic}
                                            onChange={(e) => setEmployeeData(prev => ({ ...prev, clinic: e.target.value }))}
                                            maxLength={200}
                                            placeholder="Enter clinic name"
                                        />
                                    </div>

                                    <div className="admin-employee-form-group">
                                        <label htmlFor="phone">Phone</label>
                                        <input
                                            type="text"
                                            id="phone"
                                            name="phone"
                                            className="admin-employee-form-input"
                                            value={employeeData.phone}
                                            onChange={(e) => setEmployeeData(prev => ({ ...prev, phone: e.target.value }))}
                                            maxLength={50}
                                            placeholder="Enter phone number"
                                        />
                                    </div>

                                    <div className="admin-employee-form-group">
                                        <label htmlFor="whatsApp">WhatsApp</label>
                                        <input
                                            type="text"
                                            id="whatsApp"
                                            name="whatsApp"
                                            className="admin-employee-form-input"
                                            value={employeeData.whatsApp}
                                            onChange={(e) => setEmployeeData(prev => ({ ...prev, whatsApp: e.target.value }))}
                                            maxLength={50}
                                            placeholder="Enter WhatsApp number"
                                        />
                                    </div>

                                    <div className="admin-employee-form-group">
                                        <label htmlFor="email">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            className="admin-employee-form-input"
                                            value={employeeData.email}
                                            onChange={(e) => setEmployeeData(prev => ({ ...prev, email: e.target.value }))}
                                            maxLength={200}
                                            placeholder="Enter email address"
                                        />
                                    </div>

                                    <div className="admin-employee-form-group">
                                        <label htmlFor="location">Location</label>
                                        <input
                                            type="text"
                                            id="location"
                                            name="location"
                                            className="admin-employee-form-input"
                                            value={employeeData.location}
                                            onChange={(e) => setEmployeeData(prev => ({ ...prev, location: e.target.value }))}
                                            maxLength={200}
                                            placeholder="Enter location"
                                        />
                                    </div>
                                </div>

                                <div className="admin-employee-modal-right">
                                    {/* Description Section */}
                                    <div className="admin-employee-form-group">
                                        <label htmlFor="firstDesc">First Description</label>
                                        <textarea
                                            id="firstDesc"
                                            name="firstDesc"
                                            className="admin-employee-form-textarea"
                                            value={employeeData.firstDesc}
                                            onChange={(e) => setEmployeeData(prev => ({ ...prev, firstDesc: e.target.value }))}
                                            maxLength={1000}
                                            rows={4}
                                            placeholder="Enter first description about the employee"
                                        />
                                    </div>

                                    <div className="admin-employee-form-group">
                                        <label htmlFor="secondDesc">Second Description</label>
                                        <textarea
                                            id="secondDesc"
                                            name="secondDesc"
                                            className="admin-employee-form-textarea"
                                            value={employeeData.secondDesc}
                                            onChange={(e) => setEmployeeData(prev => ({ ...prev, secondDesc: e.target.value }))}
                                            maxLength={1000}
                                            rows={4}
                                            placeholder="Enter second description about the employee"
                                        />
                                    </div>

                                    {/* Image Section */}
                                    <div className="admin-employee-modal-image-section">
                                        <div className="admin-employee-image-section">
                                            <h4>Profile Image</h4>
                                            <div className="admin-employee-image-placeholder">
                                                {employeeData.image ? (
                                                    <img
                                                        src={employeeData.image === 'employee1.png' ? employee1Image : getContextualImagePath(employeeData.image, 'employee')}
                                                        alt="Employee profile"
                                                        className="admin-employee-current-image"
                                                        onError={(e) => {

                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="admin-employee-image-placeholder-text">
                                                        No profile image
                                                    </div>
                                                )}

                                                <div className="admin-employee-image-bottom-left-content">
                                                    <div className="admin-employee-image-actions">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleImageDelete('image')}
                                                            className="admin-employee-action-btn admin-employee-delete-btn"
                                                            title="Delete profile image"
                                                        >
                                                            <img src={adminDeleteIcon} alt="Delete" className="admin-employee-action-icon" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleImageBrowse('image')}
                                                            className="admin-employee-action-btn admin-employee-refresh-btn"
                                                            title="Browse profile image"
                                                        >
                                                            <img src={adminBrowseIcon} alt="Browse" className="admin-employee-action-icon" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="admin-employee-image-section">
                                            <h4>Detail Image</h4>
                                            <div className="admin-employee-image-placeholder">
                                                {employeeData.detailImage ? (
                                                    <img
                                                        src={getContextualImagePath(employeeData.detailImage, 'employee')}
                                                        alt="Employee detail"
                                                        className="admin-employee-current-image"
                                                        onError={(e) => {

                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="admin-employee-image-placeholder-text">
                                                        No detail image
                                                    </div>
                                                )}

                                                <div className="admin-employee-image-bottom-left-content">
                                                    <div className="admin-employee-image-actions">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleImageDelete('detailImage')}
                                                            className="admin-employee-action-btn admin-employee-delete-btn"
                                                            title="Delete detail image"
                                                        >
                                                            <img src={adminDeleteIcon} alt="Delete" className="admin-employee-action-icon" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleImageBrowse('detailImage')}
                                                            className="admin-employee-action-btn admin-employee-refresh-btn"
                                                            title="Browse detail image"
                                                        >
                                                            <img src={adminBrowseIcon} alt="Browse" className="admin-employee-action-icon" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="admin-employee-image-info">
                                            *Yüklənən şəkillər 318 x 387 ölçüsündə olmalıdır
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="admin-employee-modal-actions">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="admin-employee-cancel-btn"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="admin-employee-submit-btn"
                                >
                                    {loading ? 'Saving...' : 'Create Employee'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Certificate Modal */}
            {showCertificateModal && (
                <div className="admin-employee-modal-overlay" onClick={closeCertificateModal}>
                    <div className="admin-employee-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-employee-modal-header">
                            <h2>Add Certificate</h2>
                            <button
                                className="admin-employee-modal-close"
                                onClick={closeCertificateModal}
                            >
                                ×
                            </button>
                        </div>

                        <form className="admin-employee-modal-form" onSubmit={handleCertificateSubmit}>
                            <div className="admin-employee-form-group">
                                <label htmlFor="certificateName">Certificate Name</label>
                                <input
                                    type="text"
                                    id="certificateName"
                                    name="certificateName"
                                    className="admin-employee-form-input"
                                    value={certificateData.certificateName}
                                    onChange={(e) => setCertificateData(prev => ({ ...prev, certificateName: e.target.value }))}
                                    maxLength={255}
                                    required
                                    placeholder="Enter certificate name"
                                />
                            </div>

                            <div className="admin-employee-form-group">
                                <label htmlFor="certificateImage">Certificate Image</label>
                                <div className="certificate-image-input-container">
                                    <input
                                        type="text"
                                        id="certificateImage"
                                        name="certificateImage"
                                        className="admin-employee-form-input"
                                        value={certificateData.certificateImage}
                                        onChange={(e) => setCertificateData(prev => ({ ...prev, certificateImage: e.target.value }))}
                                        maxLength={500}
                                        placeholder="Enter image filename (e.g., certificate1.png)"
                                    />
                                    <button
                                        type="button"
                                        className="browse-image-btn"
                                        onClick={handleCertificateModalImageBrowse}
                                        title="Browse for certificate image"
                                    >
                                        📁 Browse
                                    </button>
                                </div>
                                {certificateData.certificateImage && (
                                    <div className="certificate-preview">
                                        <img
                                            src={getContextualImagePath(certificateData.certificateImage, 'admin')}
                                            alt="Certificate preview"
                                            className="certificate-preview-image"
                                            onClick={() => setShowCertificateImagePreview(true)}
                                            onError={(e) => {

                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="admin-employee-modal-actions">
                                <button
                                    type="button"
                                    onClick={closeCertificateModal}
                                    className="admin-employee-cancel-btn"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="admin-employee-submit-btn"
                                >
                                    {loading ? 'Saving...' : 'Add Certificate'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showCertificateImagePreview && (
                <div className="admin-employee-modal-overlay" onClick={() => setShowCertificateImagePreview(false)}>
                    <div className="image-preview-modal" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={getContextualImagePath(certificateData.certificateImage, 'admin')}
                            alt="Certificate full preview"
                            className="image-preview-modal-img"
                        />
                        <button className="image-preview-close" onClick={() => setShowCertificateImagePreview(false)}>×</button>
                    </div>
                </div>
            )}

            {/* Degree Modal */}
            {showDegreeModal && (
                <div className="admin-employee-modal-overlay" onClick={closeDegreeModal}>
                    <div className="admin-employee-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-employee-modal-header">
                            <h2>Add Degree</h2>
                            <button
                                className="admin-employee-modal-close"
                                onClick={closeDegreeModal}
                            >
                                ×
                            </button>
                        </div>

                        <form className="admin-employee-modal-form" onSubmit={handleDegreeSubmit}>
                            <div className="admin-employee-form-group">
                                <label htmlFor="universityName">University Name</label>
                                <input
                                    type="text"
                                    id="universityName"
                                    name="universityName"
                                    className="admin-employee-form-input"
                                    value={degreeData.universityName}
                                    onChange={(e) => setDegreeData(prev => ({ ...prev, universityName: e.target.value }))}
                                    maxLength={255}
                                    required
                                    placeholder="Enter university name"
                                />
                            </div>

                            <div className="admin-employee-form-group">
                                <label htmlFor="startYear">Start Year</label>
                                <input
                                    type="number"
                                    id="startYear"
                                    name="startYear"
                                    className="admin-employee-form-input"
                                    value={degreeData.startYear}
                                    onChange={(e) => setDegreeData(prev => ({ ...prev, startYear: e.target.value }))}
                                    min="1900"
                                    max="2100"
                                    required
                                    placeholder="Enter start year"
                                />
                            </div>

                            <div className="admin-employee-form-group">
                                <label htmlFor="endYear">End Year (0 for present)</label>
                                <input
                                    type="number"
                                    id="endYear"
                                    name="endYear"
                                    className="admin-employee-form-input"
                                    value={degreeData.endYear}
                                    onChange={(e) => setDegreeData(prev => ({ ...prev, endYear: e.target.value }))}
                                    min="0"
                                    max="2100"
                                    required
                                    placeholder="Enter end year (0 for present)"
                                />
                            </div>

                            <div className="admin-employee-modal-actions">
                                <button
                                    type="button"
                                    onClick={closeDegreeModal}
                                    className="admin-employee-cancel-btn"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="admin-employee-submit-btn"
                                >
                                    {loading ? 'Saving...' : 'Add Degree'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminEmployee;
