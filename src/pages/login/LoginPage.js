import { Lock, User } from 'lucide-react';
import styles from'../../assets/styles/loginpage.module.css'
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {AuthService} from "../../services/AuthService";


function LoginPage(){
    const navigate = useNavigate();
    const[error, setError] = useState('');

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const navigateToRegister = () => {
        navigate('/register');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await AuthService.login(formData);
            if (response.ok) {
                const token = await response.text();
                document.cookie = `authToken=${token}; path=/;`;
                navigate('/dashboard');
            } else {
                const errorMessage = await response.text();
                setError(errorMessage);
            }
        } catch (error) {
            setError('Error of system');
        }
    }

    return (
        <div className={styles["login-container"]}>
            <div className="background-mountains">
            </div>
            <div className={styles["login-form"]}>
                <h2>Login</h2>
                <form>
                    <div className={styles["input-group"]}>
                        <input
                            type="text"
                            placeholder="Username"
                            required={true}
                            name="username"
                            onChange={handleChange}
                        />
                        <User size={20}/>
                    </div>
                    <div className={styles["input-group"]}>
                        <input
                            type="password"
                            placeholder="Password"
                            required={true}
                            name="password"
                            onChange={handleChange}
                        />
                        <Lock size={20}/>
                    </div>

                    {error && (
                        <div className={styles["error-message"]}>{error}</div>
                    )}

                    <button
                        type="submit"
                        className={styles["login-button"]}
                        onClick={handleSubmit}
                    >
                        Login
                    </button>
                </form>
                <p className={styles["register-link"]}>
                    Don't have an account?
                    <a
                        onClick={navigateToRegister}
                        style={{cursor: 'pointer'}}
                    > Register</a>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;