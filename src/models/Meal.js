const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Adicionar alimento/refeição
exports.addMeal = async (req, res) => {
    try {
        const { userId, mealType, foodName, calories, protein, carbs, fats } = req.body;
        const id = uuidv4();
        
        const query = `INSERT INTO meals (id, user_id, meal_type, food_name, calories, protein, carbs, fats, created_at) 
                       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING *`;
        const result = await pool.query(query, [id, userId, mealType, foodName, calories, protein, carbs, fats]);
        
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Listar refeições por usuário/data
exports.getMeals = async (req, res) => {
    try {
        const { userId, date } = req.query;
        
        let query;
        let params = [];
        
        if (userId && date) {
            query = `SELECT * FROM meals 
                     WHERE user_id = $1 AND DATE(created_at) = $2 
                     ORDER BY created_at DESC`;
            params = [userId, date];
        } else {
            // Para desenvolvimento: listar todas as refeições
            query = `SELECT * FROM meals ORDER BY created_at DESC`;
        }
        
        const result = await pool.query(query, params);
        
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Deletar refeição
exports.deleteMeal = async (req, res) => {
    try {
        const { id } = req.params;
        
        const query = 'DELETE FROM meals WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        
        res.json({ message: 'Refeição deletada', deleted: result.rowCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obter macros totais do dia
exports.getTodayMacros = async (req, res) => {
    try {
        const { userId, date } = req.query;
        const query = `SELECT 
                        COALESCE(SUM(calories), 0) as total_calories,
                        COALESCE(SUM(protein), 0) as total_protein,
                        COALESCE(SUM(carbs), 0) as total_carbs,
                        COALESCE(SUM(fats), 0) as total_fats
                       FROM meals 
                       WHERE user_id = $1 AND DATE(created_at) = $2`;
        const result = await pool.query(query, [userId, date]);
        
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
