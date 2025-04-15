const express = require("express");
const router = express.Router();
const db = require("../../config/agence"); // Assurez-vous que le chemin d'accès à votre module de base de données est correct

// Endpoint pour récupérer les années distinctes des transactions de caisse
router.get("/dates_caisse", async (req, res) => {
    try {
        const query = `
            SELECT DISTINCT 
                YEAR(STR_TO_DATE(dates, '%d/%m/%Y')) as annee
            FROM transaction_caisse 
            WHERE dates IS NOT NULL 
                AND dates != ''
                AND STR_TO_DATE(dates, '%d/%m/%Y') IS NOT NULL
            ORDER BY annee;
        `;

        const [results] = await db.query(query);
        console.log("Résultats bruts:", results);

        // Transformation en vrai nombre
        const annees = results.map(row => ({
            annee: Number(row.annee)
        }));

        console.log("Années après transformation:", annees);

        res.status(200).json({ annees: annees });

    } catch (error) {
        console.error("Erreur:", error);
        res.status(500).json({
            message: "Erreur lors de la récupération des années",
            error: error.message
        });
    }
});

// Endpoint pour récupérer les caissiers par ID d'agence
router.get("/caissiers/agence/:id", async (req, res) => {

    try {
        const { id } = req.params;
        console.log("caissiers", id);

        const query = `
            SELECT DISTINCT nom_prenom_caissier
            FROM transaction_caisse
            WHERE agence_id = ?
            AND nom_prenom_caissier IS NOT NULL
            AND nom_prenom_caissier != ''
            ORDER BY nom_prenom_caissier
        `;

        const [results] = await db.query(query, [id]);

        if (results.length === 0) {
            return res.status(404).json({
                message: "Aucun caissier trouvé pour cette agence"
            });
        }

        const caissiers = results.map(row => ({
            nom_prenom_caissier: row.nom_prenom_caissier
        }));

        res.status(200).json({ caissiers });

    } catch (error) {
        console.error("Erreur:", error);
        res.status(500).json({
            message: "Erreur lors de la récupération des caissiers",
            error: error.message
        });
    }
});

// Endpoint pour récupérer les caisses par ID d'agence
router.get("/caisses/agence/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log("caisses pour agence:", id);

        const query = `
            SELECT DISTINCT tc.code_caisse, c.*
            FROM transaction_caisse tc
            JOIN caisse c ON tc.code_caisse = c.id
            WHERE tc.agence_id = ?
            AND tc.code_caisse IS NOT NULL
        `;

        const [results] = await db.query(query, [id]);

        if (results.length === 0) {
            return res.status(404).json({
                message: "Aucune caisse trouvée pour cette agence"
            });
        }

        res.status(200).json({ caisses: results });

    } catch (error) {
        console.error("Erreur:", error);
        res.status(500).json({
            message: "Erreur lors de la récupération des caisses",
            error: error.message
        });
    }
});

module.exports = router;
