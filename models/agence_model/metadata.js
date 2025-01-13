const knex = require("../../knexfile").development;
const knexInstance = require("knex")(knex);

const createMetadata = async (data) => {
  const result = await knexInstance('metadata').insert({
    nom_meta: data.nom_meta,
    type_meta: data.type_meta,
    document_type_id: data.document_type_id,
  });
  return result;
};

const createMultipleMetadata = async (headers, doc_type_name) => {
  const determineType = () => {
    return 'text'; // Default type for all data
  };

  // Retrieve document_type_id based on doc_type_name
  const docTypeResult = await knexInstance('document_type')
    .select('id')
    .where('nom_document_type', doc_type_name);
  const document_type_id = docTypeResult.length > 0 ? docTypeResult[0].id : null;

  const results = []; // Initialize results array

  for (const data of headers) {
    const type_meta = determineType();
    const result = await knexInstance('metadata').insert({
      nom_meta: data,
      type_meta: type_meta,
      document_type_id: document_type_id, // Use the retrieved document_type_id
    });
    results.push(result);
  }
  return results;
};

const updateMetadata = async (data) => {
  const result = await knexInstance('metadata')
    .where({ id: data.id })
    .update({
      nom_meta: data.nom_meta,
      type_meta: data.type_meta,
      document_type_id: data.document_type_id,
    });
  return result;
};

const deleteMetadata = async (id) => {
  const result = await knexInstance('metadata').where({ id }).del();
  return result;
};

const getAllMetadata = async () => {
  const result = await knexInstance('metadata').select('*');
  return result;
};

const getMetadataById = async (id) => {
  const result = await knexInstance('metadata').where({ id }).first();
  return result;
};

const getMetadataByDocumentTypeId = async (document_type_id) => {
  const result = await knexInstance('metadata').where({ document_type_id });
  return result;
};

const getMetadataNomByDocumentTypeId = async (document_type_id) => {
  const result = await knexInstance('metadata').select('nom_meta').where({ document_type_id });
  return result;
};

const getMetadataNomAndTypeByDocumentTypeId = async (document_type_id) => {
  const result = await knexInstance('metadata')
    .select('id', 'nom_meta', 'type_meta')
    .where({ document_type_id });
  return result;
};

module.exports = {
  createMetadata,
  createMultipleMetadata,
  updateMetadata,
  deleteMetadata,
  getAllMetadata,
  getMetadataById,
  getMetadataByDocumentTypeId,
  getMetadataNomByDocumentTypeId,
  getMetadataNomAndTypeByDocumentTypeId,
};
