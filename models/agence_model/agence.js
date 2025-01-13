const knex = require("../../knexfile").development;
const knexInstance = require("knex")(knex);

const createAgence = async (data) => {
  const { code_agence, nom_agence } = data;
  const result = await knexInstance('agence').insert({ code_agence, nom_agence });
  return result;
};

const updateAgence = async (data) => {
  const { id, code_agence, nom_agence } = data;
  const result = await knexInstance('agence').where({ id }).update({ code_agence, nom_agence });
  return result;
};

const deleteAgence = async (id) => {
  try {
    const result = await knexInstance('agence').where({ id }).del();
    return result;
  } catch (error) {
    console.log(error);
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return { success: false, message: "L'élément est lié à d'autres données, la suppression est impossible." };
    }
    return { success: false, message: "Une erreur est survenue lors de la suppression." }; // Handle other errors
  }

}

const getAllAgences = async () => {
  const result = await knexInstance('agence').select('*');
  return result;
};

const getAgenceById = async (id) => {
  const result = await knexInstance('agence').where({ id }).first();
  return result;
};

const importAgencesFromCSV = async (agences) => {
  const values = agences.map((agence) => ({
    code_agence: agence.code_agence,
    nom_agence: agence.nom_agence,
  }));
  const result = await knexInstance('agence').insert(values);
  return result;
};

module.exports = {
  createAgence,
  updateAgence,
  deleteAgence,
  getAllAgences,
  getAgenceById,
  importAgencesFromCSV,
};
