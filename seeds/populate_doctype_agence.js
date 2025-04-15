/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Supprime toutes les entrées existantes dans la table document_type
  await knex('document_type').del();

  // Insère de nouvelles entrées dans la table document_type
  await knex('document_type').insert([
    { id: 1, nom_document_type: 'journée de caisse' },  // Correction de 'colName' à 'nom_document_type' si nécessaire
    { id: 2, nom_document_type: 'journée de guichet' },
  ]);
};
