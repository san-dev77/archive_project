// models/metadata.js
const pool = require("../config/database");

const createMetadata = async (key, type, documentTypeId) => {
  console.log(documentTypeId);

  const query =
    "INSERT INTO metadata (cle, metaType, documentTypeId) VALUES (?, ?, ?)";
  const [result] = await pool.execute(query, [key, type, documentTypeId]);
  return { id: result.insertId, key, type, documentTypeId };
};

const getMetadataByDocumentTypeId = async (documentTypeId) => {
  if (!documentTypeId) {
    throw new Error("documentTypeId is required");
  }

  const query = `
    SELECT metadata.id, metadata.cle, metadata.metaType
    FROM metadata
    WHERE metadata.documentTypeId = ?
  `;

  try {
    const [rows] = await pool.query(query, [documentTypeId]);
    return rows;
  } catch (error) {
    console.error("Error fetching metadata:", error);
    throw error;
  }
};

const getAllMetadataWithDocumentType = async () => {
  const query = `
    SELECT metadata.id, metadata.cle, metadata.metaType, DocumentTypes2.name AS documentTypeName
    FROM metadata
    JOIN DocumentTypes2 ON metadata.documentTypeId = DocumentTypes2.id
  `;
  const [rows] = await pool.query(query);
  return rows;
};

const getMetadataById = async (id) => {
  const query = "SELECT * FROM metadata WHERE id = ?";
  const [rows] = await pool.execute(query, [id]);
  return rows[0]; // Retourner la première ligne si disponible
};

const updateMetadata = async (id, cle, metaType, documentTypeId) => {
  console.log("ok");
  const query = `UPDATE metadata SET cle = ?, metaType = ?, documentTypeId = ? WHERE id = ?`;
  await pool.query(query, [cle, metaType, documentTypeId, id]);
  console.log("Metadata updated successfully");
};

const deleteMetadata = async (id) => {
  const query = `DELETE FROM metadata WHERE id = ?`;
  await pool.query(query, [id]);
};

module.exports = {
  createMetadata,
  getMetadataByDocumentTypeId,
  getAllMetadataWithDocumentType,
  getMetadataById,
  updateMetadata,
  deleteMetadata,
};
