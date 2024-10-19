import React, { useEffect, useState } from 'react';
import { AuthService } from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import styles from '../../assets/styles/home.module.css';

function Home() {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const currentUsername = AuthService.getFullName();
        if (currentUsername) {
            setUsername(currentUsername);
        }
    }, []);

    const handleLogout = async () => {
        await AuthService.logout();
        navigate('/login');
    }

    return (
        <div className={styles["container"]}>
            <h1 className={styles["title"]}>CVDS TO-DO</h1>
            <div className={styles["buttonContainer"]}>
                <div className={styles["leftButtons"]}>
                    <button className={styles["button"]}>Create</button>
                    <button className={styles["button"]}>Analytics</button>
                </div>
                <div className={styles["userDetails"]}>
                    <span>{username}</span>
                    <button
                        className={styles["button"]}
                        onClick={handleLogout}
                    >Logout</button>
                </div>
            </div>
            <div>
                <table className={styles["table"]}>
                    <thead>
                    <tr>
                        <th className={styles["tableHeader"]}>Task Name</th>
                        <th className={styles["tableHeader"]}>Description</th>
                        <th className={styles["tableHeader"]}>Estimated Time</th>
                        <th className={styles["tableHeader"]}>Difficulty</th>
                        <th className={styles["tableHeader"]}>Priority</th>
                        <th className={styles["tableHeader"]}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className={styles["tableCell"]}>Tarea 7</td>
                        <td className={styles["tableCell"]}>Tender cama</td>
                        <td className={styles["tableCell"]}>10/11/2024</td>
                        <td className={styles["tableCell"]}>Low</td>
                        <td className={styles["tableCell"]}>2</td>
                        <td className={styles["tableCell"]}>
                            <button className={styles["done"]}>Done</button>
                            <button className={styles["delete"]}>Delete</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Home;