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
      // On vérifie si user existe ET n'est pas la chaîne "undefined"
      if (!user || user === "undefined") return null;
      return JSON.parse(user);
    } catch (error) {
      console.error("Erreur parsing user localStorage:", error);
      localStorage.removeItem('user'); // Nettoyage si corrompu
      return null;
    }
  },
};

export default authService;
