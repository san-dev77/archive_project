const caisseModel = require("../../models/agence_model/caisse");
const createCaisse = async (req, res) => {
  try {
    const result = await caisseModel.createCaisse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUniqueCaisseCodes = async (_req, res) => {
  try {
    const result = await caisseModel.getUniqueCaisseCodes();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const updateCaisse = async (req, res) => {
  const result = await caisseModel.updateCaisse(req.body);
  res.status(200).json(result);
};

const deleteCaisse = async (req, res) => {
  try {
    const result = await caisseModel.deleteCaisse(req.params.id);

    if (result.success === false) {
      return res.status(404).json({ message: result.message });
    }
    return res.status(200).json({ message: "Caisse supprimée avec succès." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAllCaisses = async (_req, res) => {
  const result = await caisseModel.getAllCaisses();
  res.status(200).json(result);
};

const getCaisseById = async (req, res) => {
  const result = await caisseModel.getCaisseById(req.params.id);
  res.status(200).json(result);
};

const importCaissesFromCSV = async (_req, res) => {
  const result = await caisseModel.importCaissesFromCSV();
  res.status(200).json(result);
};

const getAllCaissesWithAgences = async (_req, res) => {
  const result = await caisseModel.getAllCaissesWithAgences();
  res.status(200).json(result);
};

const getCaisseByAgenceId = async (req, res) => {
  const result = await caisseModel.getCaisseByAgenceId(req.params.id);
  res.status(200).json(result);
};

module.exports = {
  createCaisse,
  getUniqueCaisseCodes,
  updateCaisse,
  deleteCaisse,
  getAllCaisses,
  getCaisseById,
  importCaissesFromCSV,
  getAllCaissesWithAgences,
  getCaisseByAgenceId,
};
