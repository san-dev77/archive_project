const express = require("express");
const {
  importCsvDossiers,
  importCsvGuichetController,
} = require("../../controllers/agence_controller/importCsvDossiersController");

const router = express.Router();

// Route pour importer des données CSV
router.post("/import-caisse", importCsvDossiers);
router.post("/import-guichet", importCsvGuichetController);

module.exports = router;
