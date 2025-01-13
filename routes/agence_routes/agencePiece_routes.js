const express = require("express");
const router = express.Router();
const multer = require("multer");

const agencePieceController = require("../../controllers/agence_controller/agencePiece_controller");

// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const directory = "agence_uploads/caisse/";
    cb(null, directory);
  },
  filename: (_req, file, cb) => {
    cb(null, file.originalname); // Garder le nom original du fichier
  },
});

const upload = multer({ storage: storage });

router.get(
  "/linked/:document_type_id",
  agencePieceController.getPiecesByDocType
);
router.get("/", agencePieceController.getAllAgencePieces);
router.get(
  "/linked-caisse-piece",
  agencePieceController.getLinkedItemsCaisseController
);

router.get("/:id", agencePieceController.getAgencePieceById);
router.post("/", agencePieceController.createAgencePiece);
router.post("/link-piece", agencePieceController.linkPiece);
router.post(
  "/upload-pieces",
  upload.array("files"),
  agencePieceController.linkItemController
);

router.put("/:id", agencePieceController.updateAgencePiece);
router.delete("/:id", agencePieceController.deleteAgencePiece);

module.exports = router;
