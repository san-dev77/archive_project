// routes/metadataRoutes.js
const express = require("express");
const {
  createMetadataForDocumentType,
  getMetadataByTypeId,
  getAllMetadataWithDocumentTypeController,
  getMetadataById,
  updateMetadataById,
  //pour les doc type dir
  createMetadataForDocumentType_dir,
  getMetadataByDocumentTypeId_dirController,
  getAllMetadataWithDocumentType_dirController,
  updateMetadataById_dirController,
  deleteMetadataById_dir,
  deleteMetadataById,

} = require("../controllers/metadataController");

const router = express.Router();

router.post("/", createMetadataForDocumentType);
router.post("/meta_dir", createMetadataForDocumentType_dir);
router.get("/type/:id", getMetadataByTypeId);
router.get("/meta_dir/:id", getMetadataByDocumentTypeId_dirController);
// router.get("/type_meta/:id", getMetadataByTypeId);
router.get("/", getAllMetadataWithDocumentTypeController);
router.get("/meta_dir/all", getAllMetadataWithDocumentType_dirController);
router.get("/:id", getMetadataById);
router.put("/:id", updateMetadataById);
router.put("/meta_dir/:id", updateMetadataById_dirController);
router.delete("/:id", deleteMetadataById);
router.delete("/meta_dir/:id", deleteMetadataById_dir);

module.exports = router;
