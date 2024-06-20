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
} = require("../controllers/documentTypeController");

const router = express.Router();

router.post("/", createDocumentTypeController);
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
router.delete("/:id", deleteDocumentTypeController);

module.exports = router;
