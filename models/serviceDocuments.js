const pool = require("../config/database");

const getAllServiceDocuments = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM ServiceDocuments", (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });
};

const getServiceDocumentById = (serviceId, documentId) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM ServiceDocuments WHERE serviceId = ? AND documentId = ?",
      [serviceId, documentId],
      (error, results) => {
        if (error) return reject(error);
        resolve(results[0]);
      }
    );
  });
};

const createServiceDocument = (serviceId, documentId) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO ServiceDocuments (serviceId, documentId) VALUES (?, ?)",
      [serviceId, documentId],
      (error, results) => {
        if (error) return reject(error);
        resolve({ serviceId, documentId });
      }
    );
  });
};

const deleteServiceDocument = (serviceId, documentId) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "DELETE FROM ServiceDocuments WHERE serviceId = ? AND documentId = ?",
      [serviceId, documentId],
      (error, results) => {
        if (error) return reject(error);
        resolve(results);
      }
    );
  });
};

module.exports = {
  getAllServiceDocuments,
  getServiceDocumentById,
  createServiceDocument,
  deleteServiceDocument,
};
