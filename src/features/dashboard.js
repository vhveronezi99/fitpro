// ===== DASHBOARD STATE =====
let currentPeriod = 'week';

function formatDateToISO(date) {
    return date.toISOString().split('T')[0];
}

function getCurrentPeriodRange() {
    const today = new Date();
    let start = new Date(today);
    let label = 'Hoje';

    if (currentPeriod === 'week') {
        const dayOfWeek = start.getDay(); // 0 = Sunday
        const offsetToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        start.setDate(start.getDate() - offsetToMonday);
        label = 'Semana';
    } else if (currentPeriod === 'month') {
        start.setDate(1);
        label = 'M�s';
    }

    const startDate = formatDateToISO(start);
    const endDate = formatDateToISO(today);
    const daysInRange = Math.max(
        1,
        Math.floor((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1
    );

    return { startDate, endDate, daysInRange, label };
}

// ===== DASHBOARD UPDATES =====
function updateDashboard() {
    const { startDate, endDate, daysInRange, label } = getCurrentPeriodRange();
    const inRange = (entry) => entry.date >= startDate && entry.date <= endDate;

    const relevantMeals = appData.meals.filter(inRange);
    const relevantCardio = appData.cardio.filter(inRange);
    const relevantWorkouts = appData.workoutLogs.filter(inRange);

    let totalWeight = 0;
    let totalExercises = 0;

    relevantWorkouts.forEach(log => {
        (log.exercises || []).forEach(ex => {
            totalWeight += parseFloat(ex.weight) || 0;
            totalExercises += 1;
        });
    });

    const totalCalories = relevantMeals.reduce((sum, meal) => sum + (parseFloat(meal.calories) || 0), 0);
    const totalProtein = relevantMeals.reduce((sum, meal) => sum + (parseFloat(meal.protein) || 0), 0);
    const totalCarbs = relevantMeals.reduce((sum, meal) => sum + (parseFloat(meal.carbs) || 0), 0);
    const totalFats = relevantMeals.reduce((sum, meal) => sum + (parseFloat(meal.fats) || 0), 0);

    const totalCardioKm = relevantCardio.reduce((sum, c) => sum + (parseFloat(c.distance) || 0), 0);
    const totalCardioMinutes = relevantCardio.reduce((sum, c) => sum + (parseFloat(c.time) || 0), 0);

    const totalWeightEl = document.getElementById('totalWeight');
    if (totalWeightEl) totalWeightEl.textContent = totalWeight.toFixed(0);

    const totalExercisesEl = document.getElementById('exercisesToday');
    if (totalExercisesEl) totalExercisesEl.textContent = totalExercises;

    const totalCaloriesEl = document.getElementById('totalCalories');
    if (totalCaloriesEl) totalCaloriesEl.textContent = totalCalories.toFixed(0);

    const totalCardioKmEl = document.getElementById('totalCardioKm');
    if (totalCardioKmEl) totalCardioKmEl.textContent = totalCardioKm.toFixed(1);

    const totalCardioTimeEl = document.getElementById('totalCardioTime');
    if (totalCardioTimeEl) totalCardioTimeEl.textContent = totalCardioMinutes.toFixed(0);

    const totalCardioDistanceEl = document.getElementById('totalCardioDistance');
    if (totalCardioDistanceEl) totalCardioDistanceEl.textContent = totalCardioKm.toFixed(1);

    const streak = calculateWorkoutStreak();
    const streakElement = document.getElementById('streakDays');
    if (streakElement) streakElement.textContent = streak;

    const macroCaloriesEl = document.getElementById('macro-calories');
    if (macroCaloriesEl) macroCaloriesEl.textContent = totalCalories.toFixed(0);

    const macroProteinEl = document.getElementById('macro-protein');
    if (macroProteinEl) macroProteinEl.textContent = totalProtein.toFixed(0);

    const macroCarbsEl = document.getElementById('macro-carbs');
    if (macroCarbsEl) macroCarbsEl.textContent = totalCarbs.toFixed(0);

    const macroFatsEl = document.getElementById('macro-fats');
    if (macroFatsEl) macroFatsEl.textContent = totalFats.toFixed(0);

    updatePeriodLabels(label);
    updateProgressBars(totalCalories, totalProtein, totalCarbs, totalFats, daysInRange);
    updateMealsSummary(relevantMeals);
    updateMacrosChart(relevantMeals);
    updateWidgets();

    if (typeof updateProgressCharts === 'function') {
        updateProgressCharts(startDate, endDate);
    }
}

// Calculate workout streak
function calculateWorkoutStreak() {
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];

        const hasWorkout = appData.workoutLogs.some(w => w.date === dateStr);
        if (hasWorkout) {
            streak++;
        } else if (i > 0) {
            break;
        }
    }

    return streak;
}

// Update progress bars for macros
function updateProgressBars(calories, protein, carbs, fats, daysInRange = 1) {
    const container = document.getElementById('macroProgressBars');
    if (!container) return;

    const multiplier = currentPeriod === 'today' ? 1 : daysInRange;
    const periodName = currentPeriod === 'today' ? 'Di�rias' : 'do Per�odo';

    let html = `<h3 class="text-xl font-bold mb-4 text-gray-800">Progresso de Metas ${periodName}</h3>`;
    html += createProgressBar(calories, goalsConfig.daily.calories * multiplier, 'Calorias');
    html += createProgressBar(protein, goalsConfig.daily.protein * multiplier, 'Prote�na');
    html += createProgressBar(carbs, goalsConfig.daily.carbs * multiplier, 'Carboidratos');
    html += createProgressBar(fats, goalsConfig.daily.fats * multiplier, 'Gordura');

    html += `<button onclick="openGoalModal()" class="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition">
        Editar Metas
    </button>`;

    container.innerHTML = html;
}

// Change period
function changePeriod(period, event) {
    currentPeriod = period;

    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    updateDashboard();
}

// Update additional widgets
function updateWidgets() {
    const streak = calculateWorkoutStreak();
    const streakElement = document.getElementById('streakDays');
    if (streakElement) {
        streakElement.textContent = streak;
    }

    const now = new Date();
    const dayOfWeek = now.getDay();
    const offsetToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - offsetToMonday);
    const weekStartStr = formatDateToISO(weekStart);
    const today = formatDateToISO(now);

    const weekCardio = appData.cardio
        .filter(c => c.date >= weekStartStr && c.date <= today)
        .reduce((sum, c) => sum + (parseFloat(c.distance) || 0), 0);

    const weekCardioElement = document.getElementById('weekCardio');
    if (weekCardioElement) {
        weekCardioElement.textContent = weekCardio.toFixed(1);
    }

    let prWeight = 0;
    appData.workoutLogs.forEach(log => {
        (log.exercises || []).forEach(ex => {
            const weight = parseFloat(ex.weight) || 0;
            if (weight > prWeight) prWeight = weight;
        });
    });

    const prElement = document.getElementById('prWeight');
    if (prElement) {
        prElement.textContent = prWeight.toFixed(0);
    }
}

function updateMealsSummary(mealsInPeriod = []) {
    const mealTypes = ['Caf� da Manh�', 'Lanche 1', 'Almo�o', 'Lanche 2', 'Jantar', 'Ceia'];
    const showDailyCompletion = currentPeriod === 'today';

    const summaryHTML = mealTypes.map(type => {
        const mealItems = mealsInPeriod.filter(m => m.mealType === type);
        const totalCals = mealItems.reduce((sum, m) => sum + (parseFloat(m.calories) || 0), 0);
        const totalProtein = mealItems.reduce((sum, m) => sum + (parseFloat(m.protein) || 0), 0);
        const completedCount = mealItems.filter(m => m.completed).length;
        const activeDays = new Set(mealItems.map(m => m.date)).size;
        const isCompletedToday = mealItems.length > 0 && mealItems.every(m => m.completed);
        const borderClass = showDailyCompletion && isCompletedToday ? 'border-green-500 bg-green-50' : 'border-gray-200';

        return `
            <div class="bg-white border-2 ${borderClass} rounded-lg p-4 card-hover">
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <p class="font-semibold text-gray-800 text-lg">${type}</p>
                        <p class="text-sm text-gray-500 mt-1">${mealItems.length} item(ns)</p>
                    </div>
                    <span class="text-sm font-semibold text-gray-600">
                        ${showDailyCompletion ? (isCompletedToday ? 'Conclu�do' : 'Pendente') : `${activeDays} dia(s)`}
                    </span>
                </div>
                <div class="space-y-1 mb-3 text-sm">
                    <p class="text-gray-700"><strong>${totalCals.toFixed(0)}</strong> kcal</p>
                    <p class="text-gray-600">${totalProtein.toFixed(0)}g prote�na</p>
                    ${!showDailyCompletion ? `<p class="text-gray-600">${completedCount} item(ns) marcado(s)</p>` : ''}
                </div>
                ${showDailyCompletion ? `
                <button onclick="toggleMealCompletion('${type}')" class="w-full ${isCompletedToday ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'} text-white py-2 rounded text-sm font-semibold transition">
                    ${isCompletedToday ? 'Desmarcar' : 'Confirmar Refei��o'}
                </button>
                ` : ''}
            </div>
        `;
    }).join('');

    const mealsSummary = document.getElementById('mealsSummary');
    if (mealsSummary) {
        mealsSummary.innerHTML = summaryHTML || '<p class="text-gray-500">Sem refei��es no per�odo.</p>';
    }
}

function updatePeriodLabels(periodLabel) {
    const periodText = currentPeriod === 'today' ? 'Hoje' : `na ${periodLabel.toLowerCase()}`;

    const exercisesLabel = document.getElementById('exercisesLabel');
    if (exercisesLabel) exercisesLabel.textContent = `Exerc�cios ${periodText}`;

    const caloriesLabel = document.getElementById('caloriesLabel');
    if (caloriesLabel) {
        caloriesLabel.textContent = `Calorias ${currentPeriod === 'today' ? 'Ingeridas' : `Ingeridas ${periodText}`}`;
    }

    const cardioLabel = document.getElementById('cardioLabel');
    if (cardioLabel) {
        cardioLabel.textContent = `km de Cardio ${currentPeriod === 'today' ? '' : periodText}`.trim();
    }

    const mealsSummaryTitle = document.getElementById('mealsSummaryTitle');
    if (mealsSummaryTitle) {
        mealsSummaryTitle.textContent = `Resumo de Refei��es (${periodLabel})`;
    }

    const macrosSummaryTitle = document.getElementById('macrosSummaryTitle');
    if (macrosSummaryTitle) {
        macrosSummaryTitle.textContent = `Resumo de Macros (${periodLabel})`;
    }
}

function toggleMealCompletion(mealType) {
    const today = new Date().toISOString().split('T')[0];
    const mealItems = appData.meals.filter(m => m.date === today && m.mealType === mealType);

    const allCompleted = mealItems.every(m => m.completed);
    mealItems.forEach(m => {
        m.completed = !allCompleted;
    });

    saveData();
    updateMealsSummary(appData.meals.filter(m => m.date === today));
    updateDashboard();
}
