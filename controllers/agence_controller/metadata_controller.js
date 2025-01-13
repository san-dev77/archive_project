const metadataModel = require("../../models/agence_model/metadata");

const createMetadata = async (req, res) => {
  const result = await metadataModel.createMetadata(req.body);
  res.status(200).json(result);
};

const createMultipleMetadata = async (req, res) => {
  console.log(req.body);

  const { headers, doc_type_name } = req.body;
  const result = await metadataModel.createMultipleMetadata(headers, doc_type_name);
  res.status(200).json(result);
};


const updateMetadata = async (req, res) => {
  const result = await metadataModel.updateMetadata(req.body);
  res.status(200).json(result);
};

const deleteMetadata = async (req, res) => {
  const result = await metadataModel.deleteMetadata(req.params.id);
  res.status(200).json(result);
};

const getAllMetadata = async (_req, res) => {
  const result = await metadataModel.getAllMetadata();
  res.status(200).json(result);
};

const getMetadataById = async (req, res) => {
  const result = await metadataModel.getMetadataById(req.params.id);
  res.status(200).json(result);
};

const getMetadataByDocumentTypeId = async (req, res) => {
  const result = await metadataModel.getMetadataByDocumentTypeId(req.params.id);
  res.status(200).json(result);
};

const getMetadataNomAndTypeByDocumentTypeId = async (req, res) => {
  const result = await metadataModel.getMetadataNomAndTypeByDocumentTypeId(
    req.params.id
  );
  res.status(200).json(result);
};

module.exports = {
  createMetadata,
  createMultipleMetadata,
  updateMetadata,
  deleteMetadata,
  getAllMetadata,
  getMetadataById,
  getMetadataByDocumentTypeId,
  getMetadataNomAndTypeByDocumentTypeId,
};
