// Simple key-value structure for contact data
export const contactData = {
    // Page heading
    heading: {
        line1: "Nə sualın varsa,",
        line2: "buradayıq!"
    },

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
        }
    ],

    // Social media links
    socialMedia: [
        {
            platform: 'facebook',
            name: 'Facebook',
            url: 'https://facebook.com/hospital',
            icon: 'facebook.png'
        },
        {
            platform: 'instagram',
            name: 'Instagram',
            url: 'https://instagram.com/hospital',
            icon: 'instagram.png'
        },
        {
            platform: 'linkedin',
            name: 'LinkedIn',
            url: 'https://linkedin.com/company/hospital',
            icon: 'linkedin.png'
        },
        {
            platform: 'youtube',
            name: 'YouTube',
            url: 'https://youtube.com/hospital',
            icon: 'youtube.png'
        },
        {
            platform: 'telegram',
            name: 'Telegram',
            url: 'https://t.me/hospital',
            icon: 'telegram.png'
        }
    ]
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
    getSocialMediaByPlatform: (platform) => contactData.socialMedia.find(item => item.platform === platform)
};
