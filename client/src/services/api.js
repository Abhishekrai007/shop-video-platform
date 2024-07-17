import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getVideoMetadata = async () => {
    try {
        const response = await axios.get(`${API_URL}/videos/metadata`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getProduct = async (productId) => {
    try {
        const response = await axios.get(`${API_URL}/products/${productId}`);
        return response.data;
    } catch (error) {
        console.error(error.response || error);
        throw error;
    }
};