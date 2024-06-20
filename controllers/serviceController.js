const Service = require("../models/services");
const { updateService } = require("../models/services");

const getAllServices = async (req, res) => {
  try {
    const services = await Service.getAllServices();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getServiceById = async (req, res) => {
  try {
    const service = await Service.getServiceById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createService = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newService = await Service.createService(name, description);
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Méthode pour mettre à jour un service
const updateAService = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const updatedService = await updateService(id, name, description);
    res.status(200).json(updatedService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    await Service.deleteService(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateAService,
  deleteService,
};
