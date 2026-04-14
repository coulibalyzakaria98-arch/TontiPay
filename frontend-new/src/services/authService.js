import api from './api';

const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token && response.data.data) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token && response.data.data) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      // Sécurité renforcée : check null, "undefined" ou vide
      if (!user || user === "undefined" || user === "null") return null;
      return JSON.parse(user);
    } catch (error) {
      console.error("Erreur parsing user localStorage:", error);
      localStorage.removeItem('user'); 
      return null;
    }
  },
};

export default authService;
