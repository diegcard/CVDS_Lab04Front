function changeChart(chartType) {
    const chartContainer = document.getElementById('chart-container');
    chartContainer.innerHTML = `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart would be displayed here`;
}