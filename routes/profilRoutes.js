const express = require("express");
const router = express.Router();
const profilController = require("../controllers/profilController");

router.get("/", profilController.getAllProfils);
router.post("/", profilController.createProfil);
router.get("/:id", profilController.getProfilById);
router.delete("/:id", profilController.deleteProfil);
router.put("/:id", profilController.updateProfil);
router.put("/:id/activation", profilController.toggleProfilActivation);

module.exports = router;
