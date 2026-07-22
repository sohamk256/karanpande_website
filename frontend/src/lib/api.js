import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
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

export async function fetchMedia(category) {
  const { data } = await api.get(`/media/${category}`);
  return data;
}

export async function fetchAllMedia() {
  const { data } = await api.get(`/media`);
  return data;
}

export async function createMedia(payload) {
  const { data } = await api.post(`/admin/media`, payload);
  return data;
}

export async function updateMedia(id, payload) {
  const { data } = await api.put(`/admin/media/${id}`, payload);
  return data;
}

export async function deleteMedia(id) {
  const { data } = await api.delete(`/admin/media/${id}`);
  return data;
}

export async function verifyAdmin() {
  try {
    await api.get(`/admin/me`);
    return true;
  } catch {
    auth.clear();
    return false;
  }
}
