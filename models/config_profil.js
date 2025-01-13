const db = require("../config/database");

// Méthode pour insérer la liaison d'un agent à un profil
const lierAgentProfil = async (agentId, profilId) => {
  try {
    const query =
      "INSERT INTO agent_profil (agent_id, profil_id) VALUES (?, ?)";
    await db.execute(query, [agentId, profilId]);
    console.log("Liaison agent-profil insérée avec succès");
  } catch (error) {
    console.error(
      "Erreur lors de l'insertion de la liaison agent-profil:",
      error
    );
  }
};

// Méthode pour afficher les informations d'un agent et sa relation avec le profil
const afficherAgentProfil = async (id) => {
  try {
    const query = `
      SELECT p.nom_profil, a.nom, a.prenom, s.nom_service, r.nom_role
      FROM agents a
      LEFT JOIN agent_profil ap ON a.id = ap.agent_id
      LEFT JOIN profil p ON ap.profil_id = p.id
      LEFT JOIN service_directories s ON a.service_id = s.id
      LEFT JOIN role r ON a.fonction_id = r.id
      WHERE p.id = ?
    `;
    const [rows] = await db.execute(query, [id]);
    return rows;
  } catch (error) {
    console.error(
      "Erreur lors de l'affichage des informations de l'agent et de sa relation avec le profil:",
      error
    );
  }
};

// Méthode pour supprimer une relation entre un agent et un profil
const supprimerLiaisonAgentProfil = async (agentId, profilId) => {
  try {
    const query =
      "DELETE FROM agent_profil WHERE agent_id = ? AND profil_id = ?";
    await db.execute(query, [agentId, profilId]);
    console.log("Liaison agent-profil supprimée avec succès");
  } catch (error) {
    console.error(
      "Erreur lors de la suppression de la liaison agent-profil:",
      error
    );
  }
};

module.exports = {
  lierAgentProfil,
  afficherAgentProfil,
  supprimerLiaisonAgentProfil,
};
