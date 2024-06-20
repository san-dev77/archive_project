const Document = require("../models/documents");

const getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.getAllDocuments();
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDocumentById = async (req, res) => {
  try {
    const document = await Document.getDocumentById(req.params.id);
    if (!document)
      return res.status(404).json({ message: "Document not found" });
    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createDocument = async (req, res) => {
  try {
    const { title, content, documentTypeId } = req.body;
    const newDocument = await Document.createDocument(
      title,
      content,
      documentTypeId
    );
    res.status(201).json(newDocument);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDocument = async (req, res) => {
  try {
    const { title, content, documentTypeId } = req.body;
    const updatedDocument = await Document.updateDocument(
      req.params.id,
      title,
      content,
      documentTypeId
    );
    res.status(200).json(updatedDocument);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteDocument = async (req, res) => {
  try {
    await Document.deleteDocument(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
};
