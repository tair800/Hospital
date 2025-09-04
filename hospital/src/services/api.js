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

        return await response.json()
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
    delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),
}
