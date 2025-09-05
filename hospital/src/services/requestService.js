import { api } from './api';

const REQUEST_ENDPOINT = '/requests';

export const requestService = {
    // Get all requests
    getAllRequests: () => api.get(REQUEST_ENDPOINT),

    // Get a specific request by ID
    getRequestById: (id) => api.get(`${REQUEST_ENDPOINT}/${id}`),

    // Create a new request
    createRequest: (requestData) => api.post(REQUEST_ENDPOINT, requestData),

    // Update an existing request
    updateRequest: (id, requestData) => api.put(`${REQUEST_ENDPOINT}/${id}`, requestData),

    // Delete a request
    deleteRequest: (id) => api.delete(`${REQUEST_ENDPOINT}/${id}`),

    // Update request status
    updateRequestStatus: (id, status) => api.patch(`${REQUEST_ENDPOINT}/${id}/status`, { status }),

    // Get request count
    getRequestCount: () => api.get(`${REQUEST_ENDPOINT}/count`)
};
