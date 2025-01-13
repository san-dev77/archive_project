const {
  getTransactionCaisse,
  getTransactionDossiers,
  getTransactionGuichet,
  getCaissiers,
  getAttachedFiles,
} = require("../../models/agence_model/dossiers");

const confirmTransactionCaisse = async (req, res) => {
  const { id } = req.params;
  const transaction = await getTransactionCaisse(id);
  res.json(transaction);
};


const getAttachedFilesController = async (_req, res) => {
  try {
    const files = await getAttachedFiles();
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des fichiers joints: " + error.message });
  }
};


const getCaissiersController = async (_req, res) => {
  try {
    const caissiers = await getCaissiers();
    res.json(caissiers);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des caissiers: " + error.message });
  }
};



const getTransactionCaisseController = async (_req, res) => {
  const transaction = await getTransactionCaisse();
  res.json(transaction);
};

const deleteTransactionCaisse = async (req, res) => {
  const { id } = req.params;
  const transaction = await deleteTransactionCaisse(id);
  res.json(transaction);
};

const updateTransactionCaisse = async (req, res) => {
  const { id } = req.params;
  const transaction = await updateTransactionCaisse(id, req.body);
  res.json(transaction);
};

const getTransactionGuichetController = async (_req, res) => {
  const transaction = await getTransactionGuichet();
  res.json(transaction);
};

const deleteTransactionGuichet = async (req, res) => {
  const { id } = req.params;
  const transaction = await deleteTransactionGuichet(id);
  res.json(transaction);
};

const updateTransactionGuichet = async (req, res) => {
  const { id } = req.params;
  const transaction = await updateTransactionGuichet(id, req.body);
  res.json(transaction);
};

const getTransactionDossiersController = async (_req, res) => {
  const transaction = await getTransactionDossiers();
  res.json(transaction);
};

module.exports = {
  confirmTransactionCaisse,
  getAttachedFilesController,
  getCaissiersController,
  getTransactionCaisseController,
  deleteTransactionCaisse,
  updateTransactionCaisse,
  getTransactionGuichetController,
  deleteTransactionGuichet,
  updateTransactionGuichet,
  getTransactionDossiersController,
  getTransactionGuichetController,
};
