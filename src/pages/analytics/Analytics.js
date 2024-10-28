import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/Analytics.css';
import { API_BASE_URL } from '../../config/globals.js';
import { TaskService } from "../../services/TaskService";

const Analytics = () => {
    const [selectedChart, setSelectedChart] = useState(null);
    const [googleCharts, setGoogleCharts] = useState(null);
    const [taskData, setTaskData] = useState({
        low: 0,
        medium: 0,
        high: 0,
        completed: 0,
        notCompleted: 0,
        priorities: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
    });
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();

    const chartTypes = [
        'Difficulty Histogram',
        'Priority Histogram',
        'Task Completed',
        'Scatter Plot'
    ];

    useEffect(() => {
        const initializeGoogleCharts = () => {
            const script = document.createElement('script');
            script.src = 'https://www.gstatic.com/charts/loader.js';
            script.async = true;

            script.onload = () => {
                window.google.charts.load('current', { packages: ['corechart'] });
                window.google.charts.setOnLoadCallback(() => {
                    setGoogleCharts(window.google.visualization);
                });
            };
            document.body.appendChild(script);

            return () => {
                document.body.removeChild(script);
            };
        };

        initializeGoogleCharts();
    }, [selectedChart]);

    const fetchAndFilterTasks = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/all`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const tasksData = await response.json();
            setTasks(tasksData);

            const difficultyCounts = tasksData.reduce((acc, task) => {
                if (task.difficultyLevel.toLowerCase() === 'low') acc.low += 1;
                if (task.difficultyLevel.toLowerCase() === 'medium') acc.medium += 1;
                if (task.difficultyLevel.toLowerCase() === 'high') acc.high += 1;
                return acc;
            }, { low: 0, medium: 0, high: 0 });

            setTaskData(prev => ({ ...prev, ...difficultyCounts }));
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const fetchTasksIsCompleted = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/all`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const tasksData = await response.json();
            setTasks(tasksData);

            const taskCompletionCounts = tasksData.reduce((acc, task) => {
                if (task.isCompleted) acc.completed += 1;
                else acc.notCompleted += 1;
                return acc;
            }, { completed: 0, notCompleted: 0 });

            setTaskData(prev => ({ ...prev, ...taskCompletionCounts }));
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const fetchTasksByPriority = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/all`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const tasksData = await response.json();
            setTasks(tasksData);

            const priorityCounts = tasksData.reduce((acc, task) => {
                const priority = task.priority;
                acc[priority] = (acc[priority] || 0) + 1;
                return acc;
            }, {1: 0, 2: 0, 3: 0, 4: 0, 5: 0});

            setTaskData(prev => ({ ...prev, priorities: priorityCounts }));
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const renderChart = async () => {
        if (!selectedChart || !googleCharts) {
            return (
                <div className="flex items-center justify-center h-full text-gray-500">
                    {!selectedChart ? 'Select a chart type from the sidebar' : 'Loading charts...'}
                </div>
            );
        }

        if (selectedChart === 'Difficulty Histogram') {
            await fetchAndFilterTasks();
        } else if (selectedChart === 'Task Completed') {
            await fetchTasksIsCompleted();
        } else if (selectedChart === 'Priority Histogram' || selectedChart === 'Scatter Plot') {
            await fetchTasksByPriority();
        }

        const container = document.getElementById('chart-container');
        if (!container) return null;

        const commonOptions = {
            backgroundColor: 'transparent',
            animation: { duration: 1000, easing: 'out', startup: true },
            chartArea: { width: '80%', height: '80%' },
            legend: { position: 'top' },
        };

        switch (selectedChart) {
            case 'Difficulty Histogram': {
                const data = googleCharts.arrayToDataTable([
                    ['Difficulty', 'Count'],
                    ['Low', taskData.low],
                    ['Medium', taskData.medium],
                    ['High', taskData.high],
                ]);

                const chart = new googleCharts.ColumnChart(container);
                chart.draw(data, { ...commonOptions, title: 'Task Difficulty Distribution', hAxis: { title: 'Difficulty' }, vAxis: { title: 'Count' }, bar: { groupWidth: '95%' } });
                break;
            }

            case 'Task Completed': {
                const data = googleCharts.arrayToDataTable([
                    ['Status', 'Count'],
                    ['Completed', taskData.completed],
                    ['Not Completed', taskData.notCompleted],
                ]);

                const chart = new googleCharts.PieChart(container);
                chart.draw(data, { ...commonOptions, title: 'Task Completion Status' });
                break;
            }

            case 'Priority Histogram': {
                const data = googleCharts.arrayToDataTable([
                    ['Priority', 'Count'],
                    ['1', taskData.priorities[1]],
                    ['2', taskData.priorities[2]],
                    ['3', taskData.priorities[3]],
                    ['4', taskData.priorities[4]],
                    ['5', taskData.priorities[5]],
                ]);

                const chart = new googleCharts.ColumnChart(container);
                chart.draw(data, {
                    ...commonOptions,
                    title: 'Task Priority Distribution',
                    hAxis: {
                        title: 'Priority',
                        viewWindow: { min: 0.5, max: 5.5 },
                        ticks: [1, 2, 3, 4, 5]
                    },
                    vAxis: { title: 'Count', minValue: 0 },
                    bar: { groupWidth: '95%' }
                });
                break;
            }

            case 'Scatter Plot': {
                const scatterData = tasks.map(task => {
                    // Convert estimatedTime to hours for better visualization
                    const estimatedDate = new Date(task.estimatedTime);
                    const hours = estimatedDate.getHours() + (estimatedDate.getMinutes() / 60);

                    return [task.priority, hours];
                });

                const data = googleCharts.arrayToDataTable([
                    ['Priority', 'Estimated Time (hours)'],
                    ...scatterData
                ]);

                const chart = new googleCharts.ScatterChart(container);
                chart.draw(data, {
                    ...commonOptions,
                    title: 'Priority vs Estimated Time',
                    hAxis: {
                        title: 'Priority',
                        viewWindow: { min: 0.5, max: 5.5 },
                        ticks: [1, 2, 3, 4, 5]
                    },
                    vAxis: {
                        title: 'Estimated Time (hours)',
                        minValue: 0
                    },
                    trendlines: { 0: {} }  // Adds a trend line
                });
                break;
            }
        }
    };

    useEffect(() => {
        if (selectedChart && googleCharts) {
            renderChart();
        }
    }, [selectedChart, googleCharts]);

    const handleBackClick = () => {
        navigate('/home');
    };

    return (
        <div className="container">
            <div className="box">
                <div className="flex h-screen">
                    <div className="w-64 bg-white shadow-md p-4">
                        <h2 className="text-xl font-bold mb-4">Chart Types</h2>
                        <div className="space-y-2">
                            {chartTypes.map((chartType) => (
                                <button
                                    key={chartType}
                                    onClick={() => setSelectedChart(chartType)}
                                    className={`w-full py-2 px-4 rounded text-white transition-colors ${selectedChart === chartType ? 'bg-blue-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                                >
                                    {chartType}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={handleBackClick}
                            className="w-full py-2 px-4 rounded text-white transition-colors bg-red-500 hover:bg-red-600 mt-4"
                        >
                            Back
                        </button>
                    </div>
                    <div className="flex-1 p-8">
                        <div className="bg-white rounded-lg shadow-md p-6 h-full">
                            <div id="chart-container" className="w-full h-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;