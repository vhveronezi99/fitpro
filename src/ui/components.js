// ===== REUSABLE COMPONENTS =====

// Progress Bar Component
function createProgressBar(current, goal, label, color = 'blue') {
    const percentage = calculateProgress(current, goal);
    const bgColor = getProgressColor(percentage);
    const displayColor = {
        green: 'bg-green-600',
        blue: 'bg-blue-600',
        yellow: 'bg-yellow-500',
        red: 'bg-red-500'
    }[color] || bgColor;

    return `
        <div class="mb-4">
            <div class="flex justify-between items-center mb-2">
                <label class="text-sm font-semibold text-gray-700">${label}</label>
                <span class="text-sm font-bold text-gray-800">
                    ${current.toFixed(0)} / ${goal.toFixed(0)}
                    <span class="text-gray-600">(${percentage.toFixed(0)}%)</span>
                </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div class="${displayColor} h-full transition-all duration-500 ease-out" 
                     style="width: ${percentage}%"></div>
            </div>
        </div>
    `;
}

// Stat Card Component
function createStatCard(icon, label, value, unit = '', color = 'blue') {
    const colorMap = {
        blue: 'from-blue-600 to-blue-700',
        green: 'from-green-600 to-green-700',
        purple: 'from-purple-600 to-purple-700',
        pink: 'from-pink-600 to-pink-700',
        cyan: 'from-cyan-600 to-cyan-700'
    };

    return `
        <div class="glass-effect rounded-xl p-6 text-white card-hover bg-gradient-to-br ${colorMap[color]}">
            <div class="flex justify-between items-start">
                <div>
                    <p class="opacity-80 text-sm font-medium">${label}</p>
                    <p class="text-4xl font-bold mt-2">${value}</p>
                    ${unit ? `<p class="text-sm opacity-70 mt-1">${unit}</p>` : ''}
                </div>
                <i class="fas ${icon} text-3xl opacity-60"></i>
            </div>
        </div>
    `;
}

// Macro Card Component
function createMacroCard(label, value, unit, color) {
    const colorMap = {
        calories: 'bg-blue-600',
        protein: 'bg-red-600',
        carbs: 'bg-green-600',
        fats: 'bg-yellow-600'
    };

    return `
        <div class="${colorMap[color] || colorMap.calories} rounded-lg p-4 text-white">
            <p class="text-sm opacity-90 font-medium">${label}</p>
            <p class="text-3xl font-bold mt-2">${value.toFixed(0)}</p>
            <p class="text-xs opacity-70 mt-1">${unit}</p>
        </div>
    `;
}

// Workout Streak Badge
function createStreakBadge(streakDays) {
    const emoji = streakDays >= 7 ? '??' : '??';
    const color = streakDays >= 7 ? 'orange' : 'blue';

    return `
        <div class="glass-effect rounded-xl p-6 card-hover text-center bg-gradient-to-br from-${color}-500 to-${color}-600 text-white">
            <div class="text-5xl mb-2">${emoji}</div>
            <p class="text-sm opacity-90 font-medium">Sequência de Treino</p>
            <p class="text-3xl font-bold mt-2">${streakDays}</p>
            <p class="text-xs opacity-70 mt-1">dias seguidos</p>
        </div>
    `;
}

// Mini Stat Component
function createMiniStat(icon, label, value, trend = null) {
    const trendHTML = trend ? `
        <span class="text-sm ml-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}">
            ${trend > 0 ? '?' : '?'} ${Math.abs(trend).toFixed(1)}%
        </span>
    ` : '';

    return `
        <div class="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
            <div class="text-2xl text-blue-600">
                <i class="fas ${icon}"></i>
            </div>
            <div class="flex-1">
                <p class="text-xs text-gray-600 font-medium">${label}</p>
                <p class="text-lg font-bold text-gray-800">
                    ${value}
                    ${trendHTML}
                </p>
            </div>
        </div>
    `;
}

// Period Filter Button
function createPeriodFilter(onPeriodChange) {
    return `
        <div class="flex gap-2 mb-6">
            <button class="period-btn px-6 py-2 rounded-lg font-semibold transition-all" 
                    data-period="today" onclick="changePeriod('today', event)">
                Hoje
            </button>
            <button class="period-btn active px-6 py-2 rounded-lg font-semibold transition-all" 
                    data-period="week" onclick="changePeriod('week', event)">
                Semana
            </button>
            <button class="period-btn px-6 py-2 rounded-lg font-semibold transition-all" 
                    data-period="month" onclick="changePeriod('month', event)">
                Mês
            </button>
        </div>
    `;
}

// Goal Editor Modal
function createGoalEditorModal() {
    return `
        <div id="goalModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="glass-effect rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
                <h2 class="text-2xl font-bold mb-6 text-gray-800">Minhas Metas</h2>

                <div class="space-y-4 mb-6">
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Calorias (kcal)</label>
                        <input type="number" id="goalCalories" value="2500" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Proteína (g)</label>
                        <input type="number" id="goalProtein" value="180" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Carboidratos (g)</label>
                        <input type="number" id="goalCarbs" value="250" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Gordura (g)</label>
                        <input type="number" id="goalFats" value="80" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    </div>
                </div>

                <div class="flex gap-3">
                    <button onclick="saveGoals()" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition">
                        Salvar
                    </button>
                    <button onclick="closeGoalModal()" class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 rounded-lg transition">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Helper functions
function openGoalModal() {
    const modal = document.getElementById('goalModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.getElementById('goalCalories').value = goalsConfig.daily.calories;
        document.getElementById('goalProtein').value = goalsConfig.daily.protein;
        document.getElementById('goalCarbs').value = goalsConfig.daily.carbs;
        document.getElementById('goalFats').value = goalsConfig.daily.fats;
    }
}

function closeGoalModal() {
    const modal = document.getElementById('goalModal');
    if (modal) modal.classList.add('hidden');
}

function saveGoals() {
    updateGoals({
        daily: {
            calories: parseInt(document.getElementById('goalCalories').value),
            protein: parseInt(document.getElementById('goalProtein').value),
            carbs: parseInt(document.getElementById('goalCarbs').value),
            fats: parseInt(document.getElementById('goalFats').value)
        }
    });
    closeGoalModal();
    showSuccess('Metas atualizadas com sucesso!');
}

// Export functions
window.createProgressBar = createProgressBar;
window.createStatCard = createStatCard;
window.createMacroCard = createMacroCard;
window.createStreakBadge = createStreakBadge;
window.createMiniStat = createMiniStat;
window.createPeriodFilter = createPeriodFilter;
window.createGoalEditorModal = createGoalEditorModal;
window.openGoalModal = openGoalModal;
window.closeGoalModal = closeGoalModal;
window.saveGoals = saveGoals;

