import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api/criminals"; // adjust if your backend port differs

export const criminalService = {
  // Fetch all criminals
  getAll: async () => {
    try {
      const response = await axios.get(API_BASE_URL, {
        withCredentials: true, // optional — only if backend uses JWT/cookies
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching criminals:", error);
      throw error;
    }
  },

  // Add a new criminal record
  add: async (criminalData) => {
    try {
      // if you're sending an image as base64 or file, use FormData
      const formData = new FormData();
      for (const key in criminalData) {
        formData.append(key, criminalData[key]);
      }

      const response = await axios.post(API_BASE_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error adding criminal:", error);
      throw error;
    }
  },

  // Search by name
  search: async (name) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/search?name=${name}`);
      return response.data;
    } catch (error) {
      console.error("Error searching criminals:", error);
      throw error;
    }
  },

  // Get one by ID
  getById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching criminal:", error);
      throw error;
    }
  },

  // Delete record
  remove: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      return true;
    } catch (error) {
      console.error("Error deleting criminal:", error);
      throw error;
    }
  },
};
