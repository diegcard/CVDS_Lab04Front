import axios from "axios";
import { API_BASE_URL } from "../config/globals";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

const getAuthHeaders = () => {
    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('authToken='))
        ?.split('=')[1];

    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    };
};

export const UserService = {
    createUser: async (user) => {
        try {
            const response = await axiosInstance.post('/users/create', user);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    fetchTasksByUserId: async (userId) => {
        try {
            const response = await axiosInstance.get(`/users/getTasks/${userId}`, getAuthHeaders());
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};