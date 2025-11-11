import axios from "axios";
import { auth } from "./auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // p.ej. http://127.0.0.1:8000/api
});

// setea el Authorization al vuelo si tenemos access
api.interceptors.request.use((config) => {
  const token = auth.access();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

export const setRefreshToken = (t: string | null) => {
  // podrías guardar en memoria; si luego querés refresh automático, armamos otro interceptor
};

export default api;
