require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
    try {
        // Connexion à la base de données
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        // Récupérer la liste des tables
        const [tables] = await connection.execute(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = ? AND table_name != 'audit_log'
        `, [process.env.DB_NAME]);

        for (const table of tables) {
            const tableName = table.TABLE_NAME;
            const triggerBaseName = `audit_${tableName}`;

            const triggers = [
                {
                    name: `${triggerBaseName}_insert`,
                    event: 'INSERT',
                    oldData: 'NULL',
                    newData: 'TO_JSON(NEW)'
                },
                {
                    name: `${triggerBaseName}_update`,
                    event: 'UPDATE',
                    oldData: 'TO_JSON(OLD)',
                    newData: 'TO_JSON(NEW)'
                },
                {
                    name: `${triggerBaseName}_delete`,
                    event: 'DELETE',
                    oldData: 'TO_JSON(OLD)',
                    newData: 'NULL'
                }
            ];

            for (const trigger of triggers) {
                const createTriggerQuery = `
                    DROP TRIGGER IF EXISTS ${trigger.name};

                    CREATE TRIGGER ${trigger.name}
                    AFTER ${trigger.event} ON \`${tableName}\`
                    FOR EACH ROW
                    BEGIN
                        INSERT INTO audit_log (table_name, operation_type, old_data, new_data)
                        VALUES ('${tableName}', '${trigger.event}', ${trigger.oldData}, ${trigger.newData});
                    END;
                `;

                await connection.query(createTriggerQuery);
                console.log(`✅ Trigger créé : ${trigger.name}`);
            }
        }

        await connection.end();
        console.log('🎯 Tous les triggers ont été créés avec succès !');
    } catch (error) {
        console.error('❌ Erreur lors de la création des triggers :', error);
    }
})();
