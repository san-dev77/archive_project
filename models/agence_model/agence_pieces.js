const knex = require("../../knexfile").development;
const knexInstance = require("knex")(knex);

const createAgencePiece = async (data) => {
  const result = await knexInstance('agence_pieces').insert({
    code_piece: data.code_piece,
    nom_piece: data.nom_piece,
  });
  return result;
};

const updateAgencePiece = async (data) => {
  console.log(data);

  const result = await knexInstance('agence_pieces')
    .where({ id: data.id })
    .update({
      code_piece: data.code_piece,
      nom_piece: data.nom_piece,
    });
  if (result === 0) {
    console.log("La pièce n'a pas été trouvée ou n'a pas été modifiée");
  }
  return result;
};

const deleteAgencePiece = async (id) => {
  const result = await knexInstance('agence_pieces').where({ id }).del();
  return result;
};

const getAllAgencePieces = async () => {
  const result = await knexInstance('agence_pieces').select('*');
  return result;
};

const getAgencePieceById = async (id) => {
  const result = await knexInstance('agence_pieces').where({ id }).first();
  return result;
};

const linkPieceDocType = async (data) => {
  const documentTypeId = data.documentTypeId;
  const values = data.pieceIds.map((id) => ({ piece_id: id, document_type_id: documentTypeId }));
  const result = await knexInstance('config_piece_docType').insert(values);
  return result;
};

const getPiecesByDocType = async (document_type_id) => {
  const result = await knexInstance('agence_pieces as ap')
    .innerJoin('config_piece_docType as cpc', 'ap.id', 'cpc.piece_id')
    .select('ap.*')
    .where('cpc.document_type_id', document_type_id);
  console.log(result);
  return result;
};

const linkUploaditems = async (type, piece_id, fileNames) => {
  const values = fileNames.map((fileName) => ({ piece_id, type, file_path: fileName }));
  const result = await knexInstance('piece_file').insert(values);
  return result;
};

const getLinkedItemsCaisse = async () => {
  const result = await knexInstance('piece_file as pf')
    .innerJoin('agence_pieces as ap', 'pf.piece_id', 'ap.id')
    .select('pf.*', 'ap.nom_piece as piece_name')
    .where('pf.type', 'caisse');
  return result;
};

module.exports = {
  createAgencePiece,
  updateAgencePiece,
  deleteAgencePiece,
  getAllAgencePieces,
  getAgencePieceById,
  linkPieceDocType,
  getPiecesByDocType,
  linkUploaditems,
  getLinkedItemsCaisse,
};
