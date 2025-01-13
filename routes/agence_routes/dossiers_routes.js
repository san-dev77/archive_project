const express = require("express");
const router = express.Router();
const {
  confirmTransactionCaisse,
  getTransactionCaisseController,
  deleteTransactionCaisse,
  updateTransactionCaisse,
  getTransactionGuichetController,
  deleteTransactionGuichet,
  updateTransactionGuichet,
  getTransactionDossiersController,
  getCaissiersController,
  getAttachedFilesController,
} = require("../../controllers/agence_controller/dossier_controller");
require("../../models/agence_model/dossiers");

router.get("/caissiers", getCaissiersController);
router.get("/caisse/files", getAttachedFilesController);

router.get("/transaction-caisse", getTransactionCaisseController);
router.get("/transaction-guichet", getTransactionGuichetController);
router.get("/transaction-dossiers", getTransactionDossiersController);
router.delete("/transaction-caisse/:id", deleteTransactionCaisse);
router.put("/transaction-caisse/:id", updateTransactionCaisse);
router.get("/transaction-caisse/:id", confirmTransactionCaisse);
router.delete("/transaction-guichet/:id", deleteTransactionGuichet);
router.put("/transaction-guichet/:id", updateTransactionGuichet);

module.exports = router;
