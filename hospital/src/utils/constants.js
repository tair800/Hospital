// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://ahpbca-api.webonly.io/api',
  TIMEOUT: 10000,
}

// Routes
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  EVENTS: '/events',
  GALLERY: '/gallery',
  BLOG: '/blog',
  EMPLOYEE: '/employee',
  CONTACT: '/contact',
  ADMIN: '/admin',
  ADMIN_LOGIN: '/admin/login',
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 6,
  MAX_PAGE_SIZE: 50,
}

// File Upload
export const UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
}

// Local Storage Keys
export const STORAGE_KEYS = {
  ADMIN_AUTH: 'adminAuthenticated',
  USER_PREFERENCES: 'userPreferences',
  THEME: 'theme',
}
