import api from "./api";

const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
}

const getMe = async () => {
    const response = await api.get('/auth/me');
    return response.data;
}

export default {
    login,
    getMe
};