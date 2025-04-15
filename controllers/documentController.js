const {
  createDocumentInDB,
  addDocumentMetadata,
  addDocumentPieces,
  addDocumentLot,
  getAllDocumentsFromDB,
  getAllDocumentsFromDB2,
  getDocumentByIdFromDB,
  getAllDocumentsFromDB4,
  updateDocumentInDB,
  updateDocumentMetadata,
  updateDocumentPieces,
  deleteDocumentFromDB,
  getAllDocumentsFromDB3,
  getDocumentsByTypeFromDBWithLot,
  getDocumentsByTypeFromDBWithPieces,
  updateDocumentInfo,
  deleteDocumentPieceFile,
  replaceDocumentFile,
  createDocumentInDBForDirectory,
  addDocumentMetadataForDirectory,
  getDocumentsByTypeFromDBWithPiecesForDirectory,
  updateDocumentMetadataForDirectory,
  deleteDocumentFromDBForDirectory,
  updateDocumentInfoForDirectory,
  deleteDocumentLotFile,
} = require("../models/documents");

const axios = require("axios");

const createDocumentController = async (req, res) => {
  console.log(req.body);
  const { documentTypeId, serviceName, docTypeName, ...metadata } = req.body;
  if (!documentTypeId) {
    return res.status(400).send("documentTypeId is required");
  }

  // Vérifiez le contenu de metadata
  console.log("Metadata before parsing:", metadata);

  // Transformez les métadonnées en un format clé/valeur
  const parsedMetadata = {};

  // Supposons que vous ayez une manière de récupérer les IDs des métadonnées
  const metadataKeys = await getMetadataKeysByDocumentType(documentTypeId); // Récupérez les IDs des métadonnées

  // Parcourez les clés de metadata pour les ajouter à parsedMetadata
  for (const key in metadata) {
    const trimmedKey = key.trim();
    const normalizedKey = trimmedKey.replace(/\s+/g, " ");

    const metadataKey = metadataKeys.find((m) => m.cle === normalizedKey);
    // Trouvez l'ID correspondant

    if (metadataKey) {
      parsedMetadata[metadataKey.id] = metadata[key]; // Utilisez l'ID pour l'insertion
    } else {
      console.warn(`No metadata ID found for key: ${normalizedKey}`);
    }
  }

  try {
    // Créez le document dans la base de données

    // const documentDir = path.join(
    //   baseDirectory,
    //   serviceName,
    //   docTypeName,
    //   `${documentName}-${date}`
    // );

    // createDirectoryIfNotExists(documentDir);

    const documentId = await createDocumentInDB({
      documentTypeId,
      createdAt: new Date(),
    });

    // Ajoutez les métadonnées au document si elles existent
    if (Object.keys(parsedMetadata).length > 0) {
      console.log(parsedMetadata);

      await addDocumentMetadata(documentId, parsedMetadata);
    }

    res
      .status(201)
      .json({ message: "Document created successfully", documentId });
  } catch (error) {
    console.error("Error creating document:", error);
    res.status(500).send("Error creating document");
  }
};
const createDocumentController_dir = async (req, res) => {
  console.log(req.body);
  const { documentTypeId, serviceName, docTypeName, ...metadata } = req.body;
  if (!documentTypeId) {
    return res.status(400).send("documentTypeId is required");
  }

  // Vérifiez le contenu de metadata
  console.log("Metadata before parsing:", metadata);

  // Transformez les métadonnées en un format clé/valeur
  const parsedMetadata = {};

  // Supposons que vous ayez une manière de récupérer les IDs des métadonnées
  const metadataKeys = await getMetadataKeysByDocumentType_dir(documentTypeId); // Récupérez les IDs des métadonnées

  // Parcourez les clés de metadata pour les ajouter à parsedMetadata
  for (const key in metadata) {
    const trimmedKey = key.trim();
    const normalizedKey = trimmedKey.replace(/\s+/g, " ");

    const metadataKey = metadataKeys.find((m) => m.cle === normalizedKey);
    // Trouvez l'ID correspondant

    if (metadataKey) {
      parsedMetadata[metadataKey.id] = metadata[key]; // Utilisez l'ID pour l'insertion
    } else {
      console.warn(`No metadata ID found for key: ${normalizedKey}`);
    }
  }

  try {
    // Créez le document dans la base de données

    // const documentDir = path.join(
    //   baseDirectory,
    //   serviceName,
    //   docTypeName,
    //   `${documentName}-${date}`
    // );

    // createDirectoryIfNotExists(documentDir);

    const documentId = await createDocumentInDBForDirectory({
      documentTypeId,
      createdAt: new Date(),
    });

    // Ajoutez les métadonnées au document si elles existent
    if (Object.keys(parsedMetadata).length > 0) {
      console.log(parsedMetadata);

      await addDocumentMetadataForDirectory(documentId, parsedMetadata);
    }

    res
      .status(201)
      .json({ message: "Document created successfully", documentId });
  } catch (error) {
    console.error("Error creating document:", error);
    res.status(500).send("Error creating document");
  }
};

const addDocumentLotController = async (req, res) => {
  try {
    console.log(req);
    const document_id = req.body.document_id; // Récupérer l'ID du document depuis les paramètres de la requête
    const file_names = JSON.parse(req.body.file_names); // Parser les pièces envoyées en JSON

    // Logique pour ajouter les pièces au document
    const result = await addDocumentLot({ document_id, file_names });

    res
      .status(201)
      .json({ message: "Document pieces added successfully", result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const addDocumentPiecesController = async (req, res) => {
  console.log("mon controller", req.body);

  try {
    const document_id = req.params.id; // Récupérer l'ID du document depuis les paramètres de la requête
    const fileNames = req.body.fileNames; // Récupérer les noms de fichiers depuis le corps de la requête
    const piece_id = req.body.piece_id; // Récupérer les pièces directement depuis le corps de la requête

    // Logique pour ajouter les pièces au document
    const result = await addDocumentPieces({
      document_id,
      piece_id,
      fileNames,
    });

    res
      .status(201)
      .json({ message: "Document pieces added successfully", result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getDocumentsByTypeWithLotController = async (req, res) => {
  const documentTypeId = req.params.id;

  try {
    const documents = await getDocumentsByTypeFromDBWithLot(documentTypeId);
    res.json(documents);
  } catch (error) {
    console.error("Error fetching documents by type:", error);
    res.status(500).json({ message: "Failed to fetch documents by type" });
  }
};
const getDocumentsByTypeWithPiecesController = async (req, res) => {
  const documentTypeId = req.params.id;

  try {
    const documents = await getDocumentsByTypeFromDBWithPieces(documentTypeId);
    console.log("documents", documents);

    res.json(documents);
  } catch (error) {
    console.error("Error fetching documents by type:", error);
    res.status(500).json({ message: "Failed to fetch documents by type" });
  }
};
const getDocumentsByTypeWithPiecesController_dir = async (req, res) => {
  const documentTypeId = req.params.id;

  try {
    const documents = await getDocumentsByTypeFromDBWithPiecesForDirectory(documentTypeId);
    res.json(documents);
  } catch (error) {
    console.error("Error fetching documents by type:", error);
    res.status(500).json({ message: "Failed to fetch documents by type" });
  }
};

//-------------------------------------------------

const getMetadataKeysByDocumentType = async (documentTypeId) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/metadata/type/${documentTypeId}`
    );
    console.log(response.data);

    return response.data; // Supposons que cela retourne un tableau d'objets avec { id, cle }
  } catch (error) {
    console.error("Error fetching metadata keys:", error);
    throw new Error("Could not fetch metadata keys");
  }
};
const getMetadataKeysByDocumentType_dir = async (documentTypeId) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/metadata/meta_dir/${documentTypeId}`
    );
    console.log(response.data);

    return response.data; // Supposons que cela retourne un tableau d'objets avec { id, cle }
  } catch (error) {
    console.error("Error fetching metadata keys:", error);
    throw new Error("Could not fetch metadata keys");
  }
};

//--------------------------------------------------
const getAllDocumentsController = async (_req, res) => {
  try {
    const documents = await getAllDocumentsFromDB();
    res.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).send("Error fetching documents");
  }
};

const getAllDocumentsController2 = async (_req, res) => {
  try {
    const documents = await getAllDocumentsFromDB2();
    res.status(200).json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des documents." });
  }
};
const getAllDocumentsController3 = async (_req, res) => {
  try {
    const documents = await getAllDocumentsFromDB3();
    res.status(200).json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des documents." });
  }
};

const getDocumentByIdController = async (req, res) => {
  const documentId = req.params.id;

  try {
    const document = await getDocumentByIdFromDB(documentId);
    res.json(document);
  } catch (error) {
    console.error("Error fetching document:", error);
    res.status(500).send("Error fetching document");
  }
};

const updateDocumentController = async (req, res) => {
  const documentId = req.params.id;
  const { documentTypeId, metadata } = req.body;

  try {
    await updateDocumentInDB(documentId, { documentTypeId });

    if (metadata) {
      await updateDocumentMetadata(documentId, metadata);
    }

    if (req.files) {
      await updateDocumentPieces(
        documentId,
        req.files.map((file) => ({
          filePath: file.filename,
          description: "", // Optionally add a description
        }))
      );
    }

    res.send("Document updated successfully");
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).send("Error updating document");
  }
};
const updateDocumentController_dir = async (req, res) => {
  const documentId = req.params.id;
  const { documentTypeId, metadata } = req.body;

  try {
    await updateDocumentInDB(documentId, { documentTypeId });

    if (metadata) {
      await updateDocumentMetadataForDirectory(documentId, metadata);
    }

    if (req.files) {
      await updateDocumentPieces(
        documentId,
        req.files.map((file) => ({
          filePath: file.filename,
          description: "", // Optionally add a description
        }))
      );
    }

    res.send("Document updated successfully");
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).send("Error updating document");
  }
};

const deleteDocumentController = async (req, res) => {
  const documentId = req.params.id;

  try {
    await deleteDocumentFromDB(documentId);
    res.send("Document deleted successfully");
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).send("Error deleting document");
  }
};
const deleteDocumentController_dir = async (req, res) => {

  const documentId = req.params.id;
  console.log(documentId);


  try {
    await deleteDocumentFromDBForDirectory(documentId);
    res.send("Document deleted successfully");
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).send("Error deleting document");
  }
};

const updateDocumentInfoController = async (req, res) => {
  const documentId = req.params.id;
  const updatedInfo = req.body;

  try {
    const result = await updateDocumentInfo(documentId, updatedInfo);
    res.json(result);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du document:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour du document" });
  }
};
const updateDocumentInfoController_dir = async (req, res) => {
  const documentId = req.params.id;
  const updatedInfo = req.body;

  try {
    const result = await updateDocumentInfoForDirectory(documentId, updatedInfo);
    res.json(result);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du document:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour du document" });
  }
};

const deleteOrReplaceDocumentFilesController = async (req, res) => {
  console.log(req.body);
  const documentId = req.params.id;
  const filesToDelete = req.body.filePath ? req.body.filePath : [];
  const filesToReplace = req.files
    ? req.files.map((file) => ({
      filePath: file.path,
      originalName: file.originalname,
      type: req.body.type,
    }))
    : [];
  const type = req.body.type;
  const piece = req.body.piece;

  try {
    const result = await deleteOrReplaceDocumentFiles(
      documentId,
      filesToDelete,
      filesToReplace,
      type,
      piece
    );
    res.json(result);
  } catch (error) {
    console.error(
      "Erreur lors de la suppression ou du remplacement des fichiers:",
      error
    );
    res.status(500).json({
      error: "Erreur lors de la mise à jour des fichiers du document",
    });
  }
};

const getAllDocuments4Controller = async (req, res) => {
  const documentTypeId = req.params.id;

  if (!documentTypeId) {
    return res
      .status(400)
      .json({ error: "Le paramètre documentTypeId est requis" });
  }

  try {
    const documents = await getAllDocumentsFromDB4(documentTypeId);
    res.json(documents);
  } catch (error) {
    console.error("Erreur lors de la récupération des documents:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des documents" });
  }
};


const deleteDocumentPieceFileController = async (req, res) => {
  console.log(req.params);

  const fileId = req.params.fileId;

  if (!fileId) {
    return res.status(400).json({
      error: "Les paramètres documentId et filePath sont requis"
    });
  }

  try {
    const result = await deleteDocumentPieceFile(fileId);
    res.json(result);
  } catch (error) {
    console.error("Erreur lors de la suppression du fichier:", error);
    res.status(500).json({
      error: "Erreur lors de la suppression du fichier du document"
    });
  }
};
const deleteDocumentLotFileController = async (req, res) => {
  console.log(req.params);

  const fileId = req.params.fileId;

  if (!fileId) {
    return res.status(400).json({
      error: "Les paramètres documentId et filePath sont requis"
    });
  }

  try {
    const result = await deleteDocumentLotFile(fileId);
    res.json(result);
  } catch (error) {
    console.error("Erreur lors de la suppression du fichier:", error);
    res.status(500).json({
      error: "Erreur lors de la suppression du fichier du document"
    });
  }
};

const replaceDocumentFileController = async (req, res) => {
  const { documentId, oldFilePath } = req.body;
  const newFile = req.file;

  if (!documentId || !oldFilePath || !newFile) {
    return res.status(400).json({
      error: "Les paramètres documentId, oldFilePath et le nouveau fichier sont requis"
    });
  }

  try {
    const result = await replaceDocumentFile(
      documentId,
      oldFilePath,
      newFile.path,
      newFile.originalname
    );
    res.json(result);
  } catch (error) {
    console.error("Erreur lors du remplacement du fichier:", error);
    res.status(500).json({
      error: "Erreur lors du remplacement du fichier du document"
    });
  }
};


module.exports = {
  createDocument: createDocumentController,
  createDocument_dir: createDocumentController_dir,
  getAllDocuments: getAllDocumentsController,
  addDocumentPieces: addDocumentPiecesController,
  addDocumentLot: addDocumentLotController,
  getAllDocuments2: getAllDocumentsController2,
  getAllDocuments3: getAllDocumentsController3,
  getDocumentById: getDocumentByIdController,
  getDocumentByTypeIdWithLot: getDocumentsByTypeWithLotController,
  getDocumentByTypeIdWithPieces: getDocumentsByTypeWithPiecesController,
  getDocumentByTypeIdWithPieces_dir: getDocumentsByTypeWithPiecesController_dir,
  updateDocument: updateDocumentController,
  updateDocument_dir: updateDocumentController_dir,
  deleteDocument_dir: deleteDocumentController_dir,
  deleteDocument: deleteDocumentController,
  updateDocumentInfo: updateDocumentInfoController,
  updateDocumentInfo_dir: updateDocumentInfoController_dir,
  deleteOrReplaceDocumentFiles: deleteOrReplaceDocumentFilesController,
  getAllDocuments4: getAllDocuments4Controller,
  removeFileFromdocument: deleteDocumentPieceFileController,
  removeLotFile: deleteDocumentLotFileController,
};
