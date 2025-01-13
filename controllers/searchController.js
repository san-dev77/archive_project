const { searchDocuments } = require('../models/search');

const searchController = async (req, res) => {

  const { metadata } = req.body;

  if (!metadata || !Array.isArray(metadata)) {
    return res.status(400).json({ error: 'Format de métadonnées invalide' });
  }

  try {
    const results = await searchDocuments(metadata);
    res.json(results);
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    res.status(500).json({ error: 'Erreur lors de la recherche des documents' });
  }
};

module.exports = {
  searchController,
};

