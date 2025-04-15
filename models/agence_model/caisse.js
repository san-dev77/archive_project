const knex = require("../../knexfile").development;
const knexInstance = require("knex")(knex); // Instantiate knex

const createCaisse = async (data) => {
  try {
    const existingCaisse = await knexInstance('caisse')
      .where({ code_caisse: data.code_caisse })
      .first();

    if (existingCaisse) {
      return { success: false, message: "Le code de caisse existe déjà." };
    }

    const caisseWithSameName = await knexInstance('caisse')
      .where({
        nom_caisse: data.nom_caisse,
        agence_id: data.agence_id
      });

    if (caisseWithSameName.length > 0) {
      return { success: false, message: "Cette caisse existe déjà pour l'agence spécifiée." };
    }

    await knexInstance('caisse').insert({
      code_caisse: data.code_caisse,
      nom_caisse: data.nom_caisse,
      agence_id: data.agence_id
    });
    return { success: true, message: "La caisse a été correctement créée avec succès." };
  } catch (error) {
    return { success: false, message: "Une erreur est survenue lors de la création de la caisse." };
  }
}

const getUniqueCaisseCodes = async () => {
  const result = await knexInstance('caisse').distinct('code_caisse');
  return result;
};

const updateCaisse = async (data) => {
  const result = await knexInstance('caisse')
    .where({ id: data.id })
    .update({
      code_caisse: data.code_caisse,
      nom_caisse: data.nom_caisse
    });
  return result;
};

const deleteCaisse = async (id) => {
  try {
    const result = await knexInstance('caisse').where({ id }).del();
    return result;
  } catch (error) {
    console.log(error);
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return { success: false, message: "L'élément est lié à d'autres données, la suppression est impossible." };
    }
    return { success: false, message: "Une erreur est survenue lors de la suppression." }; // Handle other errors
  }
};

const getAllCaisses = async () => {
  try {
    const result = await knexInstance('caisse').select('*'); // Ensure we select all columns
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Une erreur est survenue lors de la récupération des caisses." };
  }
};

const getCaisseById = async (id) => {
  const result = await knexInstance('caisse').where({ id });
  return result;
};

const importCaissesFromCSV = async () => {
  const query = "LOAD DATA INFILE 'C:/Users/user/Desktop/agence.csv' INTO TABLE caisse FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n' IGNORE 1 ROWS";
  const [result] = await knexInstance.raw(query);
  return result;
};

const getAllCaissesWithAgences = async () => {
  const result = await knexInstance('caisse as c')
    .leftJoin('agence as a', 'c.agence_id', 'a.id')
    .select('c.*', 'a.nom_agence');
  return result;
};

const getCaisseByAgenceId = async (agence_id) => {
  const result = await knexInstance('caisse').where({ agence_id });
  return result;
};

module.exports = {
  createCaisse,
  getUniqueCaisseCodes,
  updateCaisse,
  deleteCaisse,
  getAllCaisses,
  getCaisseById,
  importCaissesFromCSV,
  getAllCaissesWithAgences,
  getCaisseByAgenceId,
};
