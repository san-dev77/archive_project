// Route agent (routes/agentRoutes.js)
const express = require("express");
const router = express.Router();
const agentController = require("../controllers/authController");
const agents = require("../models/agents");
router.get("/", agentController.getAllAgents);
router.get("/agentNoProfil", agentController.getAgentsWithoutProfileController);
router.get("/check-phone/:phoneNumber", agentController.getAgentByPhoneNumberController);
router.get("/NoProfilAgents", agentController.getAgentsWithNoProfileController);
router.get("/dir_agents/:directoryId", agentController.getAgentsWithDirDataController);
// Route pour vérifier si le token est valide
router.get('/verify-token', agents.authenticateToken, (req, res) => {
    // Si on arrive ici, c'est que le middleware authenticateToken a réussi
    // Le token est donc valide
    console.log("valide");

    res.status(200).json({ valid: true });
});
router.post("/login", agentController.login);
router.post("/create-agent", agentController.createAgent);
router.post("/reset-password", agentController.resetAgentPasswordController);
router.delete("/remove-agent/:id", agentController.deleteAgent);
router.put("/update-agent/:id", agentController.updateAgent);
module.exports = router;
