const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");

router.get("/", serviceController.getAllServices);
router.get("/directory", serviceController.getAllServicesWithDirectory);
router.get("/directory/:id", serviceController.getServiceByDirectoryId);
router.get("/service_dir/:id", serviceController.getAllServiceByDirectoryId);
router.post("/directory", serviceController.createDirectory);
router.put("/directory/:id", serviceController.updateDirectory);
router.delete("/directory/:id", serviceController.deleteDirectory);
router.get("/:id", serviceController.getServiceById);
router.get("/name/:id", serviceController.getServiceNameById);
router.post("/", serviceController.createService);
router.put("/:id", serviceController.updateAService);
router.delete("/:id", serviceController.deleteService);

module.exports = router;
