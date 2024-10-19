import { Lock, User } from 'lucide-react';
import styles from'../../assets/styles/loginpage.module.css'
import {useNavigate} from "react-router-dom";
import {useState} from "react";


function LoginPage(){
    const navigate = useNavigate();

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

    return (
        <div className={styles["login-container"]}>
            <div className="background-mountains">
            </div>
            <div className={styles["login-form"]}>
                <h2>Login</h2>
                <form>
                    <div className={styles["input-group"]}>
                        <input type="text" placeholder="Username"/>
                        <User size={20}/>
                    </div>
                    <div className={styles["input-group"]}>
                        <input type="password" placeholder="Password"/>
                        <Lock size={20}/>
                    </div>
                    <button type="submit" className={styles["login-button"]}>
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