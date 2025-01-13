//selectionner les metadata a fin de rechercher par metadata
//en vrai faudra toujours passer par les metadata pour faire des recherches

//afficher les données dans un tableau afin de consulter

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
      values.push(meta.id, `%${meta.value}%`);
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

module.exports = {
  searchDocuments,
};
