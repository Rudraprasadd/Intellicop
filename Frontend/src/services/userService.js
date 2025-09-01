// src/services/userService.js

const API_BASE_URL = 'http://localhost:8081'; // Adjust based on your backend URL

// Helper function for API calls
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get token from wherever you store it (localStorage, context, etc.)
  const token = localStorage.getItem('authToken');
  const username = localStorage.getItem('username');
  
  // For basic auth, we need to include credentials
  const authHeader = token ? { 'Authorization': `Basic ${token}` } : {};
  
  const config = {
    headers: {
      ...authHeader,
      ...options.headers,
    },
    credentials: 'include', // Include cookies for authentication
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      // Try to get error message from response
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    // Check if response has content
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Helper function to create form data for multipart requests
const createFormData = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, data[key]);
    }
  });
  return formData;
};

// User-related API calls
export const userService = {
  // Get all users
  getUsers: async () => {
    return apiRequest('/api/users');
  },

  // Get user by ID
  getUserById: async (userId) => {
    return apiRequest(`/api/users/${userId}`);
  },

  // Get user counts by role
  getUserCounts: async () => {
    return apiRequest('/api/users/total');
  },

  // Update a user's role only
  updateUserRole: async (userId, newRole) => {
    // Using URL parameters instead of JSON body
    return apiRequest(`/api/users/${userId}/role?role=${encodeURIComponent(newRole)}`, {
      method: 'PUT',
    });
  },

  // Update multiple user fields
  updateUser: async (userId, userData) => {
    const formData = createFormData(userData);
    return apiRequest(`/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        // Let the browser set the correct content-type with boundary
      },
      body: formData,
    });
  },

  // Delete a user
  deleteUser: async (userId) => {
    return apiRequest(`/api/users/${userId}`, {
      method: 'DELETE',
    });
  },

  // Add a new user with photo (multipart form data)
  addUser: async (userData) => {
    const formData = createFormData(userData);
    return apiRequest('/api/users/add', {
      method: 'POST',
      headers: {
        // Let the browser set the correct content-type with boundary
      },
      body: formData,
    });
  },
};

// Auth service for login
export const authService = {
  login: async (username, password) => {
    // For basic auth, we need to encode credentials
    const credentials = btoa(`${username}:${password}`);
    localStorage.setItem('authToken', credentials);
    localStorage.setItem('username', username);
    
    return apiRequest('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`,
      },
      body: JSON.stringify({ username, password }),
    });
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');s
  },

  getCurrentUser: () => {
    return localStorage.getItem('username');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
};