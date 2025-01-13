const agencePieceModel = require("../../models/agence_model/agence_pieces");

const createAgencePiece = async (req, res) => {
  const result = await agencePieceModel.createAgencePiece(req.body);
  res.status(200).json(result);
};

const updateAgencePiece = async (req, res) => {
  const result = await agencePieceModel.updateAgencePiece(req.body);
  res.status(200).json(result);
};

const deleteAgencePiece = async (req, res) => {
  const result = await agencePieceModel.deleteAgencePiece(req.params.id);
  res.status(200).json(result);
};

const getAllAgencePieces = async (_req, res) => {
  const result = await agencePieceModel.getAllAgencePieces();
  res.status(200).json(result);
};

const getAgencePieceById = async (req, res) => {
  const result = await agencePieceModel.getAgencePieceById(req.params.id);
  res.status(200).json(result);
};

const linkPiece = async (req, res) => {
  const result = await agencePieceModel.linkPieceDocType(req.body);
  res.status(200).json(result);
};

const getPiecesByDocType = async (req, res) => {
  console.log(req.params.document_type_id);

  const result = await agencePieceModel.getPiecesByDocType(
    req.params.document_type_id
  );
  res.status(200).json(result);
};

const linkItemController = async (req, res) => {
  const data = JSON.parse(req.body.data);
  console.log(data);
  const { fileNames, type, piece_id } = data;

  const result = await agencePieceModel.linkUploaditems(
    type,
    piece_id,
    fileNames
  ); // Call the model method
  res.status(200).json(result); // Send the response back
};

const getLinkedItemsCaisseController = async (_req, res) => {
  const result = await agencePieceModel.getLinkedItemsCaisse();
  res.status(200).json(result);
};

module.exports = {
  createAgencePiece,
  updateAgencePiece,
  deleteAgencePiece,
  getAllAgencePieces,
  getAgencePieceById,
  linkPiece,
  getPiecesByDocType,
  linkItemController,
  getLinkedItemsCaisseController,
};
