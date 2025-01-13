const pool = require("../config/database");

// Insérer un nouveau profil dans la table profil
const insertProfil = async (nom_profil, description) => {
  try {
    const [result] = await pool.execute(
      "INSERT INTO profil (nom_profil, description) VALUES (?, ?)",
      [nom_profil, description]
    );
    return { insertId: result.insertId };
  } catch (error) {
    throw new Error("Erreur lors de l'insertion du profil: " + error.message);
  }
};

// Récupérer tous les profils de la table profil
const getAllProfils = async () => {
  try {
    const [rows] = await pool.execute("SELECT * FROM profil");
    return rows;
  } catch (error) {
    throw new Error(
      "Erreur lors de la récupération des profils: " + error.message
    );
  }
};

// Récupérer un profil par son ID
const getProfilById = async (id) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM profil WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0) {
      throw new Error("Profil non trouvé");
    }
    return rows[0];
  } catch (error) {
    throw new Error(
      "Erreur lors de la récupération du profil: " + error.message
    );
  }
};

// Supprimer un profil par son ID
const deleteProfilById = async (id) => {
  try {
    const [result] = await pool.execute("DELETE FROM profil WHERE id = ?", [
      id,
    ]);
    return result;
  } catch (error) {
    throw new Error(
      "Erreur lors de la suppression du profil: " + error.message
    );
  }
};

// Modifier un profil par son ID
const updateProfilById = async (id, nom_profil, description) => {
  try {
    const [result] = await pool.execute(
      "UPDATE profil SET nom_profil = ?, description = ? WHERE id = ?",
      [nom_profil, description, id]
    );
    return result;
  } catch (error) {
    throw new Error(
      "Erreur lors de la mise à jour du profil: " + error.message
    );
  }
};

// Activer ou désactiver un profil
const toggleProfilActivation = async (id, activation) => {
  try {
    const [result] = await pool.execute(
      "UPDATE profil SET activation = ? WHERE id = ?",
      [activation, id]
    );
    if (result.affectedRows === 0) {
      throw new Error("Profil non trouvé");
    }
    return result;
  } catch (error) {
    throw new Error(
      "Erreur lors de l'activation/désactivation du profil: " + error.message
    );
  }
};



module.exports = {
  insertProfil,
  getAllProfils,
  getProfilById,
  deleteProfilById,
  updateProfilById,
  toggleProfilActivation,
};
