const pool = require("../config/database");

// Insérer un nouveau rôle dans la table role
const insertRole = async (nom_role, description) => {
  try {
    if (description) {
      await pool.execute(
        "INSERT INTO role (nom_role, description) VALUES (?, ?)",
        [nom_role, description]
      );
    } else {
      await pool.execute(
        "INSERT INTO role (nom_role) VALUES (?)",
        [nom_role]
      );
    }
    return { "message": "Rôle ajouté avec succès" };
  } catch (error) {
    throw new Error("Erreur lors de l'insertion du rôle: " + error.message);
  }
};

// Récupérer tous les rôles de la table role
const getAllRoles = async () => {
  try {
    const [rows] = await pool.execute("SELECT * FROM role");
    return rows;
  } catch (error) {
    throw new Error(
      "Erreur lors de la récupération des rôles: " + error.message
    );
  }
};

// Supprimer un rôle par son ID
const deleteRoleById = async (id) => {
  try {
    const [result] = await pool.execute("DELETE FROM role WHERE id = ?", [id]);
    return result;
  } catch (error) {
    throw new Error("Erreur lors de la suppression du rôle: " + error.message);
  }
};

// Modifier un rôle par son ID
const updateRoleById = async (id, nom_role) => {
  try {
    const [result] = await pool.execute(
      "UPDATE role SET nom_role = ? WHERE id = ?",
      [nom_role, id]
    );
    return result;
  } catch (error) {
    throw new Error("Erreur lors de la mise à jour du rôle: " + error.message);
  }
};

module.exports = {
  insertRole,
  getAllRoles,
  deleteRoleById,
  updateRoleById,
};
