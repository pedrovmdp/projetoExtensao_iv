import api from "./api";

const getAllQuestions = async () => {
    const response = await api.get('/questions')
    return response.data;
}

const getQuestionById = async (id) => {
    const response = await api.get(`/questions/${id}`)
    return response.data;
}

const createQuestion = async (questionData) => {
    const response = await api.post(`/questions`, questionData);
    return response.data;
}

const updateQuestion = async (id, questionData) => {
    const response = await api.patch(`/questions/${id}`, questionData);
    return response.data;
}

const deleteQuestion = async (id) => {
    const response = await api.delete(`/questions/${id}`);
    return response.data;
}

export default {
    getAllQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion
}