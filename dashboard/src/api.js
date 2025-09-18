import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://maseno-counseling-fresh-k63hr1gg9-victor-mburugu-s-projects.vercel.app",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle 401 errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export function setAuthToken(token) {
  if (token) 
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else 
    delete API.defaults.headers.common["Authorization"];
}

export default API;

// Auth API calls
export const login = (email, password) => 
  API.post("/api/login", { email, password });

export const getMe = () => 
  API.get("/api/me");

// Dashboard API calls
export const getDashboardStats = () => 
  API.get("/api/dashboard/stats");

export const getRecentAppointments = (counselorId) =>
  API.get(`/api/appointments/counselor/${counselorId}?limit=5&sort=desc`);

export const getRecentAnnouncements = () =>
  API.get("/api/announcements?limit=3&sort=desc");

export const getUpcomingActivities = () =>
  API.get("/api/activities?limit=3&sort=asc&upcoming=true");

// Appointments
export const getAppointments = (counselorId) =>
  API.get(`/api/appointments/counselor/${counselorId}`);
export const createAppointment = (data) =>
  API.post("/api/appointments", data);
export const updateAppointment = (id, status) =>
  API.patch(`/api/appointments/${id}/status`, { status });
export const cancelAppointment = (id) =>
  API.delete(`/api/appointments/${id}`);

// Announcements
export const postAnnouncement = (data) =>
  API.post("/api/announcements", data);
export const getAnnouncements = () =>
  API.get("/api/announcements");

// Activities
export const postActivity = (data) =>
  API.post("/api/activities", data);
export const getActivities = () =>
  API.get("/api/activities");

// Books
export const getBooks = () =>
  API.get("/api/books");
export const postBook = (data) =>
  API.post("/api/books", data);
