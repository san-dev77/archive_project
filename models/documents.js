const db = require("../config/database");
const fs = require("fs");

const createDocumentInDB = async ({ documentTypeId, createdAt }) => {
  if (!documentTypeId) {
    throw new Error("documentTypeId is required");
  }
  const [result] = await db.query(
    "INSERT INTO documents (document_type_id, created_at) VALUES (?, ?)",
    [documentTypeId, createdAt]
  );
  return result.insertId;
};

const addDocumentMetadata = async (documentId, metadata) => {
  if (!documentId || !metadata) {
    throw new Error("documentId and metadata are required");
  }

  // Transform metadata object into an array of arrays for the SQL query
  const values = Object.keys(metadata)
    .map((metadataId) => [documentId, metadataId, metadata[metadataId]])
    .filter(([, metadataId, value]) => metadataId && value);

  if (values.length === 0) {
    throw new Error("No valid metadata to insert");
  }

  await db.query(
    "INSERT INTO document_metadata (document_id, metadata_id, value) VALUES ?",
    [values]
  );
};

const addDocumentLot = async ({ document_id, file_names }) => {
  // Ajout de 'files' dans les paramètres
  if (!document_id || !file_names || file_names.length === 0) {
    throw new Error("document_id and pieces are required");
  }

  // Prépare les valeurs pour l'insertion
  const values = file_names.map((file) => [document_id, file.name]);

  // Exécute la requête d'insertion
  await db.query("INSERT INTO document_lot (document_id, files) VALUES ?", [
    values,
  ]);
};
const addDocumentPieces = async ({ document_id, piece_id, fileNames }) => {
  console.log("done");

  // Prépare les valeurs pour l'insertion
  const values = fileNames.map((_piece, index) => [
    document_id,
    piece_id, // Utilise 'piece_id' de la structure envoyée par le controller
    fileNames[index], // Associe le nom de fichier correspondant
  ]);

  // Exécute la requête d'insertion
  await db.query(
    "INSERT INTO document_pieces (document_id, piece_id, file_path) VALUES ?",
    [values]
  );

  // Note: Le tableau 'files' n'est pas utilisé ici, mais il est inclus dans les paramètres
};

const getAllDocumentsFromDB = async () => {
  const query = `
    SELECT d.id, d.created_at, dt.name AS documentTypeName
    FROM documents d
    JOIN DocumentTypes2 dt ON d.document_type_id = dt.id
  `;
  const [documents] = await db.query(query);
  return documents;
};

const getDocumentByIdFromDB = async (id) => {
  if (!id) {
    throw new Error("id is required");
  }

  // Obtenir les détails du document
  const [document] = await db.query("SELECT * FROM documents WHERE id = ?", [
    id,
  ]);
  if (!document.length) {
    throw new Error("Document not found");
  }

  // Obtenir les détails du type de document
  const [documentType] = await db.query(
    "SELECT name FROM DocumentTypes2 WHERE id = ?",
    [document[0].document_type_id]
  );

  // Obtenez les metadata avec les noms
  const [metadataResults] = await db.query(
    `SELECT m.cle, dm.value
     FROM document_metadata dm
     JOIN metadata m ON dm.metadata_id = m.id
     WHERE dm.document_id = ?`,
    [id]
  );

  // Obtenez les pièces
  const [fileResults] = await db.query(
    "SELECT * FROM document_pieces WHERE document_id = ?",
    [id]
  );

  return {
    ...document[0],
    documentType: documentType[0]
      ? documentType[0].name
      : "Type de document inconnu",
    metadata: metadataResults,
    files: fileResults.length ? fileResults : "Aucune pièce disponible",
  };
};

const getAllDocumentsFromDB2 = async () => {
  // Obtenez tous les documents
  const [documentRows] = await db.query("SELECT * FROM documents");

  // Créez un tableau pour stocker les documents avec leurs détails
  const documentsWithDetails = await Promise.all(
    documentRows.map(async (document) => {
      // Obtenez les détails du type de document
      const [documentTypeRows] = await db.query(
        "SELECT name FROM DocumentTypes2 WHERE id = ?",
        [document.document_type_id]
      );
      const documentTypeName =
        documentTypeRows.length > 0
          ? documentTypeRows[0].name
          : "Type de document inconnu";

      // Obtenez les métadonnées associées
      const [metadataResults] = await db.query(
        `
      SELECT m.cle, dm.value
      FROM document_metadata dm
      JOIN metadata m ON dm.metadata_id = m.id
      WHERE dm.document_id = ?
    `,
        [document.id]
      );

      // Obtenez les pièces associées
      const [fileResults] = await db.query(
        "SELECT * FROM document_pieces WHERE document_id = ?",
        [document.id]
      );

      return {
        ...document,
        documentType: documentTypeName,
        metadata:
          metadataResults.length > 0
            ? metadataResults
            : "Aucune metadonnée présente",
        files: fileResults.length > 0 ? fileResults : "Aucune pièce disponible",
      };
    })
  );

  return documentsWithDetails;
};

const getAllDocumentsFromDB3 = async () => {
  // Obtenez tous les documents
  const [documentRows] = await db.query("SELECT * FROM documents");

  // Créez un tableau pour stocker les documents avec leurs détails
  const documentsWithDetails = await Promise.all(
    documentRows.map(async (document) => {
      // Obtenez les détails du type de document, y compris le nom et le code du service associé
      const [documentTypeRows] = await db.query(
        `
        SELECT dt.name AS documentTypeName, s.code AS serviceCode, s.nom_service AS serviceNom
        FROM DocumentTypes2 dt
        LEFT JOIN services s ON dt.serviceId = s.id
        WHERE dt.id = ?
      `,
        [document.document_type_id]
      );

      const documentTypeName =
        documentTypeRows.length > 0
          ? documentTypeRows[0].documentTypeName
          : "Type de document inconnu";

      const serviceCode =
        documentTypeRows.length > 0 ? documentTypeRows[0].serviceCode : null;

      const serviceNom =
        documentTypeRows.length > 0 ? documentTypeRows[0].serviceNom : null;

      // Obtenez les métadonnées associées
      const [metadataResults] = await db.query(
        `
        SELECT m.cle, dm.value
        FROM document_metadata dm
        JOIN metadata m ON dm.metadata_id = m.id
        WHERE dm.document_id = ?
      `,
        [document.id]
      );

      // Obtenez les pièces associées
      const [fileResults] = await db.query(
        "SELECT * FROM document_pieces WHERE document_id = ?",
        [document.id]
      );

      return {
        ...document,
        documentType: documentTypeName,
        serviceCode: serviceCode, // Ajout du code du service
        serviceNom: serviceNom, // Ajout du nom du service
        metadata:
          metadataResults.length > 0
            ? metadataResults
            : "Aucune metadonnée présente",
        files: fileResults.length > 0 ? fileResults : "Aucune pièce disponible",
      };
    })
  );

  return documentsWithDetails;
};
const getAllDocumentsFromDB4 = async (documentTypeId) => {
  if (!documentTypeId) {
    throw new Error("documentTypeId is required");
  }

  // Obtenez tous les documents du type spécifié
  const [documentRows] = await db.query(
    "SELECT * FROM documents WHERE document_type_id = ?",
    [documentTypeId]
  );

  // Créez un tableau pour stocker les documents avec leurs détails
  const documentsWithDetails = await Promise.all(
    documentRows.map(async (document) => {
      // Obtenez les détails du type de document, y compris le nom et le code du service associé
      const [documentTypeRows] = await db.query(
        `
        SELECT dt.name AS documentTypeName, s.code AS serviceCode, s.nom_service AS serviceNom
        FROM DocumentTypes2 dt
        LEFT JOIN service_directories s ON dt.service_id = s.id
        WHERE dt.id = ?
      `,
        [document.document_type_id]
      );

      const documentTypeName =
        documentTypeRows.length > 0
          ? documentTypeRows[0].documentTypeName
          : "Type de document inconnu";

      const serviceCode =
        documentTypeRows.length > 0 ? documentTypeRows[0].serviceCode : null;

      const serviceNom =
        documentTypeRows.length > 0 ? documentTypeRows[0].serviceNom : null;

      // Obtenez les métadonnées associées
      const [metadataResults] = await db.query(
        `
        SELECT m.cle, dm.value
        FROM document_metadata dm
        JOIN metadata m ON dm.metadata_id = m.id
        WHERE dm.document_id = ?
      `,
        [document.id]
      );

      // Obtenez les pièces associées
      const [fileResults] = await db.query(
        "SELECT * FROM document_pieces WHERE document_id = ?",
        [document.id]
      );

      console.log("mon doc pieces", fileResults);

      return {
        ...document,
        documentType: documentTypeName,
        serviceCode: serviceCode, // Ajout du code du service
        serviceNom: serviceNom, // Ajout du nom du service
        metadata:
          metadataResults.length > 0
            ? metadataResults
            : "Aucune metadonnée présente",
        files: fileResults.length > 0 ? fileResults : "Aucune pièce disponible",
      };
    })
  );

  return documentsWithDetails;
};

const updateDocumentInDB = async (id, { documentTypeId }) => {
  if (!id || !documentTypeId) {
    throw new Error("id and documentTypeId are required");
  }
  await db.query("UPDATE documents SET document_type_id = ? WHERE id = ?", [
    documentTypeId,
    id,
  ]);
};

const updateDocumentMetadata = async (id, metadata) => {
  if (!id || !metadata) {
    throw new Error("id and metadata are required");
  }
  const values = metadata
    .map((meta) => [id, meta.id, meta.value])
    .filter(([, metadataId, value]) => metadataId && value);

  if (values.length === 0) {
    throw new Error("No valid metadata to update");
  }

  await db.query(
    "INSERT INTO document_metadata (document_id, metadata_id, value) VALUES ? ON DUPLICATE KEY UPDATE value = VALUES(value)",
    [values]
  );
};

const getDocumentsByTypeFromDBWithLot = async (documentTypeId) => {
  if (!documentTypeId) {
    throw new Error("documentTypeId is required");
  }

  // Requête SQL pour récupérer tous les documents, leurs métadonnées et pièces associées
  const query = `
    SELECT 
      d.id AS documentId,
      d.created_at AS createdAt,
      dt.name AS documentTypeName,
      m.cle AS metadataKey,
      dm.value AS metadataValue,
      dl.files AS filePath
    FROM documents d
    JOIN DocumentTypes2 dt ON d.document_type_id = dt.id
    LEFT JOIN document_metadata dm ON d.id = dm.document_id
    LEFT JOIN metadata m ON dm.metadata_id = m.id
    LEFT JOIN document_lot dl ON d.id = dl.document_id
    WHERE d.document_type_id = ?
    ORDER BY d.created_at DESC;
  `;

  // Exécution de la requête
  const [results] = await db.query(query, [documentTypeId]);

  // Structurer les résultats

  const documents = results.reduce((acc, row) => {
    const {
      documentId,
      createdAt,
      documentTypeName,
      metadataKey,
      metadataValue,
      filePath,
    } = row;

    // Si le document n'existe pas encore dans l'accumulateur, l'ajouter
    if (!acc[documentId]) {
      acc[documentId] = {
        id: documentId,
        created_at: createdAt,
        documentTypeName,
        metadata: {},
        files: [],
      };
    }

    // Ajouter les métadonnées au document
    if (metadataKey && metadataValue) {
      acc[documentId].metadata[metadataKey] = metadataValue;
    }

    // Ajouter le chemin du fichier
    if (filePath) {
      // Construire l'URL complète du fichier
      const fileUrl = `http://localhost:3000/uploads/lot/${filePath}`;

      acc[documentId].files.push({ fileUrl, filePath });
    }

    return acc;
  }, {});

  // Convertir l'objet en tableau
  return Object.values(documents);
};
const getDocumentsByTypeFromDBWithPieces = async (documentTypeId) => {
  if (!documentTypeId) {
    throw new Error("documentTypeId is required");
  }

  // Requête SQL pour récupérer tous les documents, leurs métadonnées et pièces associées
  const query = `
     SELECT 
    d.id AS documentId,
    d.created_at AS createdAt,
    dt.name AS documentTypeName,
    m.cle AS metadataKey,
    dm.value AS metadataValue,
    dp.file_path AS filePath,
    dp.piece_id AS pieceId 
  FROM documents d
  JOIN DocumentTypes2 dt ON d.document_type_id = dt.id
  LEFT JOIN document_metadata dm ON d.id = dm.document_id
  LEFT JOIN metadata m ON dm.metadata_id = m.id
  LEFT JOIN document_pieces dp ON d.id = dp.document_id
  WHERE d.document_type_id = ?
  ORDER BY d.created_at DESC
`;

  // Exécution de la requête
  const [results] = await db.query(query, [documentTypeId]);

  // Utiliser Promise.all pour gérer les requêtes asynchrones
  const documents = await results.reduce(async (accPromise, row) => {
    const acc = await accPromise;

    const {
      documentId,
      createdAt,
      documentTypeName,
      metadataKey,
      metadataValue,
      filePath,
      pieceId,
    } = row;

    // Si le document n'existe pas encore dans l'accumulateur, l'ajouter
    if (!acc[documentId]) {
      acc[documentId] = {
        id: documentId,
        created_at: createdAt,
        documentTypeName,
        metadata: {},
        files: [],
      };
    }

    // Ajouter les métadonnées au document
    if (metadataKey && metadataValue) {
      acc[documentId].metadata[metadataKey] = metadataValue;
    }

    // Ajouter le chemin du fichier et le nom de la pièce
    if (filePath && pieceId) {
      try {
        // Obtenir le nom de la pièce
        const [pieceResult] = await db.query(
          "SELECT nom_piece FROM pieces WHERE id = ?",
          [pieceId]
        );

        const pieceName =
          pieceResult.length > 0
            ? pieceResult[0].nom_piece
            : "Nom de pièce inconnu";
        // Construire l'URL complète du fichier
        const fileUrl = `http://localhost:3000/uploads/pieces/${filePath}`;
        acc[documentId].files.push({ fileUrl, pieceName, filePath });
      } catch (error) {
        console.error(
          "Erreur lors de la récupération du nom de la pièce :",
          error
        );
      }
    }

    return acc;
  }, Promise.resolve({}));

  // Convertir l'objet en tableau
  return Object.values(documents);
};

const updateDocumentPieces = async (id, pieces) => {
  if (!id || !pieces) {
    throw new Error("id and pieces are required");
  }
  const values = pieces.map((piece) => [id, piece.filePath, piece.description]);
  await db.query(
    "INSERT INTO document_pieces (document_id, file_path, description) VALUES ? ON DUPLICATE KEY UPDATE file_path = VALUES(file_path), description = VALUES(description)",
    [values]
  );
};

const deleteDocumentFromDB = async (id) => {
  if (!id) {
    throw new Error("id is required");
  }
  await db.query("DELETE FROM documents WHERE id = ?", [id]);
};

const updateDocumentInfo = async (documentId, updatedInfo) => {
  const { documentTypeId, files, lots, id, created_at, ...metadata } =
    updatedInfo;

  console.log("updatedInfo", documentTypeId, metadata, files, lots);
  try {
    // Mise à jour de la table documents
    await db.query("UPDATE documents SET document_type_id = ? WHERE id = ?", [
      documentTypeId,
      documentId,
    ]);
    console.log("Document type updated");

    // Mise à jour des métadonnées existantes
    if (metadata && Object.keys(metadata).length > 0) {
      console.log("Updating metadata", metadata);

      for (const [key, value] of Object.entries(metadata)) {
        // Vérifier si l'enregistrement existe
        const [existingMetadata] = await db.query(
          "SELECT dm.id FROM document_metadata dm JOIN metadata m ON dm.metadata_id = m.id WHERE dm.document_id = ? AND m.cle = ?",
          [documentId, key]
        );

        if (existingMetadata.length > 0) {
          // Mettre à jour l'enregistrement existant
          const [result] = await db.query(
            "UPDATE document_metadata SET value = ? WHERE id = ?",
            [value, existingMetadata[0].id]
          );
          console.log(`Update result for key ${key}:`, result);
        } else {
          console.log(`No existing metadata found for key ${key}`);
        }
      }
      console.log("Metadata updated");
    } else {
      console.log("No valid metadata to update");
    }
  } catch (error) {
    console.error("Error updating document info:", error);
  }
};

const deleteOrReplaceDocumentFiles = async (
  documentId,
  fileToDelete,
  filesToReplace,
  type
) => {
  try {
    // Supprimer les fichiers
    if (fileToDelete && fileToDelete.length > 0) {
      console.log(fileToDelete);
      if (type === "piece") {
        await db.query(
          "DELETE FROM document_pieces WHERE document_id = ? and file_path = ?",
          [documentId, fileToDelete]
        );
      } else if (file.type === "lot") {
        await db.query(
          "DELETE FROM document_lot WHERE document_id = ? AND files = ?",
          [documentId, fileToDelete]
        );
      }
      // Supprimer le fichier physique

      console.log("Files deleted successfully");
    }

    // Remplacer les fichiers
    if (filesToReplace && filesToReplace.length > 0) {
      for (const file of filesToReplace) {
        if (type === "piece") {
          await db.query(
            "UPDATE document_pieces SET file_path = ? WHERE document_id = ? AND piece_id = ?",
            [file.newFilePath, documentId, file.pieceId]
          );
        } else if (file.type === "lot") {
          await db.query(
            "UPDATE document_lot SET files = ? WHERE document_id = ? AND id = ?",
            [file.newFilePath, documentId, file.lotId]
          );
        }
        // Supprimer l'ancien fichier et déplacer le nouveau
        fs.unlinkSync(file.oldFilePath);
        fs.renameSync(file.tempPath, file.newFilePath);
      }
      console.log("Files replaced successfully");
    }

    return { success: true, message: "Files updated successfully" };
  } catch (error) {
    console.error("Error updating document files:", error);
    throw error;
  }
};

module.exports = {
  createDocumentInDB,
  addDocumentMetadata,
  addDocumentPieces,
  addDocumentLot,
  getAllDocumentsFromDB,
  getDocumentByIdFromDB,
  updateDocumentInDB,
  updateDocumentMetadata,
  getDocumentsByTypeFromDBWithLot,
  getDocumentsByTypeFromDBWithPieces,
  getAllDocumentsFromDB2,
  getAllDocumentsFromDB3,
  updateDocumentPieces,
  deleteDocumentFromDB,
  updateDocumentInfo,
  deleteOrReplaceDocumentFiles,
  getAllDocumentsFromDB4,
};
