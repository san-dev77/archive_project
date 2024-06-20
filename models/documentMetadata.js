const pool = require("../config/database");

const getAllDocumentMetadata = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM DocumentMetadata", (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });
};

const getDocumentMetadataById = (documentId, metadataId) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM DocumentMetadata WHERE documentId = ? AND metadataId = ?",
      [documentId, metadataId],
      (error, results) => {
        if (error) return reject(error);
        resolve(results[0]);
      }
    );
  });
};

const createDocumentMetadata = (documentId, metadataId, value) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO DocumentMetadata (documentId, metadataId, value) VALUES (?, ?, ?)",
      [documentId, metadataId, value],
      (error, results) => {
        if (error) return reject(error);
        resolve({ documentId, metadataId, value });
      }
    );
  });
};

const deleteDocumentMetadata = (documentId, metadataId) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "DELETE FROM DocumentMetadata WHERE documentId = ? AND metadataId = ?",
      [documentId, metadataId],
      (error, results) => {
        if (error) return reject(error);
        resolve(results);
      }
    );
  });
};

module.exports = {
  getAllDocumentMetadata,
  getDocumentMetadataById,
  createDocumentMetadata,
  deleteDocumentMetadata,
};
