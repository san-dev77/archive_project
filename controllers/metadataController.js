const metadataModel = require("../models/metadata");

const getAllMetadata = async (req, res) => {
  try {
    const metadata = await metadataModel.getAllMetadata();
    res.status(200).json(metadata);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMetadataByDocumentTypeId = async (req, res) => {
  try {
    const metadata = await metadataModel.getMetadataByDocumentTypeId(
      req.params.documentTypeId
    );
    res.status(200).json(metadata);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMetadata = async (req, res) => {
  try {
    const { key, value, documentTypeId } = req.body;
    await metadataModel.createMetadata(key, value, documentTypeId);
    res.status(201).json({ message: "Metadata created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMetadata = async (req, res) => {
  try {
    const { key, value } = req.body;
    await metadataModel.updateMetadata(req.params.id, key, value);
    res.status(200).json({ message: "Metadata updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteMetadata = async (req, res) => {
  try {
    await metadataModel.deleteMetadata(req.params.id);
    res.status(204).json();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllMetadata,
  getMetadataByDocumentTypeId,
  createMetadata,
  updateMetadata,
  deleteMetadata,
};
