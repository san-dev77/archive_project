const express = require("express");
const router = express.Router();
const {
  lierAgentProfilController,
  afficherAgentProfilController,
  supprimerLiaisonAgentProfilController,
} = require("../controllers/profilConfigController");

// Route pour lier un agent à un profil
router.post("/", lierAgentProfilController);

// Route pour afficher les informations d'un agent et sa relation avec le profil
router.get("/:agentId", afficherAgentProfilController);

// Route pour supprimer une relation entre un agent et un profil
router.delete("/:agentId/:profilId", supprimerLiaisonAgentProfilController);

module.exports = router;
