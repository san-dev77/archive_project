const db = require("../../config/agence");

const getTransactionGuichet = async () => {
  try {
    const query = `
      SELECT 
        tg.id,
        tg.code_boite,
        a.nom_agence,
        dt.nom_document_type,
        tg.dates,
        tg.nom_prenom_caissier
      FROM transaction_guichet tg
      LEFT JOIN agence a ON tg.agence_id = a.id 
      LEFT JOIN document_type dt ON tg.document_type_id = dt.id
    `;

    const [results] = await db.query(query);
    return results;
  } catch (error) {
    throw new Error(
      "Erreur lors de la récupération des transactions: " + error.message
    );
  }
};

const getAttachedFiles = async () => {
  try {
    const query = `
      SELECT 
        pf.id,
        pf.file_path,
        dt.nom_document_type,
        p.nom_piece
      FROM piece_file pf
      LEFT JOIN agence_pieces p ON pf.piece_id = p.id
      LEFT JOIN config_piece_docType cpd ON p.id = cpd.piece_id
      LEFT JOIN document_type dt ON cpd.document_type_id = dt.id
    `;

    const [results] = await db.query(query);

    // Ajouter le chemin complet du fichier à chaque objet
    const basePath = "http://localhost:3000/agence_uploads/"; // Remplacez par le chemin de votre serveur
    const filesWithFullPath = results.map(file => ({
      ...file,
      file_path: basePath + file.file_path // Concaténer le chemin de base avec le chemin du fichier
    }));

    // Regrouper les fichiers par nom de pièce pour éviter la redondance
    const groupedFiles = filesWithFullPath.reduce((acc, file) => {
      const { nom_piece, file_path, nom_document_type } = file;
      if (!acc[nom_piece]) {
        acc[nom_piece] = { nom_piece, nom_document_type, file_paths: new Set() };
      }
      acc[nom_piece].file_paths.add(file_path);

      return acc;
    }, {});

    // Convertir les ensembles de chemins de fichiers en tableaux
    const finalFiles = Object.values(groupedFiles).map(group => ({
      ...group,
      file_paths: Array.from(group.file_paths)
    }));

    console.log(finalFiles);

    return finalFiles;
  } catch (error) {
    throw new Error(
      "Erreur lors de la récupération des fichiers joints: " + error.message
    );
  }
};





const getTransactionCaisse = async () => {
  try {
    const query = `
      SELECT 
        tc.id,
        tc.dates,
        tc.nom_prenom_caissier,
        tc.code_definitif,
        a.nom_agence,
        c.code_caisse AS code_caisse_nom,
        dt.nom_document_type
      FROM transaction_caisse tc
      LEFT JOIN agence a ON tc.agence_id = a.id 
      LEFT JOIN caisse c ON tc.code_caisse = c.id
      LEFT JOIN document_type dt ON tc.document_type_id = dt.id
    `;

    const [results] = await db.query(query);
    return results;
  } catch (error) {
    throw new Error(
      "Erreur lors de la récupération des transactions: " + error.message
    );
  }
};
const getTransactionDossiers = async () => {
  try {
    const query = `
      SELECT 
        td.id,
        td.dates,
        td.nom_prenom_caissier,
        td.code_definitif,
        a.nom_agence,
        c.code_caisse AS code_caisse_nom,
        dt.nom_document_type
      FROM transaction_caisse td
      LEFT JOIN agence a ON td.agence_id = a.id 
      LEFT JOIN caisse c ON td.code_caisse = c.id
      LEFT JOIN document_type dt ON td.document_type_id = dt.id
      limit 20
    `;

    const [results] = await db.query(query);
    return results;
  } catch (error) {
    throw new Error(
      "Erreur lors de la récupération des transactions: " + error.message
    );
  }
};

const deleteTransactionCaisse = async (id) => {
  const query = `DELETE FROM transaction_caisse WHERE id = ?`;
  const [result] = await db.query(query, [id]);
  return result;
};

const updateTransactionCaisse = async (id, data) => {
  const query = `UPDATE transaction_caisse SET ? WHERE id = ?`;
  const [result] = await db.query(query, [data, id]);
  return result;
};


const getCaissiers = async () => {
  try {
    const query = `
      SELECT DISTINCT nom_prenom_caissier 
      FROM transaction_caisse
    `;

    const [results] = await db.query(query);
    return results;
  } catch (error) {
    throw new Error(
      "Erreur lors de la récupération des caissiers: " + error.message
    );
  }
};


module.exports = {
  getTransactionCaisse,
  getAttachedFiles,
  getCaissiers,
  deleteTransactionCaisse,
  updateTransactionCaisse,
  getTransactionDossiers,
  getTransactionGuichet,
};
