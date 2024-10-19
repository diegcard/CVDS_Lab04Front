import React, {useEffect, useState} from 'react';
import {AuthService} from "../../services/AuthService";
import {useNavigate} from "react-router-dom";
import styles from '../../assets/styles/home.module.css';
import {UserService} from "../../services/UserService";
import {Dialog} from "primereact/dialog";
import TaskModal from "../../components/TaskModal";
import {TaskService} from "../../services/TaskService";
import Swal from "sweetalert2";

function Home() {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        setUsername(AuthService.getFullName());
        setUserId(AuthService.getId());
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        if (userId) { // Asegúrate de que userId esté disponible
            const data = await UserService.fetchTasksByUserId(userId);
            console.log(data);
            setTasks(data);
        }
    };

    const handleLogout = async () => {
        await AuthService.logout();
        navigate('/login');
    };

    const handleDone = (taskId) => {
        // TODO implement done task
        console.log('Done task', taskId);
    };

    const handleDelete = async (taskId) => {
        try {
            await TaskService.deteteTask(taskId);
            await Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Task deleted successfully",
                showConfirmButton: false,
                timer: 1500
            });
            fetchTasks();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while deleting the task',
            });
        }
    };

    const handleCreate = () => {
        setShowModal(true);
    };

    return (
        <div className={styles["container"]}>
            <h1 className={styles["title"]}>CVDS TO-DO</h1>
            <div className={styles["buttonContainer"]}>
                <div className={styles["leftButtons"]}>

                    <Dialog
                        visible={showModal}
                        style={{width: '50vw'}}
                        modal
                        onHide={() => setShowModal(false)}
                        closeOnEscape={false}
                        dismissableMask={false}
                    >
                        <TaskModal
                            onClose={() => setShowModal(false)}
                            onSuccess={() => {
                                fetchTasks();
                                setShowModal(false);
                            }}
                        />
                    </Dialog>

                    <button
                        className={styles["button"]}
                        onClick={handleCreate}
                    >Create
                    </button>


                    <button className={styles["button"]}>Analytics</button>
                </div>
                <div className={styles["userDetails"]}>
                    <span>{username}</span>
                    <button
                        className={styles["button"]}
                        onClick={handleLogout}
                    >Logout
                    </button>
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
                    {tasks.map((task) => (
                        <tr key={task.id}>
                            <td className={styles["tableCell"]}>{task.nameTask}</td>
                            <td className={styles["tableCell"]}>{task.descriptionTask}</td>
                            <td className={styles["tableCell"]}>{task.estimatedTime}</td>
                            <td className={styles["tableCell"]}>{task.difficultyLevel}</td>
                            <td className={styles["tableCell"]}>{task.priority}</td>
                            <td className={styles["tableCell"]}>
                                <button
                                    className={styles["done"]}
                                    onClick={() => handleDone(task.id)}
                                >Done</button>
                                <button
                                    className={styles["delete"]}
                                    onClick={() => handleDelete(task.id)}
                                >Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


export default Home;