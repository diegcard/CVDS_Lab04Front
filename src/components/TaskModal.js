import React, {useEffect, useState} from 'react';
import '../assets/styles/task-create.css';
import {AuthService} from "../services/AuthService";
import {TaskService} from "../services/TaskService";
import Swal from "sweetalert2";

const TaskModal = ({onClose, onSuccess }) => {
    const [error, setError] = useState('');
    const [userId, setUserId] = useState('');
    const [form, setForm] = useState({
        id: '',
        nameTask: '',
        descriptionTask: '',
        isCompleted: false,
        difficultyLevel: '',
        priority: '',
        creationDate: new Date(),
        estimatedTime: '',
        finishDate: '',
        user: '',
    });

    useEffect(() => {
        const userId = AuthService.getId();
        if (userId) {
            setUserId(userId);
            setForm({
                ...form,
                user: userId,
            });
        }
    }, []);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await TaskService.createTask(form);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Task created successfully",
                showConfirmButton: false,
                timer: 1500
            });
            onSuccess();
        } catch (error) {
            console.log(error.response?.data?.error || error.message); // Mostrar mensaje correcto
            handleError(error);
        }
    };

    const handleError = (error) => {
        Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Error',
            text: `Ocurrió un error inesperado: ${error.response?.data?.error || error.message}`, // Mostrar mensaje del servidor si existe
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">CVDS TO-DO</h2>
                <form onSubmit={handleSubmit} className="task-form">
                    <div className="form-group">
                        <label htmlFor="taskName">Task Name:</label>
                        <input
                            id="nameTask"
                            type="text"
                            required
                            className="form-input"
                            onChange={handleChange}
                            name="nameTask"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="difficulty">Difficulty:</label>
                            <select
                                id="difficultyLevel"
                                className="form-select"
                                onChange={handleChange}
                                name="difficultyLevel"
                                required={true}
                            >
                                <option value="" defaultValue>Select one Option</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="priority">Priority:</label>
                            <select
                                id="priority"
                                className="form-select"
                                onChange={handleChange}
                                name="priority"
                                required={true}
                            >
                                <option value="" defaultValue>Select one Option</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="estimatedTime">Estimated Time:</label>
                        <input
                            id="estimatedTime"
                            type="date"
                            required
                            className="form-input"
                            onChange={handleChange}
                            name="estimatedTime"
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="descriptionTask"
                            className="form-textarea"
                            rows={3}
                            required
                            onChange={handleChange}
                            name="descriptionTask"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
                        <button type="submit" className="btn btn-primary">Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;