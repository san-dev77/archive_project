const express = require("express");
const router = express.Router();
const statsController = require("../../controllers/agence_controller/statsController");

router.get("/total-agences", statsController.getTotalAgencesController);
router.get("/total-caisses", statsController.getTotalCaisseController);
router.get("/total-guichet", statsController.getTotalGuichetController);
router.get("/total-doctype", statsController.getTotalDoctypeController);
router.get("/total-pieces", statsController.getTotalPiecesController);
router.get("/total-configPieces", statsController.getTotalConfigPiecesController);
router.get("/total-agenceTreat", statsController.getTotalAgenceDocTreatController);
router.get("/total-caisseTreat", statsController.getTotalCaisseDocTreatController);
router.get("/total-guichetTreat", statsController.getTotalGuichetDocTreatController);
router.get("/total-metadataAgence", statsController.getTotalMetadataController);


module.exports = router