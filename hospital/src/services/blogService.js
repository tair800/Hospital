import { api } from './api'

export const blogService = {
  // Get all blogs
  getAllBlogs: () => api.get('/blogs'),
  
  // Get blog by ID
  getBlogById: (id) => api.get(`/blogs/${id}`),
  
  // Create blog
  createBlog: (blogData) => api.post('/blogs', blogData),
  
  // Update blog
  updateBlog: (id, blogData) => api.put(`/blogs/${id}`, blogData),
  
  // Delete blog
  deleteBlog: (id) => api.delete(`/blogs/${id}`),
}
