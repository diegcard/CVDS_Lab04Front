import React from "react";
import {Lock, User, EyeOff, Eye} from 'lucide-react';
import styles from '../../assets/styles/loginpage.module.css';
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {AuthService} from "../../services/AuthService";
import {Link} from "react-router-dom";
import Swal from "sweetalert2";

/**
 * Login page component for user authentication.
 *
 * This component renders a login form with fields for username and password.
 * It includes form validation, handles input changes, and submits the form data for authentication.
 *
 * @component
 *
 * @returns {JSX.Element} - The rendered LoginPage component.
 *
 * @example
 * <LoginPage />
 */
function LoginPage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    /**
     * useState hook to manage form data for login.
     *
     * @constant
     * @type {Object}
     * @property {string} username - The username input value.
     * @property {string} password - The password input value.
     */
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    /**
     * Toggles the visibility of the password field.
     * Updates the state to show or hide the password.
     */
    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    /**
     * Validates the form data and sets error messages for invalid fields.
     *
     * @returns {boolean} - Returns true if the form data is valid, otherwise false.
     */
    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } /*else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain uppercase, lowercase and numbers';
        }*/

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * Handles the change event for form inputs.
     * Updates the form data state with the new value and clears any existing errors for the input field.
     *
     * @param {Object} e - The event object.
     */
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: ''
            }));
        }
    };

    /**
     * Handles the form submission for user login.
     *
     * @param {Event} e - The event object representing the form submission event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await AuthService.login(formData);
            if (response.ok) {
                const token = await response.text();
                document.cookie = `authToken=${token}; path=/;`;
                navigate('/home');
                Swal.fire({
                    title: 'Success',
                    text: 'Login successful!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1000
                });
            } else {
                const errorMessage = await response.text();
                setErrors(prev => ({
                    ...prev,
                    submit: errorMessage
                }));
            }
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                submit: 'System error. Please try again later.'
            }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginForm}>
                <h2>Login</h2>

                {errors.submit && (
                    <div className={styles.errorAlert}>
                        {errors.submit}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            placeholder="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            maxLength={20}
                            disabled={isLoading}
                        />
                        <User size={20}/>
                        {errors.username && (
                            <span className={styles.errorMessage}>{errors.username}</span>
                        )}
                    </div>

                    <div className={styles.inputGroup}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            maxLength={20}
                            disabled={isLoading}
                        />
                        <Lock size={20}/>
                        <button type="button" onClick={togglePasswordVisibility} className={styles.toggleButton}>
                            {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                        </button>
                        {errors.password && (
                            <span className={styles.errorMessage}>{errors.password}</span>
                        )}
                    </div>

                    <button className={styles.animatedButton}>
                        <svg viewBox="0 0 24 24" className={styles.arr2} xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
                            ></path>
                        </svg>
                        <span className={styles.text}>{isLoading ? 'Logging in...' : 'Login'}</span>
                        <span className={styles.circle}></span>
                        <svg viewBox="0 0 24 24" className={styles.arr1} xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
                            ></path>
                        </svg>
                    </button>

                </form>
                <p className={styles.registerLink}>
                    Don't have an account?
                    <Link to="/register" style={{cursor: 'pointer'}}> Register</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;