const ServiceDocument = require("../models/serviceDocuments");

const getAllServiceDocuments = async (req, res) => {
  try {
    const serviceDocuments = await ServiceDocument.getAllServiceDocuments();
    res.status(200).json(serviceDocuments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getServiceDocumentById = async (req, res) => {
  try {
    const serviceDocument = await ServiceDocument.getServiceDocumentById(
      req.params.serviceId,
      req.params.documentId
    );
    if (!serviceDocument)
      return res.status(404).json({ message: "ServiceDocument not found" });
    res.status(200).json(serviceDocument);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createServiceDocument = async (req, res) => {
  try {
    const { serviceId, documentId } = req.body;
    const newServiceDocument = await ServiceDocument.createServiceDocument(
      serviceId,
      documentId
    );
    res.status(201).json(newServiceDocument);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteServiceDocument = async (req, res) => {
  try {
    await ServiceDocument.deleteServiceDocument(
      req.params.serviceId,
      req.params.documentId
    );
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllServiceDocuments,
  getServiceDocumentById,
  createServiceDocument,
  deleteServiceDocument,
};
