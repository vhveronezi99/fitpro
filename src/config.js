// ===== CONFIG & GLOBAL DATA =====
const appData = {
    routines: [],
    exercises: [],
    workoutLogs: [],
    meals: [],
    cardio: [],
    currentUser: null,
    isLoading: false
};

// Chart instances
let progressChart, cardioChart, exerciseProgressChart, macrosChart, cardioWeekChart;

// ===== API INITIALIZATION =====
async function initializeApp() {
    try {
        appData.isLoading = true;
        showLoadingIndicator();

        // Load data from API
        await loadDataFromAPI();

        // Initialize UI
        renderAllData();

        appData.isLoading = false;
        hideLoadingIndicator();

    } catch (error) {
        console.error('Failed to initialize app:', error);
        appData.isLoading = false;
        hideLoadingIndicator();

        // Fallback to demo data if API fails
        console.log('Falling back to demo data...');
        loadDemoData();
        renderAllData();
    }
}

async function loadDataFromAPI() {
    try {
        // Load routines
        const routines = await treinoAPI.getRoutines();
        appData.routines = routines.map(r => ({
            id: r.id,
            name: r.name,
            type: r.type,
            exercises: [], // Will be loaded separately if needed
            createdAt: r.created_at
        }));

        // Load meals
        const meals = await dietaAPI.getMeals();
        appData.meals = meals.map(m => ({
            id: m.id,
            mealType: m.meal_type,
            foodName: m.food_name,
            calories: parseFloat(m.calories),
            protein: parseFloat(m.protein),
            carbs: parseFloat(m.carbs),
            fats: parseFloat(m.fats),
            date: new Date(m.created_at).toISOString().split('T')[0],
            timestamp: m.created_at,
            completed: false
        }));

        // Load cardio sessions
        const cardioSessions = await cardioAPI.getCardioSessions();
        appData.cardio = cardioSessions.map(c => ({
            id: c.id,
            type: c.type,
            time: c.time,
            distance: parseFloat(c.distance),
            pace: parseFloat(c.pace),
            date: new Date(c.created_at).toISOString().split('T')[0],
            timestamp: c.created_at
        }));

        // Load workout logs
        const workoutLogs = await treinoAPI.getWorkoutLogs();
        appData.workoutLogs = workoutLogs.map(w => ({
            id: w.id,
            routineName: w.routine_name,
            exercises: w.exercises,
            date: new Date(w.created_at).toISOString().split('T')[0],
            timestamp: w.created_at
        }));

    } catch (error) {
        console.error('Error loading data from API:', error);
        throw error;
    }
}

function renderAllData() {
    // Render all sections
    if (typeof renderRoutines === 'function') renderRoutines();
    if (typeof renderMeals === 'function') renderMeals();
    if (typeof renderCardio === 'function') renderCardio();
    if (typeof renderWorkoutHistory === 'function') renderWorkoutHistory();
    if (typeof updateDashboard === 'function') updateDashboard();
}

function showLoadingIndicator() {
    const loader = document.createElement('div');
    loader.id = 'loading-indicator';
    loader.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    loader.innerHTML = `
        <div class="bg-white rounded-lg p-6 text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-700">Carregando dados...</p>
        </div>
    `;
    document.body.appendChild(loader);
}

function hideLoadingIndicator() {
    const loader = document.getElementById('loading-indicator');
    if (loader) loader.remove();
}
