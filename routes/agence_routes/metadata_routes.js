const express = require("express");
const router = express.Router();
const metadataController = require("../../controllers/agence_controller/metadata_controller");

router.post("/import_col", metadataController.createMultipleMetadata);

router.post("/", metadataController.createMetadata);
router.put("/:id", metadataController.updateMetadata);
router.delete("/:id", metadataController.deleteMetadata);
router.get("/", metadataController.getAllMetadata);
router.get("/:id", metadataController.getMetadataById);
router.get(
  "/document-type/:id",
  metadataController.getMetadataByDocumentTypeId
);
router.get(
  "/nom-type/:id",
  metadataController.getMetadataNomAndTypeByDocumentTypeId
);

module.exports = router;
