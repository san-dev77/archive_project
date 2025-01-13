const pieceModel = require("../models/piece");

// Create a new piece
const createPiece = async (req, res) => {
  const { code_piece, nom_piece } = req.body;
  try {
    const piece = await pieceModel.createPiece(code_piece, nom_piece);
    res.status(201).json(piece);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all pieces
const getAllPieces = async (req, res) => {
  try {
    const pieces = await pieceModel.getAllPieces();
    res.status(200).json(pieces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get piece by ID
const getPieceById = async (req, res) => {
  const { id } = req.params;
  try {
    const piece = await pieceModel.getPieceById(id);
    res.status(200).json(piece);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Get pieces by document type name
// const getPiecesByDocumentTypeName = async (req, res) => {
//   const { documentTypeName } = req.params;
//   try {
//     const pieces = await pieceModel.getPiecesByDocumentTypeName(
//       documentTypeName
//     );
//     res.status(200).json(pieces);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const getPiecesByDocumentTypeId = async (req, res) => {
  const { documentTypeId } = req.params;

  try {
    const pieces = await pieceModel.getPiecesByDocumentTypeId(documentTypeId);
    res.status(200).json(pieces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all piece-document type relations
const getAllPieceDocumentRelations = async (req, res) => {
  console.log("getAllPieceDocumentRelations called");
  try {
    const relations = await pieceModel.getAllPieceDocumentRelations();
    res.status(200).json(relations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Link piece to document type
const linkPiecesToDocumentType = async (req, res) => {
  console.log(req.body);
  
  const { piece_ids, document_type_id } = req.body;

  try {
    const relation = await pieceModel.linkPiecesToDocumentType(
      piece_ids,
      document_type_id
    );
    res.status(201).json(relation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Pour detacher une pièce d'un type de document
const detachPieceController = async (req, res) => {
  const { piece_id, document_type_id } = req.params;

  try {
    const result = await pieceModel.detachPieceFromDocumentType(
      piece_id,
      document_type_id
    );
    res.status(200).json({
      message: "Piece successfully detached from document type",
      result,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Update a piece
const updatePiece = async (req, res) => {
  const { id } = req.params;
  const { code_piece, nom_piece } = req.body;
  try {
    const piece = await pieceModel.updatePiece(id, code_piece, nom_piece);
    res.status(200).json(piece);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Delete a piece
const deletePiece = async (req, res) => {
  const { id } = req.params;
  try {
    await pieceModel.deletePiece(id);
    res.status(200).json({ message: "Piece deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  createPiece,
  getAllPieces,
  getPieceById,
  getAllPieceDocumentRelations,
  linkPiecesToDocumentType,
  getPiecesByDocumentTypeId,
  detachPieceController,
  updatePiece,
  deletePiece,
};
