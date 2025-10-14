import axios from "axios";

const BASE_URL = "http://localhost:3000";

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 2000,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;