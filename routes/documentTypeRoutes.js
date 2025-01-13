const express = require("express");
const {
  createDocumentTypeController,
  getAllDocumentTypesController,
  getDocumentTypeByIdController,
  getDocumentTypesByServiceIdController,
  getDocumentTypeByNameController,
  getDocumentTypesByServiceNameController,
  updateDocumentTypeController,
  deleteDocumentTypeController,
  createDocTypeDirController,
  getAllDocTypesDirController,
  updateDocTypedirController,
  deleteDocTypeDirController,
} = require("../controllers/documentTypeController");

const router = express.Router();

router.post("/", createDocumentTypeController);
router.post("/docType_dir", createDocTypeDirController);
router.get("/docType_dir", getAllDocTypesDirController);
router.get("/", getAllDocumentTypesController);
router.get("/:id", getDocumentTypeByIdController);
router.get(
  "/services/:serviceId/document-types",
  getDocumentTypesByServiceIdController
);
router.get("/name/:name", getDocumentTypeByNameController);
router.get(
  "/services/name/:serviceName/document-types",
  getDocumentTypesByServiceNameController
);
router.put("/:id", updateDocumentTypeController);
router.put("/docType_dir/:id", updateDocTypedirController);
router.delete("/:id", deleteDocumentTypeController);
router.delete("/docType_dir/:id", deleteDocTypeDirController);

module.exports = router;
