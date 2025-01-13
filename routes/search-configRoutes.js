const express = require("express");
const router = express.Router();
const {
  handleSaveSearchConfig,
  handleGetSearchConfig,
  handleCheckConfigExists,
  handleDeleteConfig,
} = require("../controllers/search-configController");

// Route pour sauvegarder la configuration de recherche
router.post("/save-config", handleSaveSearchConfig);
router.get("/check/:id", handleCheckConfigExists);
router.delete("/:id", handleDeleteConfig);
router.get("/get-config/:documentTypeId", handleGetSearchConfig);

module.exports = router;
