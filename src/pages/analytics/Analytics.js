import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/Analytics.css';
import { API_BASE_URL } from '../../config/globals.js';




const Analytics = () => {
  const [selectedChart, setSelectedChart] = useState(null);
  const [googleCharts, setGoogleCharts] = useState(null);
  const [taskData, setTaskData] = useState({ low: 0, medium: 0, high: 0 });
  const navigate = useNavigate();

  const chartTypes = [
    'Difficulty Histogram',
    'Priority Histogram',   
    'task compled',
    'Scatter Plot'
  ];

  useEffect(() => {
    // Initialize Google Charts
    const initializeGoogleCharts = () => {
      const script = document.createElement('script');
      script.src = 'https://www.gstatic.com/charts/loader.js';
      script.async = true;
      
      script.onload = () => {
        window.google.charts.load('current', { 
          packages: ['corechart']
        });
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
        headers: {
          'Content-Type': 'application/json',
        }
      });


      const tasks = await response.json();
      console.log(tasks);

      const difficultyCounts = tasks.reduce((acc, task) => {
        if (task.difficultyLevel === 'low') acc.low += 1;
        if (task.difficultyLevel === 'medium') acc.medium += 1;
        if (task.difficultyLevel === 'high') acc.high += 1;
        console.log(acc);
        
        return acc;
      }, { low: 0, medium: 0, high: 0 });

      setTaskData(difficultyCounts);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };


  const fetchTasksIsCompleted = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const tasks = await response.json();
      
      const taskCompleted = tasks.reduce((acc, task) => {
        if (task.isCompleted) acc.completed += 1;
        if (!task.isCompleted) acc.notCompleted += 1;
        return acc;
      }, { completed: 0, notCompleted: 0 });

      setTaskData(taskCompleted);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchTasksByPriority = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const tasks = await response.json();

      const priorityCounts = tasks.reduce((acc, task) => {
        if (task.priority === 1) acc.one += 1;
        if (task.priority === 2) acc.two += 1;
        if (task.priority === 3) acc.three += 1;
        if (task.priority === 4) acc.four += 1;
        if (task.priority === 5) acc.five += 1;
        return acc;
      }, { one: 0, two: 0, three: 0, four: 0, five: 0 });

      setTaskData(priorityCounts);
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
    } else if (selectedChart === 'Priority Histogram') {
      await fetchTasksByPriority();
    }


    const container = document.getElementById('chart-container');
    if (!container) return null;

    const commonOptions = {
      backgroundColor: 'transparent',
      animation: {
        duration: 1000,
        easing: 'out',
        startup: true,
      },
      chartArea: {
        width: '80%',
        height: '80%'
      },
      legend: { position: 'top' },
    };

    switch (selectedChart) {
      
      case 'Line Chart': {
        const data = googleCharts.arrayToDataTable([
          ['Month', 'Value'],
          ['Jan', 400],
          ['Feb', 300],
          ['Mar', 600],
          ['Apr', 800],
          ['May', 500],
        ]);

        

        const chart = new googleCharts.LineChart(container);
        chart.draw(data, {
          ...commonOptions,
          title: 'Monthly Performance',
          hAxis: { title: 'Month' },
          vAxis: { title: 'Value' },
        });
        break;
      }

      case 'Task Completed': {
        const data = googleCharts.arrayToDataTable([
          ['Status', 'Count'],
          ['Completed', taskData.completed],
          ['Not Completed', taskData.notCompleted],
        ]);

        const chart = new googleCharts.PieChart(container);
        chart.draw(data, {
          ...commonOptions,
          title: 'Task Completion Status',
        });
        break;
      }

      case 'priority Histogram': {
        const data = googleCharts.arrayToDataTable([
          ['Priority', 'Count'],
          ['1', taskData.one],
          ['2', taskData.two],
          ['3', taskData.three],
          ['4', taskData.four],
          ['5', taskData.five],
        ]);

        const chart = new googleCharts.ColumnChart(container);
        chart.draw(data, {
          ...commonOptions,
          title: 'Task Priority Distribution',
          hAxis: { title: 'priority' },
          vAxis: { title: 'Count' },
          bar: { groupWidth: '95%' },
        });
        break;
      }

      case 'Difficulty Histogram': {
        const data = googleCharts.arrayToDataTable([
          ['Difficulty', 'Count'],
          ['Low', taskData.low],
          ['Medium', taskData.medium],
          ['High', taskData.high],
        ]);

        const chart = new googleCharts.ColumnChart(container);
        chart.draw(data, {
          ...commonOptions,
          title: 'Task Difficulty Distribution',
          hAxis: { title: 'Difficulty' },
          vAxis: { title: 'Count' },
          bar: { groupWidth: '95%' },
        });
        break;
      }
    }
  };

  // Efecto para redibujar el gráfico cuando cambia la selección
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
          {/* Sidebar */}
          <div className="w-64 bg-white shadow-md p-4">
            <h2 className="text-xl font-bold mb-4">Chart Types</h2>
            <div className="space-y-2">
              {chartTypes.map((chartType) => (
                <button
                  key={chartType}
                  onClick={() => setSelectedChart(chartType)}
                  className={`w-full py-2 px-4 rounded text-white transition-colors ${
                    selectedChart === chartType
                      ? 'bg-blue-600'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
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

          {/* Main content */}
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