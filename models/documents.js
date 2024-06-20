const pool = require("../config/database");

const getAllDocuments = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM Documents", (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });
};

const getDocumentById = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM Documents WHERE id = ?",
      [id],
      (error, results) => {
        if (error) return reject(error);
        resolve(results[0]);
      }
    );
  });
};

const createDocument = (title, content, documentTypeId) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO Documents (title, content, documentTypeId) VALUES (?, ?, ?)",
      [title, content, documentTypeId],
      (error, results) => {
        if (error) return reject(error);
        resolve({ id: results.insertId, title, content, documentTypeId });
      }
    );
  });
};

const updateDocument = (id, title, content, documentTypeId) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE Documents SET title = ?, content = ?, documentTypeId = ? WHERE id = ?",
      [title, content, documentTypeId, id],
      (error, results) => {
        if (error) return reject(error);
        resolve({ id, title, content, documentTypeId });
      }
    );
  });
};

const deleteDocument = (id) => {
  return new Promise((resolve, reject) => {
    pool.query("DELETE FROM Documents WHERE id = ?", [id], (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });
};

module.exports = {
  getAllDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
};
