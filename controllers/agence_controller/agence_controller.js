const agenceModel = require("../../models/agence_model/agence");

const createAgence = async (req, res) => {
  const { code_agence, nom_agence } = req.body;
  try {
    const result = await agenceModel.createAgence({ code_agence, nom_agence });
    res.status(201).json(result);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.log("test");

      return res.status(409).json({ error: 'Le code d\'agence existe déjà.' });
    }
    res.status(500).json({ error: error.message });
  }
};

const updateAgence = async (req, res) => {
  const { id } = req.params;
  const { code_agence, nom_agence } = req.body;
  const result = await agenceModel.updateAgence({
    id,
    code_agence,
    nom_agence,
  });
  res.status(200).json(result);
};

const deleteAgence = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await agenceModel.deleteAgence(id);
    console.log(result);

    if (result.success === false) {
      return res.status(404).json({ message: result.message });
    }
    res.status(200).json({ message: "Agence supprimée avec succès." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllAgences = async (_req, res) => {
  const result = await agenceModel.getAllAgences();
  res.status(200).json(result);
};

const getAgenceById = async (req, res) => {
  const { id } = req.params;
  const result = await agenceModel.getAgenceById(id);
  res.status(200).json(result);
};

const importAgencesFromCSV = async (_req, res) => {
  try {
    const result = await agenceModel.importAgencesFromCSV();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAgence,
  updateAgence,
  deleteAgence,
  getAllAgences,
  getAgenceById,
  importAgencesFromCSV,
};
