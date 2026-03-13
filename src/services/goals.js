// ===== GOALS MANAGEMENT =====
const goalsConfig = {
    daily: {
        calories: 2500,
        protein: 180,
        carbs: 250,
        fats: 80
    },
    weekly: {
        workoutMinutes: 300,
        cardioKm: 20
    }
};

// Get today's goal progress
function getGoalProgress(period = 'today') {
    const today = new Date().toISOString().split('T')[0];
    let startDate = today;
    
    if (period === 'week') {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 7);
        startDate = weekStart.toISOString().split('T')[0];
    } else if (period === 'month') {
        const monthStart = new Date();
        monthStart.setDate(1);
        startDate = monthStart.toISOString().split('T')[0];
    }

    const relevantMeals = appData.meals.filter(m => m.date >= startDate && m.date <= today);
    const relevantCardio = appData.cardio.filter(c => c.date >= startDate && c.date <= today);
    const relevantWorkouts = appData.workoutLogs.filter(w => w.date >= startDate && w.date <= today);

    const stats = {
        calories: relevantMeals.reduce((sum, m) => sum + (parseFloat(m.calories) || 0), 0),
        protein: relevantMeals.reduce((sum, m) => sum + (parseFloat(m.protein) || 0), 0),
        carbs: relevantMeals.reduce((sum, m) => sum + (parseFloat(m.carbs) || 0), 0),
        fats: relevantMeals.reduce((sum, m) => sum + (parseFloat(m.fats) || 0), 0),
        cardioKm: relevantCardio.reduce((sum, c) => sum + (parseFloat(c.distance) || 0), 0),
        workoutMinutes: relevantWorkouts.reduce((sum, w) => sum + (w.duration || 60), 0)
    };

    return stats;
}

// Calculate progress percentage
function calculateProgress(current, goal) {
    if (goal === 0) return 0;
    return Math.min((current / goal) * 100, 100);
}

// Get color based on progress
function getProgressColor(percentage) {
    if (percentage >= 100) return 'bg-green-600';
    if (percentage >= 80) return 'bg-blue-600';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
}

// Update user goals
function updateGoals(newGoals) {
    if (newGoals.daily) {
        Object.assign(goalsConfig.daily, newGoals.daily);
    }
    if (newGoals.weekly) {
        Object.assign(goalsConfig.weekly, newGoals.weekly);
    }
    localStorage.setItem('fitpro_goals', JSON.stringify(goalsConfig));
    if (typeof updateDashboard === 'function') updateDashboard();
}

// Load goals from localStorage
function loadGoals() {
    const saved = localStorage.getItem('fitpro_goals');
    if (saved) {
        const loaded = JSON.parse(saved);
        Object.assign(goalsConfig, loaded);
    }
}

// Initialize goals on page load
loadGoals();