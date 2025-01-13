const {
  saveSearchConfig,
  getSearchConfig,
  checkConfigExists,
  deleteSearchConfig,
} = require("../models/search-config");

const handleSaveSearchConfig = async (req, res) => {
  try {
    const configList = req.body.selectedMetadata;
    const documentTypeId = req.body.documentTypeId;

    if (!configList || !Array.isArray(configList)) {
      return res.status(400).json({
        success: false,
        message: "La configuration de recherche est invalide ou manquante.",
      });
    }

    const formattedConfigList = configList.map((metaId) => ({
      metaId: parseInt(metaId),
    }));

    const result = await saveSearchConfig(formattedConfigList, documentTypeId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error(
      "Erreur lors du traitement de la configuration de recherche:",
      error
    );
    res.status(500).json({
      success: false,
      message:
        "Une erreur est survenue lors du traitement de la configuration de recherche.",
      error: error.message,
    });
  }
};

const handleGetSearchConfig = async (req, res) => {
  try {
    const documentTypeId = req.params.documentTypeId;
    const result = await getSearchConfig(documentTypeId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la configuration de recherche:",
      error
    );
    res.status(500).json({
      success: false,
      message:
        "Une erreur est survenue lors de la récupération de la configuration de recherche.",
      error: error.message,
    });
  }
};

const handleCheckConfigExists = async (req, res) => {
  try {
    console.log(req);

    const { id } = req.params;
    const result = await checkConfigExists(id);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error(
      "Erreur lors de la vérification de l'existence de configurations:",
      error
    );
    res.status(500).json({
      success: false,
      message:
        "Une erreur est survenue lors de la vérification de l'existence de configurations.",
      error: error.message,
    });
  }
};

const handleDeleteConfig = async (req, res) => {
  try {
    console.log(req);

    const { id } = req.params;
    const result = await deleteSearchConfig(id);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error(
      "Erreur lors de la vérification de l'existence de configurations:",
      error
    );
    res.status(500).json({
      success: false,
      message:
        "Une erreur est survenue lors de la vérification de l'existence de configurations.",
      error: error.message,
    });
  }
};

module.exports = {
  handleSaveSearchConfig,
  handleGetSearchConfig,
  handleCheckConfigExists,
  handleDeleteConfig,
};
