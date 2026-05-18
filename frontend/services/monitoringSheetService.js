import api from "./api";
 
const getAllMonitoringSheets = async () => {
    const response = await api.get('/monitoring-sheets');
    return response.data;
};
 
const getMonitoringSheetById = async (id) => {
    const response = await api.get(`/monitoring-sheets/${id}`);
    return response.data;
};
 
const createMonitoringSheet = async (monitoringData) => {
    const response = await api.post('/monitoring-sheets', monitoringData);
    return response.data;
};
 
const updateMonitoringSheet = async (id, monitoringData) => {
    const response = await api.patch(`/monitoring-sheets/${id}`, monitoringData);
    return response.data;
};
 
const deleteMonitoringSheet = async (id) => {
    const response = await api.delete(`/monitoring-sheets/${id}`);
    return response.data;
};
 
export default {
    getAllMonitoringSheets,
    getMonitoringSheetById,
    createMonitoringSheet,
    updateMonitoringSheet,
    deleteMonitoringSheet,
};