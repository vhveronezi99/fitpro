// ===== DIETA ROUTES =====
let dietaHistoryPeriod = 'week';

function getDietaPeriodDateRange(period) {
    const today = new Date();
    let start = new Date(today);
    let label = 'Hoje';

    if (period === 'week') {
        const dayOfWeek = start.getDay();
        const offsetToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        start.setDate(start.getDate() - offsetToMonday);
        label = 'Semana';
    } else if (period === 'month') {
        start.setDate(1);
        label = 'Mês';
    }

    return {
        startDate: start.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0],
        label
    };
}

function changeDietaPeriod(period, event) {
    dietaHistoryPeriod = period;
    document.querySelectorAll('.dieta-period-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    renderMeals();
}

async function addFood() {
    const mealType = document.getElementById('mealType').value;
    const foodName = document.getElementById('foodName').value.trim();
    const calories = document.getElementById('foodCalories').value;
    const protein = document.getElementById('foodProtein').value;
    const carbs = document.getElementById('foodCarbs').value;
    const fats = document.getElementById('foodFats').value;

    if (!foodName) {
        showWarning('Digite o nome do alimento!');
        return;
    }

    if (!calories || !protein || !carbs || !fats) {
        showWarning('Preencha todos os campos de macros!');
        return;
    }

    const calsNum = parseFloat(calories);
    const proteinNum = parseFloat(protein);
    const carbsNum = parseFloat(carbs);
    const fatsNum = parseFloat(fats);

    if (calsNum < 0 || proteinNum < 0 || carbsNum < 0 || fatsNum < 0) {
        showError('Os valores nÃ£o podem ser negativos!');
        return;
    }

    try {
        const mealData = {
            meal_type: mealType,
            food_name: foodName,
            calories: calsNum,
            protein: proteinNum,
            carbs: carbsNum,
            fats: fatsNum
        };

        const newMeal = await dietaAPI.addMeal(mealData);
        
        if (!appData.meals) appData.meals = [];
        appData.meals.push({
            id: newMeal.id || Date.now(),
            mealType,
            foodName,
            calories: calsNum,
            protein: proteinNum,
            carbs: carbsNum,
            fats: fatsNum,
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString(),
            completed: false
        });

        showSuccess(`ðŸ½ï¸ "${foodName}" adicionado com sucesso!`);
        
        // Clear form
        document.getElementById('foodName').value = '';
        document.getElementById('foodCalories').value = '';
        document.getElementById('foodProtein').value = '';
        document.getElementById('foodCarbs').value = '';
        document.getElementById('foodFats').value = '';

        await renderMeals();
        if (typeof updateDashboard === 'function') updateDashboard();

    } catch (error) {
        console.error('Error adding meal:', error);
        showError('Erro ao adicionar alimento');
    }
}

async function renderMeals() {
    try {
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

        const { startDate, endDate, label } = getDietaPeriodDateRange(dietaHistoryPeriod);
        const periodMeals = appData.meals.filter(m => m.date >= startDate && m.date <= endDate);

        const title = document.getElementById('mealsListTitle');
        if (title) title.textContent = `Refeições da ${label}`;

        const groupedByType = {};
        periodMeals.forEach(meal => {
            if (!groupedByType[meal.mealType]) {
                groupedByType[meal.mealType] = [];
            }
            groupedByType[meal.mealType].push(meal);
        });

        let html = '';
        for (const [mealType, items] of Object.entries(groupedByType)) {
            const totalCals = items.reduce((sum, m) => sum + m.calories, 0);
            const totalProtein = items.reduce((sum, m) => sum + m.protein, 0);
            const totalCarbs = items.reduce((sum, m) => sum + m.carbs, 0);
            const totalFats = items.reduce((sum, m) => sum + m.fats, 0);

            html += `
                <div class="bg-white border-l-4 border-blue-600 rounded-lg p-4 text-gray-800 card-hover">
                    <h4 class="font-bold text-lg mb-3">${mealType}</h4>
                    <div class="space-y-1 text-sm mb-4 bg-gray-50 p-3 rounded">
                        ${items.map(item => `<div class="text-gray-700 flex items-center"><span class="text-xs mr-2">•</span>${item.foodName}</div>`).join('')}
                    </div>
                    <div class="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-3 rounded">
                        <div><span class="text-gray-600">Calorias:</span> <strong class="text-blue-600">${totalCals}kcal</strong></div>
                        <div><span class="text-gray-600">Proteína:</span> <strong class="text-blue-600">${totalProtein}g</strong></div>
                        <div><span class="text-gray-600">Carbs:</span> <strong class="text-blue-600">${totalCarbs}g</strong></div>
                        <div><span class="text-gray-600">Gorduras:</span> <strong class="text-blue-600">${totalFats}g</strong></div>
                    </div>
                    <button onclick="deleteMeal('${items[0].id}')" class="mt-3 w-full bg-red-500 hover:bg-red-600 px-2 py-1 rounded text-xs">
                        <i class="fas fa-trash"></i> Remover
                    </button>
                </div>
            `;
        }

        const mealsList = document.getElementById('mealsList');
        if (mealsList) {
            mealsList.innerHTML = html || `<p class="text-gray-500">Nenhuma refeição registrada na ${label.toLowerCase()}</p>`;
        }

        if (typeof updateMacrosChart === 'function') {
            updateMacrosChart(periodMeals);
        }

    } catch (error) {
        console.error('Error loading meals:', error);
        const mealsList = document.getElementById('mealsList');
        if (mealsList) mealsList.innerHTML = '<p class="text-red-500">Erro ao carregar refeições</p>';
    }
}
async function deleteMeal(id) {
    try {
        await dietaAPI.deleteMeal(id);
        await renderMeals();
        if (typeof updateDashboard === 'function') updateDashboard();
    } catch (error) {
        console.error('Error deleting meal:', error);
        alert('Erro ao deletar refeiÃ§Ã£o');
    }
}



