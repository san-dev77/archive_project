const SearchParamResult = require("../models/searchParamResults");

// Contrôleur pour récupérer tous les résultats de recherche
exports.getAllSearchResults = async (req, res) => {
  try {
    const documentTypeId = req.params.documentTypeId;
    const searchResults = await SearchParamResult.getSearchResultConfig(
      documentTypeId
    );
    res.status(200).json(searchResults);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des résultats de recherche",
      error: error.message,
    });
  }
};

// Contrôleur pour créer un nouveau résultat de recherche
exports.createSearchResult = async (req, res) => {
  console.log(req);

  try {
    const { metadataDisplayState, documentTypeId } = req.body;
    if (!metadataDisplayState || !documentTypeId) {
      return res.status(400).json({
        message: "Les données de configuration sont manquantes ou invalides",
      });
    }
    const savedSearchResult = await SearchParamResult.saveSearchResultConfig(
      metadataDisplayState,
      documentTypeId
    );
    res.status(201).json(savedSearchResult);
  } catch (error) {
    res.status(400).json({
      message: "Erreur lors de la création du résultat de recherche",
      error: error.message,
    });
  }
};

// Contrôleur pour récupérer un résultat de recherche par son ID
exports.getSearchResultById = async (req, res) => {
  try {
    const searchResult = await SearchParamResult.getSearchResultConfig(
      req.params.id
    );
    if (!searchResult) {
      return res
        .status(404)
        .json({ message: "Résultat de recherche non trouvé" });
    }
    res.status(200).json(searchResult);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération du résultat de recherche",
      error: error.message,
    });
  }
};

// Contrôleur pour mettre à jour un résultat de recherche
exports.updateSearchResult = async (req, res) => {
  try {
    const updatedSearchResult = await SearchParamResult.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedSearchResult) {
      return res
        .status(404)
        .json({ message: "Résultat de recherche non trouvé" });
    }
    res.status(200).json(updatedSearchResult);
  } catch (error) {
    res.status(400).json({
      message: "Erreur lors de la mise à jour du résultat de recherche",
      error: error.message,
    });
  }
};

// Contrôleur pour supprimer un résultat de recherche
exports.deleteSearchResult = async (req, res) => {
  try {
    const deletedSearchResult = await SearchParamResult.findByIdAndDelete(
      req.params.id
    );
    if (!deletedSearchResult) {
      return res
        .status(404)
        .json({ message: "Résultat de recherche non trouvé" });
    }
    res
      .status(200)
      .json({ message: "Résultat de recherche supprimé avec succès" });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression du résultat de recherche",
      error: error.message,
    });
  }
};
