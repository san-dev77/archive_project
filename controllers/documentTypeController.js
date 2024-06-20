const {
  createDocumentType,
  getAllDocumentTypes,
  getDocumentTypeById,
  getDocumentTypesByServiceId,
  getDocumentTypeByName,
  getDocumentTypesByServiceName,
  updateDocumentType,
  deleteDocumentType,
} = require("../models/documentTypes");

const createDocumentTypeController = async (req, res) => {
  const { name, serviceId } = req.body;

  try {
    const newDocumentType = await createDocumentType(name, serviceId);
    res.status(201).json(newDocumentType);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllDocumentTypesController = async (req, res) => {
  try {
    const documentTypes = await getAllDocumentTypes();
    res.status(200).json(documentTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDocumentTypeByIdController = async (req, res) => {
  const { id } = req.params;

  try {
    const documentType = await getDocumentTypeById(id);
    res.status(200).json(documentType);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getDocumentTypesByServiceIdController = async (req, res) => {
  const { serviceId } = req.params;

  try {
    const documentTypes = await getDocumentTypesByServiceId(serviceId);
    res.status(200).json(documentTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDocumentTypeByNameController = async (req, res) => {
  const { name } = req.params;

  try {
    const documentType = await getDocumentTypeByName(name);
    res.status(200).json(documentType);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getDocumentTypesByServiceNameController = async (req, res) => {
  const { serviceName } = req.params;

  try {
    const documentTypes = await getDocumentTypesByServiceName(serviceName);
    res.status(200).json(documentTypes);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updateDocumentTypeController = async (req, res) => {
  const { id } = req.params;
  const { name, serviceId } = req.body;

  try {
    const updatedDocumentType = await updateDocumentType(id, name, serviceId);
    res.status(200).json(updatedDocumentType);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deleteDocumentTypeController = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await deleteDocumentType(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  createDocumentTypeController,
  getAllDocumentTypesController,
  getDocumentTypeByIdController,
  getDocumentTypesByServiceIdController,
  getDocumentTypeByNameController,
  getDocumentTypesByServiceNameController,
  updateDocumentTypeController,
  deleteDocumentTypeController,
};
