const pool = require("../../config/agence");

const getTotalAgences = async () => {
    const [rows] = await pool.execute(`
        SELECT COUNT(*) AS total 
        FROM agence 
    `);
    return rows[0].total;
};
const getTotalCaisses = async () => {
    const [rows] = await pool.execute(`
        SELECT COUNT(*) AS total 
        FROM caisse 
    `);
    return rows[0].total;
};
const getTotalGuichet = async () => {
    const [rows] = await pool.execute(`
        SELECT COUNT(*) AS total 
        FROM guichet
    `);
    return rows[0].total;
};
const getTotalDocTypeAgence = async () => {
    const [rows] = await pool.execute(`
        SELECT COUNT(*) AS total 
        FROM document_type
    `);
    return rows[0].total;
};
const getTotalPiecesAgence = async () => {
    const [rows] = await pool.execute(`
        SELECT COUNT(*) AS total 
        FROM agence_pieces
    `);
    return rows[0].total;
};
const getTotalCaisseDocumentAgence = async () => {
    const [rows] = await pool.execute(`
        SELECT COUNT(*) AS total 
        FROM transaction_caisse
    `);
    return rows[0].total;
};
const getTotalGuichetDocumentAgence = async () => {
    const [rows] = await pool.execute(`
        SELECT COUNT(*) AS total 
        FROM transaction_guichet
    `);
    return rows[0].total;
};
const getTotalConfigPiecesAgence = async () => {
    const [rows] = await pool.execute(`
        SELECT COUNT(*) AS total 
        FROM config_piece_doctype
    `);
    return rows[0].total;
};
const getTotalMetadataAgence = async () => {
    const [rows] = await pool.execute(`
        SELECT COUNT(*) AS total 
        FROM metadata
    `);
    return rows[0].total;
};

//ici on recupere les doctype que les agences traitent
const getTotalAgenceDoctypeTreat = async () => {
    const [rows] = await pool.execute(`
        SELECT COUNT(*) AS total 
        FROM  document_type_agence
    `);
    return rows[0].total;
};
const getTotalCaisseDoctypeTreat = async () => {
    const [rows] = await pool.execute(`
        SELECT COUNT(*) AS total 
        FROM  document_type_caisse
    `);
    return rows[0].total;
};
const getTotalGuichetDoctypeTreat = async () => {
    const [rows] = await pool.execute(`
        SELECT COUNT(*) AS total 
        FROM  document_type_guichet
    `);
    return rows[0].total;
};





module.exports = {
    getTotalAgenceDoctypeTreat,
    getTotalAgences,
    getTotalCaisseDoctypeTreat,
    getTotalConfigPiecesAgence,
    getTotalDocTypeAgence,
    getTotalGuichet,
    getTotalGuichetDoctypeTreat,
    getTotalMetadataAgence,
    getTotalPiecesAgence,
    getTotalGuichetDocumentAgence,
    getTotalCaisseDocumentAgence,
    getTotalCaisses,


}