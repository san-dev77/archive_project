const knex = require("../../knexfile").development;
const knexInstance = require("knex")(knex);
const path = require("path");

const {
  createDirectory,
  renameDirectory,
  deleteDirectory,
} = require("../../folder_maker/tree_maker");

const createDocumentType = async (data) => {
  const result = await knexInstance('document_type').insert({
    nom_document_type: data.nom_document_type.trim(),
  });

  const dirPath = path.join(__dirname, "../..", "Agence_tree");
  console.log(dirPath);

  createDirectory(dirPath, data.nom_document_type);

  return result;
};

const updateDocumentType = async (data) => {
  const result1 = await knexInstance('document_type').where({ id: data.id }).first();
  console.log(result1);

  const result = await knexInstance('document_type')
    .where({ id: data.id })
    .update({ nom_document_type: data.nom_document_type });

  const dirPath = path.join(__dirname, "../..", "Agence_tree");

  renameDirectory(
    dirPath,
    result1.nom_document_type,
    data.nom_document_type
  );

  return result;
};

const deleteDocumentType = async (id) => {
  const result1 = await knexInstance('document_type').where({ id }).first();

  const result = await knexInstance('document_type').where({ id }).del();

  const dirPath = path.join(__dirname, "../..", "Agence_tree");

  deleteDirectory(dirPath, result1.nom_document_type);
  console.log("test");

  return result;
};

const getAllDocumentTypes = async () => {
  const result = await knexInstance('document_type').select('*');
  return result;
};

const getDocumentTypeById = async (id) => {
  const result = await knexInstance('document_type').where({ id }).first();
  return result;
};

const linkAgenceDocumentType = async (data) => {
  const result = await knexInstance('document_type_agence').insert({
    document_type_id: data.document_type_id,
  });
  return result;
};

const linkCaisseDocumentType = async (data) => {
  const result = await knexInstance('document_type_caisse').insert({
    document_type_id: data.document_type_id,
  });
  return result;
};

const linkGuichetDocumentType = async (data) => {
  const result = await knexInstance('document_type_guichet').insert({
    document_type_id: data.document_type_id,
  });
  return result;
};

// get all document types by agence id
const getDocumentTypeByAgence = async () => {
  const result = await knexInstance('document_type')
    .join('document_type_agence', 'document_type.id', 'document_type_agence.document_type_id')
    .select('document_type.*');
  console.log("result", result);
  return result;
};

//get relations document type name with caisse name
const getRelationsWithCaisse = async () => {
  console.log("Début de getRelationsWithCaisse");

  const result = await knexInstance('document_type')
    .join('document_type_caisse', 'document_type.id', 'document_type_caisse.document_type_id')
    .select('document_type.*');
  return result;
};

const getRelationsWithGuichet = async () => {
  try {
    console.log("Début de getRelationsWithGuichet");

    const result = await knexInstance('document_type')
      .leftJoin('document_type_guichet', 'document_type.id', 'document_type_guichet.document_type_id')
      .orderBy('document_type.id', 'asc')
      .select('document_type.*');

    if (!result.length) {
      console.log("Aucun résultat trouvé");
      return [];
    }

    console.log("Nombre de résultats:", result.length);
    console.log("Résultats:", result);

    return result;
  } catch (error) {
    console.error("Erreur dans getRelationsWithGuichet:", error);
    throw error;
  }
};

const getRelationsWithAgence = async () => {
  console.log("Début de getRelationsWithAgence");

  const result = await knexInstance('document_type')
    .join('document_type_agence', 'document_type.id', 'document_type_agence.document_type_id')
    .select('document_type.*');
  console.log("Résultat de la requête:", result);

  console.log("Fin de getRelationsWithAgence");
  return result;
};

const unlinkAgenceDocumentType = async (id) => {
  const result = await knexInstance('document_type_agence').where({ document_type_id: id }).del();
  return result;
};

const unlinkCaisseDocumentType = async (id) => {
  const result = await knexInstance('document_type_caisse').where({ document_type_id: id }).del();
  return result;
};

const unlinkGuichetDocumentType = async (id) => {
  const result = await knexInstance('document_type_guichet').where({ document_type_id: id }).del();
  return result;
};

const getDocumentTypeForAgence = async () => {
  const result = await knexInstance('document_type')
    .join('document_type_agence', 'document_type.id', 'document_type_agence.document_type_id')
    .select('document_type.*');
  return result;
};

const getDocTypeByAgence = async () => {
  const result = await knexInstance('document_type_agence')
    .join('document_type', 'document_type_agence.document_type_id', 'document_type.id')
    .select('document_type.*');
  return result;
};

module.exports = {
  createDocumentType,
  updateDocumentType,
  deleteDocumentType,
  getAllDocumentTypes,
  getDocumentTypeById,
  linkAgenceDocumentType,
  getDocumentTypeByAgence,
  linkCaisseDocumentType,
  linkGuichetDocumentType,
  getRelationsWithCaisse,
  getRelationsWithGuichet,
  getRelationsWithAgence,
  unlinkAgenceDocumentType,
  unlinkCaisseDocumentType,
  unlinkGuichetDocumentType,
  getDocumentTypeForAgence,
  getDocTypeByAgence,
};
