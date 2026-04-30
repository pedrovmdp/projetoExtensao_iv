import api from "./api";

const getAllPeople = async () => {
    const response = await api.get('/people', {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")}`,
        },
    });
    return response.data;
}

const getPersonById = async (id) => {
    const response = await api.get(`/people/${id}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")}`,
        },
    });
    return response.data;
}

const getPersonByNameOrCpf = async (name) => {
    if (!name) return [];

    const response = await api.get(`/people/search?search=${encodeURIComponent(name)}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")}`,
        },
    });

    return response.data;
};

const getPersonByRoleName = async (roleName) => {
    const response = await api.get(`/people/role/${encodeURIComponent(roleName).toUpperCase()}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")}`,
        },
    });
    console.log(response)
    return response.data;
}

const createPerson = async (personData) => {
    const response = await api.post(`/people`, personData, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")}`,
        },
    });
    return response.data;
};

const updatePerson = async (id, personData) => {
    const response = await api.patch(`/people/${id}`, personData, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")}`,
        },
    });
    return response.data;
};

const deletePerson = async (id) => {
    const response = await api.patch(`/people/${id}/status`, {}, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")}`,
        },
    });
    return response.data;
};

export default {
    getAllPeople,
    getPersonById,
    getPersonByNameOrCpf,
    getPersonByRoleName,
    createPerson,
    updatePerson,
    deletePerson,
}