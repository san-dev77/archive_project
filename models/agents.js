const pool = require("../config/database");
const jwt = require("jsonwebtoken");

// Insérer un nouvel agent dans la table agents
const insertAgent = async (
  firstName,
  lastName,
  phone,
  email,
  login,
  password,
  service,
  fonction_id
) => {
  try {
    const [result] = await pool.execute(
      "INSERT INTO agents (nom, prenom, tel_number, mail, login, password, service_id, fonction_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [lastName, firstName, phone, email, login, password, service, fonction_id]
    );
    return { insertId: result.insertId };
  } catch (error) {
    throw new Error("Erreur lors de l'insertion de l'agent: " + error.message);
  }
};

// Connexion d'un agent
const loginAgent = async (login, password) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM agents WHERE login = ?", [
      login,
    ]);
    if (rows.length === 0) {
      return { error: "Agent not found" };
    }

    const agent = rows[0];
    console.log(agent);

    if (agent.password !== password) {
      return { error: "Invalid password" };
    }

    // Récupérer le profil et les actions de l'agent
    const [profilActionRows] = await pool.execute(
      `SELECT 
        agent_profil.profil_id,
        profil.nom_profil,
        profil.description as profil_description,
        permissions.id as permission_id,
        permissions.section,
        permissions.action
      FROM agent_profil 
      JOIN profil ON agent_profil.profil_id = profil.id
      LEFT JOIN profil_permissions ON profil.id = profil_permissions.profil_id
      LEFT JOIN permissions ON profil_permissions.permission_id = permissions.id
      WHERE agent_profil.agent_id = ?`,
      [agent.id]
    );

    if (profilActionRows.length === 0) {
      return {
        alert: "Aucun profil trouvé pour cet agent. Veuillez contacter l'administrateur."
      };
    }

    const profilName = profilActionRows[0].nom_profil;
    const profilDescription = profilActionRows[0].profil_description;
    console.log(profilName);

    // Organiser les permissions
    const permissions = profilActionRows
      .filter(row => row.permission_id) // Filtrer les lignes avec des permissions
      .map(row => ({
        id: row.permission_id,
        section: row.section,
        action: row.action
      }));

    // Récupérer le rôle et le service de l'agent
    const [roleServiceRows] = await pool.execute(
      `SELECT role.nom_role, service_directories.nom_service, service_directories.directory_id, agents.created_at, agents.service_id, agents.tel_number, agents.mail 
       FROM agents 
       LEFT JOIN role ON agents.fonction_id = role.id
       LEFT JOIN service_directories ON agents.service_id = service_directories.id
       WHERE agents.id = ?`,
      [agent.id]
    );
    console.log("rows", roleServiceRows);

    const { nom_role, created_at, nom_service, service_id, tel_number, mail, directory_id } = roleServiceRows[0];

    const token = jwt.sign(
      { id: agent.id, login: agent.login },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Enregistrer l'ID de l'agent dans la table connections
    await pool.execute(
      "INSERT INTO connections (user_id) VALUES (?)",
      [agent.id]
    );

    console.log("test", agent.id);

    const response = {
      token,
      id_user: agent.id,
      profilName,
      profilDescription,
      permissions,
      firstName: agent.prenom,
      lastName: agent.nom,
      role: nom_role,
      service: nom_service,
      serviceId: service_id,
      created_at: created_at,
      directoryId: null,
      tel_number,
      mail,
    };

    // Ajouter directory_id seulement si le rôle est "agent"
    if (nom_role === "agent") {
      response.directoryId = directory_id;
    }
    console.log("response", response);


    return response;

  } catch (error) {
    return {
      error: "Erreur lors de la connexion de l'agent: " + error.message,
    };
  }
};

// Middleware pour vérifier le token JWT
const authenticateToken = (req, res, next) => {
  console.log(req);

  const authHeader = req.headers.authorization;  // Vérifier que l'en-tête est bien là
  if (!authHeader) {
    return res.sendStatus(401);  // Si aucun header trouvé
  }

  const token = authHeader.split(" ")[1];  // Extraire le token après "Bearer "
  if (!token) {
    return res.sendStatus(401);  // Si aucun token n'a été trouvé
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);  // Token invalide
    }
    req.user = user;  // Ajouter les informations utilisateur au req
    next();  // Passer à la suite
  });
};


// Obtenir la liste de tous les agents
const getAllAgents = async () => {
  try {
    const [rows] = await pool.execute(`
      SELECT agents.*, service_directories.nom_service, role.nom_role, profil.nom_profil
      FROM agents 
      LEFT JOIN service_directories ON agents.service_id = service_directories.id
      LEFT JOIN role ON agents.fonction_id = role.id
      LEFT JOIN agent_profil ON agents.id = agent_profil.agent_id
      LEFT JOIN profil ON agent_profil.profil_id = profil.id
    `);
    return rows;
  } catch (error) {
    throw new Error("Erreur lors de la récupération de la liste des agents");
  }
};

// Supprimer un agent par son ID
const deleteAgentById = async (id) => {
  try {
    const [result] = await pool.execute("DELETE FROM agents WHERE id = ?", [
      id,
    ]);
    return result;
  } catch (error) {
    throw new Error("Erreur lors de la suppression de l'agent" + error.message);
  }
};


// Mettre à jour un agent par son ID
const updateAgentById = async (
  id,
  prenom,
  nom,
  tel_number,
  mail,
  login,
  service_id,
  fonction_id
) => {
  try {
    const [result] = await pool.execute(
      `UPDATE agents 
       SET prenom = ?, nom = ?, tel_number = ?, mail = ?, login = ?, service_id = ?, fonction_id = ? 
       WHERE id = ?`,
      [prenom, nom, tel_number, mail, login, service_id, fonction_id, id]
    );
    return result;
  } catch (error) {
    throw new Error(
      "Erreur lors de la mise à jour de l'agent: " + error.message
    );
  }
};

const getAgentsWithoutProfile = async () => {
  try {
    const [rows] = await pool.execute(
      `SELECT COUNT(a.id) as count
       FROM agents a
       LEFT JOIN agent_profil ap ON a.id = ap.agent_id 
       WHERE ap.profil_id IS NULL`
    );
    return rows[0].count;
  } catch (error) {
    throw new Error("Erreur lors du comptage des agents sans profil: " + error.message);
  }
};


const getAgentsWithNoProfile = async () => {
  try {
    const [rows] = await pool.execute(
      `SELECT 
        a.id,
        a.prenom,
        a.nom, 
        a.tel_number,
        a.mail,
        a.login,
        a.created_at,
        s.nom_service as nom_service,
        r.nom_role as nom_role
       FROM agents a
       LEFT JOIN agent_profil ap ON a.id = ap.agent_id
       LEFT JOIN service_directories s ON a.service_id = s.id 
       LEFT JOIN role r ON a.fonction_id = r.id
       WHERE ap.profil_id IS NULL`
    );
    return rows;
  } catch (error) {
    throw new Error("Erreur lors de la récupération des agents sans profil: " + error.message);
  }
};


const getAgentsByDirectoryId = async (directoryId) => {
  try {
    if (!directoryId) {
      throw new Error("L'ID de la direction est requis");
    }

    const [rows] = await pool.execute(
      `SELECT 
        a.id,
        a.prenom,
        a.nom,
        a.tel_number,
        a.mail,
        a.fonction_id,
        a.login,
        a.password,
        a.created_at,
        a.service_id,
        s.nom_service,
        r.nom_role
      FROM agents a
      JOIN service_directories s ON a.service_id = s.id
      LEFT JOIN role r ON a.fonction_id = r.id
      WHERE s.directory_id = ?`,
      [directoryId]
    );

    return rows;
  } catch (error) {
    throw new Error("Erreur lors de la récupération des agents par direction: " + error.message);
  }
};

const getAgentByPhoneNumber = async (tel_number) => {
  try {
    if (!tel_number) {
      throw new Error("Le numéro de téléphone est requis");
    }

    const [rows] = await pool.execute(
      `SELECT 
        a.id,
        a.prenom,
        a.nom,
        a.tel_number,
        a.mail,
        a.fonction_id,
        a.login,
        a.password,
        a.created_at,
        a.service_id,
        s.nom_service,
        r.nom_role,
        d.nom_directory
      FROM agents a
      LEFT JOIN service_directories s ON a.service_id = s.id
      LEFT JOIN role r ON a.fonction_id = r.id
      LEFT JOIN directories d ON s.directory_id = d.id
      WHERE a.tel_number = ?`,
      [tel_number]
    );

    if (rows.length === 0) {
      throw new Error("Numéro de téléphone non trouvé");
    }

    return rows[0];
  } catch (error) {
    throw new Error("Erreur lors de la récupération de l'agent par numéro de téléphone: " + error.message);
  }
};

const resetAgentPassword = async (tel_number, new_password) => {
  try {
    if (!tel_number || !new_password) {
      throw new Error("Le numéro de téléphone et le nouveau mot de passe sont requis");
    }

    const [result] = await pool.execute(
      `UPDATE agents SET password = ? WHERE tel_number = ?`,
      [new_password, tel_number]
    );

    if (result.affectedRows === 0) {
      throw new Error("Numéro de téléphone non trouvé");
    }

    return { message: "Mot de passe mis à jour avec succès" };
  } catch (error) {
    throw new Error("Erreur lors de la réinitialisation du mot de passe: " + error.message);
  }
};






module.exports = {
  // getAgentByLogin,
  // getAgentRoleByLogin,
  insertAgent,
  getAllAgents,
  deleteAgentById,
  updateAgentById,
  loginAgent,
  authenticateToken,
  getAgentsWithoutProfile,
  getAgentsWithNoProfile,
  getAgentsByDirectoryId,
  getAgentByPhoneNumber,
  resetAgentPassword,

};
