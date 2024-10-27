import { API_BASE_URL } from "../config/globals";
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export const AuthService = {
    login: async (credentials) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
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
    },

    logout: () => {
        Cookies.remove('authToken');
    },

    getDecodedToken: () => {
        const token = Cookies.get('authToken');
        if (token) {
            try {
                return jwtDecode(token);
            } catch (error) {
                console.error('Error decoding token:', error);
                return null;
            }
        }
        return null;
    },

    getId: () => {
        const decodedToken = AuthService.getDecodedToken();
        return decodedToken ? decodedToken.id : null;
    },

    getUsername: () => {
        const decodedToken = AuthService.getDecodedToken();
        return decodedToken ? decodedToken.username : null;
    },

    getEmail: () => {
        const decodedToken = AuthService.getDecodedToken();
        return decodedToken ? decodedToken.email : null;
    },

    getFullName: () => {
        const decodedToken = AuthService.getDecodedToken();
        return decodedToken ? decodedToken.fullName : null;
    },

    getCreationDate: () => {
        const decodedToken = AuthService.getDecodedToken();
        return decodedToken ? decodedToken.creationDate : null;
    },

    isAuthenticated: () => {
        return !!Cookies.get('token');
    }
};