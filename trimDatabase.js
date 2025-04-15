require('dotenv').config();
const knex = require('knex');

// Connexion directe via les variables d'environnement
const db = knex({
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    }
});

// Fonction de nettoyage
async function cleanDatabase() {
    try {
        console.log("🚀 Démarrage du nettoyage des données...");

        // Récupérer la liste des tables
        const tables = await db.raw("SHOW TABLES");
        const tableKey = Object.keys(tables[0][0])[0]; // Identifier la clé des tables

        for (const table of tables[0]) {
            const tableName = table[tableKey];
            console.log(`🔍 Nettoyage de la table : ${tableName}`);

            // Récupérer les colonnes de la table
            const columns = await db.raw(`SHOW COLUMNS FROM \`${tableName}\``);

            for (const column of columns[0]) {
                const columnName = column.Field;
                const dataType = column.Type.toLowerCase();

                // On cible les colonnes de type texte
                if (dataType.includes("char") || dataType.includes("text")) {
                    console.log(`➡️  Nettoyage de la colonne : ${columnName}`);

                    // Appliquer TRIM via une requête SQL
                    await db(tableName)
                        .update({ [columnName]: db.raw(`TRIM(\`${columnName}\`)`) });
                }
            }
        }

        console.log("✅ Nettoyage terminé avec succès !");
        process.exit(0);
    } catch (error) {
        console.error("❌ Erreur pendant le nettoyage :", error);
        process.exit(1);
    }
}

cleanDatabase();
