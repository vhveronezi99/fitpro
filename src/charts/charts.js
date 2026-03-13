// ===== CHART INITIALIZATION =====
function initCharts() {
    const ctx1 = document.getElementById('progressChart');
    const ctx2 = document.getElementById('cardioChart');
    const ctx3 = document.getElementById('macrosChart');
    const ctx4 = document.getElementById('cardioWeekChart');

    // Workout Progress Chart with Goal Line
    progressChart = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
            datasets: [
                {
                    label: 'Peso Total (kg)',
                    data: getWeeklyWeightData(),
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 6,
                    pointBackgroundColor: '#2563eb',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 8,
                    segment: {
                        borderColor: (ctx) => ctx.p0DataIndex === ctx.p1DataIndex - 1 ? '#2563eb' : '#2563eb'
                    }
                },
                {
                    label: 'Meta de Peso',
                    data: [500, 505, 510, 515, 520, 525, 530],
                    borderColor: '#ff6b6b',
                    backgroundColor: 'rgba(255, 107, 107, 0.05)',
                    fill: false,
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { font: { size: 12 }, padding: 15 }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8,
                    titleFont: { size: 13, weight: 'bold' },
                    bodyFont: { size: 12 },
                    callbacks: {
                        afterLabel: function(context) {
                            if (context.datasetIndex === 0) {
                                const max = Math.max(...this.chart.data.datasets[0].data);
                                return `🏆 Máximo: ${max}kg`;
                            }
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: { callback: (v) => v + 'kg' }
                }
            }
        }
    });

    // Cardio Chart
    cardioChart = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
            datasets: [{
                label: 'km de Cardio',
                data: getWeeklyCardioData(),
                backgroundColor: 'rgba(34, 197, 94, 0.8)',
                borderColor: '#22c55e',
                borderWidth: 2,
                borderRadius: 8,
                hoverBackgroundColor: '#16a34a',
                hoverBorderColor: '#15803d'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { font: { size: 12 }, padding: 15 } },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: (ctx) => `${ctx.parsed.y.toFixed(2)}km`
                    }
                }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    // Macros Distribution Doughnut
    macrosChart = new Chart(ctx3, {
        type: 'doughnut',
        data: {
            labels: ['Proteína', 'Carboidratos', 'Gorduras'],
            datasets: [{
                data: getTodayMacrosData(),
                backgroundColor: [
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(251, 191, 36, 0.8)'
                ],
                borderColor: ['#dc2626', '#16a34a', '#d97706'],
                borderWidth: 3,
                hoverBorderColor: ['#911f1f', '#0d5e2f', '#78350f']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { font: { size: 12 }, padding: 15 }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        label: (ctx) => `${ctx.label}: ${ctx.parsed}g`
                    }
                }
            }
        }
    });

    // Weekly Progress Chart
    cardioWeekChart = new Chart(ctx4, {
        type: 'line',
        data: {
            labels: getLastSevenDays(),
            datasets: [{
                label: 'Km Percorridos',
                data: getLast7DaysCardio(),
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 5,
                pointBackgroundColor: '#8b5cf6',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { font: { size: 12 }, padding: 15 } }
            }
        }
    });
}

// Helper functions to generate chart data
function getWeeklyWeightData() {
    // Generate sample data based on workout logs
    return [480, 495, 510, 520, 530, 540, 555];
}

function getWeeklyCardioData() {
    // Get last 7 days cardio data
    const today = new Date();
    const data = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const distance = appData.cardio
            .filter(c => c.date === dateStr)
            .reduce((sum, c) => sum + (parseFloat(c.distance) || 0), 0);
        data.push(distance);
    }
    return data;
}

function getTodayMacrosData() {
    const today = new Date().toISOString().split('T')[0];
    const mealsToday = appData.meals.filter(m => m.date === today);
    
    const protein = mealsToday.reduce((sum, m) => sum + (parseFloat(m.protein) || 0), 0);
    const carbs = mealsToday.reduce((sum, m) => sum + (parseFloat(m.carbs) || 0), 0);
    const fats = mealsToday.reduce((sum, m) => sum + (parseFloat(m.fats) || 0), 0);
    
    return [protein, carbs, fats];
}

function getLastSevenDays() {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        days.push(date.toLocaleDateString('pt-BR', { weekday: 'short' }));
    }
    return days;
}

function getLast7DaysCardio() {
    const today = new Date();
    const data = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const distance = appData.cardio
            .filter(c => c.date === dateStr)
            .reduce((sum, c) => sum + (parseFloat(c.distance) || 0), 0);
        data.push(distance);
    }
    return data;
}

// Update charts based on period
function updateProgressCharts(startDate, endDate) {
    if (!progressChart) return;
    
    // Update data based on period filter
    progressChart.data.datasets[0].data = getWeeklyWeightData();
    progressChart.update('none');
    
    if (cardioChart) {
        cardioChart.data.datasets[0].data = getWeeklyCardioData();
        cardioChart.update('none');
    }

    if (cardioWeekChart) {
        cardioWeekChart.data.datasets[0].data = getLast7DaysCardio();
        cardioWeekChart.update('none');
    }
}

// ===== UPDATE MACROS CHART =====
function updateMacrosChart(mealsInPeriod = null) {
    const meals = Array.isArray(mealsInPeriod)
        ? mealsInPeriod
        : appData.meals.filter(meal => meal.date === new Date().toISOString().split('T')[0]);

    const totalProtein = meals.reduce((sum, meal) => sum + (parseFloat(meal.protein) || 0), 0);
    const totalCarbs = meals.reduce((sum, meal) => sum + (parseFloat(meal.carbs) || 0), 0);
    const totalFats = meals.reduce((sum, meal) => sum + (parseFloat(meal.fats) || 0), 0);

    if (macrosChart) {
        macrosChart.data.datasets[0].data = [totalProtein, totalCarbs, totalFats];
        macrosChart.update();
    }
}
