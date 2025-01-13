const {
  importData,
} = require("../../models/agence_model/importCsvDossiersModel");

const {
  importDataGuichet,
} = require("../../models/agence_model/importCSVGuichet");
// Fonction pour traiter l'importation des données CSV pour les dossiers
const importCsvDossiers = async (req, res) => {
  console.log(req.body);
  const chunks = req.body;

  if (!Array.isArray(chunks)) {
    return res
      .status(400)
      .json({ message: "Les données doivent être un tableau." });
  }

  const db_url = "mysql://root@localhost/agence_migrations";

  try {
    for (const chunk of chunks) {
      console.log(`Traitement du chunk: ${JSON.stringify(chunk)}`);
      await importData(chunk, db_url, 100); // Appel au modèle
    }
    res.status(200).json({ message: "Chunks reçus et traités avec succès." });
  } catch (error) {
    console.error(`Erreur lors du traitement: ${error.message}`);
    res.status(500).json({ message: "Erreur lors du traitement des données." });
  }
};

// Fonction pour traiter l'importation des données CSV pour les guichets
const importCsvGuichetController = async (req, res) => {
  console.log(req.body);
  const chunks = req.body;

  if (!Array.isArray(chunks)) {
    return res
      .status(400)
      .json({ message: "Les données doivent être un tableau." });
  }

  const db_url = "mysql://root@localhost/agence_migrations";

  try {
    for (const chunk of chunks) {
      console.log(`Traitement du chunk: ${JSON.stringify(chunk)}`);
      await importDataGuichet(chunk, db_url, 100); // Appel au modèle
    }
    res.status(200).json({ message: "Chunks reçus et traités avec succès." });
  } catch (error) {
    console.error(`Erreur lors du traitement: ${error.message}`);
    res.status(500).json({ message: "Erreur lors du traitement des données." });
  }
};

// Fonction pour traiter l'importation des données CSV pour les guichets
module.exports = { importCsvDossiers, importCsvGuichetController };
