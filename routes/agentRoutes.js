// Route agent (routes/agentRoutes.js)
const express = require("express");
const router = express.Router();
const agentController = require("../controllers/authController");
router.get("/", agentController.getAllAgents);
router.post("/login", agentController.login);
router.post("/create-agent", agentController.createAgent);
router.delete("/remove-agent/:id", agentController.deleteAgent);
router.put("/update-agent/:id", agentController.updateAgent);
module.exports = router;
