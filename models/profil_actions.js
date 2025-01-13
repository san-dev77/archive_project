const pool = require("../config/database");

const actionTranslations = {
  services: {
    voir: "view",
    modifier: "edit",
    supprimer: "delete",
  },
  types_documents: {
    voir: "view",
    modifier: "edit",
    supprimer: "delete",
  },
  pieces: {
    voir: "view",
    modifier: "edit",
    supprimer: "delete",
  },
  metadata: {
    voir: "view",
    modifier: "edit",
    supprimer: "delete",
  },
  documents: {
    voir: "view",
    modifier: "edit",
    supprimer: "delete",
  },
};

// const translateActions = (actions) => {
//   console.log(actions);
//   return actions.map((actionObj) => {
//     const [section, actionEn] = actionObj.action.split(":");
//     console.log("section et actionEN",section, actionEn);
//     if (!section || !actionEn) {
//       throw new Error(`Format d'action incorrect: ${actionObj.action}`);
//     }
//     console.log(actionTranslations[section]);
//     const actionFr = Object.keys(actionTranslations[section]).find(
//       (key) => actionTranslations[section][key] === actionEn
//     );
//     if (!actionFr) {
//       throw new Error(`Action inconnue: ${actionObj.action}`);
//     }

//     return { section, action: actionEn };
//   });
// };

const translateActionInString = (actionString) => {
  console.log("actionString", actionString);
  const translations = {
    afficher: 'view',
    modifier: 'edit',
    supprimer: 'delete'
  };

  // Remplacer le mot français par l'anglais dans la chaîne
  for (const [fr, en] of Object.entries(translations)) {
    if (actionString.includes(fr)) {
      return actionString.replace(fr, en);
    }
  }
  console.log("actionString", actionString);
  return actionString; // Retourne la chaîne originale si aucune traduction n'est trouvée
};

const linkProfilToActions = async (profilId, newActions) => {
  console.log("Début de la mise à jour des actions pour le profil:", profilId);
  console.log("Nouvelles actions reçues:", newActions);
  
  try {
    // Récupérer les actions existantes pour le profil
    const [existingActions] = await pool.execute(
      "SELECT permission_id FROM profil_permissions WHERE profil_id = 2;",
      [profilId]
    );
    const existingActionIds = existingActions.length > 0 
      ? existingActions.map((action) => action.permission_id) 
      : [];
    console.log("Actions existantes pour le profil:", existingActionIds);

    // Récupérer les IDs des actions fournies
    const [permissions] = await pool.execute(
      "SELECT id, section, action FROM permissions"
    );
    console.log("Permissions disponibles:", permissions);

    const actionIds = newActions.map((action) => {
      console.log("Traitement de l'action:", action);

      // Extraire la section et l'action de la chaîne
      const [section, actionName] = action.action.split(':');

      // Vérifiez que la section et l'action sont bien définies
      if (!section || !actionName) {
        console.error("Action mal formée:", action);
        throw new Error(`Action mal formée: ${JSON.stringify(action)}`);
      }

      // Traduire l'action dans la chaîne si nécessaire
      const translatedActionString = translateActionInString(actionName);

      const permission = permissions.find(
        (perm) => perm.section === section && perm.action === translatedActionString
      );
      if (!permission) {
        console.error(`Permission non trouvée pour l'action: ${section}:${translatedActionString}`);
        throw new Error(`Permission non trouvée pour l'action: ${section}:${translatedActionString}`);
      }
      return permission.id;
    });
    console.log("IDs des nouvelles actions:", actionIds);

    // Déterminer les actions à ajouter et à supprimer
    const actionsToAdd = actionIds.filter(
      (actionId) => !existingActionIds.includes(actionId)
    );
    const actionsToRemove = existingActionIds.filter(
      (actionId) => !actionIds.includes(actionId)
    );
    console.log("Actions à ajouter:", actionsToAdd);
    console.log("Actions à supprimer:", actionsToRemove);

    // Ajouter les nouvelles actions
    const addPromises = actionsToAdd.map((actionId) => {
      console.log(`Ajout de l'action ID: ${actionId} au profil ID: ${profilId}`);
      return pool.execute(
        "INSERT INTO profil_permissions (profil_id, permission_id) VALUES (?, ?)",
        [profilId, actionId]
      );
    });

    // Supprimer les actions qui ne sont plus nécessaires
    const removePromises = actionsToRemove.map((actionId) => {
      console.log(`Suppression de l'action ID: ${actionId} du profil ID: ${profilId}`);
      return pool.execute(
        "DELETE FROM profil_permissions WHERE profil_id = ? AND permission_id = ?",
        [profilId, actionId]
      );
    });

    await Promise.all([...addPromises, ...removePromises]);
    console.log("Mise à jour des actions terminée avec succès pour le profil:", profilId);
    return { message: "Actions mises à jour avec succès pour le profil" };
  } catch (error) {
    console.error("Erreur lors de la mise à jour des actions pour le profil:", error.message);
    throw new Error(
      "Erreur lors de la mise à jour des actions pour le profil: " +
        error.message
    );
  }
};

const getAllProfilActions = async () => {
  try {
    const [rows] = await pool.execute(`
      SELECT pa.profil_id, p.nom_profil, pa.permission_id, a.section, a.action
      FROM profil_permissions pa
      JOIN profil p ON pa.profil_id = p.id
      JOIN permissions a ON pa.permission_id = a.id
    `);
    return rows;
  } catch (error) {
    throw new Error(
      "Erreur lors de la récupération des relations profil-actions: " +
        error.message
    );
  }
};

const getProfilActions = async (profilId) => {
  try {
    const [rows] = await pool.execute(`
      SELECT pa.permission_id, p.section, p.action
      FROM profil_permissions pa
      JOIN permissions p ON pa.permission_id = p.id
      WHERE pa.profil_id = ?
      ORDER BY p.section, p.action
    `, [profilId]);
    return rows;
  } catch (error) {
    throw new Error(
      "Erreur lors de la récupération des actions du profil: " + error.message
    );
  }
};


const getPermissions = async () => {
  try {
    const [rows] = await pool.execute(`
      SELECT id, section, action
      FROM permissions
      ORDER BY section, action
    `);
    return rows;
  } catch (error) {
    throw new Error(
      "Erreur lors de la récupération des permissions: " + error.message
    );
  }
};


const deleteProfilAction = async (profilId, permissionId) => {
  try {
    const [result] = await pool.execute(`
      DELETE FROM profil_permissions
      WHERE profil_id = ? AND permission_id = ?
    `, [profilId, permissionId]);

    if (result.affectedRows === 0) {
      throw new Error("Aucune action n'a été supprimée. Vérifiez les identifiants fournis.");
    }

    return { success: true, message: "L'action a été supprimée avec succès du profil." };
  } catch (error) {
    throw new Error(
      "Erreur lors de la suppression de l'action du profil: " + error.message
    );
  }
};


const translateAction = (actionFr) => {
  console.log("actionFr text", actionFr);
  const translations = {
    afficher: 'view',
    modifier: 'edit',
    supprimer: 'delete'
  };
  console.log("translations", translations);
  return translations[actionFr] || actionFr;
};

module.exports = {
  linkProfilToActions,
  getAllProfilActions,
  getPermissions,
  getProfilActions,
  deleteProfilAction  
};
