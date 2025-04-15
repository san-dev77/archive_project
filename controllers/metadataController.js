// controllers/metadataController.js
const {
  createMetadata,
  deleteMetadatad_dir,
  getAllMetadataWithDocumentType_dir,
  getMetadataByDocumentTypeId_dir,
  updateMetadata_dir,
  createMetadata_dir,
  getMetadataByDocumentTypeId,
  getAllMetadataWithDocumentType,
  updateMetadata,
  deleteMetadatada,
} = require("../models/metadata");

const metadataModel = require("../models/metadata");

const createMetadataForDocumentType = async (req, res) => {
  try {

    const { key, metaType, required, documentTypeId } = req.body;
    if (!key || !metaType || !documentTypeId) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const metadata = await createMetadata(key, metaType, required, documentTypeId);
    res.status(201).json(metadata);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const createMetadataForDocumentType_dir = async (req, res) => {
  console.log(req.body);

  try {
    const { key, metaType, required, documentTypeId } = req.body;
    if (!key || !metaType || !documentTypeId) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const metadata = await createMetadata_dir(key, metaType, required, documentTypeId);
    res.status(201).json(metadata);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMetadataByTypeId = async (req, res) => {
  try {
    // Récupère l'ID du type de document depuis les paramètres de la requête
    const documentTypeId = req.params.id;

    if (!documentTypeId) {
      return res.status(400).json({ message: "Document type ID is required" });
    }

    // Appelle la méthode pour obtenir les métadonnées en utilisant l'ID
    const metadata = await getMetadataByDocumentTypeId(documentTypeId);

    // Répond avec les métadonnées récupérées
    res.status(200).json(metadata);
  } catch (error) {
    // Répond avec un message d'erreur en cas de problème
    res.status(500).json({ message: error.message });
  }
};
const getMetadataByDocumentTypeId_dirController = async (req, res) => {
  try {
    // Récupère l'ID du type de document depuis les paramètres de la requête
    const documentTypeId = req.params.id;

    if (!documentTypeId) {
      return res.status(400).json({ message: "Document type ID is required" });
    }

    // Appelle la méthode pour obtenir les métadonnées en utilisant l'ID
    const metadata = await getMetadataByDocumentTypeId_dir(documentTypeId);

    // Répond avec les métadonnées récupérées
    res.status(200).json(metadata);
  } catch (error) {
    // Répond avec un message d'erreur en cas de problème
    res.status(500).json({ message: error.message });
  }
};

const getAllMetadataWithDocumentTypeController = async (_req, res) => {
  try {
    const metadata = await getAllMetadataWithDocumentType();
    res.status(200).json(metadata);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAllMetadataWithDocumentType_dirController = async (_req, res) => {
  try {
    const metadata = await getAllMetadataWithDocumentType_dir();
    res.status(200).json(metadata);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMetadataById = async (req, res) => {
  const { id } = req.params;

  try {
    const metadata = await metadataModel.getMetadataById(id);
    if (metadata) {
      res.json(metadata);
    } else {
      res.status(404).json({ message: "Metadata not found" });
    }
  } catch (error) {
    console.error("Error fetching metadata by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const getMetadataById_dirController = async (req, res) => {
  const { id } = req.params;

  try {
    const metadata = await metadataModel.getMetadataById_dir(id);
    if (metadata) {
      res.json(metadata);
    } else {
      res.status(404).json({ message: "Metadata not found" });
    }
  } catch (error) {
    console.error("Error fetching metadata by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateMetadataById = async (req, res) => {
  console.log(req.body);
  try {
    const { id, cle, metaType, documentTypeId } = req.body;
    await updateMetadata(id, cle, metaType, documentTypeId);
    res.status(200).json({ message: "Metadata updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateMetadataById_dirController = async (req, res) => {
  console.log(req.body);
  try {
    const { id, cle, metaType, documentTypeId } = req.body;
    await updateMetadata_dir(id, cle, metaType, documentTypeId);
    res.status(200).json({ message: "Metadata updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMetadataById = async (req, res) => {
  try {
    const id = req.params.id;
    await deleteMetadatada(id);
    res.status(200).json({ message: "Metadata deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteMetadataById_dir = async (req, res) => {
  try {
    const id = req.params.id;
    await deleteMetadatad_dir(id);
    res.status(200).json({ message: "Metadata deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMetadataForDocumentType,
  createMetadataForDocumentType_dir,
  getMetadataById_dirController,
  deleteMetadataById_dir,
  updateMetadataById_dirController,
  getAllMetadataWithDocumentType_dirController,
  getMetadataByTypeId,
  getMetadataByDocumentTypeId_dirController,
  getAllMetadataWithDocumentTypeController,
  updateMetadataById,
  getMetadataById,
  deleteMetadataById,

};
