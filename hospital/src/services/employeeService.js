import { api } from './api'

export const employeeService = {
  // Get all employees
  getAllEmployees: () => api.get('/employees'),
  
  // Get employee by ID
  getEmployeeById: (id) => api.get(`/employees/${id}`),
  
  // Get recent employees
  getRecentEmployees: () => api.get('/employees/recent'),
  
  // Create employee
  createEmployee: (employeeData) => api.post('/employees', employeeData),
  
  // Update employee
  updateEmployee: (id, employeeData) => api.put(`/employees/${id}`, employeeData),
  
  // Delete employee
  deleteEmployee: (id) => api.delete(`/employees/${id}`),
}
