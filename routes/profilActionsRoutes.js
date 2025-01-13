const express = require("express");
const router = express.Router();
const {
  lierProfilActionsController,
  getAllProfilActionsController
} = require("../controllers/profilActionsController");

// Route pour lier un profil à des actions
router.post("/", lierProfilActionsController);

// Route pour récupérer toutes les relations profil-actions
router.get("/", getAllProfilActionsController);

module.exports = router;
