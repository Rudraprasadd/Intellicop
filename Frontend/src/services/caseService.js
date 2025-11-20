// src/services/caseService.js
import axios from "axios";
// if you still want the type only for TS files, you can import it there;
// this JS file doesn't need the type import

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

export const caseService = {
  async getAll() {
    const res = await axios.get(`${API_BASE}/api/criminal-cases`);
    return res.data;
  },

  async create(data) {
    const res = await axios.post(`${API_BASE}/api/criminal-cases`, data);
    return res.data;
  },

  async update(id, data) {
    const res = await axios.put(`${API_BASE}/api/criminal-cases/${id}`, data);
    return res.data;
  },

  async remove(id) {
    return axios.delete(`${API_BASE}/api/criminal-cases/${id}`);
  },
};
