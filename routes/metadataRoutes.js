// routes/metadataRoutes.js
const express = require("express");
const {
  createMetadataForDocumentType,
  getMetadataByTypeId,
  getAllMetadataWithDocumentTypeController,
  getMetadataById,
  updateMetadataById,
  deleteMetadataById,
} = require("../controllers/metadataController");

const router = express.Router();

router.post("/", createMetadataForDocumentType);
router.get("/type/:id", getMetadataByTypeId);
router.get("/", getAllMetadataWithDocumentTypeController);
router.get("/:id", getMetadataById);
router.put("/:id", updateMetadataById);
router.delete("/:id", deleteMetadataById);

module.exports = router;
