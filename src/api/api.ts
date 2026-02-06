import axios from "axios";
import { API_URL } from "../config";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // ESTA LÍNEA ES CLAVE PARA NGROK:
    // Evita que la pantalla de advertencia de ngrok bloquee la petición
    config.headers['ngrok-skip-browser-warning'] = 'true';
    
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;