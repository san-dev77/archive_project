const express = require("express");
const router = express.Router();
const guichetController = require("../../controllers/agence_controller/guichet_controller");

router.post("/", guichetController.createGuichet);
router.put("/:id", guichetController.updateGuichet);
router.delete("/:id", guichetController.deleteGuichet);
router.get("/agence/:id", guichetController.getGuichetByAgenceId);
router.get("/agence", guichetController.getGuichetWithAgence);
router.get("/", guichetController.getAllGuichets);
router.get("/:id", guichetController.getGuichetById);

module.exports = router;
