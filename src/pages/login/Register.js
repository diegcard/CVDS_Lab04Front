import {Lock, User, Voicemail} from 'lucide-react';
import styles from'../../assets/styles/register.module.css'
import {useState} from "react";
import Swal from "sweetalert2";
import {UserService} from "../../services/UserService";
import {useNavigate} from "react-router-dom";

function Register(){
    const navigate = useNavigate();
    const[formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await UserService.createUser(formData);
            Swal.fire({
                icon: 'success',
                title: 'User created successfully',
                showConfirmButton: false,
                timer: 1500
            });
            navigate('/login');

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
            });
        }
    }

    const navigateToLogin = () => {
        navigate('/login');
    }

    return (
        <div className={styles["login-container"]}>
            <div className="background-mountains">
            </div>
            <div className={styles["login-form"]}>
                <h2>Register</h2>
                <form>
                    <div className={styles["input-group"]}>
                        <input type="text"
                               placeholder="Username"
                               onChange={handleChange}
                               maxLength={20}
                               name="username"
                               required
                        />
                        <User size={20}/>
                    </div>
                    <div className={styles["input-group"]}>
                        <input
                            type="text"
                            placeholder="Email"
                            onChange={handleChange}
                            name="email"
                            required
                            maxLength={50}
                        />
                        <Voicemail size={20}/>
                    </div>
                    <div className={styles["input-group"]}>
                        <input
                            type="password"
                            placeholder="Password"
                            onChange={handleChange}
                            name="password"
                            required
                            maxLength={20}
                        />
                        <Lock size={20}/>
                    </div>
                    <div className={styles["input-group"]}>
                        <input
                            type="text"
                            placeholder="Full Name"
                            onChange={handleChange}
                            name="fullName"
                            required
                            maxLength={50}
                        />
                        <User size={20}/>
                    </div>
                    <button
                        type="submit"
                        className={styles["login-button"]}
                        onClick={handleSubmit}
                    >
                        Register
                    </button>
                </form>
                <p className={styles["register-link"]}>
                    You have an account?
                    <a
                    onClick={navigateToLogin}
                    style={{cursor: 'pointer'}}
                > Login</a>
                </p>
            </div>
        </div>
    );
}

export default Register;