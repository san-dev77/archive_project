const pool = require("../config/database");

// Create a new service
const createService = async (code, nom_service, directory_id) => {

  const query = "INSERT INTO service_directories (code, nom_service, directory_id) VALUES (?, ?, ?)";
  const values = [code, nom_service, directory_id];

  const [result] = await pool.execute(query, values);

  const [rows] = await pool.execute("SELECT * FROM service_directories WHERE id = ?", [
    result.insertId,
  ]);
  return rows[0];
};

//get service by directory id
const getServiceByDirectoryId = async (directory_id) => {
  const [rows] = await pool.execute("SELECT * from service_directories WHERE directory_id = ?", [directory_id]);
  return rows;
};

//update directory
const updateDirectory = async (id, code, nom_directory) => {
  const query = "UPDATE directories SET code = ?, nom_directory = ? WHERE id = ?";
  const values = [code, nom_directory, id];

  const [result] = await pool.execute(query, values);
  return result;
};


//delete directory
const deleteDirectory = async (id) => {
  const [result] = await pool.execute("DELETE FROM directories WHERE id = ?", [id]);
  return result;
};

//create directory
const createDirectory = async (code, nom_directory) => {
  const query = "INSERT INTO directories (code, nom_directory) VALUES (?, ?)";
  const values = [code, nom_directory];

  const [result] = await pool.execute(query, values);
  return result;
};


// Get all services
const getAllServicesWithDirectory = async () => {
  const [rows] = await pool.execute(
    "SELECT d.id AS directory_id, d.nom_directory, d.code, GROUP_CONCAT(JSON_OBJECT('id', sd.id, 'code', sd.code, 'nom_service', sd.nom_service) SEPARATOR '|') AS services FROM directories d LEFT JOIN service_directories sd ON d.id = sd.directory_id GROUP BY d.id, d.nom_directory, d.code ORDER BY d.id ASC"
  );
  return rows;
};

// Get all services
const getAllServices = async () => {
  const [rows] = await pool.execute("SELECT * FROM service_directories");
  return rows;
};

// Get service by ID
const getServiceById = async (id) => {
  const [rows] = await pool.execute("SELECT * FROM service_directories WHERE id = ?", [
    id,
  ]);
  if (rows.length === 0) {
    throw new Error("Service not found");
  }
  return rows[0];
};

// Update a service
const updateService = async (id, code, nom_service) => {
  const query = "UPDATE service_directories SET code = ?, nom_service = ? WHERE id = ?";
  const values = [code, nom_service, id];

  const [result] = await pool.execute(query, values);

  if (result.affectedRows === 0) {
    throw new Error("Service not found");
  }

  const [rows] = await pool.execute("SELECT * FROM service_directories WHERE id = ?", [
    id,
  ]);
  return rows[0];
};

// Delete a service
const deleteService = async (id) => {
  const [result] = await pool.execute("DELETE FROM service_directories WHERE id = ?", [
    id,
  ]);

  if (result.affectedRows === 0) {
    throw new Error("Service not found");
  }

  return { message: "Service deleted successfully" };
};


// Get service name by ID
const getServiceNameById = async (id) => {
  const [rows] = await pool.execute("SELECT s.nom_service, d.nom_directory FROM service_directories s LEFT JOIN directories d ON s.directory_id = d.id WHERE s.id = ?", [id]);
  if (rows.length === 0) {
    throw new Error("Service not found");
  }
  return {
    serviceName: rows[0].nom_service,
    directoryName: rows[0].nom_directory
  };
};

// Get all services linked to a directory by directory ID
const getServicesByDirectoryId = async (directoryId) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id FROM service_directories WHERE directory_id = ?",
      [directoryId]
    );
    console.log(rows);

    return rows;
  } catch (error) {
    throw new Error("Erreur lors de la récupération des services: " + error.message);
  }
};





module.exports = {
  createService,
  getAllServices,
  createDirectory,
  updateDirectory,
  deleteDirectory,
  getServiceById,
  getServiceByDirectoryId,
  updateService,
  deleteService,
  getAllServicesWithDirectory,
  getServiceNameById,
  getServicesByDirectoryId,
};
