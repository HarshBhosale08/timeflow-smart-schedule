
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },
  
  register: async (name: string, email: string, password: string, role: string) => {
    const response = await api.post('/register', { name, email, password, role });
    return response.data;
  }
};

// Appointments API
export const appointmentsAPI = {
  getAll: async () => {
    const response = await api.get('/appointments');
    return response.data;
  },
  
  getByUser: async (userId: string, role: string) => {
    const response = await api.get(`/appointments?userId=${userId}&role=${role}`);
    return response.data;
  },
  
  create: async (appointmentData: any) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },
  
  updateStatus: async (id: string, status: string) => {
    const response = await api.put(`/appointments/${id}/status`, { status });
    return response.data;
  }
};

// Services API
export const servicesAPI = {
  getAll: async () => {
    const response = await api.get('/services');
    return response.data;
  },
  
  getByProvider: async (providerId: string) => {
    const response = await api.get(`/services?providerId=${providerId}`);
    return response.data;
  }
};

export default api;
