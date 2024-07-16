import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Adjust this if your backend is on a different URL

export const getVideoMetadata = async () => {
    try {
        const response = await axios.get(`${API_URL}/videos/metadata`);
        return response.data;
    } catch (error) {
        console.error('Error fetching video metadata:', error);
        throw error;
    }
};

export const getProduct = async (productId) => {
    try {
        console.log('Fetching product with ID:', productId);
        const response = await axios.get(`${API_URL}/products/${productId}`);
        console.log('Product data received:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching product:', error.response || error);
        throw error;
    }
};