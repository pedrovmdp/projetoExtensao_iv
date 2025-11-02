import api from "./api";

const getAllMonitorings = async () => {
    const response = await api.get('/monitoring')
    return response.data;
}

const getMonitoringById = async (id) => {
    const response = await api.get(`/monitoring/${id}`)
}

const createMonitoring = async (monitoringData) => {
    const response = await api.post(`/monitoring`, monitoringData);
    return response.data;
};

const updateMonitoring = async (id, monitoringData) => {
    const response = await api.put(`/monitoring/${id}`, monitoringData);
    return response.data;
};

const deleteMonitoring = async (id) => {
    const response = await api.delete(`/monitoring/${id}`);
    return response.data;
};

export default {
    getAllMonitorings,
    getMonitoringById,
    createMonitoring,
    updateMonitoring,
    deleteMonitoring
}