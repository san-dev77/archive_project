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

    // Récupérer le profil de l'agent
    const [profilRows] = await pool.execute(
      `SELECT agent_profil.profil_id, profil.nom_profil 
       FROM agent_profil 
       JOIN profil ON agent_profil.profil_id = profil.id
       WHERE agent_profil.agent_id = ?`,
      [agent.id]
    );

    let profilName = null;
    if (profilRows.length > 0) {
      profilName = profilRows[0].nom_profil;
      console.log(profilName);
    } else {
      return {
        alert:
          "Aucun profil trouvé pour cet agent. Veuillez contacter l'administrateur.",
      };
    }

    // Récupérer les permissions du profil
    const [permissionsRows] = await pool.execute(
      `SELECT permissions.section, permissions.action 
       FROM profil_permissions 
       JOIN permissions ON profil_permissions.permission_id = permissions.id
       WHERE profil_permissions.profil_id = ?`,
      [profilRows[0].profil_id]
    );

    const permissions = permissionsRows.map((row) => ({
      section: row.section,
      action: row.action,
    }));

    // Récupérer le rôle et le service de l'agent
    const [roleServiceRows] = await pool.execute(
      `SELECT role.nom_role, service_directories.nom_service, agents.service_id 
       FROM agents 
       LEFT JOIN role ON agents.fonction_id = role.id
       LEFT JOIN service_directories ON agents.service_id = service_directories.id
       WHERE agents.id = ?`,
      [agent.id]
    );
    console.log("rows", roleServiceRows);

    const { nom_role, nom_service, service_id } = roleServiceRows[0];


    const token = jwt.sign(
      { id: agent.id, login: agent.login },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );



    // Retourner le token, le nom du profil, les permissions, le nom, le prénom, le rôle, le service et l'ID du service

    console.log(agent.prenom, agent.nom);

    return {
      token,
      profilName,
      permissions,
      firstName: agent.prenom,
      lastName: agent.nom,
      role: nom_role,
      service: nom_service,
      serviceId: service_id,
    };
  } catch (error) {
    return {
      error: "Erreur lors de la connexion de l'agent: " + error.message,
    };
  }
};

// Middleware pour vérifier le token JWT
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Obtenir la liste de tous les agents
const getAllAgents = async () => {
  try {
    const [rows] = await pool.execute(`
      SELECT agents.*, service_directories.nom_service, role.nom_role 
      FROM agents 
      LEFT JOIN service_directories ON agents.service_id = service_directories.id
      LEFT JOIN role ON agents.fonction_id = role.id
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

// Get agent by login
// const getAgentByLogin = async (login) => {
//   const [rows] = await pool.execute("SELECT * FROM agents WHERE login = ?", [
//     login,
//   ]);

//   if (rows.length === 0) {
//     throw new Error("Agent not found");
//   }

//   const agent = rows[0];
//   console.log("agent", agent);

//   // Récupérer le profil de l'agent
//   const [profilRows] = await pool.execute(
//     `SELECT profil_id 
//      FROM agent_profil 
//      WHERE agent_id = ?`,
//     [agent.id]
//   );

//   if (profilRows.length === 0) {
//     throw new Error("Profil not found for the agent");
//   }
//   const profilId = profilRows[0].profil_id;

//   // Récupérer les permissions du profil
//   const [permissionsRows] = await pool.execute(
//     `SELECT permissions.section, permissions.action 
//      FROM profil_permissions 
//      JOIN permissions ON profil_permissions.permission_id = permissions.id
//      WHERE profil_permissions.profil_id = ?`,
//     [profilId]
//   );

//   const permissions = permissionsRows.map((row) => ({
//     section: row.section,
//     action: row.action,
//   }));

//   // Retourner l'agent avec son profilId et ses permissions
//   console.log("true a", agent);

//   return { ...agent, profilId, permissions };
// };

// Get agent role by login
// const getAgentRoleByLogin = async (login) => {
//   const [rows] = await pool.execute(
//     `SELECT role.nom_role 
//      FROM agents 
//      LEFT JOIN role ON agents.fonction_id = role.id 
//      WHERE agents.login = ?
//      `,
//     [login]
//   );
//   if (rows.length === 0) {
//     throw new Error("Agent not found");
//   }
//   const role = rows[0].nom_role;
//   const isAdmin = role.trim().toLowerCase() === "admin";

//   return { role, isAdmin };
// };

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

module.exports = {
  // getAgentByLogin,
  // getAgentRoleByLogin,
  insertAgent,
  getAllAgents,
  deleteAgentById,
  updateAgentById,
  loginAgent,
  authenticateToken,
};
