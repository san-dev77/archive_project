const db = require("../config/database");

const saveSearchResultConfig = async (metadataDisplayState, documentTypeId) => {
  try {
    const query = `INSERT INTO search_result_meta (meta_id, show_state, document_type_id) 
                   VALUES ? 
                   ON DUPLICATE KEY UPDATE show_state = VALUES(show_state)`;

    const values = Object.entries(metadataDisplayState).map(
      ([metaId, showState]) => [parseInt(metaId), showState, documentTypeId]
    );

    const [result] = await db.query(query, [values]);
    return {
      success: true,
      message: `${result.affectedRows} enregistrements insérés ou mis à jour.`,
      affectedRows: result.affectedRows,
    };
  } catch (error) {
    console.error(
      "Erreur lors de l'enregistrement de la configuration des résultats de recherche:",
      error
    );
    return {
      success: false,
      message:
        "Une erreur est survenue lors de l'enregistrement de la configuration.",
      error: error.message,
    };
  }
};

const getSearchResultConfig = async (documentTypeId) => {
  try {
    const query = `
      SELECT srm.id, srm.show_state, m.id AS meta_id, m.cle AS meta_key
      FROM search_result_meta srm
      JOIN metadata m ON srm.meta_id = m.id
      WHERE srm.document_type_id = ?
    `;

    const [rows] = await db.query(query, [documentTypeId]);

    return {
      success: true,
      data: rows,
    };
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la configuration des résultats de recherche:",
      error
    );
    return {
      success: false,
      message:
        "Une erreur est survenue lors de la récupération de la configuration.",
      error: error.message,
    };
  }
};

module.exports = {
  saveSearchResultConfig,
  getSearchResultConfig,
};
