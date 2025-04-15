const db = require("../config/database");

const saveSearchConfig = async (configList, documentTypeId) => {
  try {
    const query = `INSERT INTO search_params (meta_id, document_type_id) VALUES ?
                   ON DUPLICATE KEY UPDATE meta_id = VALUES(meta_id)`;

    const values = configList.map((config) => [config.metaId, documentTypeId]);

    const [result] = await db.query(query, [values]);

    return {
      success: true,
      message: `${result.affectedRows} enregistrements insérés ou mis à jour.`,
      affectedRows: result.affectedRows,
    };
  } catch (error) {
    console.error(
      "Erreur lors de l'enregistrement de la configuration de recherche:",
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

const getSearchConfig = async (documentTypeId) => {
  try {
    const query = `
      SELECT m.id, m.cle AS name
      FROM metadata m
      JOIN search_params sp ON m.id = sp.meta_id
      WHERE sp.document_type_id = ?
    `;

    const [rows] = await db.query(query, [documentTypeId]);

    console.log("rows", rows);
    return {
      success: true,
      data: rows,
    };
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la configuration de recherche:",
      error
    );
    return {
      success: false,
      message:
        "Une erreur est survenue lors de la récupération de la configuration de recherche.",
      error: error.message,
    };
  }
};

//pour checker les configurations existantes pour un type de document
const checkConfigExists = async (documentTypeId) => {
  try {
    console.log(documentTypeId);

    const query = `
      SELECT COUNT(*) AS config_count, m.cle AS metadata_name
      FROM search_params sp
      JOIN metadata m ON sp.meta_id = m.id 
      WHERE sp.document_type_id = ?
      GROUP BY m.cle
    `;

    const [rows] = await db.query(query, [documentTypeId]);

    console.log("Résultats de la requête:", rows);
    const configExists = rows.length > 0;
    const metadataNames = rows.map(row => row.metadata_name);
    console.log(
      "Nombre de configurations existantes:",
      rows.length
    );
    console.log("Noms des métadonnées configurées:", metadataNames);

    return {
      success: true,
      exists: configExists,
      metadataNames: metadataNames,
    };
  } catch (error) {
    console.error(
      "Erreur lors de la vérification de l'existence de configurations:",
      error
    );
    return {
      success: false,
      message:
        "Une erreur est survenue lors de la vérification des configurations.",
      error: error.message,
    };
  }
};

//pour écraser les configurations existantes pour un type de document

const deleteSearchConfig = async (documentTypeId) => {
  try {
    console.log(
      `Deleting configurations for document type ID: ${documentTypeId}`
    );

    const deleteParamsQuery = `
      DELETE FROM search_params
      WHERE document_type_id = ?
    `;

    const deleteResultsQuery = `
      DELETE FROM search_result_meta
      WHERE document_type_id = ?
    `;

    // Delete from search_params
    const [paramsResult] = await db.query(deleteParamsQuery, [documentTypeId]);
    console.log("Delete operation result from search_params:", paramsResult);

    // Delete from search_result_meta
    const [resultsResult] = await db.query(deleteResultsQuery, [
      documentTypeId,
    ]);
    console.log(
      "Delete operation result from search_result_meta:",
      resultsResult
    );

    return {
      success: true,
      message: "Configurations successfully deleted from both tables.",
      affectedRows: {
        search_params: paramsResult.affectedRows,
        search_result_meta: resultsResult.affectedRows,
      },
    };
  } catch (error) {
    console.error("Error while deleting configurations:", error);
    return {
      success: false,
      message: "An error occurred while deleting configurations.",
      error: error.message,
    };
  }
};

module.exports = {
  saveSearchConfig,
  getSearchConfig,
  checkConfigExists,
  deleteSearchConfig,
};
