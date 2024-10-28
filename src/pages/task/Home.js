import React, {useEffect, useState, useCallback} from 'react';
import {AuthService} from "../../services/AuthService";
import {useNavigate} from "react-router-dom";
import styles from '../../assets/styles/home.module.css';
import {UserService} from "../../services/UserService";
import {Dialog} from "primereact/dialog";
import TaskModal from "../../components/TaskModal";
import {TaskService} from "../../services/TaskService";
import Swal from "sweetalert2";
import {Button} from "primereact/button";
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {InputText} from "primereact/inputtext";
import {Tag} from "primereact/tag";
import stylesList from '../../assets/styles/TaskList.module.css';
import 'primereact/resources/themes/saga-blue/theme.css';


function Home() {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [userId, setUserId] = useState('');
    const [globalFilter, setGlobalFilter] = useState(''); // Filtro global para buscar
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        setUsername(AuthService.getFullName());
        setUserId(AuthService.getId());
    }, []);

    useEffect(() => {
        if (userId) fetchTasks();
    }, [userId]);

    const fetchTasks = async () => {
        if (userId) {
            const data = await UserService.fetchTasksByUserId(userId);
            setTasks(data);
        }
    };

    const createRandomTask = async () => {
        try {
            await TaskService.createAleatoryTask();
            fetchTasks();
        } catch (error) {
            Swal.fire({icon: 'error', title: 'Error', text: 'Error creating random task'});
        }
    };

    const handleLogout = () => {
        AuthService.logout();
        navigate('/login');
    };

    const handleDone = async (taskId) => {
        try {
            await TaskService.makeTaskCompleted(taskId);
            Swal.fire({
                icon: "success",
                title: "Task marked as done",
                timer: 1500,
                position: "top-end",
                showConfirmButton: false
            });
            fetchTasks();
        } catch (error) {
            Swal.fire({icon: 'error', title: 'Error', text: 'Error marking task as done'});
        }
    };

    const handleDelete = async (taskId) => {
        try {
            await TaskService.deleteTask(taskId);
            Swal.fire({
                icon: "success",
                title: "Task deleted",
                timer: 1500,
                position: "top-end",
                showConfirmButton: false
            });
            fetchTasks();
        } catch (error) {
            Swal.fire({icon: 'error', title: 'Error', text: 'Error deleting task'});
        }
    };

    const handleUnDone = async (taskId) => {
        try {
            await TaskService.makeTaskUnDone(taskId);
            Swal.fire({
                icon: "success",
                title: "Task marked as undone",
                timer: 1500,
                position: "top-end",
                showConfirmButton: false
            });
            fetchTasks();
        } catch (error) {
            Swal.fire({icon: 'error', title: 'Error', text: 'Error marking task as undone'});
        }
    };

    const handleEdit = (task) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    const handleAnalyticsClick = () => {
        navigate('/analytics');
    };

    const renderHeader = () => (
        <div className="table-header">
            <h2 className={styles.title}>CVDS TO-DO</h2>
            <span className="p-input-icon-left">
                <i className="pi pi-search"/>
                <InputText
                    type="search"
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search tasks..."
                    style={{margin: '1.5rem'}}
                />
            </span>
        </div>
    );

    const actionBodyTemplate = (task) => (
        <div className="flex gap-2">
            <Button
                label={task.isCompleted ? "UnDone" : "Done"}
                className={task.isCompleted ? styles.undone : styles.done}
                onClick={() => task.isCompleted ? handleUnDone(task.id) : handleDone(task.id)}
            />
            <Button label="Delete" className={styles.delete} onClick={() => handleDelete(task.id)}/>
            <Button
                icon="pi pi-pencil"
                label="Edit"
                className={styles.edit}
                onClick={() => handleEdit(task)}/>
        </div>
    );

    const statusBodyTemplate = (task) => (
        <Tag
            value={task.isCompleted ? "Completed" : "Pending"}
            severity={task.isCompleted ? "success" : "warning"}
        />
    );

    const handleCreate = () => {
        setSelectedTask(null);
        setShowModal(true);
    }

    return (
        <div className={styles.container}>
            <div className={styles.buttonContainer}>
                <div className={styles.leftButtons}>
                    <Dialog visible={showModal} modal onHide={() => setShowModal(false)}>
                        <TaskModal onClose={() => setShowModal(false)} onSuccess={fetchTasks}
                                   taskToEdit={selectedTask}/>
                    </Dialog>
                    <Button label="Create Task" onClick={() => handleCreate()} className={styles.button}/>
                    {AuthService.getRole() === 'ADMIN' && (
                        <>
                            <Button label="Analytics" onClick={handleAnalyticsClick} className={styles.button}/>
                            <Button label="Create Aleatory Task" onClick={createRandomTask} className={styles.button}/>
                        </>
                    )}
                </div>
                <div className={styles.userDetails}>
                    <span>{username}</span>
                    <Button label="Logout" onClick={handleLogout} className={styles.button}/>
                </div>
            </div>
            <div className={stylesList.tableContainer}>
                <DataTable
                    value={tasks}
                    paginator
                    rows={15}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    header={renderHeader()}
                    globalFilter={globalFilter}
                    emptyMessage="No tasks found."
                    className="p-datatable-sm"
                    showGridlines
                    stripedRows
                >
                    <Column field="nameTask" header="Task Name"/>
                    <Column field="descriptionTask" header="Description"/>
                    <Column field="estimatedTime" header="Estimated Time"/>
                    <Column field="difficultyLevel" header="Difficulty"/>
                    <Column field="priority" header="Priority"/>
                    <Column body={statusBodyTemplate} header="Status"/>
                    <Column body={actionBodyTemplate} header="Actions" style={{minWidth: '12rem'}}/>
                </DataTable>
            </div>
        </div>
    );
}

export default Home;