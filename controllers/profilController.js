const Profil = require("../models/profil");

const createProfil = async (req, res) => {
  const { nom_profil, description } = req.body;

  try {
    const result = await Profil.insertProfil(nom_profil, description);
    res.status(201).json({
      id: `${result.insertId}`,
      nom_profil: nom_profil,
      description: description,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création du profil: " + error.message,
    });
  }
};

const getAllProfils = async (req, res) => {
  try {
    const profils = await Profil.getAllProfils();
    res.status(200).json(profils);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des profils: " + error.message,
    });
  }
};

const getProfilById = async (req, res) => {
  const { id } = req.params;

  try {
    const profil = await Profil.getProfilById(id);
    res.status(200).json(profil);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération du profil: " + error.message,
    });
  }
};

const deleteProfil = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Profil.deleteProfilById(id);
    if (result.affectedRows === 0) {
      res.status(404).send("Profil non trouvé");
    } else {
      res.status(200).send("Profil supprimé avec succès");
    }
  } catch (error) {
    res
      .status(500)
      .send("Erreur lors de la suppression du profil: " + error.message);
  }
};

const updateProfil = async (req, res) => {
  const { id } = req.params;
  const { nom_profil, description } = req.body;

  try {
    const result = await Profil.updateProfilById(id, nom_profil, description);
    if (result.affectedRows === 0) {
      res.status(404).send("Profil non trouvé");
    } else {
      res.status(200).send("Profil mis à jour avec succès");
    }
  } catch (error) {
    res
      .status(500)
      .send("Erreur lors de la mise à jour du profil: " + error.message);
  }
};


const toggleProfilActivation = async (req, res) => {
 console.log(req.body);
  const { id } = req.params;
  const { activation } = req.body;

  try {
    const result = await Profil.toggleProfilActivation(id, activation);
    res.status(200).json({ message: "Statut d'activation du profil mis à jour avec succès" });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la modification du statut d'activation du profil: " + error.message
    });
  }
};



module.exports = {
  createProfil,
  getAllProfils,
  getProfilById,
  deleteProfil,
  updateProfil,
  toggleProfilActivation,
};
