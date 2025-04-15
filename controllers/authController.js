const Agent = require("../models/agents");

const login = async (req, res) => {
  console.log("Requête de connexion reçue:", req.body);
  const { login, password } = req.body;

  try {
    // Utiliser la méthode loginAgent pour obtenir le token, le profil et les permissions
    const result = await Agent.loginAgent(login, password);

    if (result.error) {
      return res.status(401).json({ message: result.error });
    }

    if (result.alert) {
      return res.status(403).json({ message: result.alert });
    }

    const {
      token,
      profilName,
      permissions,
      firstName,
      lastName,
      role,
      service,
      serviceId,
      mail,
      id_user,
      directoryId,
      tel_number,
      created_at,
    } = result;

    // Envoyer la réponse avec le token, le profil et les permissions
    console.log("role", role, lastName, firstName);

    res.status(200).json({
      token,
      profilName,
      permissions,
      firstName,
      lastName,
      role,
      id_user,
      service,
      serviceId,
      directoryId,
      mail,
      login,
      password,
      tel_number,
      created_at,
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


const getAgentsWithoutProfileController = async (req, res) => {
  try {
    const count = await Agent.getAgentsWithoutProfile();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors du comptage des agents sans profil: " + error.message,
    });
  }
};





const getAgentsWithNoProfileController = async (req, res) => {
  try {
    const agents = await Agent.getAgentsWithNoProfile();
    res.status(200).json(agents);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des agents sans profil: " + error.message,
    });
  }
};
const getAgentsWithDirDataController = async (req, res) => {
  try {
    const directoryId = req.params.directoryId
    const agents = await Agent.getAgentsByDirectoryId(directoryId);
    res.status(200).json(agents);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des agents sans profil: " + error.message,
    });
  }
};


const getAgentByPhoneNumberController = async (req, res) => {
  try {
    let tel_number = req.params.phoneNumber;
    tel_number = tel_number.trim(); // Remove spaces
    const agent = await Agent.getAgentByPhoneNumber(tel_number);
    res.status(200).json({ exist: true, agent });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération de l'agent par numéro de téléphone: " + error.message,
    });
  }
};


const resetAgentPasswordController = async (req, res) => {
  try {
    const { tel_number, new_password } = req.body;
    const result = await Agent.resetAgentPassword(tel_number, new_password);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la réinitialisation du mot de passe: " + error.message,
    });
  }
};




module.exports = {
  login,
  createAgent,
  getAllAgents,
  deleteAgent,
  updateAgent,
  getAgentsWithoutProfileController,
  getAgentsWithNoProfileController,
  getAgentsWithDirDataController,
  getAgentByPhoneNumberController,
  resetAgentPasswordController,
};
