import {API_BASE_URL} from "../config/globals";

export const AuthService = {

    login: async (credentials) => {
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });
            return response;
        } catch (error) {
            throw error;
        }
    }

};