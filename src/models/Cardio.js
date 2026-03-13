const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Registrar sessão de cardio
exports.addCardioSession = async (req, res) => {
    try {
        const { userId, type, time, distance } = req.body;
        const id = uuidv4();
        
        // Calcular pace
        const pace = time > 0 && distance > 0 ? (time / distance).toFixed(2) : 0;
        
        const query = `INSERT INTO cardio_sessions (id, user_id, type, time, distance, pace, created_at) 
                       VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`;
        const result = await pool.query(query, [id, userId, type, time, distance, pace]);
        
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Listar sessões de cardio por usuário/data
exports.getCardioSessions = async (req, res) => {
    try {
        const { userId, date } = req.query;
        const query = `SELECT * FROM cardio_sessions 
                       WHERE user_id = $1 AND DATE(created_at) = $2 
                       ORDER BY created_at DESC`;
        const result = await pool.query(query, [userId, date]);
        
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Deletar sessão de cardio
exports.deleteCardioSession = async (req, res) => {
    try {
        const { id } = req.params;
        
        const query = 'DELETE FROM cardio_sessions WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        
        res.json({ message: 'Sessão de cardio deletada', deleted: result.rowCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obter estatísticas de cardio
exports.getCardioStats = async (req, res) => {
    try {
        const { userId, date } = req.query;
        const query = `SELECT 
                        COALESCE(SUM(time), 0) as total_time,
                        COALESCE(SUM(distance), 0) as total_distance,
                        COUNT(*) as session_count
                       FROM cardio_sessions 
                       WHERE user_id = $1 AND DATE(created_at) = $2`;
        const result = await pool.query(query, [userId, date]);
        
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
