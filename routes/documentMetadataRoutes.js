const express = require("express");
const router = express.Router();
const documentMetadataController = require("../controllers/documentMetadata");

router.get("/", documentMetadataController.getAllDocumentMetadata);
router.get(
  "/:documentId/:metadataId",
  documentMetadataController.getDocumentMetadataById
);
router.post("/", documentMetadataController.createDocumentMetadata);
router.delete(
  "/:documentId/:metadataId",
  documentMetadataController.deleteDocumentMetadata
);

module.exports = router;
