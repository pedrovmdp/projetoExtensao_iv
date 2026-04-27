import api from "./api";

const getAllCompanies = async () => {
    const response = await api.get('/companies')
    return response.data;
}

const getCompanyById = async (id) => {
    const response = await api.get(`/companies/${id}`)
}

const getCompanyByNameOrCnpj = async (name) => {
    if (!name) return [];
    // Faz a busca usando LIKE no campo correto (ex: razao_social)
    const response = await api.get(`/companies/search?search=${encodeURIComponent(name)}`);

    return response.data;
};

const createCompany = async (companyData) => {
    const response = await api.post(`/companies`, companyData);
    return response.data;
};

const updateCompany = async (id, companyData) => {
    const response = await api.patch(`/companies/${id}`, companyData);
    return response.data;
};

const deleteCompany = async (id) => {
    const response = await api.delete(`/companies/${id}`);
    return response.data;
};

export default {
    getAllCompanies,
    getCompanyById,
    getCompanyByNameOrCnpj,
    createCompany,
    updateCompany,
    deleteCompany,
}