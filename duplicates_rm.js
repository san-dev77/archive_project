const mysql = require('mysql2/promise'); // npm install mysql2

async function removeDuplicates() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'agence' // Mets ici le nom de ta base
    });

    try {
        // ✅ Récupérer toutes les tables
        const [tables] = await connection.execute(`SHOW TABLES;`);

        // 🎯 Extraire les noms de tables selon la structure renvoyée par MySQL
        const tableNames = tables.map(row => Object.values(row)[0]);

        for (const tableName of tableNames) {
            console.log(`🔍 Suppression des doublons dans ${tableName}...`);

            // ✅ Récupérer toutes les colonnes
            const [columns] = await connection.execute(`SHOW COLUMNS FROM \`${tableName}\`;`);
            const columnNames = columns.map(col => col.Field);

            // Vérifier si la table a une colonne 'id'
            if (!columnNames.includes('id')) {
                console.log(`❌ Pas de colonne 'id' dans ${tableName}, passage...`);
                continue;
            }

            // Générer la clause UNIQUE automatiquement
            const uniqueColumns = columnNames.filter(col => col !== 'id').join(', ');

            if (!uniqueColumns) {
                console.log(`❌ Pas de colonnes uniques dans ${tableName}, passage...`);
                continue;
            }

            // ✅ Supprimer les doublons en conservant l'enregistrement avec le plus petit id
            const deleteQuery = `
        DELETE t1
        FROM \`${tableName}\` t1
        INNER JOIN \`${tableName}\` t2
        ON t1.id > t2.id 
        AND ${uniqueColumns.split(', ').map(col => `t1.${col} = t2.${col}`).join(' AND ')};
      `;

            const [result] = await connection.execute(deleteQuery);
            console.log(`✅ ${result.affectedRows} doublons supprimés de ${tableName}`);
        }
    } catch (error) {
        console.error('❌ Erreur :', error.message);
    } finally {
        await connection.end();
        console.log('🚀 Fin de la suppression des doublons.');
    }
}

removeDuplicates();
