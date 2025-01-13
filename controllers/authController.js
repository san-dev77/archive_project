const Agent = require("../models/agents");

const login = async (req, res) => {
  console.log("Requête de connexion reçue:", req.body);
  const { login, password } = req.body;

  try {
    // Utiliser la méthode loginAgent pour obtenir le token, le profil et les permissions
    const {
      token,
      profilName,
      permissions,
      firstName,
      lastName,
      role,
      service,
      serviceId,
    } = await Agent.loginAgent(login, password);

    // Envoyer la réponse avec le token, le profil et les permissions
    console.log("role", role, lastName, firstName);

    res.status(200).json({
      token,
      profilName,
      permissions,
      firstName,
      lastName,
      role,
      service,
      serviceId,
    });
  } catch (error) {
    console.error("Erreur lors de l'authentification:", error);
    res.status(500).send("Erreur lors de l'authentification: " + error.message);
  }
};

const createAgent = async (req, res) => {
  console.log(req.body);
  const {
    lastName,
    firstName,
    phone,
    email,
    login,
    password,
    service,
    fonction_id,
  } = req.body;

  console.log(req.body);

  try {
    const result = await Agent.insertAgent(
      firstName,
      lastName,
      phone,
      email,
      login,
      password,
      service,
      fonction_id
    );
    res.status(201).json({
      id: `${result.insertId}`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création de l'agent: " + error.message,
    });
  }
};

const getAllAgents = async (_req, res) => {
  try {
    const agents = await Agent.getAllAgents();
    res.status(200).json(agents);
  } catch (error) {
    res
      .status(500)
      .send(
        "Erreur lors de la récupération de la liste des agents: " +
        error.message
      );
  }
};

const deleteAgent = async (req, res) => {
  console.log("ok");
  const { id } = req.params;

  try {
    const result = await Agent.deleteAgentById(id);
    if (result.affectedRows === 0) {
      res.status(404).send("Agent non trouvé");
    } else {
      res.status(200).send("Agent supprimé avec succès");
    }
  } catch (error) {
    res
      .status(500)
      .send("Erreur lors de la suppression de l'agent: " + error.message);
  }
};

const updateAgent = async (req, res) => {
  const { id } = req.params;
  const { prenom, nom, tel_number, mail, login, service_id, fonction_id } =
    req.body;

  try {
    const result = await Agent.updateAgentById(
      id,
      prenom,
      nom,
      tel_number,
      mail,
      login,
      service_id,
      fonction_id
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Agent non trouvé" });
    } else {
      res.status(200).json({ message: "Agent mis à jour avec succès" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour de l'agent: " + error.message,
    });
  }
};

console.log("JWT_SECRET:", process.env.JWT_SECRET);

module.exports = {
  login,
  createAgent,
  getAllAgents,
  deleteAgent,
  updateAgent,
};
