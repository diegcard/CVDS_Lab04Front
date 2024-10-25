import axios from 'axios';
import {API_BASE_URL} from "../config/globals";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

/**
 * Retrieves the authorization headers for making authenticated requests.
 * Extracts the token from the document cookies and constructs the headers object.
 *
 * @returns {Object} An object containing the headers with the authorization token and content type.
 */
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

/**
 * TaskService provides methods to interact with the task management API.
 * 
 * @namespace TaskService
 */
export const TaskService = {     
    /**
     * Creates a new task.
     * 
     * @function createTask
     * @memberof TaskService
     * @param {Object} task - The task object to be created.
     * @returns {Promise<Object>} The created task data.
     * @throws Will throw an error if the request fails.
     */
    createTask: async (task) => {
        try {
            const response = await axiosInstance.post(`/tasks/create`, task, getAuthHeaders());
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    
    /**
     * Deletes a task by its ID.
     * 
     * @function deleteTask
     * @memberof TaskService
     * @param {string} taskId - The ID of the task to be deleted.
     * @returns {Promise<Object>} The response data after deletion.
     * @throws Will throw an error if the request fails.
     */
    deleteTask: async (taskId) => {
        try {
            const response = await axiosInstance.delete(`/tasks/delete/${taskId}`, getAuthHeaders());
            return response.data;
        } catch (error) {
            throw error;
        }
    },
     
    /**
     * Marks a task as completed by its ID.
     * 
     * @function makeTaskCompleted
     * @memberof TaskService
     * @param {string} taskId - The ID of the task to be marked as completed.
     * @returns {Promise<Object>} The updated task data.
     * @throws Will throw an error if the request fails.
     */
    makeTaskCompleted: async (taskId) => {
        try {
            const response = await axiosInstance.patch(`/tasks/done/${taskId}`, {}, getAuthHeaders());
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    
    /**
     * Marks a task as not completed by its ID.
     * 
     * @function makeTaskUnDone
     * @memberof TaskService
     * @param {string} taskId - The ID of the task to be marked as not completed.
     * @returns {Promise<Object>} The updated task data.
     * @throws Will throw an error if the request fails.
     */

    makeTaskUnDone: async (taskId) => {
        try {
            const response = await axiosInstance.patch(`/tasks/undone/${taskId}`, {}, getAuthHeaders());
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};