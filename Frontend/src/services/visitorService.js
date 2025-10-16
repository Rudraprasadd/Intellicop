// @ts-check
import axios from "axios";
/** @typedef {import("./VisitorMeetingData").VisitorMeetingData} VisitorMeetingData */

const API_URL = "http://localhost:8081/api/visitors";

/** Helper to get JWT token from localStorage */
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const visitorService = {
  /** ---------- FETCH ---------- **/

  /** @returns {Promise<VisitorMeetingData[]>} */
  getToday: async () => {
    const res = await axios.get(`${API_URL}/today`, { headers: getAuthHeader() });
    return res.data;
  },

  /** @returns {Promise<VisitorMeetingData[]>} */
  getUpcoming: async () => {
    const res = await axios.get(`${API_URL}/upcoming`, { headers: getAuthHeader() });
    return res.data;
  },

  /** @returns {Promise<VisitorMeetingData[]>} */
  getAll: async () => {
    const res = await axios.get(API_URL, { headers: getAuthHeader() });
    return res.data;
  },

  // ---------- FETCH COMPLETED VISITORS ----------
  /** @returns {Promise<VisitorMeetingData[]>} */
  getCompleted: async () => {
    const res = await axios.get(`${API_URL}/completed`, { headers: getAuthHeader() });
    return res.data;
  },


  /** ---------- CRUD ---------- **/

  /** @param {VisitorMeetingData} data */
  schedule: async (data) => {
    const res = await axios.post(API_URL, data, {
      headers: { ...getAuthHeader(), "Content-Type": "application/json" },
    });
    return res.data;
  },

  /** @param {number} id @param {VisitorMeetingData} data */
  update: async (id, data) => {
    const res = await axios.put(`${API_URL}/${id}`, data, {
      headers: { ...getAuthHeader(), "Content-Type": "application/json" },
    });
    return res.data;
  },

  /** @param {number} id */
  delete: async (id) => {
    await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
  },

  /** ---------- STATUS UPDATE ---------- **/

  /**
   * @param {number} id
   * @param {"SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"} status
   */
  updateStatus: async (id, status) => {
    await axios.put(`${API_URL}/${id}/status`, null, {
      headers: getAuthHeader(),
      params: { status },
    });
  },

  /** ✅ Mark visitor as completed — moves to completed table */
  /** @param {number} id */
  /** ✅ Mark visitor as completed */
  complete: async (id) => {
    return visitorService.updateStatus(id, "COMPLETED");
  },

  /** ✅ Cancel visitor */
  /** @param {number} id */
  cancel: async (id) => {
    return visitorService.updateStatus(id, "CANCELLED");
  },


};

export default visitorService;
