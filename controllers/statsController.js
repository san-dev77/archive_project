const Stats = require("../models/stats");


const logoutUser = async (req, res) => {
    console.log(req.params);

    const userId = req.params.userId; // Assuming userId is sent in the request body
    try {
        const result = await Stats.insertIntoLogout(userId);
        res.status(200).json({ message: "User logged out successfully", logoutId: result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePageViewsController = async (req, res) => {
    try {
        const { pageId, pageName } = req.body;
        if (!pageId || !pageName) {
            return res.status(400).json({ message: "Page ID and page name are required" });
        }

        const result = await Stats.updatePageViews(pageId, pageName);
        res.status(200).json({
            message: "Page view updated successfully",
            result
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getPageViewsStatsController = async (req, res) => {
    try {
        const pageViewsStats = await Stats.getPageViewsStatistics();
        res.status(200).json({ pageViewsStats });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




const getAgentConnectionInfoController = async (req, res) => {
    try {
        const data = await Stats.getAgentConnectionInfo();
        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getTotalServices = async (req, res) => {
    try {
        const total = await Stats.getTotalServices();
        res.status(200).json({ total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getTotalServiceActif = async (req, res) => {
    try {
        const total = await Stats.getTotalServicesWithDocumentTypes();
        res.status(200).json({ total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getTotalServiceWWithoutDocType = async (req, res) => {
    try {
        const total = await Stats.getTotalServicesWithoutDocumentType();
        res.status(200).json({ total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTotalDirectories = async (req, res) => {
    try {
        const total = await Stats.getTotalDirectories();
        res.status(200).json({ total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTotalDirectoriesWithoutServices = async (req, res) => {
    try {
        const total = await Stats.getTotalDirectoriesWithoutServices();
        res.status(200).json({ total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTotalDocumentTypes = async (req, res) => {
    try {
        const total = await Stats.getTotalDocumentTypes();
        res.status(200).json({ total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTotalDocumentTypesWithoutMetadata = async (req, res) => {
    try {
        const total = await Stats.getTotalDocumentTypesWithoutMetadata();
        res.status(200).json({ total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTotalDocumentTypesInDocTypeDir = async (req, res) => {
    try {
        const total = await Stats.getTotalDocumentTypesInDocTypeDir();
        res.status(200).json({ total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTotalDocumentTypesWithMetadata = async (req, res) => {
    try {
        const result = await Stats.getTotalDocumentTypesWithMetadata();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getTotalDirectoriesWithoutDocumentTypes = async (req, res) => {
    try {
        const result = await Stats.getTotalDirectoriesWithoutDocumentTypes();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTotalPieces = async (req, res) => {
    try {
        const total = await Stats.getTotalPieces();
        res.status(200).json({ total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTotalPiecesInDocumentType = async (req, res) => {
    try {
        const total = await Stats.getTotalPiecesInDocumentType();
        res.status(200).json({ total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTotalDocuments = async (req, res) => {
    try {
        const total = await Stats.getTotalDocuments();
        res.status(200).json({ total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTotalMetadata = async (req, res) => {
    try {
        const total = await Stats.getTotalMetadata();
        res.status(200).json({ total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTotalMetadataInDir = async (req, res) => {
    try {
        const total = await Stats.getTotalMetadataInDir();
        res.status(200).json({ total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTotalConnectionsByTime = async (req, res) => {
    try {
        const total = await Stats.getTotalConnectionsByTime();
        res.status(200).json({ total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getConnectionDetails = async (req, res) => {
    try {
        const details = await Stats.getConnectionDetails();
        res.status(200).json({ details });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getDocumentsLastWeekController = async (req, res) => {
    try {
        const documents = await Stats.getDocumentsLastWeek();
        res.status(200).json({ documents });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDocumentsLastMonthController = async (req, res) => {
    try {
        const documents = await Stats.getDocumentsLastMonth();
        res.status(200).json({ documents });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTopDocumentTypesController = async (req, res) => {
    try {
        const topTypes = await Stats.getTopDocumentTypes();
        res.status(200).json({ topTypes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDatabaseSizeController = async (req, res) => {
    try {
        const size = await Stats.getDatabaseSize();
        res.status(200).json({ size });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getAgenceDatabaseSizeController = async (req, res) => {
    try {
        const size = await Stats.getAgenceDatabaseSize();
        res.status(200).json({ size });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDocumentViewsByMonthController = async (req, res) => {
    try {
        const views = await Stats.getDocumentViewsByMonth();
        res.status(200).json({ views });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAgentsCountByServiceController = async (req, res) => {
    try {
        const agentCounts = await Stats.getAgentsCountByService();
        res.status(200).json({ agentCounts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const checkForWhitespaceInAllTablesController = async (req, res) => {
    try {
        const whitespaceResults = await Stats.checkForWhitespaceInAllTables();
        res.status(200).json({ whitespaceResults });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const checkForDuplicatesInAllTablesController = async (req, res) => {
    try {
        const duplicateResults = await Stats.checkForDuplicatesInAllTables();
        res.status(200).json({ duplicateResults });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};





module.exports = {
    logoutUser,
    getPageViewsStatsController,
    updatePageViewsController,
    getAgentConnectionInfoController,
    getTotalServices,
    getTotalServiceActif,
    getTotalServiceWWithoutDocType,
    getTotalDirectories,
    getTotalDirectoriesWithoutServices,
    getTotalDocumentTypesWithMetadata,
    getTotalDocumentTypes,
    getTotalDocumentTypesWithoutMetadata,
    getTotalDocumentTypesInDocTypeDir,
    getTotalDirectoriesWithoutDocumentTypes,
    getTotalPieces,
    getTotalPiecesInDocumentType,
    getTotalDocuments,
    getTotalMetadata,
    getTotalMetadataInDir,
    getTotalConnectionsByTime,
    getConnectionDetails,
    getDatabaseSizeController,
    getAgenceDatabaseSizeController,
    getDocumentsLastMonthController,
    getDocumentsLastWeekController,
    getTopDocumentTypesController,
    getDocumentViewsByMonthController,
    getAgentsCountByServiceController,
    checkForDuplicatesInAllTablesController,
    checkForWhitespaceInAllTablesController
};
