const pool = require("../config/database");


const insertIntoLogout = async (userId) => {
    console.log(userId);

    const [result] = await pool.execute(`
        INSERT INTO logout (user_id) 
        VALUES (?)`, [userId]);
    return result.insertId; // Return the ID of the newly inserted record
};

const updatePageViews = async (pageId, pageName) => {
    try {
        // Check if the page already exists in the table
        const [existingPage] = await pool.execute(
            'SELECT * FROM page_views WHERE page_id = ?',
            [pageId]
        );

        if (existingPage.length > 0) {
            // If page exists, increment the view count
            const [result] = await pool.execute(
                'UPDATE page_views SET views = views + 1, moment = CURRENT_TIMESTAMP WHERE page_id = ?',
                [pageId]
            );
            return result.affectedRows;
        } else {
            // If page doesn't exist, insert a new record
            const [result] = await pool.execute(
                'INSERT INTO page_views (page_id, page_name, views, moment) VALUES (?, ?, 1, CURRENT_TIMESTAMP)',
                [pageId, pageName]
            );
            return result.insertId;
        }
    } catch (error) {
        console.error('Error updating page views:', error);
        throw error;
    }
};

const getPageViewsStatistics = async () => {
    try {
        // Get today's most viewed pages
        const [todayViews] = await pool.execute(`
            SELECT page_id, page_name, views
            FROM page_views
            WHERE DATE(moment) = CURDATE()
            ORDER BY views DESC
            LIMIT 10
        `);

        // Get last week's most viewed pages (excluding today)
        const [lastWeekViews] = await pool.execute(`
            SELECT page_id, page_name, SUM(views) as total_views
            FROM page_views
            WHERE moment >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            AND DATE(moment) < CURDATE()
            GROUP BY page_id, page_name
            ORDER BY total_views DESC
            LIMIT 10
        `);

        // Get last month's most viewed pages (excluding today)
        const [lastMonthViews] = await pool.execute(`
            SELECT page_id, page_name, SUM(views) as total_views
            FROM page_views
            WHERE moment >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
            AND DATE(moment) < CURDATE()
            GROUP BY page_id, page_name
            ORDER BY total_views DESC
            LIMIT 10
        `);

        // Get last three months' most viewed pages (excluding today)
        const [lastThreeMonthsViews] = await pool.execute(`
            SELECT page_id, page_name, SUM(views) as total_views
            FROM page_views
            WHERE moment >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)
            AND DATE(moment) < CURDATE()
            GROUP BY page_id, page_name
            ORDER BY total_views DESC
            LIMIT 10
        `);

        // Get all pages ever viewed
        const [allPagesViewed] = await pool.execute(`
            SELECT page_id, page_name, views, moment
            FROM page_views
            ORDER BY views DESC
        `);

        return {
            today: todayViews,
            lastWeek: lastWeekViews,
            lastMonth: lastMonthViews,
            lastThreeMonths: lastThreeMonthsViews,
            allPages: allPagesViewed
        };
    } catch (error) {
        console.error('Error getting page views statistics:', error);
        throw error;
    }
};



const getAgentConnectionInfo = async () => {
    // Requête pour obtenir les informations détaillées de connexion des agents
    const query = `
        SELECT 
            a.id,
            a.prenom,
            a.nom,
            a.service_id,
            s.nom_service AS service_name,
            AVG(TIMESTAMPDIFF(SECOND, c.timestamp, l.logout_time)) AS average_time_seconds,
            MAX(TIMESTAMPDIFF(SECOND, c.timestamp, l.logout_time)) AS max_time_seconds,
            COUNT(c.id) AS total_connections,
            MAX(c.timestamp) AS last_connection,
            DATE_FORMAT(MAX(c.timestamp), '%Y-%m-%d %H:%i:%s') AS last_connection_formatted
        FROM 
            agents a
        LEFT JOIN 
            service_directories s ON a.service_id = s.id
        LEFT JOIN 
            connections c ON a.id = c.user_id
        LEFT JOIN 
            logout l ON c.user_id = l.user_id AND c.timestamp <= l.logout_time
        GROUP BY 
            a.id
        ORDER BY 
            average_time_seconds DESC
    `;

    const [rows] = await pool.execute(query);

    // Traitement des données pour un format plus lisible
    return rows.map(row => {
        // Conversion des secondes en format heures:minutes:secondes
        const avgSeconds = row.average_time_seconds || 0;
        const maxSeconds = row.max_time_seconds || 0;

        const avgHours = Math.floor(avgSeconds / 3600);
        const avgMinutes = Math.floor((avgSeconds % 3600) / 60);
        const avgSecondsRemaining = Math.floor(avgSeconds % 60);

        const maxHours = Math.floor(maxSeconds / 3600);
        const maxMinutes = Math.floor((maxSeconds % 3600) / 60);
        const maxSecondsRemaining = Math.floor(maxSeconds % 60);

        return {
            id: row.id,
            prenom: row.prenom,
            nom: row.nom,
            nom_complet: `${row.prenom} ${row.nom}`,
            service: {
                id: row.service_id,
                nom: row.service_name
            },
            temps_connexion: {
                moyen: {
                    secondes: avgSeconds,
                    minutes: (avgSeconds / 60).toFixed(2),
                    heures: (avgSeconds / 3600).toFixed(2),
                    format: `${avgHours}h ${avgMinutes}m ${avgSecondsRemaining}s`
                },
                max: {
                    secondes: maxSeconds,
                    minutes: (maxSeconds / 60).toFixed(2),
                    heures: (maxSeconds / 3600).toFixed(2),
                    format: `${maxHours}h ${maxMinutes}m ${maxSecondsRemaining}s`
                }
            },
            connexions: {
                total: row.total_connections || 0,
                derniere: row.last_connection_formatted || 'Jamais connecté'
            },
            statut: (row.total_connections > 0) ? 'Actif' : 'Inactif'
        };
    });
};




const getTotalServicesWithDocumentTypes = async () => {
    const [rows] = await pool.execute(`
        SELECT COUNT(*) AS total 
        FROM service_directories 
        WHERE id IN (SELECT DISTINCT service_id FROM documenttypes2)
    `);
    return rows[0].total;
};

const getTotalServices = async () => {
    const [rows] = await pool.execute("SELECT COUNT(*) AS total FROM service_directories");
    return rows[0].total;
};
const getTotalDirectories = async () => {
    const [rows] = await pool.execute("SELECT COUNT(*) AS total FROM directories");
    return rows[0].total;
};

const getTotalServicesWithoutDocumentType = async () => {
    const [rows] = await pool.execute(`
        SELECT COUNT(*) AS total 
        FROM service_directories 
        WHERE id NOT IN (SELECT DISTINCT service_id FROM documenttypes2)
    `);
    return rows[0].total;
};


const getTotalDirectoriesWithoutServices = async () => {
    const [rows] = await pool.execute(`
        SELECT COUNT(*) AS total 
        FROM directories 
        WHERE id NOT IN (SELECT DISTINCT directory_id FROM service_directories)
    `);
    return rows[0].total;
};

const getTotalDocumentTypes = async () => {
    const [rows] = await pool.execute("SELECT COUNT(*) AS total FROM documenttypes2");
    return rows[0].total;
};

const getTotalDocumentTypesWithoutMetadata = async () => {
    const [rows] = await pool.execute(`
        SELECT COUNT(*) AS total 
        FROM documenttypes2
        WHERE id NOT IN (SELECT DISTINCT documentTypeId FROM metadata)
    `);
    return rows[0].total;
};



const getTotalDocumentTypesWithMetadata = async () => {
    const [rows] = await pool.execute(`
        SELECT COUNT(DISTINCT dt.id) AS total 
        FROM documenttypes2 dt
        JOIN metadata m ON dt.id = m.documentTypeId
    `);
    return rows[0].total;
};

const getTotalDocumentTypesInDocTypeDir = async () => {
    const [rows] = await pool.execute("SELECT COUNT(*) AS total FROM doc_type_dir");
    return rows[0].total;
};

const getTotalDirectoriesWithoutDocumentTypes = async () => {
    const [rows] = await pool.execute(`
        SELECT COUNT(*) AS total, GROUP_CONCAT(code) AS codes 
        FROM directories 
        WHERE id NOT IN (SELECT DISTINCT directory_id FROM doc_type_dir)
    `);
    return {
        total: rows[0].total,
        codes: rows[0].codes ? rows[0].codes.split(',') : []
    };
};

const getTotalPieces = async () => {
    const [rows] = await pool.execute("SELECT COUNT(*) AS total FROM pieces");
    return rows[0].total;
};

//linked pieces
const getTotalPiecesInDocumentType = async () => {
    const [rows] = await pool.execute("SELECT COUNT(*) AS total FROM piece_document_type");
    return rows[0].total;
};

const getTotalDocuments = async () => {
    const [rows] = await pool.execute("SELECT COUNT(*) AS total FROM documents");
    return rows[0].total;
};

const getTotalMetadata = async () => {
    const [rows] = await pool.execute("SELECT COUNT(*) AS total FROM metadata");
    return rows[0].total;
};

const getTotalMetadataInDir = async () => {
    const [rows] = await pool.execute("SELECT COUNT(*) AS total FROM metadata_dir");
    return rows[0].total;
};

//methode pour les connexions par jour
const getTotalConnectionsByTime = async () => {
    const [rows] = await pool.execute(`
       SELECT 
    YEAR(timestamp) AS year, 
    MONTH(timestamp) AS month, 
    DAY(timestamp) AS day,
    DATE_FORMAT(timestamp, '%W') AS day_name, -- Nom du jour
    DATE(timestamp) AS connection_date, -- Date exacte
    COUNT(DISTINCT user_id) AS total_connections, -- Nombre de connexions uniques par jour
    TIME(MAX(timestamp)) AS last_time -- Heure et minute de la dernière connexion
FROM connections
GROUP BY YEAR(timestamp), MONTH(timestamp), DAY(timestamp)
ORDER BY year DESC, month DESC, day DESC
    `);
    return rows;
};

//methode pour les connexions les plus recentes et ancciennes
const getConnectionDetails = async () => {
    const [rows] = await pool.execute(`
        SELECT 
            YEAR(c.timestamp) AS year, 
            MONTH(c.timestamp) AS month, 
            DAY(c.timestamp) AS day,
            DATE_FORMAT(c.timestamp, '%W') AS day_name,
            DATE(c.timestamp) AS connection_date,
            TIME(c.timestamp) AS connection_time,
            a.prenom, 
            a.nom,
            COALESCE(s.nom_service, 'Aucun service') AS service,
            COALESCE(r.nom_role, 'Aucun rôle') AS role
        FROM connections c
        JOIN agents a ON c.user_id = a.id
        LEFT JOIN Service_Directories s ON a.service_id = s.id
        LEFT JOIN role r ON a.fonction_id = r.id
        ORDER BY connection_date DESC, connection_time DESC
    `);
    return rows;
};

//methode pour les documents crée la semaine dernière et la semaine en cours
const getDocumentsLastWeek = async () => {
    const [rows] = await pool.execute(`
        SELECT 
            COUNT(*) as total,
            'Cette semaine' as periode
        FROM documents 
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        UNION
        SELECT 
            COUNT(*) as total,
            'Semaine dernière' as periode
        FROM documents 
        WHERE created_at BETWEEN DATE_SUB(CURDATE(), INTERVAL 14 DAY) AND DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    `);
    return rows;
};

//methode pour les documents crée le mois dernier et le mois en cours avec doctype, service et directory
const getDocumentsLastMonth = async () => {
    const [rows] = await pool.execute(`
        SELECT 
            COUNT(*) as total,
            'Ce mois' as periode,
            GROUP_CONCAT(d.code_unique) as codification,
            dt.name as document_type_name,
            COALESCE(sd.nom_service, 'Aucun service') as service_name,
            COALESCE(dir.nom_directory, 'Aucune direction') as directory_name
        FROM documents d
        JOIN DocumentTypes2 dt ON d.document_type_id = dt.id
        LEFT JOIN Service_Directories sd ON dt.service_id = sd.id
        LEFT JOIN Directories dir ON sd.directory_id = dir.id
        WHERE MONTH(d.created_at) = MONTH(CURRENT_DATE()) 
        AND YEAR(d.created_at) = YEAR(CURRENT_DATE())
        UNION
        SELECT 
            COUNT(*) as total,
            'Mois dernier' as periode,
            GROUP_CONCAT(d.code_unique) as codification,
            dt.name as document_type_name,
            COALESCE(sd.nom_service, 'Aucun service') as service_name,
            COALESCE(dir.nom_directory, 'Aucune direction') as directory_name
        FROM documents d
        JOIN DocumentTypes2 dt ON d.document_type_id = dt.id
        LEFT JOIN Service_Directories sd ON dt.service_id = sd.id
        LEFT JOIN Directories dir ON sd.directory_id = dir.id
        WHERE MONTH(d.created_at) = MONTH(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH))
        AND YEAR(d.created_at) = YEAR(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH))
    `);
    return rows;
};

//methode pour les top document types les plus utilisés, les services et la direction
const getTopDocumentTypes = async () => {
    const [rows] = await pool.execute(`
        SELECT 
            dt.name as document_type_name,
            COUNT(d.id) as usage_count,
            sd.nom_service as service_name,
            dir.nom_directory as directory_name,
            (SELECT COUNT(d2.id) 
             FROM documents d2 
             JOIN DocumentTypes2 dt2 ON d2.document_type_id = dt2.id 
             WHERE dt2.service_id = dt.service_id) as documents_per_service
        FROM documents d
        JOIN DocumentTypes2 dt ON d.document_type_id = dt.id
        LEFT JOIN Service_Directories sd ON dt.service_id = sd.id 
        LEFT JOIN Directories dir ON sd.directory_id = dir.id
        GROUP BY dt.id, dt.name, sd.nom_service, dir.nom_directory, dt.service_id
        ORDER BY usage_count DESC
        LIMIT 10
    `);
    return rows;
};



//methode pour obtenir la taille de la base de données
const getDatabaseSize = async () => {
    const [rows] = await pool.execute(`
        SELECT table_schema AS database_name, 
            ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS size_mb
        FROM information_schema.tables
        WHERE table_schema = 'archive'
        GROUP BY table_schema
    `);
    return rows;
};
//methode pour obtenir la taille de la base de données
const getAgenceDatabaseSize = async () => {
    const [rows] = await pool.execute(`
        SELECT table_schema AS database_name, 
            ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS size_mb
        FROM information_schema.tables
        WHERE table_schema = 'agence'
        GROUP BY table_schema
    `);
    return rows;
};

//vu faites sur les documents
const getDocumentViewsByMonth = async () => {
    const [rows] = await pool.execute(`
        SELECT 
            d.code_unique as document_code,
            dt.name as document_type_name,
            sd.nom_service as service_name,
            dir.nom_directory as directory_name,
            SUM(CASE WHEN MONTH(d.derniere_vue) = MONTH(CURRENT_DATE()) AND YEAR(d.derniere_vue) = YEAR(CURRENT_DATE()) THEN d.vues ELSE 0 END) as vues_ce_mois,
            SUM(CASE WHEN MONTH(d.derniere_vue) = MONTH(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH)) AND YEAR(d.derniere_vue) = YEAR(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH)) THEN d.vues ELSE 0 END) as vues_mois_dernier,
            SUM(CASE WHEN d.derniere_vue >= DATE_SUB(CURRENT_DATE(), INTERVAL 3 MONTH) THEN d.vues ELSE 0 END) as vues_3_derniers_mois
        FROM documents d
        JOIN DocumentTypes2 dt ON d.document_type_id = dt.id
        LEFT JOIN Service_Directories sd ON dt.service_id = sd.id
        LEFT JOIN Directories dir ON sd.directory_id = dir.id
        GROUP BY d.code_unique, dt.name, sd.nom_service, dir.nom_directory
    `);
    return rows;
};

//
const getAgentsCountByService = async () => {
    const [rows] = await pool.execute(`
        SELECT 
            sd.nom_service as service_name,
            dir.nom_directory as directory_name,
            COUNT(a.id) as agent_count
        FROM agents a
        LEFT JOIN Service_Directories sd ON a.service_id = sd.id
        LEFT JOIN Directories dir ON sd.directory_id = dir.id
        GROUP BY sd.nom_service, dir.nom_directory
    `);
    return rows;

};


const checkForWhitespaceInAllTables = async () => {
    try {
        const [tables] = await pool.execute(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'archive'
            AND table_type = 'BASE TABLE'
        `);

        const results = [];

        for (const table of tables) {
            const tableName = table.TABLE_NAME;

            const [columns] = await pool.execute(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_schema = 'archive' 
                AND table_name = ?
                AND data_type IN ('varchar', 'char', 'text')
            `, [tableName]);

            if (columns.length > 0) {
                const columnChecks = columns.map(col =>
                    `(${col.COLUMN_NAME} IS NOT NULL AND TRIM(${col.COLUMN_NAME}) <> ${col.COLUMN_NAME})`
                ).join(' OR ');

                const [rows] = await pool.execute(`
                    SELECT COUNT(*) as count
                    FROM ${tableName}
                    WHERE ${columnChecks}
                `);

                if (rows[0].count > 0) {
                    results.push({
                        table: tableName,
                        whitespace_count: rows[0].count
                    });
                }
            }
        }

        return results;

    } catch (error) {
        console.error('Error checking whitespace:', error);
        return [];
    }
};

const checkForDuplicatesInAllTables = async () => {
    try {
        const [tables] = await pool.execute(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'archive'
            AND table_type = 'BASE TABLE'
        `);

        const results = [];

        for (const table of tables) {
            const tableName = table.TABLE_NAME;

            // Get primary key columns
            const [pkColumns] = await pool.execute(`
                SELECT column_name
                FROM information_schema.key_column_usage 
                WHERE table_schema = 'archive'
                AND table_name = ?
                AND constraint_name = 'PRIMARY'
            `, [tableName]);

            if (pkColumns.length > 0) {
                const pkColumnList = pkColumns.map(col => col.COLUMN_NAME).join(',');

                const [duplicates] = await pool.execute(`
                    SELECT ${pkColumnList}, COUNT(*) as duplicate_count
                    FROM ${tableName} 
                    GROUP BY ${pkColumnList}
                    HAVING COUNT(*) > 1
                `);

                if (duplicates.length > 0) {
                    results.push({
                        table: tableName,
                        duplicates: duplicates
                    });
                }
            }
        }

        return results;

    } catch (error) {
        console.error('Error checking duplicates:', error);
        return [];
    }
};






module.exports = {
    insertIntoLogout,
    updatePageViews,
    getPageViewsStatistics,
    getTotalServices,
    getTotalServicesWithDocumentTypes,
    getTotalServicesWithoutDocumentType,
    getTotalDirectories,
    getTotalDirectoriesWithoutServices,
    getTotalDocumentTypes,
    getTotalDocumentTypesWithMetadata,
    getTotalDocumentTypesWithoutMetadata,
    getTotalDocumentTypesInDocTypeDir,
    getTotalDirectoriesWithoutDocumentTypes,
    getTotalPieces,
    getTotalPiecesInDocumentType,
    getTotalDocuments,
    getTotalMetadata,
    getTotalMetadataInDir,
    getTotalConnectionsByTime,
    getConnectionDetails,
    getDocumentsLastWeek,
    getDocumentsLastMonth,
    getTopDocumentTypes,
    getDatabaseSize,
    getAgenceDatabaseSize,
    getDocumentViewsByMonth,
    getAgentsCountByService,
    checkForDuplicatesInAllTables,
    checkForWhitespaceInAllTables,
    getAgentConnectionInfo,
};
