const pool = require("../config/database");

// Create a new service
const createService = async (name, description) => {
  const query = "INSERT INTO services (name, description) VALUES (?, ?)";
  const values = [name, description];

  const [result] = await pool.execute(query, values);

  const [rows] = await pool.execute("SELECT * FROM services WHERE id = ?", [
    result.insertId,
  ]);
  return rows[0];
};

// Get all services
const getAllServices = async () => {
  const [rows] = await pool.execute("SELECT * FROM services");
  return rows;
};

// Get service by ID
const getServiceById = async (id) => {
  const [rows] = await pool.execute("SELECT * FROM services WHERE id = ?", [
    id,
  ]);
  if (rows.length === 0) {
    throw new Error("Service not found");
  }
  return rows[0];
};

// Update a service
const updateService = async (id, name, description) => {
  const query = "UPDATE services SET name = ?, description = ? WHERE id = ?";
  const values = [name, description, id];

  const [result] = await pool.execute(query, values);

  if (result.affectedRows === 0) {
    throw new Error("Service not found");
  }

  const [rows] = await pool.execute("SELECT * FROM services WHERE id = ?", [
    id,
  ]);
  return rows[0];
};

// Delete a service
const deleteService = async (id) => {
  const [result] = await pool.execute("DELETE FROM services WHERE id = ?", [
    id,
  ]);

  if (result.affectedRows === 0) {
    throw new Error("Service not found");
  }

  return { message: "Service deleted successfully" };
};

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};
