import {API_BASE_URL} from "../config/globals";

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

};