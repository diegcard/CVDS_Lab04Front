import axios from 'axios';
import {API_BASE_URL} from "../config/globals";

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
}

export const TaskService = {
    createTask: async (task) => {
        try {
            const response = await axiosInstance.post(`/tasks/create`, task, getAuthHeaders());
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deteteTask: async (taskId) => {
        try {
            const response = await axiosInstance.delete(`/tasks/delete/${taskId}`, getAuthHeaders());
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    makeTaskCompleted: async (taskId) => {
        try {
            const response = await axiosInstance.patch(`/tasks/done/${taskId}`, {}, getAuthHeaders());
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    makeTaskUnDone: async (taskId) => {
        try {
            const response = await axiosInstance.patch(`/tasks/undone/${taskId}`, {}, getAuthHeaders());
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};