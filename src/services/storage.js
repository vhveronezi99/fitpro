// ===== API DATA MANAGEMENT =====

// Save functions for API operations (no longer needed for localStorage)
function saveData() {
    // Data is now saved automatically through API calls
    // This function is kept for backward compatibility
}

// Load demo data (fallback when API fails)
function loadDemoData() {
    const today = new Date().toISOString().split('T')[0];

    if (appData.routines.length === 0) {
        // Create demo routines
        appData.routines = [
            {
                id: 1001,
                name: 'Dia A - Peito e Tríceps',
                type: 'ABC',
                exercises: [
                    { id: 101, name: 'Supino Inclinado', sets: 4, reps: 10 },
                    { id: 102, name: 'Supino Reto', sets: 4, reps: 8 },
                    { id: 103, name: 'Tríceps na Corda', sets: 3, reps: 12 },
                    { id: 104, name: 'Mergulho no Banco', sets: 3, reps: 10 }
                ],
                createdAt: new Date().toISOString()
            },
            {
                id: 1002,
                name: 'Dia B - Costas e Bíceps',
                type: 'ABC',
                exercises: [
                    { id: 201, name: 'Puxada na Barra', sets: 4, reps: 10 },
                    { id: 202, name: 'Rosca Direta EZ', sets: 4, reps: 10 },
                    { id: 203, name: 'Rosca Inversa', sets: 3, reps: 12 },
                    { id: 204, name: 'Rosca Concentrada', sets: 3, reps: 12 }
                ],
                createdAt: new Date().toISOString()
            },
            {
                id: 1003,
                name: 'Dia C - Pernas',
                type: 'ABC',
                exercises: [
                    { id: 301, name: 'Agachamento Livre', sets: 4, reps: 8 },
                    { id: 302, name: 'Leg Press', sets: 4, reps: 12 },
                    { id: 303, name: 'Rosca de Perna', sets: 3, reps: 12 },
                    { id: 304, name: 'Extensora', sets: 3, reps: 12 }
                ],
                createdAt: new Date().toISOString()
            }
        ];
    }

    if (appData.meals.length === 0) {
        appData.meals = [
            {
                id: 2001,
                mealType: 'Café da Manhã',
                foodName: 'Ovos mexidos com pão integral',
                calories: 380,
                protein: 22,
                carbs: 35,
                fats: 12,
                date: today,
                timestamp: new Date().toISOString(),
                completed: false
            },
            {
                id: 2002,
                mealType: 'Café da Manhã',
                foodName: 'Suco de laranja',
                calories: 110,
                protein: 2,
                carbs: 26,
                fats: 0.5,
                date: today,
                timestamp: new Date().toISOString(),
                completed: false
            },
            {
                id: 2003,
                mealType: 'Lanche 1',
                foodName: 'Maçã com pasta de amendoim',
                calories: 195,
                protein: 7,
                carbs: 25,
                fats: 8,
                date: today,
                timestamp: new Date().toISOString(),
                completed: false
            },
            {
                id: 2004,
                mealType: 'Almoço',
                foodName: 'Frango grelhado com arroz integral',
                calories: 520,
                protein: 50,
                carbs: 55,
                fats: 8,
                date: today,
                timestamp: new Date().toISOString(),
                completed: false
            },
            {
                id: 2005,
                mealType: 'Jantar',
                foodName: 'Salmão com batata doce',
                calories: 480,
                protein: 45,
                carbs: 45,
                fats: 12,
                date: today,
                timestamp: new Date().toISOString(),
                completed: false
            }
        ];
    }

    if (appData.cardio.length === 0) {
        appData.cardio = [
            {
                id: 3001,
                type: 'Corrida',
                time: 35,
                distance: 5.2,
                pace: 6.73,
                date: today,
                timestamp: new Date().toISOString()
            },
            {
                id: 3002,
                type: 'Bicicleta',
                time: 25,
                distance: 8.0,
                pace: 3.13,
                date: today,
                timestamp: new Date().toISOString()
            }
        ];
    }

    if (appData.workoutLogs.length === 0) {
        appData.workoutLogs = [
            {
                id: 4001,
                routineName: 'Dia A - Peito e Tríceps',
                exercises: [
                    { name: 'Supino Inclinado', sets: 4, reps: 10, weight: 70 },
                    { name: 'Supino Reto', sets: 4, reps: 8, weight: 80 },
                    { name: 'Tríceps na Corda', sets: 3, reps: 12, weight: 25 }
                ],
                date: today,
                timestamp: new Date().toISOString()
            }
        ];
    }
}
