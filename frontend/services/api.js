import axios from "axios";

const BASE_URL = "http://localhost:3000";

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 2000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
})

export default api;