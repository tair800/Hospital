import { api } from './api'

export const eventsService = {
  // Get all events
  getAllEvents: () => api.get('/events'),
  
  // Get event by ID
  getEventById: (id) => api.get(`/events/${id}`),
  
  // Get upcoming events
  getUpcomingEvents: () => api.get('/events/upcoming'),
  
  // Get upcoming events count
  getUpcomingEventsCount: () => api.get('/events/upcoming/count'),
  
  // Create event
  createEvent: (eventData) => api.post('/events', eventData),
  
  // Update event
  updateEvent: (id, eventData) => api.put(`/events/${id}`, eventData),
  
  // Delete event
  deleteEvent: (id) => api.delete(`/events/${id}`),
}
