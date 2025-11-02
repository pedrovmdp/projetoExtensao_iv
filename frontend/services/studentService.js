import api from "./api";

const getAllStudents = async () => {
    const response = await api.get('/students')
    return response.data;
}

const getStudentById = async (id) => {
    const response = await api.get(`/students/${id}`)
}

const getStudentByName = async (name) => {
    if (!name) return [];

    const response = await api.get(`/students?name_like=${encodeURIComponent(name)}`);

    return response.data;
};

const createStudent = async (studentData) => {
    const response = await api.post(`/students`, studentData);
    return response.data;
};

const updateStudent = async (id, studentData) => {
    const response = await api.put(`/students/${id}`, studentData);
    return response.data;
};

const deleteStudent = async (id) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
};

export default {
    getAllStudents,
    getStudentById,
    getStudentByName,
    createStudent,
    updateStudent,
    deleteStudent,
}