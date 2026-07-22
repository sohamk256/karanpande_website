import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";
export const API = `${BACKEND_URL}/api`;

const TOKEN_KEY = "kp_admin_token";

export const api = axios.create({ baseURL: API });

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export const auth = {
  setToken: (t) => localStorage.setItem(TOKEN_KEY, t),
  getToken: () => localStorage.getItem(TOKEN_KEY),
  clear: () => localStorage.removeItem(TOKEN_KEY),
  isAuthed: () => !!localStorage.getItem(TOKEN_KEY),
};

export async function login(username, password) {
  const { data } = await api.post("/admin/login", { username, password });
  auth.setToken(data.token);
  return data;
}

// Media
export const fetchMedia = (category) => api.get(`/media/${category}`).then((r) => r.data);
export const fetchAllMedia = () => api.get(`/media`).then((r) => r.data);
export const createMedia = (payload) => api.post(`/admin/media`, payload).then((r) => r.data);
export const updateMedia = (id, payload) => api.put(`/admin/media/${id}`, payload).then((r) => r.data);
export const deleteMedia = (id) => api.delete(`/admin/media/${id}`).then((r) => r.data);

// Albums
export const fetchAlbums = (category) => api.get(`/albums/${category}`).then((r) => r.data);
export const fetchAllAlbums = () => api.get(`/albums`).then((r) => r.data);
export const fetchAlbumBySlug = (category, slug) => api.get(`/albums/${category}/${slug}`).then((r) => r.data);
export const createAlbum = (payload) => api.post(`/admin/albums`, payload).then((r) => r.data);
export const updateAlbum = (id, payload) => api.put(`/admin/albums/${id}`, payload).then((r) => r.data);
export const deleteAlbum = (id) => api.delete(`/admin/albums/${id}`).then((r) => r.data);

// Testimonials
export const fetchTestimonials = () => api.get(`/testimonials`).then((r) => r.data);
export const createTestimonial = (payload) => api.post(`/admin/testimonials`, payload).then((r) => r.data);
export const updateTestimonial = (id, payload) => api.put(`/admin/testimonials/${id}`, payload).then((r) => r.data);
export const deleteTestimonial = (id) => api.delete(`/admin/testimonials/${id}`).then((r) => r.data);

// Settings
export const fetchSettings = () => api.get(`/settings`).then((r) => r.data);
export const updateSettings = (payload) => api.put(`/admin/settings`, payload).then((r) => r.data);

export async function verifyAdmin() {
  try {
    await api.get(`/admin/me`);
    return true;
  } catch {
    auth.clear();
    return false;
  }
}
