const pool = require("../config/database");

// Create a new document type
const createDocumentType = async (name, serviceId) => {
  const query = "INSERT INTO DocumentTypes2 (name, service_id) VALUES (?, ?)";
  const values = [name, serviceId];

  const [result] = await pool.execute(query, values);

  const [rows] = await pool.execute(
    "SELECT * FROM DocumentTypes2 WHERE id = ?",
    [result.insertId]
  );
  return rows[0];
};

// Get all document types with their service names
const getAllDocumentTypes = async () => {
  const query = `
    SELECT 
      dt.id AS documentTypeId, 
      dt.name AS documentTypeName, 
      sd.id AS serviceId,
      sd.code AS serviceCode, 
      sd.nom_service AS serviceName,
      d.id AS directoryId,
      d.code AS directoryCode,
      d.nom_directory AS directoryName
    FROM DocumentTypes2 dt
    LEFT JOIN Service_Directories sd ON dt.service_id = sd.id
    LEFT JOIN Directories d ON sd.directory_id = d.id
    ORDER BY d.id, sd.id, dt.id
  `;
  const [rows] = await pool.execute(query);

  // Grouper les résultats par direction, service et type de document
  const groupedResults = rows.reduce((acc, row) => {
    if (!acc[row.directoryId]) {
      acc[row.directoryId] = {
        id: row.directoryId,
        code: row.directoryCode,
        name: row.directoryName,
        services: {}
      };
    }
    if (!acc[row.directoryId].services[row.serviceId]) {
      acc[row.directoryId].services[row.serviceId] = {
        id: row.serviceId,
        code: row.serviceCode,
        name: row.serviceName,
        documentTypes: []
      };
    }
    acc[row.directoryId].services[row.serviceId].documentTypes.push({
      id: row.documentTypeId,
      name: row.documentTypeName
    });
    return acc;
  }, {});

  // Convertir l'objet groupé en tableau
  const result = Object.values(groupedResults).map(directory => ({
    ...directory,
    services: Object.values(directory.services)
  }));

  console.log(result);

  return result;
};

// Get document type by ID with its service name
const getDocumentTypeById = async (id) => {
  const query = `
    SELECT 
      dt.id AS documentTypeId, 
      dt.name AS documentTypeName, 
      s.id AS serviceId,
      s.code AS serviceCode, 
      s.nom_service AS serviceName,
      d.id AS directoryId,
      d.code AS directoryCode,
      d.nom_directory AS directoryName
    FROM DocumentTypes2 dt
    LEFT JOIN Service_Directories s ON dt.service_id = s.id
    LEFT JOIN Directories d ON s.directory_id = d.id
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
    SELECT dt.id, dt.name
    FROM DocumentTypes2 dt
    LEFT JOIN Service_Directories s ON dt.service_id = s.id
    WHERE s.id = ?
  `;
  const [rows] = await pool.execute(query, [serviceId]);
  return rows;
};

// Get document type by name with its service name and description
const getDocumentTypeByName = async (name) => {
  const query = `
    SELECT dt.id, dt.name, s.code AS serviceCode, s.nom_service AS serviceNom
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
    SELECT dt.id, dt.name, s.code AS serviceCode, s.nom_service AS serviceNom
    FROM documentTypes dt
    LEFT JOIN services s ON dt.serviceId = s.id
    WHERE s.name = ?
  `;
  const [rows] = await pool.execute(query, [serviceName]);
  return rows;
};

// Update a document type
const updateDocumentType = async (id, name) => {
  const query = "UPDATE DocumentTypes2 SET name = ? WHERE id = ?";
  const values = [name, id];

  const [result] = await pool.execute(query, values);

  if (result.affectedRows === 0) {
    throw new Error("DocumentType not found");
  }

  const [rows] = await pool.execute(
    "SELECT * FROM DocumentTypes2 WHERE id = ?",
    [id]
  );
  return rows[0];
};

// Delete a document type
const deleteDocumentType = async (id) => {
  const [result] = await pool.execute(
    "DELETE FROM DocumentTypes2 WHERE id = ?",
    [id]
  );

  if (result.affectedRows === 0) {
    throw new Error("DocumentType not found");
  }

  return { message: "DocumentType deleted successfully" };
};

const getMetadataByDocumentTypeId = async (documentTypeId) => {
  const query = "SELECT * FROM metadata WHERE documenttypeId = ?";
  const [rows] = await pool.execute(query, [documentTypeId]);
  return rows;
};

//-------------------Doc type dir APIS -----------------------------------
const createDocTypeDir = async (name_doc_type, direcotyId) => {
  const query = "INSERT INTO doc_type_dir (name_doc_type, directory_id) VALUES (?, ?)";
  const values = [name_doc_type, direcotyId];

  const [result] = await pool.execute(query, values);

  const [rows] = await pool.execute(
    "SELECT * FROM doc_type_dir WHERE id = ?",
    [result.insertId]
  );
  return rows[0];
};


const getAllDocTypeDirs = async () => {
  const query = `
    SELECT 
      dtd.id AS docTypeDirId, 
      dtd.name_doc_type AS docTypeName, 
      d.id AS directoryId,
      d.code AS directoryCode, 
      d.nom_directory AS directoryName
    FROM doc_type_dir dtd
    INNER JOIN directories d ON dtd.directory_id = d.id
  `;
  const [rows] = await pool.execute(query);

  const groupedDocTypes = rows.reduce((acc, row) => {
    const { directoryId, directoryCode, directoryName } = row;
    if (!acc[directoryId]) {
      acc[directoryId] = {
        directoryId,
        directoryCode,
        directoryName,
        docTypes: []
      };
    }
    acc[directoryId].docTypes.push({
      docTypeDirId: row.docTypeDirId,
      docTypeName: row.docTypeName
    });
    console.log(acc);

    return acc;
  }, {});

  return Object.values(groupedDocTypes);
};




// Update a document type
const updateDocTypeDir = async (id, name_doc_type) => {
  const query = "UPDATE doc_type_dir SET name_doc_type = ? WHERE id = ?";
  const values = [name_doc_type, id];

  const [result] = await pool.execute(query, values);

  if (result.affectedRows === 0) {
    throw new Error("DocumentType not found");
  }

  const [rows] = await pool.execute(
    "SELECT * FROM doc_type_dir WHERE id = ?",
    [id]
  );
  return rows[0];
};


// Delete a document type
const deleteDocTypeDir = async (id) => {
  const [result] = await pool.execute(
    "DELETE FROM doc_type_dir WHERE id = ?",
    [id]
  );

  if (result.affectedRows === 0) {
    throw new Error("DocumentType not found");
  }

  return { message: "DocumentType deleted successfully" };
};

module.exports = {
  createDocumentType,
  createDocTypeDir,
  getAllDocTypeDirs,
  getAllDocumentTypes,
  getDocumentTypeById,
  getMetadataByDocumentTypeId,
  getDocumentTypesByServiceId,
  getDocumentTypeByName,
  getDocumentTypesByServiceName,
  updateDocumentType,
  updateDocTypeDir,
  deleteDocumentType,
  deleteDocTypeDir,

};
