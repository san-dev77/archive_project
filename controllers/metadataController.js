// controllers/metadataController.js
const {
  createMetadata,
  getMetadataByDocumentTypeId,
  getAllMetadataWithDocumentType,
  updateMetadata,
  deleteMetadata,
} = require("../models/metadata");

const metadataModel = require("../models/metadata");

const createMetadataForDocumentType = async (req, res) => {
  const { key, metaType, documentTypeId } = req.body;
  try {
    const { key, metaType, documentTypeId } = req.body;
    if (!key || !metaType || !documentTypeId) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const metadata = await createMetadata(key, metaType, documentTypeId);
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

const getAllMetadataWithDocumentTypeController = async (req, res) => {
  try {
    const metadata = await getAllMetadataWithDocumentType();
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

const deleteMetadataById = async (req, res) => {
  try {
    const id = req.params.id;
    await deleteMetadata(id);
    res.status(200).json({ message: "Metadata deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMetadataForDocumentType,
  getMetadataByTypeId,
  getAllMetadataWithDocumentTypeController,
  updateMetadataById,
  getMetadataById,
  deleteMetadataById,
};
