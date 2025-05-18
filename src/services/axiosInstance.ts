import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api", // ← cambia si tu API usa otra URL
});

// ⬇️ inyecta automáticamente el Bearer token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
