// Simple key-value structure for contact data
export const contactData = {


    // Contact information
    contactInfo: [
        {
            type: 'phone',
            value: '+(994) 50 xxx xx xx',
            icon: 'phone-icon.png'
        },
        {
            type: 'whatsapp',
            value: '+(994) 50 xxx xx xx',
            icon: 'whatsapp-icon.png'
        },
        {
            type: 'email',
            value: 'examplegmail.com',
            icon: 'mail-icon.png'
        },
        {
            type: 'location',
            value: 'Bakı, Azərbaycan',
            icon: 'location-icon.png'
        },
        {
            type: 'facebook',
            value: 'https://facebook.com/hospital',
            icon: 'facebook.png'
        },
        {
            type: 'instagram',
            value: 'https://instagram.com/hospital',
            icon: 'instagram.png'
        },
        {
            type: 'linkedin',
            value: 'https://linkedin.com/company/hospital',
            icon: 'linkedin.png'
        },
        {
            type: 'youtube',
            value: 'https://youtube.com/hospital',
            icon: 'youtube.png'
        },
        {
            type: 'telegram',
            value: 'https://t.me/hospital',
            icon: 'telegram.png'
        }
    ],


};

// Simple helper functions
export const contactDataHelpers = {
    // Get all contact info
    getContactInfo: () => contactData.contactInfo,

    // Get all social media
    getSocialMedia: () => contactData.socialMedia,

    // Get contact info by type
    getContactInfoByType: (type) => contactData.contactInfo.find(item => item.type === type),

    // Get social media by platform
    getSocialMediaByPlatform: (platform) => contactData.socialMedia.find(item => item.type === platform)
};
