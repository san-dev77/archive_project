const express = require("express");
const router = express.Router();
const pieceController = require("../controllers/pieceController");

// Create a new piece
router.post("/", pieceController.createPiece);

// Get all pieces
router.get("/", pieceController.getAllPieces);

// Get piece by ID
router.get("/:id", pieceController.getPieceById);

// Get pieces by document type name
// router.get(
//   "/documentTypeName/:documentTypeName",
//   pieceController.getPiecesByDocumentTypeName
// );

router.get(
  "/relations/:documentTypeId",
  pieceController.getPiecesByDocumentTypeId
);

// Link piece to document type
router.post("/link", pieceController.linkPiecesToDocumentType);

//Unlink piece to a document type
router.delete(
  "/:piece_id/document-types/:document_type_id",
  pieceController.detachPieceController
);

// Get all piece-document type relations
router.get("/relations", pieceController.getAllPieceDocumentRelations);

// Update a piece
router.put("/:id", pieceController.updatePiece);

// Delete a piece
router.delete("/:id", pieceController.deletePiece);

module.exports = router;
