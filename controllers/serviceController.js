const Service = require("../models/services");

const fs = require("fs");
const { DeleteChecker } = require("../services/deletionService");
const path = require("path");
const baseDirectory = path.join(__dirname, "../archives");

// Methode pour créer un repertoire pour le nouveau service
// si il n'existe pas
function createDirectoryIfNotExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Répertoire créé : ${dirPath}`);
  }
}

const { updateService } = require("../models/services");
const { canDelete } = require("../services/deletionService");

const getAllServices = async (req, res) => {
  try {
    const services = await Service.getAllServices();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getServiceByDirectoryId = async (req, res) => {
  try {
    const services = await Service.getServiceByDirectoryId(req.params.id);
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createDirectory = async (req, res) => {
  try {
    const { code, nom_directory } = req.body;
    const newDirectory = await Service.createDirectory(code, nom_directory);
    res.status(201).json(newDirectory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDirectory = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, nom_directory } = req.body;
    const updatedDirectory = await Service.updateDirectory(
      id,
      code,
      nom_directory
    );
    res.status(200).json(updatedDirectory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteDirectory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDirectory = await Service.deleteDirectory(id);
    res.status(200).json(deletedDirectory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllServicesWithDirectory = async (req, res) => {
  try {
    const services = await Service.getAllServicesWithDirectory();
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

// Get service name by ID
const getServiceNameById = async (req, res) => {
  try {
    const serviceName = await Service.getServiceNameById(req.params.id);
    res.status(200).json({ name: serviceName });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createService = async (req, res) => {
  try {
    const { code, nom_service, directory_id } = req.body;
    // Création du répertoire pour le new service
    const serviceDir = path.join(baseDirectory, nom_service);
    createDirectoryIfNotExists(serviceDir);

    const newService = await Service.createService(
      code,
      nom_service,
      directory_id
    );
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Méthode pour mettre à jour un service
const updateAService = async (req, res) => {
  const { id } = req.params;
  const { code, nom_service } = req.body;

  try {
    const updatedService = await updateService(id, code, nom_service);
    res.status(200).json(updatedService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    //check if the service can delete or not...
    const { canDelete, reason } = await DeleteChecker("service", req.params.id);
    console.log("candelete", canDelete);

    if (canDelete) {
      await Service.deleteService(req.params.id);
      res.status(204).send();
    } else {
      res.status(200).json({ message: reason });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  getServiceNameById,
  getServiceByDirectoryId,
  updateDirectory,
  deleteDirectory,
  createDirectory,
  getAllServicesWithDirectory,
  createService,
  updateAService,
  deleteService,
};
