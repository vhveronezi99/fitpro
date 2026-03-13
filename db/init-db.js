const pool = require('../config/database');

const createTables = async () => {
    try {
        console.log('🔄 Conectando ao PostgreSQL...');

        // Testar conexão
        await pool.query('SELECT NOW()');
        console.log('✅ Conexão estabelecida!');

        // Criar tabelas
        console.log('📋 Criando tabelas...');

        // Tabela de usuários
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Tabela "users" criada');

        // Tabela de rotinas
        await pool.query(`
            CREATE TABLE IF NOT EXISTS routines (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL,
                name VARCHAR(255) NOT NULL,
                type VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Tabela "routines" criada');

        // Tabela de exercícios
        await pool.query(`
            CREATE TABLE IF NOT EXISTS exercises (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                routine_id UUID NOT NULL,
                name VARCHAR(255) NOT NULL,
                sets INT NOT NULL,
                reps INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Tabela "exercises" criada');

        // Tabela de workout logs
        await pool.query(`
            CREATE TABLE IF NOT EXISTS workout_logs (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL,
                routine_id UUID NOT NULL,
                routine_name VARCHAR(255) NOT NULL,
                exercises JSONB NOT NULL,
                logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Tabela "workout_logs" criada');

        // Tabela de refeições
        await pool.query(`
            CREATE TABLE IF NOT EXISTS meals (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL,
                meal_type VARCHAR(100) NOT NULL,
                food_name VARCHAR(255) NOT NULL,
                calories DECIMAL(10, 2) NOT NULL,
                protein DECIMAL(10, 2) NOT NULL,
                carbs DECIMAL(10, 2) NOT NULL,
                fats DECIMAL(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Tabela "meals" criada');

        // Tabela de cardio
        await pool.query(`
            CREATE TABLE IF NOT EXISTS cardio_sessions (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL,
                type VARCHAR(100) NOT NULL,
                time INT NOT NULL,
                distance DECIMAL(10, 2) NOT NULL,
                pace DECIMAL(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Tabela "cardio_sessions" criada');

        // Inserir usuário demo
        console.log('👤 Criando usuário demo...');
        const demoUser = await pool.query(`
            INSERT INTO users (email, password, name)
            VALUES ('demo@fitpro.com', '$2b$10$dummy.hash.for.demo', 'Usuário Demo')
            ON CONFLICT (email) DO NOTHING
            RETURNING id
        `);

        let userId = demoUser.rows[0]?.id;

        // Se não retornou ID (usuário já existe), buscar o ID existente
        if (!userId) {
            const existingUser = await pool.query(`
                SELECT id FROM users WHERE email = 'demo@fitpro.com'
            `);
            userId = existingUser.rows[0]?.id;
            console.log('Usuário existente encontrado com ID:', userId);
        }

        if (userId) {
            console.log('✅ Usuário demo criado/encontrado com ID:', userId);

            // Inserir dados demo
            console.log('📊 Inserindo dados demo...');

            // Rotinas demo
            const routine1 = await pool.query(`
                INSERT INTO routines (user_id, name, type)
                VALUES ($1, 'Dia A - Peito e Tríceps', 'ABC')
                RETURNING id
            `, [userId]);

            const routine2 = await pool.query(`
                INSERT INTO routines (user_id, name, type)
                VALUES ($1, 'Dia B - Costas e Bíceps', 'ABC')
                RETURNING id
            `, [userId]);

            // Exercícios demo
            await pool.query(`
                INSERT INTO exercises (routine_id, name, sets, reps) VALUES
                ($1, 'Supino Inclinado', 4, 10),
                ($1, 'Supino Reto', 4, 8),
                ($1, 'Tríceps na Corda', 3, 12),
                ($1, 'Mergulho no Banco', 3, 10),
                ($2, 'Puxada na Barra', 4, 10),
                ($2, 'Rosca Direta EZ', 4, 10),
                ($2, 'Rosca Inversa', 3, 12),
                ($2, 'Rosca Concentrada', 3, 12)
            `, [routine1.rows[0].id, routine2.rows[0].id]);

            // Refeições demo
            await pool.query(`
                INSERT INTO meals (user_id, meal_type, food_name, calories, protein, carbs, fats) VALUES
                ($1, 'Café da Manhã', 'Ovos mexidos com pão integral', 380, 22, 35, 12),
                ($1, 'Café da Manhã', 'Suco de laranja', 110, 2, 26, 0.5),
                ($1, 'Lanche 1', 'Maçã com pasta de amendoim', 195, 7, 25, 8),
                ($1, 'Almoço', 'Frango grelhado com arroz integral', 520, 50, 55, 8),
                ($1, 'Almoço', 'Brócolis e cenoura', 45, 4, 8, 0.5),
                ($1, 'Lanche 2', 'Iogurte grego com granola', 180, 18, 20, 5),
                ($1, 'Jantar', 'Salmão com batata doce', 480, 45, 45, 12),
                ($1, 'Jantar', 'Salada verde', 60, 3, 11, 0.5)
            `, [userId]);

            // Cardio demo
            await pool.query(`
                INSERT INTO cardio_sessions (user_id, type, time, distance, pace) VALUES
                ($1, 'Corrida', 35, 5.2, 6.73),
                ($1, 'Bicicleta', 25, 8.0, 3.13)
            `, [userId]);

            console.log('✅ Dados demo inseridos!');
        }

        console.log('\n🎉 Banco de dados inicializado com sucesso!');
        console.log('📊 Tabelas criadas: users, routines, exercises, workout_logs, meals, cardio_sessions');
        console.log('👤 Usuário demo: demo@fitpro.com');
        console.log('🔑 Senha: demo123 (para desenvolvimento)');

        process.exit(0);
    } catch (err) {
        console.error('❌ Erro ao inicializar banco:', err.message);
        console.error('💡 Dica: Verifique se PostgreSQL está rodando e as credenciais estão corretas');
        process.exit(1);
    }
};

createTables();
