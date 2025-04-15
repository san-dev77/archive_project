const pool = require("../config/database"); // Assurez-vous que vous avez configuré votre connexion à la base de données

const searchDocuments = async (metadata) => {
  try {
    // Construire la requête SQL pour récupérer les documents correspondant aux métadonnées
    let query = `
      SELECT DISTINCT dm.document_id
      FROM document_metadata dm
      WHERE `;
    const conditions = [];
    const values = [];

    metadata.forEach((meta) => {
      conditions.push(`(dm.metadata_id = ? AND dm.value LIKE ?)`);
      values.push(meta.id, `%${meta.value.trim()}%`);
    });

    query += conditions.join(" OR ");

    // Ajoutez des logs pour déboguer
    console.log("SQL Query:", query);
    console.log("Values:", values);

    // Exécuter la requête pour obtenir les document_ids
    const [documentIds] = await pool.query(query, values);
    console.log("documentIds", documentIds);

    if (documentIds.length === 0) {
      return [];
    }

    // Récupérer toutes les métadonnées pour les document_ids trouvés
    const documentIdList = documentIds.map((doc) => doc.document_id);
    const metadataQuery = `
      SELECT dm.document_id, m.cle AS metadata_name, dm.value 
      FROM document_metadata dm
      JOIN metadata m ON dm.metadata_id = m.id
      WHERE dm.document_id IN (?)
    `;
    const [rows] = await pool.query(metadataQuery, [documentIdList]);
    console.log("rows", rows);

    // Organiser les résultats par document_id
    const results = documentIdList.map((docId) => ({
      document_id: docId,
      metadata: rows
        .filter((row) => row.document_id === docId)
        .map((row) => ({
          metadata_name: row.metadata_name,
          value: row.value,
        })),
    }));
    console.log("results test", results);
    console.log("Detailed results:", JSON.stringify(results)); // Log the detailed content of results
    const searchResult = JSON.stringify(results);
    const parsedResults = JSON.parse(searchResult);
    let tab = [];
    parsedResults.forEach((doc) => {
      // console.log(`Document ID: ${doc.document_id}`);
      tab.push(doc.document_id);
      doc.metadata.forEach(() => {
        // console.log(
        //   `Metadata Name: ${meta.metadata_name}, Value: ${meta.value}`
        // );
        tab.push(doc.metadata);
      });
    });

    const uniqueTab = [...new Set(tab)];
    console.log("tab", uniqueTab);

    return uniqueTab;
  } catch (error) {
    console.error("Erreur lors de la recherche des documents:", error);
    throw error;
  }
};

const getUploadedFiles = async (documentId) => {
  try {
    // Récupérer les pièces et lots associés au document
    const piecesQuery = `
      SELECT dp.file_path, p.nom_piece AS piece_name
      FROM document_pieces dp
      JOIN pieces p ON dp.piece_id = p.id
      WHERE dp.document_id = ?
    `;
    const [piecesRows] = await pool.query(piecesQuery, [documentId]);

    const lotsQuery = `
      SELECT dl.files
      FROM document_lot dl
      WHERE dl.document_id = ?
    `;
    const [lotsRows] = await pool.query(lotsQuery, [documentId]);

    // Regrouper les fichiers par noms de pièces sans créer de doublons
    const groupedPieces = piecesRows.reduce((acc, row) => {
      const { piece_name, file_path } = row;
      if (!acc[piece_name]) {
        acc[piece_name] = new Set(); // Utiliser un Set pour éviter les doublons
      }
      acc[piece_name].add(file_path);
      return acc;
    }, {});

    // Convertir les Sets en tableaux
    const finalGroupedPieces = Object.fromEntries(
      Object.entries(groupedPieces).map(([key, value]) => [key, Array.from(value)])
    );

    return {
      pieces: finalGroupedPieces,
      lots: lotsRows.map((row) => row.files),
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des fichiers:", error);
    throw error;
  }



}

module.exports = {
  searchDocuments,
  getUploadedFiles,
};
