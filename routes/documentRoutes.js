const express = require("express");
const multer = require("multer");
const {
  createDocument,
  addDocumentPieces,
  getAllDocuments,
  getDocumentById,
  getAllDocuments4,
  deleteDocument,
  getAllDocuments2,
  getAllDocuments3,
  addDocumentLot,
  getDocumentByTypeIdWithPieces,
  getDocumentByTypeIdWithLot,
  updateDocumentInfo,
  deleteOrReplaceDocumentFiles,
} = require("../controllers/documentController");
const router = express.Router();

// Configuration de Multer
const storage_pieces = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Destination pieces:", "uploads/pieces/");
    cb(null, "uploads/pieces/");
  },

  filename: (req, file, cb) => {
    const filename = `${file.originalname}`;
    console.log("Filename pieces:", filename);
    cb(null, filename);
  },
});
const storage_lot = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Destination lot:", "uploads/lot/");
    cb(null, "uploads/lot/");
  },

  filename: (req, file, cb) => {
    const filename = `${file.originalname}`;
    console.log("Filename lot:", filename);
    cb(null, filename);
  },
});
const upload_pieces = multer({ storage: storage_pieces });
const upload_lot = multer({ storage: storage_lot });

// Routes
router.post(
  "/:id/pieces",
  upload_pieces.array("files"),
  (req, res, next) => {
    console.log("Files received for pieces:", req.files);
    // Adding file names to the request body
    req.body.fileNames = req.files.map((file) => file.originalname);
    next();
  },
  addDocumentPieces
);
router.post(
  "/:id/lot",
  upload_lot.array("files"),
  (req, res, next) => {
    console.log("Files received for lot:", req.files);
    next();
  },
  addDocumentLot
);

router.post("/", createDocument); // Étape 1
// Étape 2
router.get("/", getAllDocuments);
router.get("/all", getAllDocuments2);
router.put("/:id", updateDocumentInfo);
router.get("/alls", getAllDocuments3);
router.get("/:id", getDocumentById);
router.get("/all/:id", getAllDocuments4);
router.put("/:id/delete-replace", deleteOrReplaceDocumentFiles);
router.delete("/:id/delete-replace", deleteOrReplaceDocumentFiles);
router.get("/type/lot/:id", getDocumentByTypeIdWithLot);
router.get("/type/pieces/:id", getDocumentByTypeIdWithPieces);
router.delete("/:id", deleteDocument);

module.exports = router;
