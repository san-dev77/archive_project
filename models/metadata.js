// models/metadata.js
const pool = require("../config/database");

const createMetadata = async (key, metaType, required, documentTypeId) => {
  console.log(documentTypeId);

  const query =
    "INSERT INTO metadata (cle, metaType, required, documentTypeId) VALUES (?, ?, ?, ?)";
  const [result] = await pool.execute(query, [key, metaType, required, documentTypeId]);
  return { id: result.insertId, key, metaType, required, documentTypeId };
};
const createMetadata_dir = async (key, metaType, required, documentTypeId) => {

  const query =
    "INSERT INTO metadata_dir (cle, metaType,required, documentTypeId) VALUES (?, ?, ?, ?)";
  const [result] = await pool.execute(query, [key, metaType, required, documentTypeId]);
  return { id: result.insertId, key, metaType, required, documentTypeId };
};

const getMetadataByDocumentTypeId = async (documentTypeId) => {
  if (!documentTypeId) {
    throw new Error("documentTypeId is required");
  }

  const query = `
    SELECT metadata.id, metadata.cle, metadata.required, metadata.metaType
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
const getMetadataByDocumentTypeId_dir = async (documentTypeId) => {
  if (!documentTypeId) {
    throw new Error("documentTypeId is required");
  }

  const query = `
    SELECT metadata_dir.id, metadata_dir.cle, metadata_dir.required, metadata_dir.metaType
    FROM metadata_dir
    WHERE metadata_dir.documentTypeId = ?
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
const getAllMetadataWithDocumentType_dir = async () => {
  const query = `
    SELECT metadata_dir.id, metadata_dir.cle, metadata_dir.metaType, doc_type_dir.name_doc_type AS documentTypeName
    FROM metadata_dir
    JOIN doc_type_dir ON metadata_dir.documentTypeId = doc_type_dir.id
  `;
  const [rows] = await pool.query(query);
  return rows;
};

const getMetadataById = async (id) => {
  const query = "SELECT * FROM metadata WHERE id = ?";
  const [rows] = await pool.execute(query, [id]);
  return rows[0]; // Retourner la première ligne si disponible
};
const getMetadataById_dir = async (id) => {
  const query = "SELECT * FROM metadata_dir WHERE id = ?";
  const [rows] = await pool.execute(query, [id]);
  return rows[0]; // Retourner la première ligne si disponible
};

const updateMetadata = async (id, cle, metaType, documentTypeId) => {
  console.log("ok");
  const query = `UPDATE metadata SET cle = ?, metaType = ?, documentTypeId = ? WHERE id = ?`;
  await pool.query(query, [cle, metaType, documentTypeId, id]);
  console.log("Metadata updated successfully");
};
const updateMetadata_dir = async (id, cle, metaType, documentTypeId) => {
  console.log("ok");
  const query = `UPDATE metadata_dir SET cle = ?, metaType = ?, documentTypeId = ? WHERE id = ?`;
  await pool.query(query, [cle, metaType, documentTypeId, id]);
  console.log("Metadata updated successfully");
};

const deleteMetadatada = async (id) => {
  console.log(id);

  const query = `DELETE FROM metadata WHERE id = ?`;
  await pool.query(query, [id]);
};
const deleteMetadatad_dir = async (id) => {
  const query = `DELETE FROM metadata_dir WHERE id = ?`;
  await pool.query(query, [id]);
};

module.exports = {
  createMetadata,
  createMetadata_dir,
  getMetadataByDocumentTypeId,
  getMetadataByDocumentTypeId_dir,
  getAllMetadataWithDocumentType,
  getAllMetadataWithDocumentType_dir,
  getMetadataById,
  getMetadataById_dir,
  updateMetadata,
  updateMetadata_dir,
  deleteMetadatada,
  deleteMetadatad_dir,
};
