import api from "./api";

const getAllRoles = async () => {
    const response = await api.get('/role')
    return response.data;
}

const getRoleById = async (id) => {
    const response = await api.get(`/role/${id}`)
    return response.data
}

const createRole = async (roleData) => {
    const response = await api.post(`/role`, roleData);
    return response.data;
}

const updateRole = async (id, roleData) => {
    const response = await api.patch(`/role/${id}`, roleData);
    return response.data;
}

const deleteRole = async (id) => {
    const response = await api.delete(`/role/${id}`);
    return response.data;
}

export default {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
}