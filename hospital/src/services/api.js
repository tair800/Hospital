// Base API configuration
const API_BASE_URL = 'http://localhost:5000/api'

// Generic API request function
export const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`

    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    }

    const config = { ...defaultOptions, ...options }

    try {
        const response = await fetch(url, config)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        // Handle different response types
        const contentType = response.headers.get('content-type')

        // If response is empty (like DELETE requests with NoContent), return null
        if (response.status === 204) {
            return null
        }

        // Check if response has content
        const contentLength = response.headers.get('content-length')
        if (contentLength === '0' || !response.body) {
            return null
        }

        // If response is JSON, parse it
        if (contentType && contentType.includes('application/json')) {
            const text = await response.text()
            return text ? JSON.parse(text) : null
        }

        // For other content types, return the response text
        return await response.text()
    } catch (error) {
        console.error('API request failed:', error)
        throw error
    }
}

// HTTP methods
export const api = {
    get: (endpoint) => apiRequest(endpoint, { method: 'GET' }),
    post: (endpoint, data) => apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    put: (endpoint, data) => apiRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    patch: (endpoint, data) => apiRequest(endpoint, {
        method: 'PATCH',
        body: JSON.stringify(data),
    }),
    delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),
}
