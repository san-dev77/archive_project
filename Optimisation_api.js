require('dotenv').config();
const express = require('express');
const knex = require('knex');

// 🔗 Connexion aux deux bases de données
const primaryDB = knex({
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER_SECONDARY,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME_SECONDARY,
        port: process.env.DB_PORT
    },
    pool: { min: 2, max: 20 } // Amélioration de la gestion des connexions
});

const logDB = knex({
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST_SECONDARY,
        user: process.env.DB_USER_SECONDARY,
        password: process.env.DB_PASSWORD_SECONDARY,
        database: process.env.DB_NAME_SECONDARY,
        port: process.env.DB_PORT_SECONDARY
    },
    pool: { min: 2, max: 20 }
});

const app = express();
const PORT = process.env.PORT || 3001;

const cors = require("cors");

const corsOptions = {
    origin: ["http://localhost:5173", "http://192.168.92.48:3000"],
    credentials: true,
    allowedHeaders: ["sessionId", "content-type"],
    exposedHeaders: ["sessionId"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    maxBuffer: 1024 * 1024 * 10,
};
app.use(cors(corsOptions));

// 🛡️ Middleware pour vérifier la connexion
async function checkDBConnection(db, res, next) {
    try {
        await db.raw('SELECT 1');
        next();
    } catch (error) {
        console.error('Erreur de connexion à la base de données:', error);
        res.status(500).json({ error: 'Problème de connexion à la base de données.' });
    }
}

// 🔍 Détection des optimisations nécessaires
async function detectOptimizations() {
    const optimizations = { duplicates: 0, spaces: 0 };
    try {
        const tables = await primaryDB.raw("SHOW TABLES");
        const tableKey = Object.keys(tables[0][0])[0];

        for (const table of tables[0]) {
            const tableName = table[tableKey];
            const columns = await primaryDB.raw(`SHOW COLUMNS FROM \`${tableName}\``);
            const columnNames = columns[0].map(col => col.Field);

            if (columnNames.includes("id")) {
                const colStr = columnNames.filter(col => col !== 'id').join(', ');
                if (colStr) {
                    const duplicates = await primaryDB.raw(`
                        SELECT COUNT(*) AS count FROM ${tableName}
                        WHERE id NOT IN (
                            SELECT MIN(id) FROM (SELECT * FROM ${tableName}) AS tmp GROUP BY ${colStr}
                        )
                    `);
                    optimizations.duplicates += duplicates[0][0].count;
                }
            }

            for (const column of columns[0]) {
                const dataType = column.Type.toLowerCase();
                if (dataType.includes("char") || dataType.includes("text")) {
                    const spaces = await primaryDB(tableName)
                        .whereRaw(`TRIM(\`${column.Field}\`) != \`${column.Field}\``)
                        .count('* as count');
                    const spaceCount = spaces[0].count; // Define spaceCount here
                    optimizations.spaces += spaceCount;
                    if (spaceCount > 0) {
                        await logOptimization('Espace blanc detecté', tableName, spaceCount, { column: column.Field });
                    }
                }
            }
        }
    } catch (error) {
        console.error('Erreur lors de la détection des optimisations:', error);
    }
    return optimizations;
}

// 📝 Enregistrement des logs d'optimisation
async function logOptimization(operationType, tableName, affectedRows, details = '') {
    try {
        await logDB('optimization_logs').insert({
            operation_type: operationType,
            table_name: tableName,
            affected_rows: affectedRows,
            details: JSON.stringify(details),
            created_at: new Date()
        });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement du log:', error);
    }
}

// 🚀 Nouvelle méthode pour optimiser la base de données
async function optimizeDatabase() {
    try {
        const tables = await primaryDB.raw("SHOW TABLES");
        const tableKey = Object.keys(tables[0][0])[0];

        for (const table of tables[0]) {
            const tableName = table[tableKey];
            const columns = await primaryDB.raw(`SHOW COLUMNS FROM \`${tableName}\``);
            const columnNames = columns[0].map(col => col.Field);

            // Éliminer les doublons
            if (columnNames.includes("id")) {
                const colStr = columnNames.filter(col => col !== 'id').join(', ');
                if (colStr) {
                    await primaryDB.raw(`
                        DELETE FROM ${tableName}
                        WHERE id NOT IN (
                            SELECT MIN(id) FROM (SELECT * FROM ${tableName}) AS tmp GROUP BY ${colStr}
                        )
                    `);
                }
            }

            // Éliminer les espaces blancs
            for (const column of columns[0]) {
                const dataType = column.Type.toLowerCase();
                if (dataType.includes("char") || dataType.includes("text")) {
                    await primaryDB(tableName)
                        .whereRaw(`TRIM(\`${column.Field}\`) != \`${column.Field}\``)
                        .update({ [column.Field]: primaryDB.raw('TRIM(`??`)', [column.Field]) });
                }
            }
        }
    } catch (error) {
        console.error('Erreur lors de l\'optimisation de la base de données:', error);
    }
}

// 🚀 API Endpoints
app.use((req, res, next) => checkDBConnection(primaryDB, res, next));

app.get('/detect-optimizations', async (req, res) => {
    try {
        const result = await detectOptimizations();
        res.json(result);
    } catch (error) {
        console.error('Erreur API:', error);
        res.status(500).json({ error: 'Erreur lors de la détection des optimisations.' });
    }
});

app.post('/optimize', async (req, res) => {
    try {
        await optimizeDatabase();
        res.json({ message: 'Optimisation terminée avec succès !' });
    } catch (error) {
        console.error('Erreur API:', error);
        res.status(500).json({ error: 'Erreur lors de l\'optimisation de la base de données.' });
    }
});

app.get('/optimization-reports', async (req, res) => {
    try {
        const logs = await logDB('optimization_logs').orderBy('created_at', 'desc');
        res.json(logs);
    } catch (error) {
        console.error('Erreur lors de la récupération des logs:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des rapports.' });
    }
});

// Nouvel endpoint pour obtenir le nombre de logs
app.get('/optimization-log-count', async (req, res) => {
    try {
        const count = await logDB('optimization_logs').count('* as count');
        res.json({ count: count[0].count });
    } catch (error) {
        console.error('Erreur lors de la récupération du nombre de logs:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération du nombre de logs.' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Serveur API d'optimisation en cours d'exécution sur le port ${PORT}`);
});
