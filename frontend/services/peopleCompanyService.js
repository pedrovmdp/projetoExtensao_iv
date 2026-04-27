import api  from "./api";

const getAllPeopleCompany = async () => {
    const response = await api.get('/people-company')
    return response.data;
}

const getPeopleCompanyById = async (id) => {
    const response = await api.get(`/people-company/${id}`)
    return response.data
}

const createPeopleCompany = async (peopleCompanyData) => {
    const response = await api.post(`/people-company`, peopleCompanyData);
    return response.data;
}

const updatePeopleCompany = async (id, peopleCompanyData) => {
    const response = await api.patch(`/people-company/${id}`, peopleCompanyData);
    return response.data;
}

const deletePeopleCompany = async (id) => {
    const response = await api.delete(`/people-company/${id}`);
    return response.data;
}

export default {
    getAllPeopleCompany,
    getPeopleCompanyById,
    createPeopleCompany,
    updatePeopleCompany,
    deletePeopleCompany
}   