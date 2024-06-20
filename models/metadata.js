const pool = require("../config/database");

const getAllMetadata = async () => {
  const [rows] = await pool.query("SELECT * FROM Metadata");
  return rows;
};

const getMetadataByDocumentTypeId = async (documentTypeId) => {
  const [rows] = await pool.query(
    "SELECT * FROM Metadata WHERE documentTypeId = ?",
    [documentTypeId]
  );
  return rows;
};

const createMetadata = async (key, value, documentTypeId) => {
  await pool.query(
    "INSERT INTO Metadata (key, value, documentTypeId) VALUES (?, ?, ?)",
    [key, value, documentTypeId]
  );
};

const updateMetadata = async (id, key, value) => {
  await pool.query("UPDATE Metadata SET key = ?, value = ? WHERE id = ?", [
    key,
    value,
    id,
  ]);
};

const deleteMetadata = async (id) => {
  await pool.query("DELETE FROM Metadata WHERE id = ?", [id]);
};

module.exports = {
  getAllMetadata,
  getMetadataByDocumentTypeId,
  createMetadata,
  updateMetadata,
  deleteMetadata,
};
