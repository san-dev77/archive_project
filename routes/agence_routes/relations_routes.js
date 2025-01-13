const express = require("express");
const router = express.Router();
const relationsController = require("../../controllers/agence_controller/relationsController");

router.get("/caisse", relationsController.getRelationsWithCaisse);

router.get("/guichet", relationsController.getRelationsWithGuichet);

router.get("/agence", relationsController.getRelationsWithAgence);
router.delete(
  "/unlink-agence/:id",
  relationsController.unlinkAgenceDocumentType
);
router.delete(
  "/unlink-guichet/:id",
  relationsController.unlinkGuichetDocumentType
);
router.delete(
  "/unlink-caisse/:id",
  relationsController.unlinkCaisseDocumentType
);

module.exports = router;
