// Load the Google Charts library
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(initializeCharts);

let tasks = [];

function initializeCharts() {
    getTasks().then(() => {
        // Draw initial chart after tasks are loaded
        changeChart('difficultyHistogram');
    });
}

function changeChart(chartType) {
    switch(chartType) {
        case 'difficultyHistogram':
            drawDifficultyHistogram();
            break;
        case 'completedTasksOverTime':
            drawCompletedTasksOverTime();
            break;
        case 'averageTasksByPriority':
            drawAverageTasksByPriority();
            break;
        case 'totalTimeByCompletedTasks':
            drawTotalTimeByCompletedTasks();
            break;
        default:
            console.log('Unknown chart type');
    }
}

function drawDifficultyHistogram() {
    const difficultyCounts = {
        low: 0,
        medium: 0,
        high: 0
    };

    tasks.forEach(task => {
        difficultyCounts[task.difficultyLevel]++;
    });

    const data = new google.visualization.DataTable();
    data.addColumn('string', 'Difficulty');
    data.addColumn('number', 'Count');

    data.addRows([
        ['Low', difficultyCounts.low],
        ['Medium', difficultyCounts.medium],
        ['High', difficultyCounts.high]
    ]);

    const options = {
        title: 'Histogram of Task Difficulties',
        legend: { position: 'none' },
        hAxis: { title: 'Difficulty' },
        vAxis: { title: 'Count' }
    };

    const chart = new google.visualization.ColumnChart(document.getElementById('chart-container'));
    chart.draw(data, options);
}

function drawCompletedTasksOverTime() {
    const completedTasks = tasks.filter(task => task.isCompleted)
        .sort((a, b) => new Date(a.finishDate) - new Date(b.finishDate));

    const data = new google.visualization.DataTable();
    data.addColumn('date', 'Date');
    data.addColumn('number', 'Completed Tasks');

    let cumulativeCount = 0;
    const rows = completedTasks.map(task => {
        cumulativeCount++;
        return [new Date(task.finishDate), cumulativeCount];
    });

    data.addRows(rows);

    const options = {
        title: 'Number of Completed Tasks Over Time',
        legend: { position: 'none' },
        hAxis: { 
            title: 'Date',
            format: 'MMM d, yyyy'
        },
        vAxis: { 
            title: 'Number of Completed Tasks',
            minValue: 0
        },
        lineWidth: 2,
        pointSize: 5
    };

    const chart = new google.visualization.LineChart(document.getElementById('chart-container'));
    chart.draw(data, options);
}


function drawAverageTasksByPriority() {
    const priorityGroups = tasks.reduce((acc, task) => {
        if (!acc[task.priority]) {
            acc[task.priority] = [];
        }
        acc[task.priority].push(task);
        return acc;
    }, {});

    const data = new google.visualization.DataTable();
    data.addColumn('string', 'Priority');
    data.addColumn('number', 'Average Time (Days)');

    Object.entries(priorityGroups).forEach(([priority, tasks]) => {
        const avgTime = tasks.reduce((sum, task) => {
            const startDate = new Date(task.creationDate);
            const endDate = new Date(task.estimatedTime);
            const timeDiff = Math.abs(endDate - startDate);
            const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
            return sum + daysDiff;
        }, 0) / tasks.length;
        data.addRow([priority.toString(), avgTime]);
    });

    const options = {
        title: 'Average Estimated Time by Task Priority',
        legend: { position: 'none' },
        hAxis: { title: 'Priority' },
        vAxis: { title: 'Average Time (Days)' }
    };

    const chart = new google.visualization.ColumnChart(document.getElementById('chart-container'));
    chart.draw(data, options);
}

function drawTotalTimeByCompletedTasks() {
    const completedTasks = tasks.filter(task => task.isCompleted)
        .sort((a, b) => new Date(a.finishDate) - new Date(b.finishDate));

    const data = new google.visualization.DataTable();
    data.addColumn('date', 'Completion Date');
    data.addColumn('number', 'Cumulative Time Spent (Days)');

    let cumulativeTimeDays = 0;
    const rows = completedTasks.map(task => {
        const startDate = new Date(task.creationDate);
        const endDate = new Date(task.finishDate);
        const timeDiff = Math.abs(endDate - startDate);
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        cumulativeTimeDays += daysDiff;
        return [new Date(task.finishDate), cumulativeTimeDays];
    });

    data.addRows(rows);

    const options = {
        title: 'Total Time Spent on Completed Tasks Over Time',
        legend: { position: 'none' },
        hAxis: { 
            title: 'Date',
            format: 'MMM d, yyyy'
        },
        vAxis: { 
            title: 'Cumulative Time Spent (Days)',
            minValue: 0
        },
        lineWidth: 2,
        pointSize: 5
    };

    const chart = new google.visualization.LineChart(document.getElementById('chart-container'));
    chart.draw(data, options);
}

async function getTasks() {
    tasks = [];
    try {
        const response = await fetch("http://localhost:8080/api/tasks/all");
        tasks = await response.json();
        console.log("Tasks loaded:", tasks);
    } catch (error) {
        console.log("Error fetching tasks", error);
    }
}

// Initialize the charts when the page loads
google.charts.setOnLoadCallback(initializeCharts);