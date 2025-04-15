const {
  linkProfilToActions,
  getAllProfilActions,
  getPermissions,
  getProfilActions,
  deleteProfilAction
} = require("../models/profil_actions");

// Contrôleur pour lier un profil à des actions
const linkProfilToActionsController = async (req, res) => {
  const { profilId, actions } = req.body;
  console.log("profilId, actions", profilId, actions);
  try {
    const result = await linkProfilToActions(profilId, actions);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Contrôleur pour obtenir les actions d'un profil spécifique
const getProfilActionsController = async (req, res) => {
  const { profilId } = req.params;
  try {
    const actions = await getProfilActions(profilId);
    res.status(200).json(actions);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des actions du profil",
      error: error.message
    });
  }
};


// Contrôleur pour obtenir toutes les actions de profil
const getAllProfilActionsController = async (req, res) => {
  try {
    const actions = await getAllProfilActions();
    res.status(200).json(actions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Contrôleur pour récupérer toutes les permissions
const getPermissionsController = async (req, res) => {
  try {
    const permissions = await getPermissions();
    res.status(200).json(permissions);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des permissions",
      error: error.message
    });
  }
};


// Contrôleur pour supprimer une action d'un profil
const deleteProfilActionController = async (req, res) => {
  const { profilId, permissionId } = req.params;
  try {
    const result = await deleteProfilAction(profilId, permissionId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression de l'action du profil",
      error: error.message
    });
  }
};


module.exports = {
  linkProfilToActionsController,
  getAllProfilActionsController,
  getPermissionsController,
  getProfilActionsController,
  deleteProfilActionController
};
