const DocumentMetadata = require("../models/documentMetadata");

const getAllDocumentMetadata = async (req, res) => {
  try {
    const documentMetadata = await DocumentMetadata.getAllDocumentMetadata();
    res.status(200).json(documentMetadata);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDocumentMetadataById = async (req, res) => {
  try {
    const documentMeta = await DocumentMetadata.getDocumentMetadataById(
      req.params.documentId,
      req.params.metadataId
    );
    if (!documentMeta)
      return res.status(404).json({ message: "DocumentMetadata not found" });
    res.status(200).json(documentMeta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createDocumentMetadata = async (req, res) => {
  try {
    const { documentId, metadataId, value } = req.body;
    const newDocumentMeta = await DocumentMetadata.createDocumentMetadata(
      documentId,
      metadataId,
      value
    );
    res.status(201).json(newDocumentMeta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteDocumentMetadata = async (req, res) => {
  try {
    await DocumentMetadata.deleteDocumentMetadata(
      req.params.documentId,
      req.params.metadataId
    );
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllDocumentMetadata,
  getDocumentMetadataById,
  createDocumentMetadata,
  deleteDocumentMetadata,
};
