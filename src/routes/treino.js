// ===== TREINO ROUTES =====
let treinoHistoryPeriod = 'week';

function getPeriodDateRange(period) {
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
        label = 'M�s';
    }

    return {
        startDate: start.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0],
        label
    };
}

function changeTreinoPeriod(period, event) {
    treinoHistoryPeriod = period;
    document.querySelectorAll('.treino-period-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    renderWorkoutHistory();
}

async function renderRoutines() {
    try {
        // Load routines from API
        const routines = await treinoAPI.getRoutines();
        appData.routines = routines.map(r => ({
            id: r.id,
            name: r.name,
            type: r.type,
            exercises: [], // Exercises will be loaded separately if needed
            createdAt: r.created_at
        }));

        // Render available routines for selecting
        const routineOptions = appData.routines.map(r => `<option value="${r.id}">${r.name} (${r.type})</option>`).join('');

        const elem = document.getElementById('selectRoutine');
        if (elem) elem.innerHTML = '<option value="">Selecione uma rotina...</option>' + routineOptions;

        const elem2 = document.getElementById('selectRoutineForWorkout');
        if (elem2) elem2.innerHTML = '<option value="">Selecione uma rotina para treinar...</option>' + routineOptions;

        // Render routine details
        const routineDetails = appData.routines.map(routine => `
            <div class="glass-effect rounded-lg p-6 card-hover border-l-4 border-blue-600">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h4 class="text-xl font-bold text-gray-800">${routine.name}</h4>
                        <p class="text-sm text-gray-600">Tipo: ${routine.type}</p>
                    </div>
                    <button onclick="deleteRoutine('${routine.id}')" class="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm text-white">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="bg-gray-50 p-3 rounded">
                    <p class="font-semibold text-gray-700 mb-2">Exercícios:</p>
                    <p class="text-gray-500 text-sm">Exercícios serão carregados separadamente</p>
                </div>
            </div>
        `).join('');

        const container = document.getElementById('routinesList');
        if (container) container.innerHTML = routineDetails || '<p class="text-gray-500">Nenhuma rotina criada</p>';

    } catch (error) {
        console.error('Error loading routines:', error);
        const container = document.getElementById('routinesList');
        if (container) container.innerHTML = '<p class="text-red-500">Erro ao carregar rotinas</p>';
    }
}

async function deleteRoutine(id) {
    if (confirm('Tem certeza que deseja deletar esta rotina?')) {
        try {
            await treinoAPI.deleteRoutine(id);
            showSuccess('🗑️ Rotina deletada com sucesso!');
            await renderRoutines();
        } catch (error) {
            console.error('Error deleting routine:', error);
            showError('Erro ao deletar rotina');
        }
    }
}

function deleteExerciseFromRoutine(routineId, exerciseId) {
    const routine = appData.routines.find(r => r.id === routineId);
    if (routine) {
        routine.exercises = routine.exercises.filter(ex => ex.id !== exerciseId);
        saveData();
        renderRoutines();
    }
}

async function renderWorkoutHistory() {
    try {
        const workoutLogs = await treinoAPI.getWorkoutLogs();
        appData.workoutLogs = workoutLogs.map(w => ({
            id: w.id,
            routineName: w.routine_name,
            exercises: w.exercises,
            date: new Date(w.created_at).toISOString().split('T')[0],
            timestamp: w.created_at
        }));

        const { startDate, endDate, label } = getPeriodDateRange(treinoHistoryPeriod);
        const filteredWorkouts = appData.workoutLogs.filter(log => log.date >= startDate && log.date <= endDate);

        const title = document.getElementById('workoutHistoryTitle');
        if (title) title.textContent = `Treinos da ${label}`;

        const html = filteredWorkouts.map(log => `
            <div class="glass-effect rounded-lg p-6 card-hover border-l-4 border-green-600">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h4 class="text-lg font-bold text-gray-800">${log.routineName}</h4>
                        <p class="text-sm text-gray-600">${new Date(log.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <button onclick="deleteWorkoutLog('${log.id}')" class="bg-red-500 hover:bg-red-600 px-2 py-1 rounded text-xs text-white">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="space-y-2 text-sm">
                    ${(log.exercises || []).map(ex => `
                        <div class="flex justify-between items-center bg-gray-50 p-2 rounded">
                            <span class="text-gray-700"><strong>${ex.name}</strong> ${ex.sets}x${ex.reps}</span>
                            <span class="text-blue-600 font-bold">${ex.weight || 0} kg</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');

        const container = document.getElementById('workoutHistoryList');
        if (container) container.innerHTML = html || `<p class="text-gray-500">Nenhum treino registrado na ${label.toLowerCase()}</p>`;

    } catch (error) {
        console.error('Error loading workout history:', error);
        const container = document.getElementById('workoutHistoryList');
        if (container) container.innerHTML = '<p class="text-red-500">Erro ao carregar hist�rico</p>';
    }
}
async function deleteWorkoutLog(id) {
    if (confirm('Tem certeza que deseja deletar este registro?')) {
        try {
            await treinoAPI.deleteWorkoutLog(id);
            await renderWorkoutHistory();
            if (typeof updateDashboard === 'function') updateDashboard();
        } catch (error) {
            console.error('Error deleting workout log:', error);
            alert('Erro ao deletar registro');
        }
    }
}

async function createRoutine() {
    const name = document.getElementById('routineName').value.trim();
    const type = document.getElementById('routineType').value;

    if (!name) {
        showWarning('Digite o nome da rotina!');
        return;
    }

    if (!type) {
        showWarning('Selecione um tipo de divisão!');
        return;
    }

    if (name.length < 2) {
        showWarning('O nome da rotina deve ter pelo menos 2 caracteres!');
        return;
    }

    try {
        // Check if routine name already exists
        const existingRoutines = await treinoAPI.getRoutines();
        const routineExists = existingRoutines.some(r => r.name.toLowerCase() === name.toLowerCase());
        if (routineExists) {
            showError('Já existe uma rotina com este nome!');
            return;
        }

        const routineData = {
            name,
            type,
            userId: '182c75d0-7244-4aef-a0a0-af09e589caf7' // Demo user ID
        };

        await treinoAPI.createRoutine(routineData);

        showSuccess('💪 Rotina "' + name + '" criada com sucesso!');
        document.getElementById('routineName').value = '';
        document.getElementById('routineType').value = '';
        await renderRoutines();

    } catch (error) {
        console.error('Error creating routine:', error);
        showError('Erro ao criar rotina');
    }
}

function addExerciseToRoutine() {
    const selectedRoutine = document.getElementById('selectRoutine').value;
    const name = document.getElementById('exerciseName').value;
    const sets = document.getElementById('exerciseSets').value;
    const reps = document.getElementById('exerciseReps').value;

    if (!selectedRoutine) {
        showWarning('Selecione uma rotina!');
        return;
    }
    
    if (!name || !sets || !reps) {
        showWarning('Preencha todos os campos!');
        return;
    }

    const setsNum = parseInt(sets);
    const repsNum = parseInt(reps);
    
    if (setsNum < 1 || setsNum > 20 || repsNum < 1 || repsNum > 100) {
        showError('Séries: 1-20 | Repetições: 1-100!');
        return;
    }

    const routine = appData.routines.find(r => r.id == selectedRoutine);
    if (!routine) return;

    // Verificar duplicatas
    const exerciseExists = routine.exercises.some(ex => ex.name.toLowerCase() === name.toLowerCase());
    if (exerciseExists) {
        showError('Este exercício já existe nesta rotina!');
        return;
    }

    const exercise = {
        id: Date.now(),
        name: name.trim(),
        sets: setsNum,
        reps: repsNum
    };

    routine.exercises.push(exercise);
    saveData();

    showSuccess('➕ Exercício "' + name + '" adicionado!');
    document.getElementById('exerciseName').value = '';
    document.getElementById('exerciseSets').value = '';
    document.getElementById('exerciseReps').value = '';
    renderRoutines();
}

function logWorkout() {
    const selectedRoutine = document.getElementById('selectRoutineForWorkout').value;
    
    if (!selectedRoutine) {
        showWarning('Selecione uma rotina!');
        return;
    }

    const routine = appData.routines.find(r => r.id == selectedRoutine);
    if (!routine || routine.exercises.length === 0) {
        showWarning('Esta rotina não tem exercícios!');
        return;
    }

    // Criar modal com interface melhorada para múltiplas séries
    let html = `
        <div style="background: white; padding: 20px; border-radius: 10px; max-width: 700px; max-height: 80vh; overflow-y: auto;">
            <h3 style="margin-top: 0; margin-bottom: 20px;">${routine.name}</h3>
            <div id="exercisesSeriesContainer" style="margin: 10px 0;">
    `;
    
    routine.exercises.forEach(ex => {
        html += `
            <div style="margin-bottom: 20px; border: 2px solid #e0e0e0; padding: 15px; border-radius: 8px; background: #f9f9f9;">
                <p style="margin: 0 0 10px 0; font-weight: bold; font-size: 16px; color: #333;">${ex.name}</p>
                <p style="margin: 0 0 10px 0; font-size: 12px; color: #666; background: #e3f2fd; padding: 5px 8px; border-radius: 4px; display: inline-block;">Rotina: ${ex.sets}x${ex.reps}</p>
                
                <div style="margin: 10px 0;">
                    <label style="display: block; font-size: 13px; font-weight: 600; color: #555; margin-bottom: 5px;">Quantas séries válidas você fez?</label>
                    <input type="number" id="numSeries_${ex.id}" placeholder="Número de séries" min="1" max="10" value="1" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: 14px;">
                </div>
                
                <div id="seriesInputs_${ex.id}" style="margin: 10px 0;">
                    <!-- Inputs de peso e reps para cada série serão adicionados dinamicamente -->
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
            <button onclick="saveWorkoutLog('${selectedRoutine}')" style="width: 100%; padding: 12px; background: #2563eb; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 16px; margin-top: 15px;">Registrar Treino</button>
            <button onclick="closeWorkoutModal()" style="width: 100%; padding: 12px; background: #999; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px; font-size: 16px;">Cancelar</button>
        </div>
    `;

    const modal = document.createElement('div');
    modal.id = 'workoutModal';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000;';
    modal.innerHTML = html;
    document.body.appendChild(modal);

    // Adicionar event listeners para os inputs de número de séries
    routine.exercises.forEach(ex => {
        const numSeriesInput = document.getElementById(`numSeries_${ex.id}`);
        numSeriesInput.addEventListener('change', function() {
            generateSeriesInputs(ex.id, parseInt(this.value));
        });
        // Gerar inputs iniciais
        generateSeriesInputs(ex.id, 1);
    });
}

function generateSeriesInputs(exerciseId, numSeries) {
    const container = document.getElementById(`seriesInputs_${exerciseId}`);
    let html = '';
    
    for (let i = 1; i <= numSeries; i++) {
        html += `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
                <div>
                    <label style="display: block; font-size: 12px; color: #666; margin-bottom: 3px;">Série ${i} - Peso (kg)</label>
                    <input type="number" id="weight_${exerciseId}_${i}" placeholder="Peso" step="0.5" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                </div>
                <div>
                    <label style="display: block; font-size: 12px; color: #666; margin-bottom: 3px;">Série ${i} - Reps</label>
                    <input type="number" id="reps_${exerciseId}_${i}" placeholder="Repetições" min="1" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

function closeWorkoutModal() {
    const modal = document.getElementById('workoutModal');
    if (modal) modal.remove();
}

async function saveWorkoutLog(routineId) {
    try {
        const routine = appData.routines.find(r => r.id == routineId);
        if (!routine) return;

        const exercises = [];

        // Coletar dados de todas as séries para cada exercício
        routine.exercises.forEach(ex => {
            const numSeriesInput = document.getElementById(`numSeries_${ex.id}`);
            const numSeries = parseInt(numSeriesInput.value) || 1;
            const weights = [];
            const repsList = [];

            for (let i = 1; i <= numSeries; i++) {
                const weightInput = document.getElementById(`weight_${ex.id}_${i}`);
                const repsInput = document.getElementById(`reps_${ex.id}_${i}`);

                const weight = parseFloat(weightInput.value);
                const reps = parseInt(repsInput.value);

                if (!isNaN(weight) && weight > 0 && !isNaN(reps) && reps > 0) {
                    weights.push(weight);
                    repsList.push(reps);
                }
            }

            if (weights.length > 0) {
                const maxWeight = Math.max(...weights);

                exercises.push({
                    name: ex.name,
                    sets: numSeries,
                    reps: repsList[0], // Use first rep count
                    weight: maxWeight
                });
            }
        });

        if (exercises.length === 0) {
            showWarning('Registre o peso de pelo menos um exercício!');
            return;
        }

        const workoutData = {
            routineId: routineId,
            routineName: routine.name,
            exercises: exercises,
            userId: '182c75d0-7244-4aef-a0a0-af09e589caf7' // Demo user ID
        };

        await treinoAPI.logWorkout(workoutData);

        showSuccess('🏋️ Treino registrado com sucesso! Bom treino!');
        closeWorkoutModal();
        await renderWorkoutHistory();
        if (typeof updateDashboard === 'function') updateDashboard();
        if (typeof renderExerciseProgress === 'function') renderExerciseProgress();

    } catch (error) {
        console.error('Error saving workout log:', error);
        showError('Erro ao registrar treino');
        alert('Erro ao registrar treino');
    }
}

// ===== GRÁFICO DE PROGRESSO DE EXERCÍCIOS =====
function renderExerciseProgress() {
    const workoutLogs = appData.workoutLogs;
    
    if (workoutLogs.length === 0) return;

    // Pegar última e melhor sessão para cada exercício
    const exerciseStats = {};
    
    workoutLogs.forEach(log => {
        log.exercises.forEach(ex => {
            if (!exerciseStats[ex.name]) {
                exerciseStats[ex.name] = {
                    last: 0,
                    best: 0
                };
            }
            const weight = parseFloat(ex.weight) || 0;
            exerciseStats[ex.name].last = weight;
            exerciseStats[ex.name].best = Math.max(exerciseStats[ex.name].best, weight);
        });
    });

    const labels = Object.keys(exerciseStats).slice(0, 8);
    const lastWeights = labels.map(name => exerciseStats[name].last);
    const bestWeights = labels.map(name => exerciseStats[name].best);

    const ctx = document.getElementById('exerciseProgressChart');
    if (!ctx) return;

    if (exerciseProgressChart) {
        exerciseProgressChart.data.labels = labels;
        exerciseProgressChart.data.datasets[0].data = lastWeights;
        exerciseProgressChart.data.datasets[1].data = bestWeights;
        exerciseProgressChart.update();
    }
}



