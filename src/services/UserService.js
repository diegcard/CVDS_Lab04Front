import axios from "axios";
import {API_BASE_URL} from "../config/globals";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});


export const UserService = {

    createUser: async (user) => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
            return response.json();
        } catch (error) {
            throw error;
        }
    },

    fetchTasksByUserId: async (userId) => {
        try {
            const response = await axiosInstance.get(`${API_BASE_URL}/users/getTasks/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

};