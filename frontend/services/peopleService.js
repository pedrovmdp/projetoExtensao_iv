import api from "./api";

const getAllPeople = async () => {
    const response = await api.get('/people')
    return response.data;
}

const getPersonById = async (id) => {
    const response = await api.get(`/people/${id}`)
    return response.data;
}

const getPersonByNameOrCpf = async (name) => {
    if (!name) return [];

    const response = await api.get(`/people/search?search=${encodeURIComponent(name)}`);

    return response.data;
};

const createPerson = async (personData) => {
    const response = await api.post(`/people`, personData);
    return response.data;
};

const updatePerson = async (id, personData) => {
    const response = await api.patch(`/people/${id}`, personData);
    return response.data;
};

const deletePerson = async (id) => {
    const response = await api.patch(`/people/${id}/status`);
    return response.data;
};

export default {
    getAllPeople,
    getPersonById,
    getPersonByNameOrCpf,
    createPerson,
    updatePerson,
    deletePerson,
}