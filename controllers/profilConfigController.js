const {
  lierAgentProfil,
  afficherAgentProfil,
  supprimerLiaisonAgentProfil,
} = require("../models/config_profil");

// Contrôleur pour lier un agent à un profil
const lierAgentProfilController = async (req, res) => {
  const { agentIds, profilId } = req.body;
  try {
    for (const agentId of agentIds) {
      await lierAgentProfil(agentId, profilId);
    }
    res.status(200).json({ message: "Agents liés au profil avec succès" });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la liaison des agents au profil",
      error,
    });
  }
};

// Contrôleur pour afficher les informations d'un agent et sa relation avec le profil
const afficherAgentProfilController = async (req, res) => {
  console.log(req.params);
  const { agentId } = req.params;
  const id = agentId;
  try {
    const result = await afficherAgentProfil(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message:
        "Erreur lors de l'affichage des informations de l'agent et de sa relation avec le profil",
      error,
    });
  }
};

// Contrôleur pour supprimer une relation entre un agent et un profil
const supprimerLiaisonAgentProfilController = async (req, res) => {
  const { agentId, profilId } = req.params;
  try {
    await supprimerLiaisonAgentProfil(agentId, profilId);
    res
      .status(200)
      .json({ message: "Liaison agent-profil supprimée avec succès" });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression de la liaison agent-profil",
      error,
    });
  }
};

module.exports = {
  lierAgentProfilController,
  afficherAgentProfilController,
  supprimerLiaisonAgentProfilController,
};
