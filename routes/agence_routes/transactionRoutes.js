const express = require('express');
const router = express.Router();
const { updateTransactionCaisseController, deleteTransactionCaisseController } = require('../../controllers/agence_controller/transactionCaisse_controller');

// Route pour mettre à jour une transaction de caisse
router.put('/edit/:id', updateTransactionCaisseController);

// Route pour supprimer une transaction de caisse 
router.delete('/:id', deleteTransactionCaisseController);

module.exports = router;
