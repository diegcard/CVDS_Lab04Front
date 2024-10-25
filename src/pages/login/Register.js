import {Lock, User, Voicemail} from 'lucide-react';
import styles from '../../assets/styles/loginpage.module.css';
import {useState} from "react";
import {UserService} from "../../services/UserService";
import {Link, useNavigate} from "react-router-dom";
import Swal from "sweetalert2";

/**
 * Register component for user registration.
 * 
 * This component renders a registration form with fields for username, email, password, and full name.
 * It includes form validation, handles input changes, and submits the form data to create a new user.
 * 
 * @component
 * 
 * @returns {JSX.Element} - The rendered Register component.
 * 
 * @example
 * <Register />
 * 
 * @description
 * The Register component manages the state for form data, loading status, and error messages.
 * It validates the form fields, handles input changes, and submits the form data to the UserService.
 * If the registration is successful, it navigates to the login page and displays a success message.
 * If an error occurs during registration, it sets the appropriate error message in the state.
 */
function Register() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: ''
    });

    /**
     * Validates the form data and sets error messages for invalid fields.
     * 
     * @returns {boolean} - Returns true if the form data is valid, otherwise false.
     * 
     * Validates the following fields:
     * - username: Must be at least 3 characters long and not empty.
     * - email: Must be a valid email format and not empty.
     * - password: Must be at least 8 characters long, contain uppercase, lowercase, and numbers, and not be empty.
     * - fullName: Must not be empty.
     * 
     * Sets error messages for each invalid field in the `newErrors` object and updates the state with `setErrors`.
     */
    const validateForm = () => {
        const newErrors = {};
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain uppercase, lowercase and numbers';
        }
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * Handles the change event for form inputs.
     * Updates the form data state with the new value and clears any existing errors for the input field.
     *
     * @param {Object} e - The event object.
     * @param {Object} e.target - The target element of the event.
     * @param {string} e.target.name - The name of the input field.
     * @param {string} e.target.value - The value of the input field.
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
     * Handles the form submission for user registration.
     * 
     * @param {Event} e - The event object representing the form submission event.
     * @returns {Promise<void>} - A promise that resolves when the form submission is complete.
     * 
     * @async
     * @function handleSubmit
     * 
     * @description
     * This function prevents the default form submission behavior, validates the form,
     * and if valid, sets the loading state to true. It then attempts to create a new user
     * using the UserService. If successful, it navigates to the login page with a success message
     * and displays a success alert using Swal. If an error occurs, it sets the appropriate error
     * message in the state. Finally, it sets the loading state to false.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setIsLoading(true);
        try {
            await UserService.createUser(formData);
            navigate('/login', {
                state: {
                    message: 'Registration successful! Please login.'
                }
            });
            Swal.fire({
                title: 'Success',
                text: 'Registration successful! Please login.',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
            })
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred during registration';
            setErrors(prev => ({
                ...prev,
                submit: errorMessage
            }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginForm}>
                <h2>Register</h2>

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
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            maxLength={50}
                            disabled={isLoading}
                        />
                        <Voicemail size={20}/>
                        {errors.email && (
                            <span className={styles.errorMessage}>{errors.email}</span>
                        )}
                    </div>

                    <div className={styles.inputGroup}>
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            maxLength={20}
                            disabled={isLoading}
                        />
                        <Lock size={20}/>
                        {errors.password && (
                            <span className={styles.errorMessage}>{errors.password}</span>
                        )}
                    </div>

                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            placeholder="Full Name"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            maxLength={50}
                            disabled={isLoading}
                        />
                        <User size={20}/>
                        {errors.fullName && (
                            <span className={styles.errorMessage}>{errors.fullName}</span>
                        )}
                    </div>
                    <button
                        type="submit"
                        className={`${styles.loginButton} ${isLoading ? styles.loading : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <p className={styles.registerLink}>
                    You have an account?
                    <Link to="/login" style={{cursor: 'pointer'}}> Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;