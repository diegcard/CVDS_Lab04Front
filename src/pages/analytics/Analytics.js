import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/Analytics.css';

const Analytics = () => {
  const [selectedChart, setSelectedChart] = useState(null);
  const [googleCharts, setGoogleCharts] = useState(null);
  const navigate = useNavigate();

  const chartTypes = [
    'Difficulty Histogram',
    'Line Chart', 
    'Pie Chart',
    'Scatter Plot'
  ];

  useEffect(() => {
    // Initialize Google Charts
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
  }, []);

  const renderChart = () => {
    if (!selectedChart || !googleCharts) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          {!selectedChart ? 'Select a chart type from the sidebar' : 'Loading charts...'}
        </div>
      );
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

      case 'Pie Chart': {
        const data = googleCharts.arrayToDataTable([
          ['Task', 'Hours per Day'],
          ['Work', 11],
          ['Eat', 2],
          ['Commute', 2],
          ['Watch TV', 2],
          ['Sleep', 7],
        ]);

        const chart = new googleCharts.PieChart(container);
        chart.draw(data, {
          ...commonOptions,
          title: 'Daily Activities',
        });
        break;
      }

      case 'Scatter Plot': {
        const data = googleCharts.arrayToDataTable([
          ['Age', 'Weight'],
          [8, 12],
          [4, 5.5],
          [11, 14],
          [4, 5],
          [3, 3.5],
          [6.5, 7],
        ]);

        const chart = new googleCharts.ScatterChart(container);
        chart.draw(data, {
          ...commonOptions,
          title: 'Age vs. Weight Correlation',
          hAxis: { title: 'Age' },
          vAxis: { title: 'Weight' },
          trendlines: { 0: {} },
        });
        break;
      }

      case 'Difficulty Histogram': {
        const data = googleCharts.arrayToDataTable([
          ['Range', 'Count'],
          ['0-20', 15],
          ['21-40', 25],
          ['41-60', 30],
          ['61-80', 20],
          ['81-100', 10],
        ]);

        const chart = new googleCharts.ColumnChart(container);
        chart.draw(data, {
          ...commonOptions,
          title: 'Difficulty Distribution',
          hAxis: { title: 'Range' },
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
    navigate('/Home');
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