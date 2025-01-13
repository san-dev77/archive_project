const express = require("express");
const router = express.Router();
const caisseController = require("../../controllers/agence_controller/caisse_controller");

router.get("/unique-codes", caisseController.getUniqueCaisseCodes);

router.post("/", caisseController.createCaisse);

router.put("/:id", caisseController.updateCaisse);
router.delete("/:id", caisseController.deleteCaisse);
router.get("/", caisseController.getAllCaisses);
router.get("/agence/:id", caisseController.getCaisseByAgenceId);
router.get("/agence", caisseController.getAllCaissesWithAgences);
router.get("/:id", caisseController.getCaisseById);
router.post("/import", caisseController.importCaissesFromCSV);

module.exports = router;
