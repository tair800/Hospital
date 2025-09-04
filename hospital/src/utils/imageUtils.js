/**
 * Utility functions for handling image paths in the admin dashboard
 */

/**
 * Get the correct image path for display in the admin dashboard
 * @param {string} imageName - The image name or path from the API
 * @returns {string} - The properly formatted image path
 */
export const getImagePath = (imageName) => {
    if (!imageName) return '';

    // If it's already a full path (starts with / or http), return as is
    if (imageName.startsWith('/') || imageName.startsWith('http')) {
        return imageName;
    }

    // For local assets, prefix with /src/assets/
    return `/src/assets/${imageName}`;
};

/**
 * Get the correct image path for uploads (server-side images)
 * @param {string} imageName - The image name from the API
 * @returns {string} - The properly formatted upload path
 */
export const getUploadPath = (imageName) => {
    if (!imageName) return '';

    // If it's already a full path, return as is
    if (imageName.startsWith('/') || imageName.startsWith('http')) {
        return imageName;
    }

    // For uploads, prefix with /uploads/
    return `/uploads/${imageName}`;
};

/**
 * Get the correct image path with fallback logic
 * @param {string} imageName - The image name from the API
 * @param {string} fallbackPath - Fallback path if image is not found
 * @returns {string} - The properly formatted image path
 */
export const getImagePathWithFallback = (imageName, fallbackPath = '') => {
    if (!imageName) return fallbackPath;

    // If it's already a full path, return as is
    if (imageName.startsWith('/') || imageName.startsWith('http')) {
        return imageName;
    }

    // For local assets, prefix with /src/assets/
    return `/src/assets/${imageName}`;
};

/**
 * Check if an image path is a local asset
 * @param {string} imageName - The image name to check
 * @returns {boolean} - True if it's a local asset
 */
export const isLocalAsset = (imageName) => {
    if (!imageName) return false;

    // Common local asset patterns
    const localAssetPatterns = [
        'contact-bg.png',
        'admin-bg.png',
        'blog1.png',
        'employee1.png',
        'event-img.png',
        'phone-icon.png',
        'location-icon.png',
        'mail-icon.png',
        'whatsapp-icon.png',
        'facebook.png',
        'instagram.png',
        'telegram.png',
        'youtube.png'
    ];

    return localAssetPatterns.some(pattern => imageName.includes(pattern));
};

/**
 * Get the correct image path based on context
 * @param {string} imageName - The image name from the API
 * @param {string} context - The context: 'admin', 'gallery', 'blog', 'employee', 'event'
 * @returns {string} - The properly formatted image path
 */
export const getContextualImagePath = (imageName, context = 'admin') => {
    if (!imageName) return '';

    // If it's already a full path, return as is
    if (imageName.startsWith('/') || imageName.startsWith('http')) {
        return imageName;
    }

    // Check if it's a local asset
    if (isLocalAsset(imageName)) {
        return `/src/assets/${imageName}`;
    }

    // For different contexts, use appropriate paths
    switch (context) {
        case 'gallery':
        case 'blog':
        case 'employee':
        case 'event':
            // These might be uploads or local assets
            return imageName.includes('upload') ? `/uploads/${imageName}` : `/src/assets/${imageName}`;
        case 'admin':
        default:
            // Default to local assets for admin
            return `/src/assets/${imageName}`;
    }
};
