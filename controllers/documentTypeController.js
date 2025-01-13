const { body } = require("express-validator");
const {
  createDocumentType,
  getAllDocumentTypes,
  getDocumentTypeById,
  getDocumentTypesByServiceId,
  getDocumentTypeByName,
  getDocumentTypesByServiceName,
  updateDocumentType,
  deleteDocumentType,
  getMetadataByDocumentTypeId,
  createDocTypeDir,
  updateDocTypeDir,
  deleteDocTypeDir,
  getAllDocTypeDirs,
} = require("../models/documentTypes");

const { DeleteChecker } = require("../services/deletionService");

const createDocumentTypeController = async (req, res) => {
  console.log(req.body);
  const { name, serviceId } = req.body;

  // const documentTypeDir = path.join(baseDirectory, serviceName, name);
  // createDirectoryIfNotExists(documentTypeDir);

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
  console.log(req.body);
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedDocumentType = await updateDocumentType(id, name);
    res.status(200).json(updatedDocumentType);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deleteDocumentTypeController = async (req, res) => {
  const { id } = req.params;

  try {
    const { canDelete, reason } = await DeleteChecker("document-types", id);
    console.log(canDelete, reason, "test");

    if (canDelete) {
      const result = await deleteDocumentType(id);
      res.status(200).json(result);
    } else {
      res.status(200).json({ message: reason });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getMetadataByDocumentTypeIdController = async (req, res) => {
  try {
    const metadata = await getMetadataByDocumentTypeId(req.params.id);
    res.status(200).json(metadata);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createDocTypeDirController = async (req, res) => {
  const { name_docType_dir, directoryId } = req.body;

  try {
    const newDocumentType = await createDocTypeDir(name_docType_dir, directoryId);
    res.status(201).json(newDocumentType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllDocTypesDirController = async (req, res) => {
  try {
    const documentTypes = await getAllDocTypeDirs();
    res.status(200).json(documentTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteDocTypeDirController = async (req, res) => {
  const { id } = req.params;

  try {
    const documentType = await deleteDocTypeDir(id);
    res.status(200).json(documentType);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updateDocTypedirController = async (req, res) => {
  const { id } = req.params;

  try {
    const documentTypes = await updateDocTypeDir(id);
    res.status(200).json(documentTypes);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};



module.exports = {
  createDocumentTypeController,
  createDocTypeDirController,
  updateDocTypedirController,
  deleteDocTypeDirController,
  getAllDocTypesDirController,
  getAllDocumentTypesController,
  getDocumentTypeByIdController,
  getDocumentTypesByServiceIdController,
  getDocumentTypeByNameController,
  getDocumentTypesByServiceNameController,
  updateDocumentTypeController,
  deleteDocumentTypeController,
  getMetadataByDocumentTypeIdController,
};
