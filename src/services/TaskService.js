import axios from 'axios';
import {API_BASE_URL} from "../config/globals";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

export const TaskService = {
    createTask: async (task) => {
        try {
            const response = await axiosInstance.post(`${API_BASE_URL}/tasks/create`, task);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deteteTask: async (taskId) => {
        try {
            const response = await axiosInstance.delete(`${API_BASE_URL}/tasks/delete/${taskId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};