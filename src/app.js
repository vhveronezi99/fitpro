// ===== UTILITY FUNCTIONS =====
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// ===== TAB SWITCHING =====
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active-tab');
        btn.classList.add('text-gray-600');
        btn.classList.add('hover:text-purple-600');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');

    // Mark button as active
    event.target.closest('.tab-btn').classList.add('active-tab');
    event.target.closest('.tab-btn').classList.remove('text-gray-600', 'hover:text-purple-600');

    // Update charts when switching tabs
    setTimeout(() => {
        if (tabName === 'treino') {
            if (exerciseProgressChart) exerciseProgressChart.resize();
        } else if (tabName === 'dieta') {
            if (macrosChart) macrosChart.resize();
        } else if (tabName === 'cardio') {
            if (cardioWeekChart) cardioWeekChart.resize();
        }
    }, 100);
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async () => {
    // Load API script first
    await loadScript('src/services/api.js');

    // Initialize app with API data
    await initializeApp();

    // Initialize period filter
    const periodFilter = document.getElementById('periodFilter');
    if (periodFilter) {
        periodFilter.innerHTML = createPeriodFilter();
    }

    // Add goal editor modal
    const metalsModal = document.body.appendChild(document.createElement('div'));
    metalsModal.innerHTML = createGoalEditorModal();

    // Initialize charts
    initCharts();
    updateDashboard();
});
