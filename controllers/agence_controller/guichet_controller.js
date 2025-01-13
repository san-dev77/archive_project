const guichetModel = require("../../models/agence_model/guichet");

const createGuichet = async (req, res) => {
  const result = await guichetModel.createGuichet(req.body);
  res.status(200).json(result);
};

const updateGuichet = async (req, res) => {
  const result = await guichetModel.updateGuichet(req.body);
  res.status(200).json(result);
};

const deleteGuichet = async (req, res) => {
  const result = await guichetModel.deleteGuichet(req.params.id);
  res.status(200).json(result);
};

const getAllGuichets = async (_req, res) => {
  const result = await guichetModel.getAllGuichets();
  res.status(200).json(result);
};

const getGuichetById = async (req, res) => {
  const result = await guichetModel.getGuichetById(req.params.id);
  res.status(200).json(result);
};

const getGuichetByAgenceId = async (req, res) => {
  const result = await guichetModel.getGuichetByAgenceId(req.params.id);
  res.status(200).json(result);
};

const getGuichetWithAgence = async (_req, res) => {
  const result = await guichetModel.getGuichetWithAgence();
  res.status(200).json(result);
};

module.exports = {
  createGuichet,
  updateGuichet,
  deleteGuichet,
  getAllGuichets,
  getGuichetById,
  getGuichetByAgenceId,
  getGuichetWithAgence,
};
