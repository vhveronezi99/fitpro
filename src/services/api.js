// ===== API CLIENT =====
const API_BASE_URL = 'http://localhost:5000/api';

// Generic API call function with fallback
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `HTTP ${response.status}`);
        }

        return data;
    } catch (error) {
        console.warn(`API not available for ${endpoint}, using fallback data:`, error.message);
        // Return fallback data based on endpoint
        return getFallbackData(endpoint, options);
    }
}

// Fallback data when API is not available
function getFallbackData(endpoint, options) {
    if (endpoint.includes('/treino/routines')) {
        if (options.method === 'POST') {
            return { id: Date.now(), ...JSON.parse(options.body) };
        }
        return [
            {
                id: 1,
                name: "Dia A - Peito e Tríceps",
                type: "AB",
                exercises: [
                    { id: 1, name: "Supino Reto", sets: 4, reps: 10 },
                    { id: 2, name: "Supino Inclinado", sets: 3, reps: 12 }
                ]
            },
            {
                id: 2,
                name: "Dia B - Costas e Bíceps",
                type: "AB",
                exercises: [
                    { id: 3, name: "Puxada Frontal", sets: 4, reps: 10 },
                    { id: 4, name: "Rosca Direta", sets: 3, reps: 12 }
                ]
            }
        ];
    }

    if (endpoint.includes('/dieta/meals')) {
        if (options.method === 'POST') {
            return { id: Date.now(), ...JSON.parse(options.body), date: new Date().toISOString().split('T')[0] };
        }
        return [
            {
                id: 1,
                mealType: "Café da Manhã",
                foodName: "Aveia com Frutas",
                calories: 350,
                protein: 12,
                carbs: 45,
                fats: 8,
                date: new Date().toISOString().split('T')[0]
            },
            {
                id: 2,
                mealType: "Almoço",
                foodName: "Frango com Arroz",
                calories: 650,
                protein: 45,
                carbs: 60,
                fats: 15,
                date: new Date().toISOString().split('T')[0]
            }
        ];
    }

    if (endpoint.includes('/cardio/sessions')) {
        if (options.method === 'POST') {
            return { id: Date.now(), ...JSON.parse(options.body), date: new Date().toISOString().split('T')[0] };
        }
        return [
            {
                id: 1,
                type: "Corrida",
                time: 30,
                distance: 5.2,
                pace: "5:46",
                date: new Date().toISOString().split('T')[0]
            },
            {
                id: 2,
                type: "Caminhada",
                time: 45,
                distance: 3.8,
                pace: "11:50",
                date: new Date().toISOString().split('T')[0]
            }
        ];
    }

    if (endpoint.includes('/treino/workouts')) {
        if (options.method === 'POST') {
            return { id: Date.now(), ...JSON.parse(options.body), date: new Date().toISOString() };
        }
        return [
            {
                id: 1,
                routineId: 1,
                routineName: "Dia A - Peito e Tríceps",
                exercises: [
                    { name: "Supino Reto", weight: 80, sets: 4, reps: 10 },
                    { name: "Supino Inclinado", weight: 60, sets: 3, reps: 12 }
                ],
                date: new Date().toISOString()
            }
        ];
    }

    // Default empty response
    return [];
}

// ===== TREINO API =====
const treinoAPI = {
    // Get all routines
    async getRoutines() {
        return await apiCall('/treino/routines');
    },

    // Create routine
    async createRoutine(routineData) {
        return await apiCall('/treino/routine', {
            method: 'POST',
            body: JSON.stringify(routineData)
        });
    },

    // Delete routine
    async deleteRoutine(id) {
        return await apiCall(`/treino/routine/${id}`, {
            method: 'DELETE'
        });
    },

    // Log workout
    async logWorkout(workoutData) {
        return await apiCall('/treino/workout', {
            method: 'POST',
            body: JSON.stringify(workoutData)
        });
    },

    // Get workout logs
    async getWorkoutLogs() {
        return await apiCall('/treino/workouts');
    },

    // Delete workout log
    async deleteWorkoutLog(id) {
        return await apiCall(`/treino/workout/${id}`, {
            method: 'DELETE'
        });
    }
};

// ===== DIETA API =====
const dietaAPI = {
    // Get all meals
    async getMeals() {
        return await apiCall('/dieta/meals');
    },

    // Add meal
    async addMeal(mealData) {
        return await apiCall('/dieta/meal', {
            method: 'POST',
            body: JSON.stringify(mealData)
        });
    },

    // Delete meal
    async deleteMeal(id) {
        return await apiCall(`/dieta/meal/${id}`, {
            method: 'DELETE'
        });
    },

    // Get daily macros
    async getMacros(date) {
        return await apiCall(`/dieta/macros?date=${date}`);
    }
};

// ===== CARDIO API =====
const cardioAPI = {
    // Get all cardio sessions
    async getCardioSessions() {
        return await apiCall('/cardio/sessions');
    },

    // Add cardio session
    async addCardioSession(sessionData) {
        return await apiCall('/cardio/session', {
            method: 'POST',
            body: JSON.stringify(sessionData)
        });
    },

    // Delete cardio session
    async deleteCardioSession(id) {
        return await apiCall(`/cardio/session/${id}`, {
            method: 'DELETE'
        });
    }
};

// ===== AUTH API =====
const authAPI = {
    // Login
    async login(credentials) {
        return await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    },

    // Register
    async register(userData) {
        return await apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    // Get current user
    async getCurrentUser() {
        const token = localStorage.getItem('fitpro_token');
        if (!token) return null;

        return await apiCall('/auth/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
};

// Export APIs
window.treinoAPI = treinoAPI;
window.dietaAPI = dietaAPI;
window.cardioAPI = cardioAPI;
window.authAPI = authAPI;