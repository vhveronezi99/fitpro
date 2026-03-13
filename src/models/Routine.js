const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Criar rotina
exports.createRoutine = async (req, res) => {
    try {
        const { name, type, userId } = req.body;
        const id = uuidv4();
        
        const query = 'INSERT INTO routines (id, name, type, user_id, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *';
        const result = await pool.query(query, [id, name, type, userId]);
        
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Listar rotinas
exports.getRoutines = async (req, res) => {
    try {
        const { userId } = req.query;

        let query;
        let params = [];

        if (userId) {
            query = 'SELECT * FROM routines WHERE user_id = $1 ORDER BY created_at DESC';
            params = [userId];
        } else {
            // Para desenvolvimento: listar todas as rotinas
            query = 'SELECT * FROM routines ORDER BY created_at DESC';
        }

        const result = await pool.query(query, params);

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Adicionar exercício à rotina
exports.addExerciseToRoutine = async (req, res) => {
    try {
        const { routineId, name, sets, reps } = req.body;
        const id = uuidv4();
        
        const query = 'INSERT INTO exercises (id, routine_id, name, sets, reps) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const result = await pool.query(query, [id, routineId, name, sets, reps]);
        
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Registrar treino
exports.logWorkout = async (req, res) => {
    try {
        const { routineId, routineName, userId, exercises } = req.body;
        const workoutId = uuidv4();
        
        const query = 'INSERT INTO workout_logs (id, routine_id, routine_name, user_id, exercises, logged_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *';
        const result = await pool.query(query, [workoutId, routineId, routineName, userId, JSON.stringify(exercises)]);
        
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Deletar rotina
exports.deleteRoutine = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Deletar exercícios primeiro
        await pool.query('DELETE FROM exercises WHERE routine_id = $1', [id]);
        
        // Deletar rotina
        const query = 'DELETE FROM routines WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        
        res.json({ message: 'Rotina deletada', deleted: result.rowCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
