import {Lock, User} from 'lucide-react';
import styles from '../../assets/styles/loginpage.module.css'
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {AuthService} from "../../services/AuthService";
import {Link} from "react-router-dom";


function LoginPage() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await AuthService.login(formData);
            if (response.ok) {
                const token = await response.text();
                document.cookie = `authToken=${token}; path=/;`;
                navigate('/home');
            } else {
                const errorMessage = await response.text();
                setError(errorMessage);
            }
        } catch (error) {
            setError('Error of system');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles["login-container"]}>
            <div className="background-mountains">
            </div>
            <div className={styles["login-form"]}>
                <h2>Login</h2>
                {isLoading ? <div>Loading...</div> : (
                    <form onSubmit={handleSubmit}>
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
                        >
                            Login
                        </button>
                    </form>
                )}
                <p className={styles["register-link"]}>
                    Don't have an account?
                    <Link to="/register" style={{cursor: 'pointer'}}> Register</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;