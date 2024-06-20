const express = require("express");
const router = express.Router();
const metadataController = require("../controllers/metadataController");

router.get("/", metadataController.getAllMetadata);
router.get(
  "/document-type/:documentTypeId",
  metadataController.getMetadataByDocumentTypeId
);
router.post("/", metadataController.createMetadata);
router.put("/:id", metadataController.updateMetadata);
router.delete("/:id", metadataController.deleteMetadata);

module.exports = router;
