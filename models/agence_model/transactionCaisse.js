const pool = require("../../config/agence");

const updateTransactionCaisse = async (id, data) => {
    const query = `
    UPDATE transaction_caisse 
    SET dates = ?,
        nom_prenom_caissier = ?,
        code_definitif = ?
    WHERE id = ?`;

    const [result] = await pool.query(query, [

        data.dates,
        data.nom_prenom_caissier,
        data.code_definitif,
        id
    ]);
    return result;
};

const deleteTransactionCaisse = async (id) => {
    const query = "DELETE FROM transaction_caisse WHERE id = ?";
    try {
        const [result] = await pool.query(query, [id]);
        if (result.affectedRows === 0) {
            return { success: false, message: "Transaction non trouvée" };
        }
        return { success: true, message: "Transaction supprimée avec succès" };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Une erreur est survenue lors de la suppression" };
    }
};

module.exports = {
    updateTransactionCaisse,
    deleteTransactionCaisse
};