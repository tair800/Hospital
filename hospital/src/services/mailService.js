import { api } from './api';

const MAIL_ENDPOINT = '/mail';

export const mailService = {
    // Get all mails
    getAllMails: () => api.get(MAIL_ENDPOINT),

    // Get mail by ID
    getMailById: (id) => api.get(`${MAIL_ENDPOINT}/${id}`),

    // Get mails by status
    getMailsByStatus: (status) => api.get(`${MAIL_ENDPOINT}/status/${status}`),

    // Get mail counts
    getMailCounts: () => api.get(`${MAIL_ENDPOINT}/count`),

    // Submit contact form (creates new mail)
    submitContactForm: (formData) => api.post(MAIL_ENDPOINT, formData),

    // Update mail
    updateMail: (id, mailData) => api.put(`${MAIL_ENDPOINT}/${id}`, mailData),

    // Update mail status
    updateMailStatus: (id, status) => api.put(`${MAIL_ENDPOINT}/${id}/status`, { status }),

    // Reply to mail
    replyToMail: (id, replyMessage) => api.put(`${MAIL_ENDPOINT}/${id}/reply`, { replyMessage }),

    // Delete mail
    deleteMail: (id) => api.delete(`${MAIL_ENDPOINT}/${id}`)
};
