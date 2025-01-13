const knex = require("../../knexfile").development;
const knexInstance = require("knex")(knex);

const createGuichet = async (data) => {
  const result = await knexInstance('guichet').insert({
    code_guichet: data.code_guichet,
    nom_guichet: data.nom_guichet,
    agence_id: data.agence_id,
  });
  return result;
};

const updateGuichet = async (data) => {
  const result = await knexInstance('guichet')
    .where({ id: data.id })
    .update({
      code_guichet: data.code_guichet,
      nom_guichet: data.nom_guichet,
    });
  return result;
};

const deleteGuichet = async (id) => {
  const result = await knexInstance('guichet').where({ id }).del();
  return result;
};

const getAllGuichets = async () => {
  const result = await knexInstance('guichet').select('*');
  return result;
};

const getGuichetById = async (id) => {
  const result = await knexInstance('guichet').where({ id }).first();
  return result;
};

const getGuichetByAgenceId = async (agence_id) => {
  const result = await knexInstance('guichet').where({ agence_id });
  return result;
};

const getGuichetWithAgence = async () => {
  const result = await knexInstance('guichet')
    .join('agence', 'guichet.agence_id', 'agence.id')
    .select('guichet.*', 'agence.nom_agence');
  return result;
};

module.exports = {
  createGuichet,
  updateGuichet,
  deleteGuichet,
  getAllGuichets,
  getGuichetById,
  getGuichetByAgenceId,
  getGuichetWithAgence,
};
