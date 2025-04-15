const express = require("express");
const router = express.Router();
const statsController = require("../controllers/statsController");

router.post("/logout/:userId", statsController.logoutUser);
router.post("/page-views", statsController.updatePageViewsController);
router.get("/page-stats", statsController.getPageViewsStatsController);
router.get("/suivi_connections_details", statsController.getAgentConnectionInfoController);
router.get("/total-services", statsController.getTotalServices);
router.get("/total-servicesActif", statsController.getTotalServiceActif);
router.get("/total-servicesNoDocType", statsController.getTotalServiceWWithoutDocType);
router.get("/total-directories", statsController.getTotalDirectories);
router.get("/total-directories-without-services", statsController.getTotalDirectoriesWithoutServices);
router.get("/total-document-types", statsController.getTotalDocumentTypes);
router.get("/total-document-types-with-metadata", statsController.getTotalDocumentTypesWithMetadata);
router.get("/total-document-types-without-metadata", statsController.getTotalDocumentTypesWithoutMetadata);
router.get("/total-document-types-in-doc-type-dir", statsController.getTotalDocumentTypesInDocTypeDir);
router.get("/total-directories-without-document-types", statsController.getTotalDirectoriesWithoutDocumentTypes);
router.get("/total-pieces", statsController.getTotalPieces);
router.get("/total-pieces-in-document-type", statsController.getTotalPiecesInDocumentType);
router.get("/total-documents", statsController.getTotalDocuments);
router.get("/total-metadata", statsController.getTotalMetadata);
router.get("/total-metadata-in-dir", statsController.getTotalMetadataInDir);
router.get("/total-connexions", statsController.getTotalConnectionsByTime);
router.get("/connexions-details", statsController.getConnectionDetails);
router.get("/database-size", statsController.getDatabaseSizeController);
router.get("/agence-database-size", statsController.getAgenceDatabaseSizeController);
//renvoi le nombre de document ce mois-ci et le mois dernier
router.get("/documents-last-month", statsController.getDocumentsLastMonthController);
//renvoi le nombre de document cette semaine et la semaine dernière
router.get("/documents-last-week", statsController.getDocumentsLastWeekController);
//renvoi les types de document les plus utilisés et leur service avec la direction
router.get("/top-document-types", statsController.getTopDocumentTypesController);
//renvoi le nombre de document vu ce mois, le mois dernier et les 3 derniers mois
router.get("/document-views-by-month", statsController.getDocumentViewsByMonthController);
//renvoi le nombre d'agents par service avec la direction
router.get("/agents-count-by-service", statsController.getAgentsCountByServiceController);
//check la database pour voir si il y des espaces blancs
router.get("/check-whitespace", statsController.checkForWhitespaceInAllTablesController);
//check la database pour voir si il y a des doublons
router.get("/check-duplicates", statsController.checkForDuplicatesInAllTablesController);




module.exports = router;
