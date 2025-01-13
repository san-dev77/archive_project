const express = require("express");
const router = express.Router();
const {
  linkProfilToActionsController,
  getAllProfilActionsController,
  getPermissionsController,
  getProfilActionsController,
  deleteProfilActionController
} = require("../controllers/profil_actionsController");



// Route pour lier un profil à des actions
router.post("/link", linkProfilToActionsController);

// Route pour obtenir toutes les actions de profil
router.get("/all", getAllProfilActionsController);

// Route pour obtenir toutes les permissions
router.get("/permissions", getPermissionsController);

// Route pour obtenir les actions d'un profil spécifique
router.get("/:profilId", getProfilActionsController);

// Route pour supprimer une action d'un profil
router.delete("/:profilId/:permissionId", deleteProfilActionController);

module.exports = router;
