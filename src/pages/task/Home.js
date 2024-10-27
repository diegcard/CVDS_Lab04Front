import React, {useEffect, useState} from 'react';
import {AuthService} from "../../services/AuthService";
import {useNavigate} from "react-router-dom";
import styles from '../../assets/styles/home.module.css';
import {UserService} from "../../services/UserService";
import {Dialog} from "primereact/dialog";
import TaskModal from "../../components/TaskModal";
import {TaskService} from "../../services/TaskService";
import Swal from "sweetalert2";
import {Button} from "primereact/button";
import 'primeicons/primeicons.css';

function Home() {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        setUsername(AuthService.getFullName());
        setUserId(AuthService.getId());
    }, []);

    useEffect(() => {
        const fetchTasks = async () => {
            if (userId) {
                const data = await UserService.fetchTasksByUserId(userId);
                console.log(data);
                setTasks(data);
            }
        };

        fetchTasks();
    }, [userId]);

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
        try {
            TaskService.makeTaskCompleted(taskId);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Task marked as done",
                showConfirmButton: false,
                timer: 1500
            });

            fetchTasks();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while marking the task as done',
            });
        }
    };

    const handleDelete = async (taskId) => {
        try {
            await TaskService.deleteTask(taskId);
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
        setSelectcedTask(null);
        setShowModal(true);
    };

    const handleUnDone = (taskId) => {
        try {
            TaskService.makeTaskUnDone(taskId);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Task marked as undone",
                showConfirmButton: false,
                timer: 1500
            });
            fetchTasks();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while marking the task as undone',
            });
        }
    }

    const templateButtons = (task) => (
        <div>
            <button
                className={styles[task.isCompleted ? "undone" : "done"]}
                onClick={() => task.isCompleted ? handleUnDone(task.id) : handleDone(task.id)}
            >
                {task.isCompleted ? "UnDone" : "Done"}
            </button>
            <button
                className={styles.delete}
                onClick={() => handleDelete(task.id)}
            >
                Delete
            </button>
            <div>
                <Button
                    icon="pi pi-pencil"
                    label="Edit"
                    className={styles.edit}
                    onClick={() => {
                        handleEdit(task);
                    }}
                />
            </div>
        </div>

    );

    const [selectcedTask, setSelectcedTask] = useState(null);

    const handleEdit = (task) => {
        setSelectcedTask(task);
        setShowModal(true);
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>CVDS TO-DO</h1>
            <div className={styles.buttonContainer}>
                <div className={styles.leftButtons}>

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
                            taskToEdit={selectcedTask}
                        />
                    </Dialog>

                    <button
                        className={styles.button}
                        onClick={handleCreate}
                    >Create
                    </button>


                    <button className={styles.button}>Analytics</button>
                </div>
                <div className={styles.userDetails}>
                    <span>{username}</span>
                    <button
                        className={styles.button}
                        onClick={handleLogout}
                    >Logout
                    </button>
                </div>
            </div>
            <div>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th className={styles.tableHeader}>Task Name</th>
                        <th className={styles.tableHeader}>Description</th>
                        <th className={styles.tableHeader}>Estimated Time</th>
                        <th className={styles.tableHeader}>Difficulty</th>
                        <th className={styles.tableHeader}>Priority</th>
                        <th className={styles.tableHeader}>Actions</th>
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
                                {templateButtons(task)}
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