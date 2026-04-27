import api from "./api";

const getAllReviews = async () => {
    const response = await api.get('/reviews')
    return response.data;
}

const getReviewById = async (id) => {
    const response = await api.get(`/reviews/${id}`)
    return response.data;
}

const getReviewsByPersonName = async (name) => {
    const response = await api.get(`/reviews/personName/${name}`);
    return response.data;
}

const createReview = async (reviewsData) => {
    const response = await api.post(`/reviews`, reviewsData);
    return response.data;
};

const deleteReview = async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
};

export default {
    getAllReviews,
    getReviewById,
    getReviewsByPersonName,
    createReview,
    deleteReview
}