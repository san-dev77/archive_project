const pool = require("../config/database");

/**
 * Vérifie si un élément peut être supprimé en fonction de ses relations.
 * @param {string} entityType - Le type d'entité ('service', 'typeDocument', 'piece').
 * @param {string} id - L'identifiant de l'élément à vérifier.
 * @returns {Promise<{ canDelete: boolean, reason?: string }>} - Indique si l'élément peut être supprimé et pourquoi.
 */
async function DeleteChecker(entityType, id) {
    switch (entityType) {
        case "service": {
            const { count, docTypeNames } = await checkServiceDependencies(id);

            if (count > 0) {
                return {
                    canDelete: false,
                    reason: `Le service est lié à ${count} type(s) de document: ${docTypeNames}`,
                };
            }
            break;
        }

        case "document-types": {
            const { metadataCount, pieceCount, documentsCount } = await checkDocumentTypeDependencies(id);

            if (
                metadataCount > 0 ||
                pieceCount > 0 ||
                documentsCount > 0
            ) {
                return {
                    canDelete: false,
                    reason: `Le type de document est lié à ${metadataCount} meta-données, ${pieceCount} pièces, et ${documentsCount} documents. Impossible de supprimer.`,
                };
            }
            break;
        }

        case "piece": {
            const linkedConfigurations = await checkPieceDependencies(id);
            if (linkedConfigurations.length > 0) {
                return {
                    canDelete: false,
                    reason: `La pièce est configurée et liée à ${linkedConfigurations.length} type(s) de document.`,
                };
            }
            break;
        }

        case "metadata": {
            const linkedConfigurations = await checkMetadataDependencies(id);
            if (linkedConfigurations.length > 0) {
                return {
                    canDelete: false,
                    reason: `Cette meta-donnée est configurée et liée à ${linkedConfigurations.length} document(s).`,
                };
            }
            break;
        }

        default:
            return {
                canDelete: false,
                reason: "Type d’entité non supporté.",
            };
    }

    return { canDelete: true };
}

/**
 * Vérifie les relations d'un type de document.
 * @param {string} documentTypeId - L'identifiant du type de document.
 * @returns {Promise<{ metadataCount: number, pieceCount: number, documentsCount: number }>} - Compte des dépendances du type de document.
 */
async function checkDocumentTypeDependencies(documentTypeId) {
    const [metadataRows] = await pool.query(
        "SELECT COUNT(*) AS count FROM metadata WHERE documentTypeId = ?",
        [documentTypeId]
    );
    const [pieceRows] = await pool.query(
        "SELECT COUNT(*) AS count FROM piece_document_type WHERE document_type_id = ?",
        [documentTypeId]
    );
    const [documentsRows] = await pool.query(
        "SELECT COUNT(*) AS count FROM documents WHERE document_type_id = ?",
        [documentTypeId]
    );

    return {
        metadataCount: metadataRows[0].count,
        pieceCount: pieceRows[0].count,
        documentsCount: documentsRows[0].count
    };
}

/**
 * Vérifie les relations d'un service.
 * @param {string} serviceId - L'identifiant du service.
 * @returns {Promise<any[]>} - Liste des dépendances du service.
 */
async function checkServiceDependencies(serviceId) {
    const [countRows] = await pool.query(
        "SELECT COUNT(*) AS count FROM documenttypes2 WHERE service_id = ?",
        [serviceId]
    );
    const [nameRows] = await pool.query(
        "SELECT GROUP_CONCAT(dt.name SEPARATOR ', ') AS doc_type_names FROM documenttypes2 dt WHERE dt.service_id = ?",
        [serviceId]
    );

    return { count: countRows[0].count, docTypeNames: nameRows[0].doc_type_names };
}

/**
 * Vérifie les relations d'une pièce.
 * @param {string} pieceId - L'identifiant de la pièce.
 * @returns {Promise<any[]>} - Liste des dépendances de la pièce.
 */
async function checkPieceDependencies(pieceId) {
    const [rows] = await pool.query(
        "SELECT * FROM piece_document_type WHERE document_type_id = ?",
        [pieceId]
    );
    return rows;
}


module.exports = { DeleteChecker };
