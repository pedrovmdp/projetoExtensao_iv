import api from "./api";

const getAllCompanys = async () => {
    const response = await api.get('/companys')
    return response.data;
}

const getCompanyById = async (id) => {
    const response = await api.get(`/companys/${id}`)
}

const getCompanyByName = async (name) => {
    const response = await api.get(`/companys`);
    return response.data.filter(company =>
        company.name.toLowerCase().includes(name.toLowerCase())
    );
};

const createCompany = async (companyData) => {
    const response = await api.post(`/companys`, companyData);
    return response.data;
};

const updateCompany = async (id, companyData) => {
    const response = await api.put(`/companys/${id}`, companyData);
    return response.data;
};

const deleteCompany = async (id) => {
    const response = await api.delete(`/companys/${id}`);
    return response.data;
};

export default {
    getAllCompanys,
    getCompanyById,
    getCompanyByName,
    createCompany,
    updateCompany,
    deleteCompany,
}