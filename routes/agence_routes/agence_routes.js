const express = require("express");
const router = express.Router();
const agenceController = require("../../controllers/agence_controller/agence_controller");

router.post("/", agenceController.createAgence);
router.get("/", agenceController.getAllAgences);
router.get("/:id", agenceController.getAgenceById);
router.put("/:id", agenceController.updateAgence);
router.delete("/:id", agenceController.deleteAgence);
router.post("/import", agenceController.importAgencesFromCSV);

module.exports = router;
