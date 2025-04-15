const Stats = require("../../models/agence_model/stats");

const getTotalAgencesController = async (req, res) => {
    try {
        const total = await Stats.getTotalAgences();
        res.status(200).json({ total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getTotalCaisseController = async (req, res) => {
    try {
        const total = await Stats.getTotalCaisses();
        res.status(200).json({ total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getTotalGuichetController = async (req, res) => {
    try {
        const total = await Stats.getTotalGuichet();
        res.status(200).json({ total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getTotalPiecesController = async (req, res) => {
    try {
        const total = await Stats.getTotalPiecesAgence();
        res.status(200).json({ total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getTotalConfigPiecesController = async (req, res) => {
    try {
        const total = await Stats.getTotalConfigPiecesAgence();
        res.status(200).json({ total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getTotalCaisseDocTreatController = async (req, res) => {
    try {
        const total = await Stats.getTotalCaisseDoctypeTreat();
        res.status(200).json({ total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getTotalGuichetDocTreatController = async (req, res) => {
    try {
        const total = await Stats.getTotalGuichetDoctypeTreat();
        res.status(200).json({ total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getTotalAgenceDocTreatController = async (req, res) => {
    try {
        const total = await Stats.getTotalAgenceDoctypeTreat();
        res.status(200).json({ total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getTotalMetadataController = async (req, res) => {
    try {
        const total = await Stats.getTotalMetadataAgence();
        res.status(200).json({ total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getTotalDoctypeController = async (req, res) => {
    try {
        const total = await Stats.getTotalDocTypeAgence();
        res.status(200).json({ total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getTotalAgencesController,
    getTotalAgenceDocTreatController,
    getTotalCaisseController,
    getTotalCaisseDocTreatController,
    getTotalConfigPiecesController,
    getTotalDoctypeController,
    getTotalGuichetController,
    getTotalGuichetDocTreatController,
    getTotalMetadataController,
    getTotalPiecesController,
}