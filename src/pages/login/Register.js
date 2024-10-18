import {Lock, User, Voicemail} from 'lucide-react';
import styles from'../../assets/styles/register.module.css'

function Register(){
    return (
        <div className={styles["login-container"]}>
            <div className="background-mountains">
            </div>
            <div className={styles["login-form"]}>
                <h2>Register</h2>
                <form>
                    <div className={styles["input-group"]}>
                        <input type="text" placeholder="Username"/>
                        <User size={20}/>
                    </div>
                    <div className={styles["input-group"]}>
                        <input type="text" placeholder="Email"/>
                        <Voicemail size={20}/>
                    </div>
                    <div className={styles["input-group"]}>
                        <input type="password" placeholder="Password"/>
                        <Lock size={20}/>
                    </div>
                    <div className={styles["input-group"]}>
                        <input type="text" placeholder="Full Name"/>
                        <User size={20}/>
                    </div>
                    <button type="submit" className={styles["login-button"]}>
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;