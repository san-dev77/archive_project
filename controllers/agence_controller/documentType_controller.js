const documentTypeModel = require("../../models/agence_model/document_type");

const createDocumentType = async (req, res) => {
  const result = await documentTypeModel.createDocumentType(req.body);
  res.status(200).json(result);
};

const updateDocumentType = async (req, res) => {
  const result = await documentTypeModel.updateDocumentType(req.body);
  res.status(200).json(result);
};

const deleteDocumentType = async (req, res) => {
  console.log("test");
  const result = await documentTypeModel.deleteDocumentType(req.params.id);
  res.status(200).json(result);
};

const getAllDocumentTypes = async (_req, res) => {
  const result = await documentTypeModel.getAllDocumentTypes();

  res.status(200).json(result);
};

const getDocumentTypeById = async (req, res) => {
  const result = await documentTypeModel.getDocumentTypeById(req.params.id);
  res.status(200).json(result);
};

const getDocumentTypeByAgenceId = async (req, res) => {
  const result = await documentTypeModel.getDocumentTypeByAgenceId(
    req.params.id
  );
  res.status(200).json(result);
};

const linkAgenceDocumentType = async (req, res) => {
  const result = await documentTypeModel.linkAgenceDocumentType(req.body);
  res.status(200).json(result);
};

const linkCaisseDocumentType = async (req, res) => {
  const result = await documentTypeModel.linkCaisseDocumentType(req.body);
  res.status(200).json(result);
};

const linkGuichetDocumentType = async (req, res) => {
  const result = await documentTypeModel.linkGuichetDocumentType(req.body);
  res.status(200).json(result);
};

const getRelationsWithCaisse = async (_req, res) => {
  console.log("test");
  try {
    const result = await documentTypeModel.getRelationsWithCaisse();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRelationsWithGuichet = async (_req, res) => {
  try {
    const result = await documentTypeModel.getRelationsWithGuichet();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRelationsWithAgence = async (_req, res) => {
  console.log("test ajs");

  try {
    console.log(_req);

    const result = await documentTypeModel.getRelationsWithAgence();
    console.log(result);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const unlinkAgenceDocumentType = async (req, res) => {
  const result = await documentTypeModel.unlinkAgenceDocumentType(req.body);
  res.status(200).json(result);
};

const unlinkCaisseDocumentType = async (req, res) => {
  const result = await documentTypeModel.unlinkCaisseDocumentType(req.body);
  res.status(200).json(result);
};

const unlinkGuichetDocumentType = async (req, res) => {
  const result = await documentTypeModel.unlinkGuichetDocumentType(req.body);
  res.status(200).json(result);
};

const getDocumentTypeForAgence = async (_req, res) => {
  try {
    const result = await documentTypeModel.getDocumentTypeForAgence();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDocTypeByAgence = async (req, res) => {
  const result = await documentTypeModel.getDocTypeByAgence(req.params.id);
  res.status(200).json(result);
};

module.exports = {
  createDocumentType,
  updateDocumentType,
  deleteDocumentType,
  getAllDocumentTypes,
  getDocumentTypeById,
  getDocumentTypeByAgenceId,
  linkAgenceDocumentType,
  linkCaisseDocumentType,
  linkGuichetDocumentType,
  getRelationsWithCaisse,
  getRelationsWithGuichet,
  getRelationsWithAgence,
  unlinkAgenceDocumentType,
  unlinkCaisseDocumentType,
  unlinkGuichetDocumentType,
  getDocumentTypeForAgence,
  getDocTypeByAgence,
};
