const express = require("express");
const router = express.Router();
const serviceDocumentController = require("../controllers/serviceDocumentController");

router.get("/", serviceDocumentController.getAllServiceDocuments);
router.get(
  "/:serviceId/:documentId",
  serviceDocumentController.getServiceDocumentById
);
router.post("/", serviceDocumentController.createServiceDocument);
router.delete(
  "/:serviceId/:documentId",
  serviceDocumentController.deleteServiceDocument
);

module.exports = router;
