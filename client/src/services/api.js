import axios from 'axios';

const API_URL = 'http://localhost:5000/api';


// export const getVideoMetadata = () => axios.get(`${API_URL}/videos/metadata`);
export const getProduct = (id) => axios.get(`${API_URL}/products/${id}`);
const userInfo = JSON.parse(localStorage.getItem('userInfo'));

const api = axios.create({
    baseURL: '/api',
    headers: {
        Authorization: userInfo ? `Bearer ${userInfo.token}` : '',
    },
});

export const getVideoMetadata = async () => {
    try {
        const { data } = await api.get('/videos/metadata');
        return data;
    } catch (error) {
        console.error('Error fetching video metadata:', error);
        throw error;
    }
};