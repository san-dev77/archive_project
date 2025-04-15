const express = require("express");
const router = express.Router();
const documentTypeController = require("../../controllers/agence_controller/documentType_controller");

router.get("/agence/", documentTypeController.getDocTypeByAgence);
router.get(
  "/relations-caisse",
  (_req, _res, next) => {
    console.log("Route /relations-caisse appelée");
    next();
  },
  documentTypeController.getRelationsWithCaisse
);
router.post("/", documentTypeController.createDocumentType);
router.put("/:id", documentTypeController.updateDocumentType);
router.delete("/:id", documentTypeController.deleteDocumentType);
router.get("/", documentTypeController.getAllDocumentTypes);
router.get("/:id", documentTypeController.getDocumentTypeById);
router.get("/agence/:id", documentTypeController.getDocumentTypeByAgenceId);
router.post("/link-agence", documentTypeController.linkAgenceDocumentType);
router.post("/link-caisse", documentTypeController.linkCaisseDocumentType);
router.post("/link-guichet", documentTypeController.linkGuichetDocumentType);

router.get("/guichet/", documentTypeController.getRelationsWithGuichet);
router.get("/get/", documentTypeController.getRelationsWithAgence);
router.delete(
  "/unlink-agence/:id",
  documentTypeController.unlinkAgenceDocumentType
);
router.delete(
  "/unlink-caisse/:id",
  documentTypeController.unlinkCaisseDocumentType
);
router.delete(
  "/unlink-guichet/:id",
  documentTypeController.unlinkGuichetDocumentType
);
router.get("/agence-types", documentTypeController.getDocumentTypeForAgence);

module.exports = router;
