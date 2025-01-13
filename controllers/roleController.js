const Role = require("../models/role_agent");

const createRole = async (req, res) => {
  const { nom_role, description } = req.body;
  let result;
  try {
    if (description) {
       result = await Role.insertRole(nom_role, description);
    } else {
       result = await Role.insertRole(nom_role);
    }
    res.status(201).json({
      id: `${result.insertId}`,
      nom_role: nom_role,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création du rôle: " + error.message,
    });
  }
};

const deleteRole = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Role.deleteRoleById(id);
    if (result.affectedRows === 0) {
      res.status(404).send("Rôle non trouvé");
    } else {
      res.status(200).send("Rôle supprimé avec succès");
    }
  } catch (error) {
    res
      .status(500)
      .send("Erreur lors de la suppression du rôle: " + error.message);
  }
};

const updateRole = async (req, res) => {
  const { id } = req.params;
  const { nom_role } = req.body;

  try {
    const result = await Role.updateRoleById(id, nom_role);
    if (result.affectedRows === 0) {
      res.status(404).send("Rôle non trouvé");
    } else {
      res.status(200).send("Rôle mis à jour avec succès");
    }
  } catch (error) {
    res
      .status(500)
      .send("Erreur lors de la mise à jour du rôle: " + error.message);
  }
};

const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.getAllRoles();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des rôles: " + error.message,
    });
  }
};

module.exports = {
  createRole,
  getAllRoles,
  deleteRole,
  updateRole,
};
