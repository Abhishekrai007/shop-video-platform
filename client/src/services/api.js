import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getVideoMetadata = () => axios.get(`${API_URL}/videos/metadata`);
export const getProduct = (id) => axios.get(`${API_URL}/products/${id}`);
