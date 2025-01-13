const { updateTransactionCaisse, deleteTransactionCaisse } = require('../../models/agence_model/transactionCaisse');

// Mettre à jour une transaction de caisse
const updateTransactionCaisseController = async (req, res) => {
    console.log("test");

    try {
        console.log(req.body);
        const id = req.params.id
        const data = {
            dates: req.body.dates,
            nom_prenom_caissier: req.body.nom_prenom_caissier,
            code_definitif: req.body.code_definitif,

        };

        const result = await updateTransactionCaisse(id, data);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Transaction non trouvée" });
        }

        res.status(200).json({ message: "Transaction mise à jour avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la mise à jour de la transaction" });
    }
};

// Supprimer une transaction de caisse
const deleteTransactionCaisseController = async (req, res) => {
    try {
        const result = await deleteTransactionCaisse(req.params.id);

        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }

        res.status(200).json({ message: result.message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la suppression de la transaction" });
    }
};

module.exports = {
    updateTransactionCaisseController,
    deleteTransactionCaisseController
};

