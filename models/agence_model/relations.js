const pool = require("../../config/agence");

const getRelationsWithCaisse = async () => {
  const query = `SELECT dt.*
      FROM document_type dt 
      INNER JOIN document_type_caisse dtc ON dt.id = dtc.document_type_id 
        `;
  const [result] = await pool.query(query);
  return result;
};

const getRelationsWithAgence = async () => {

  const query = `
      SELECT dt.*
      FROM document_type dt 
      INNER JOIN document_type_agence dta ON dt.id = dta.document_type_id 
    `;

  const [result] = await pool.query(query);

  return result;
};

const getRelationsWithGuichet = async () => {
  try {
    const query = `
        SELECT dt.*
        FROM document_type dt
        LEFT JOIN document_type_guichet dgt ON dt.id = dgt.document_type_id
        ORDER BY dt.id ASC
      `;

    const [result] = await pool.query(query);

    if (!result.length) {
      console.log("Aucun résultat trouvé");
      return [];
    }

    return result;
  } catch (error) {
    console.error("Erreur dans getRelationsWithGuichet:", error);
    throw error;
  }
};

const unlinkAgenceDocumentType = async (id) => {
  const query = "DELETE FROM document_type_agence WHERE document_type_id = ?";
  const [result] = await pool.query(query, [id]);
  return result;
};

const unlinkCaisseDocumentType = async (id) => {
  const query = "DELETE FROM document_type_caisse WHERE document_type_id = ?";
  const [result] = await pool.query(query, [id]);
  return result;
};

const unlinkGuichetDocumentType = async (id) => {
  const query = "DELETE FROM document_type_guichet WHERE document_type_id = ?";
  const [result] = await pool.query(query, [id]);
  return result;
};

module.exports = {
  getRelationsWithCaisse,
  unlinkCaisseDocumentType,
  getRelationsWithAgence,
  unlinkAgenceDocumentType,
  unlinkGuichetDocumentType,
  getRelationsWithGuichet,
};
