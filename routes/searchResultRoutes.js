const express = require('express');
const router = express.Router();
const searchResultController = require('../controllers/searchResultController');

// Route pour récupérer tous les résultats de recherche
router.get('/:documentTypeId', searchResultController.getAllSearchResults);

// Route pour créer un nouveau résultat de recherche
router.post('/', searchResultController.createSearchResult);

// Route pour récupérer un résultat de recherche par son ID
router.get('/:id', searchResultController.getSearchResultById);

// Route pour mettre à jour un résultat de recherche
router.put('/:id', searchResultController.updateSearchResult);

// Route pour supprimer un résultat de recherche
router.delete('/:id', searchResultController.deleteSearchResult);

module.exports = router;
