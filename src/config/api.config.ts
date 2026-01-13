import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// (Optional – production ready)
// apiClient.interceptors.request.use(...)
// apiClient.interceptors.response.use(...)

export default apiClient;
