const pool = require("../config/database");

// Create a new document type
const createDocumentType = async (name, serviceId) => {
  const query = "INSERT INTO documentTypes (name, serviceId) VALUES (?, ?)";
  const values = [name, serviceId];

  const [result] = await pool.execute(query, values);

  const [rows] = await pool.execute(
    "SELECT * FROM documentTypes WHERE id = ?",
    [result.insertId]
  );
  return rows[0];
};

// Get all document types with their service names
const getAllDocumentTypes = async () => {
  const query = `
    SELECT dt.id, dt.name, s.name AS serviceName, s.description AS serviceDescription
    FROM documentTypes dt
    LEFT JOIN services s ON dt.serviceId = s.id
  `;
  const [rows] = await pool.execute(query);
  return rows;
};

// Get document type by ID with its service name
const getDocumentTypeById = async (id) => {
  const query = `
    SELECT dt.id, dt.name, s.name AS serviceName, s.description AS serviceDescription
    FROM documentTypes dt
    LEFT JOIN services s ON dt.serviceId = s.id
    WHERE dt.id = ?
  `;
  const [rows] = await pool.execute(query, [id]);
  if (rows.length === 0) {
    throw new Error("DocumentType not found");
  }
  return rows[0];
};

// Get document types by service ID with their service names
const getDocumentTypesByServiceId = async (serviceId) => {
  const query = `
    SELECT dt.id, dt.name, s.name AS serviceName, s.description AS serviceDescription
    FROM documentTypes dt
    LEFT JOIN services s ON dt.serviceId = s.id
    WHERE dt.serviceId = ?
  `;
  const [rows] = await pool.execute(query, [serviceId]);
  return rows;
};

// Get document type by name with its service name and description
const getDocumentTypeByName = async (name) => {
  const query = `
    SELECT dt.id, dt.name, s.name AS serviceName, s.description AS serviceDescription
    FROM documentTypes dt
    LEFT JOIN services s ON dt.serviceId = s.id
    WHERE dt.name = ?
  `;
  const [rows] = await pool.execute(query, [name]);
  if (rows.length === 0) {
    throw new Error("DocumentType not found");
  }
  return rows;
};

// Get document types by service name with their service names and descriptions
const getDocumentTypesByServiceName = async (serviceName) => {
  const query = `
    SELECT dt.id, dt.name, s.name AS serviceName, s.description AS serviceDescription
    FROM documentTypes dt
    LEFT JOIN services s ON dt.serviceId = s.id
    WHERE s.name = ?
  `;
  const [rows] = await pool.execute(query, [serviceName]);
  return rows;
};

// Update a document type
const updateDocumentType = async (id, name, serviceId) => {
  const query = "UPDATE documentTypes SET name = ?, serviceId = ? WHERE id = ?";
  const values = [name, serviceId, id];

  const [result] = await pool.execute(query, values);

  if (result.affectedRows === 0) {
    throw new Error("DocumentType not found");
  }

  const [rows] = await pool.execute(
    "SELECT * FROM documentTypes WHERE id = ?",
    [id]
  );
  return rows[0];
};

// Delete a document type
const deleteDocumentType = async (id) => {
  const [result] = await pool.execute(
    "DELETE FROM documentTypes WHERE id = ?",
    [id]
  );

  if (result.affectedRows === 0) {
    throw new Error("DocumentType not found");
  }

  return { message: "DocumentType deleted successfully" };
};

module.exports = {
  createDocumentType,
  getAllDocumentTypes,
  getDocumentTypeById,
  getDocumentTypesByServiceId,
  getDocumentTypeByName,
  getDocumentTypesByServiceName,
  updateDocumentType,
  deleteDocumentType,
};
