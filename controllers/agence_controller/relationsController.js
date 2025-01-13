const relationsModel = require("../../models/agence_model/relations");

const getRelationsWithCaisse = async (_req, res) => {
  const result = await relationsModel.getRelationsWithCaisse();
  res.status(200).json(result);
};

const getRelationsWithAgence = async (_req, res) => {
  const result = await relationsModel.getRelationsWithAgence();
  res.status(200).json(result);
};

const getRelationsWithGuichet = async (_req, res) => {
  const result = await relationsModel.getRelationsWithGuichet();
  res.status(200).json(result);
};

const unlinkCaisseDocumentType = async (_req, res) => {
  const result = await relationsModel.unlinkCaisseDocumentType(_req.params.id);
  res.status(200).json(result);
};

const unlinkAgenceDocumentType = async (_req, res) => {
  const result = await relationsModel.unlinkAgenceDocumentType(_req.params.id);
  res.status(200).json(result);
};

const unlinkGuichetDocumentType = async (_req, res) => {
  const result = await relationsModel.unlinkGuichetDocumentType(_req.params.id);
  res.status(200).json(result);
};

module.exports = {
  getRelationsWithCaisse,
  getRelationsWithAgence,
  getRelationsWithGuichet,
  unlinkCaisseDocumentType,
  unlinkAgenceDocumentType,
  unlinkGuichetDocumentType,
};
