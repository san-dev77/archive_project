const mysql = require("mysql2/promise");
const { createLogger, format, transports } = require("winston");

const { createDirectorycompplete } = require("../../folder_maker/tree_maker");

const path = require("path");

// Configurer le logging
const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} - ${level}: ${message}`;
    })
  ),
  transports: [
    new transports.File({ filename: "import_csv_agence.log" }),
    new transports.Console(),
  ],
});

// Fonction pour tester la connexion à la base de données
async function testDbConnection(dbUrl) {
  logger.info(
    `Tentative de connexion à la base de données avec l'URL: ${dbUrl}`
  );
  const connection = await mysql.createConnection(dbUrl);
  logger.info("Connexion à la base de données réussie.");
  return connection;
}

// Fonction pour obtenir ou créer l'ID de l'agence
async function getOrCreateAgenceId(connection, code_agence, nom_agence) {
  if (!code_agence || !nom_agence) {
    logger.warn(
      "Valeur manquante pour code_agence ou nom_agence, aucune action effectuée."
    );
    return null;
  }

  const [result] = await connection.query(
    "SELECT id FROM agence WHERE code_agence = ? AND nom_agence = ?",
    [code_agence, nom_agence]
  );

  if (result.length > 0) {
    logger.info(
      `L'agence ${nom_agence} avec le code ${code_agence} existe déjà avec l'ID ${result[0].id}`
    );
    //pour créer un repertoire pour chaque agence
    //et ne surtout pas toucher au await
    const dirPath = path.join(
      __dirname,
      "../..",
      "Agence_tree",
      "journée de guichet"
    );

    await createDirectorycompplete(dirPath, nom_agence); // Appel de la méthode avec le nom de l'agence

    return result[0].id;
  } else {
    await connection.query(
      "INSERT INTO agence (code_agence, nom_agence) VALUES (?, ?)",
      [code_agence, nom_agence]
    );

    //pour créer un repertoire pour chaque agence
    //et ne surtout pas toucher au await
    const dirPath = path.join(
      __dirname,
      "../..",
      "Agence_tree",
      "journée de guichet"
    );

    await createDirectorycompplete(dirPath, nom_agence); // Appel de la méthode avec le nom de l'agence

    const [newResult] = await connection.query(
      "SELECT id FROM agence WHERE code_agence = ? AND nom_agence = ?",
      [code_agence, nom_agence]
    );
    logger.info(
      `L'agence ${nom_agence} avec le code ${code_agence} a été ajoutée avec l'ID ${newResult[0].id}`
    );

    return newResult[0].id;
  }
}

// Fonction pour obtenir ou créer l'ID du guichet

// Fonction pour insérer des données avec réessai
async function insertDataWithRetry(connection, data) {
  const maxRetries = 5; // Nombre maximum de tentatives
  let attempt = 0;
  let totalInserted = 0;

  while (attempt < maxRetries) {
    try {
      logger.info(`Tentative d'insertion des données, essai ${attempt + 1}`);
      totalInserted = await insertData(connection, data); // Appel de la fonction d'insertion
      logger.info(`Total de lignes insérées: ${totalInserted}`);
      break; // Sortir de la boucle si l'insertion réussit
    } catch (error) {
      logger.error(`Erreur lors de l'insertion des données: ${error.message}`);
      attempt++;
      if (attempt === maxRetries) {
        logger.error("Nombre maximum de tentatives atteint. Arrêt du script.");
        throw error; // Relancer l'erreur après plusieurs tentatives
      }
      logger.info("Réessai dans 5 secondes...");
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Attendre 5 secondes avant de réessayer
    }
  }
}

// Fonction pour insérer des données
async function insertData(connection, data) {
  let totalInserted = 0; // Compteur pour les lignes insérées
  try {
    logger.info("Début de l'insertion des données.");
    logger.info(`Nombre total de lignes à insérer: ${data.length}`); // Log du nombre total de lignes
    const batchSize = 1000; // Taille du lot modifiée à 1000
    const batches = []; // Tableau pour stocker les lots

    // Découper les données en plusieurs tableaux de 1000 lignes
    for (let i = 0; i < data.length; i += batchSize) {
      batches.push(data.slice(i, i + batchSize));
    }

    // Insérer chaque tableau successivement
    for (const batch of batches) {
      logger.info(`Traitement d'un lot de ${batch.length} lignes.`);
      await connection.beginTransaction(); // Démarrer une transaction
      try {
        for (const row of batch) {
          logger.info(`Ligne en cours: ${JSON.stringify(row)}`);
          const codeAgence = row["CODE_AGENCE"];
          if (!codeAgence) {
            logger.warn(
              `Ligne ignorée : code_agence est vide pour la ligne ${JSON.stringify(
                row
              )}`
            );
            continue; // Ignorez cette ligne
          }

          const code_agence = row["CODE_AGENCE"];
          const agence = row["AGENCE"];
          const nom_prenom_caissier =
            row["NOM_ET_PRENOM_DU_CAISSIER"] || "Non rensigné"; // Utiliser null si vide
          const type_de_journee = row["TYPE_DE_JOURNEE"];
          //   const code_guichet = row["CODE_GUICHET"];
          const code_boite = row["CODE_BOITE"];
          const date = row["DATE"];

          // Insérer ou obtenir l'ID de l'agence
          const agenceID = await getOrCreateAgenceId(
            connection,
            code_agence,
            agence
          );

          // Insérer ou obtenir l'ID du type de journée
          const [typeJourneeResult] = await connection.query(
            "SELECT id FROM document_type WHERE nom_document_type = ?",
            [type_de_journee]
          );

          if (typeJourneeResult.length === 0) {
            logger.error(`Type de journée non trouvé pour: ${type_de_journee}`);
            throw new Error(`Type de journée non trouvé: ${type_de_journee}`);
          }

          const typeJourneeID = typeJourneeResult[0].id; // Assurez-vous que cela ne génère pas d'erreur

          // Insérer ou obtenir l'ID de la caisse

          // Insérer les données dans transaction_dossiers
          await connection.query(
            `
            INSERT INTO transaction_guichet (agence_id, document_type_id, dates, nom_prenom_caissier, code_boite)
            VALUES (?, ?, ?, ?, ?)`,
            [
              agenceID,
              typeJourneeID,
              date,
              nom_prenom_caissier, // Insérer null si vide
              code_boite,
            ]
          );

          logger.info(`Ligne insérée avec succès: ${JSON.stringify(row)}`);
        }
        await connection.commit(); // Valider la transaction
      } catch (error) {
        await connection.rollback(); // Annuler la transaction en cas d'erreur
        logger.error(`Erreur lors de l'insertion du lot: ${error.message}`);
      }
      totalInserted += batch.length; // Compter les lignes insérées
    }
  } catch (error) {
    logger.error(`Erreur lors de l'insertion des données: ${error.message}`);
  }
  return totalInserted; // Retourner le nombre total de lignes insérées
}

// Fonction principale pour importer les données
async function importDataGuichet(data, dbUrl, lineCount) {
  const connection = await testDbConnection(dbUrl);

  // Vérifier si data est un objet et le convertir en tableau
  const limitedData = Array.isArray(data) ? data.slice(0, lineCount) : [data]; // Convertir en tableau si ce n'est pas déjà un tableau

  await insertDataWithRetry(connection, limitedData); // Passer les données limitées
  await connection.end();
}

// Exporter les fonctions
module.exports = { importDataGuichet };
