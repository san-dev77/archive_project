import { useState, useEffect } from "react";
import SideBar from "../Components/Side_bar";
import TopBar from "../Components/Top_bar";
import {
  Container,
  TextField,
  Checkbox,
  FormControlLabel,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Modal,
  Switch,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Folder,
  Grip,
  Link2Icon,
  Settings,
  SquarePen,
  Trash2,
  UserRound,
  UserRoundPlus,
  Users,
  X,
  ZapIcon,
} from "lucide-react";

import { styled } from "@mui/system";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { showDeleteConfirmation } from "../utils/alerts";

// const AgentDetails = ({ agent }) => (
//   <Box>
//     <Typography variant="h6">{agent.nom}</Typography>
//     <Typography variant="body2">Email: {agent.email}</Typography>
//     <Typography variant="body2">Téléphone: {agent.telephone}</Typography>
//     <Typography variant="body2">Adresse: {agent.adresse}</Typography>
//   </Box>
// );

const ToggleSwitch = styled(Switch)(() => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "#3b82f6",
    "&:hover": {
      backgroundColor: "rgba(59, 130, 246, 0.1)",
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#60a5fa",
  },
}));

const ProfilPage = () => {
  const [nomProfil, setNomProfil] = useState("");
  const [description, setDescription] = useState("");
  const [showDescription, setShowDescription] = useState(false);
  const [profils, setProfils] = useState([]);
  const [agents, setAgents] = useState([]);
  const [editProfilId, setEditProfilId] = useState(null);
  const [editNomProfil, setEditNomProfil] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [selectedProfil, setSelectedProfil] = useState(null);
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [activeProfilId, setActiveProfilId] = useState(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [linkedAgents, setLinkedAgents] = useState([]);
  const [openActionsModal, setOpenActionsModal] = useState(false);
  const [selectedActionProfil, setSelectedActionProfil] = useState(null);
  const [openLinkModal, setOpenLinkModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [actions, setActions] = useState([]); // Ajouter un état pour les actions

  useEffect(() => {
    const fetchProfils = async () => {
      try {
        const response = await axios.get("http://localhost:3000/profil");
        setProfils(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des profils:", error);
      }
    };

    const fetchAgents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/agents/NoProfilAgents"
        );
        setAgents(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des agents:", error);
      }
    };

    fetchProfils();
    fetchAgents();
  }, []);

  const toastOptions = {
    style: {
      backgroundColor: "#333", // Fond sombre
      color: "#fff", // Texte blanc
    },
    progressStyle: {
      background: "#4caf50", // Barre de progression verte
    },
  };

  const handleDeleteProfil = async (id) => {
    const confirm = await showDeleteConfirmation();
    if (confirm) {
      try {
        await axios.delete(`http://localhost:3000/profil/${id}`);
        setProfils(profils.filter((profil) => profil.id !== id));
        toast.success("Profil supprimé avec succès!", toastOptions);
      } catch (error) {
        console.error("Erreur lors de la suppression du profil:", error);
        toast.error("Erreur lors de la suppression du profil.", toastOptions);
      }
    }
  };

  const handleEditProfil = (profil) => {
    setEditProfilId(profil.id);
    setEditNomProfil(profil.nom_profil);
    setEditDescription(profil.description);
    setOpenEditModal(true); // Ouvrir la modale d'édition
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditProfilId(null);
    setEditNomProfil("");
    setEditDescription("");
  };

  const handleUpdateProfil = async () => {
    if (editNomProfil.trim()) {
      try {
        const response = await axios.put(
          `http://localhost:3000/profil/${editProfilId}`,
          {
            nom_profil: editNomProfil,
            description: editDescription,
          }
        );

        if (response.status === 200) {
          setProfils(
            profils.map((profil) =>
              profil.id === editProfilId ? response.data : profil
            )
          );
          toast.success("Profil mis à jour avec succès!", toastOptions);
          setEditProfilId(null);
          setEditNomProfil("");
          setEditDescription("");
          setOpenEditModal(false);
          window.location.reload(); // Refresh the page
        } else {
          console.error(
            "La réponse de l'API pour la mise à jour du profil est incorrecte:",
            response.data
          );
          toast.error("Erreur lors de la mise à jour du profil.", toastOptions);
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour du profil:", error);
        toast.error("Erreur lors de la mise à jour du profil.", toastOptions);
      }
    }
  };

  const handleWatchProfil = async (profil) => {
    setSelectedProfil(profil);
    console.log(profil.id);
    try {
      const response = await axios.get(
        `http://localhost:3000/profil-config/${profil.id}`
      );
      setLinkedAgents(response.data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des agents liés au profil:",
        error
      );
      toast.error(
        "Erreur lors de la récupération des agents liés au profil.",
        toastOptions
      );
    }
    setOpenViewModal(true);
  };

  const handleCloseViewModal = () => {
    setOpenViewModal(false);
    setLinkedAgents([]);
  };

  const handleCreateProfil = async () => {
    if (nomProfil.trim()) {
      try {
        const response = await axios.post("http://localhost:3000/profil", {
          nom_profil: nomProfil,
          description: showDescription ? description : "",
        });
        if (response.data && response.data.id) {
          setProfils([...profils, response.data]);
          toast.success("Profil créé avec succès!", toastOptions);
          setNomProfil("");
          setDescription("");
          setShowDescription(false);
        } else {
          console.error(
            "La réponse de l'API pour la création de profil est incorrecte:",
            response.data
          );
          toast.error("Erreur lors de la création du profil.", toastOptions);
        }
      } catch (error) {
        console.error("Erreur lors de la création du profil:", error);
        toast.error("Erreur lors de la création du profil.", toastOptions);
      }
    }
  };

  const handleToggleAgent = (agentId) => {
    setSelectedAgents((prevSelected) =>
      prevSelected.includes(agentId)
        ? prevSelected.filter((id) => id !== agentId)
        : [...prevSelected, agentId]
    );
  };

  const handleSelectProfil = (profil) => {
    setSelectedProfil(profil);
    setActiveProfilId(profil.id);
    // setShowAgentList(true);
  };

  const handleLinkAgentsToSelectedProfil = async () => {
    if (selectedProfil) {
      try {
        await axios.post("http://localhost:3000/profil-config/", {
          agentIds: selectedAgents,
          profilId: selectedProfil.id,
        });
        toast.success("Agents liés au profil avec succès!", toastOptions);
        setSelectedAgents([]);
        // setShowAgentList(false);
        setOpenLinkModal(false); // Fermer la modale après la liaison
      } catch (error) {
        console.error("Erreur lors de la liaison des agents au profil:", error);
        toast.error(
          "Erreur lors de la liaison des agents au profil.",
          toastOptions
        );
      }
    } else {
      toast.error("Aucun profil sélectionné.", toastOptions);
    }
  };

  const handleToggleActiveProfil = async (id) => {
    console.log("Profil reçu:", id); // Log pour vérifier l'état de profil

    try {
      // Crée un nouvel objet profil avec la propriété 'activation' inversée
      const currentProfil = profils.find((p) => p.id === id);
      const updatedProfil = { activation: !currentProfil.activation };

      // Envoie une requête PUT pour mettre à jour le profil sur le serveur
      const response = await axios.put(
        `http://localhost:3000/profil/${id}/activation`,
        updatedProfil
      );

      if (response.status === 200) {
        setProfils(
          profils.map((p) =>
            p.id === id ? { ...p, activation: updatedProfil.activation } : p
          )
        );
        toast.success(
          `Profil ${
            updatedProfil.activation ? "activé" : "désactivé"
          } avec succès!`,
          toastOptions
        );
      } else {
        throw new Error("La réponse de l'API n'est pas valide");
      }
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du statut du profil:",
        error
      );
      toast.error(
        "Erreur lors de la mise à jour du statut du profil.",
        toastOptions
      );
    }
  };

  const handleOpenActionsModal = async (profil) => {
    setSelectedActionProfil(profil);
    try {
      const response = await axios.get(
        `http://localhost:3000/rights/${profil.id}`
      );
      setActions(response.data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des actions du profil:",
        error
      );
      toast.error(
        "Erreur lors de la récupération des actions du profil.",
        toastOptions
      );
    }
    setOpenActionsModal(true);
  };

  const handleCloseActionsModal = () => {
    setOpenActionsModal(false);
    setSelectedActionProfil(null);
  };

  const handleOpenLinkModal = (profil) => {
    setSelectedProfil(profil);
    setOpenLinkModal(true);
  };

  const handleCloseLinkModal = () => {
    setOpenLinkModal(false);
    setSelectedProfil(null);
  };

  const filteredAgents = agents.filter((agent) =>
    `${agent.prenom} ${agent.nom}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleRemoveLinkedAgent = async (agentId) => {
    const confirm = await showDeleteConfirmation();
    if (confirm) {
      try {
        await axios.delete(
          `http://localhost:3000/profil-config/${agentId}/${selectedProfil.id}`
        );
        setLinkedAgents(linkedAgents.filter((agent) => agent.id !== agentId));
        toast.success("Agent supprimé du profil avec succès!", toastOptions);
      } catch (error) {
        console.error(
          "Erreur lors de la suppression de l'agent du profil:",
          error
        );
        toast.error(
          "Erreur lors de la suppression de l'agent du profil.",
          toastOptions
        );
      }
    }
  };

  const handleRemoveAction = async (actionId) => {
    const confirm = await showDeleteConfirmation();
    if (confirm) {
      try {
        await axios.delete(
          `http://localhost:3000/rights/${selectedActionProfil.id}/${actionId.permission_id}`
        );
        setActions(actions.filter((action) => action.id !== actionId));
        toast.success("Action supprimée avec succès!", toastOptions);
      } catch (error) {
        console.error("Erreur lors de la suppression de l'action:", error);
        toast.error("Erreur lors de la suppression de l'action.", toastOptions);
      }
    }
  };

  // Fonction pour regrouper les actions par section
  const groupActionsBySection = (actions) => {
    return actions.reduce((acc, action) => {
      if (!acc[action.section]) {
        acc[action.section] = [];
      }
      acc[action.section].push(action);
      return acc;
    }, {});
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <SideBar isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar />

        <Container style={{ flex: 1, overflowY: "auto" }}>
          <div className="mx-auto w-[95%] mt-24 mb-6">
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl shadow-2xl p-6 border border-green-400/30 relative">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    <ZapIcon className="text-green-300" />
                    Attribution des Actions
                  </h2>
                  <p className="text-green-100 mb-4">
                    Pour permettre aux agents d&apos;interagir avec le système,
                    vous devez leur attribuer des actions spécifiques. Chaque
                    agent peut avoir différents niveaux d&apos;accès et de
                    permissions selon son rôle.
                  </p>
                  <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-2 bg-green-700/50 px-4 py-2 rounded-lg">
                      <span className="text-yellow-300">⚠️</span>
                      <span className="text-green-100 text-sm">
                        <span className="text-green-800 p-1 rounded-full bg-white font-bold text-2x1">
                          {/* {AgentNoProfil.count} */}
                        </span>{" "}
                        agents nécessitent un profil avec au moins une
                        d&apos;action
                      </span>
                    </div>
                    <button
                      onClick={() => (window.location.href = "/rights")}
                      className="btn bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2"
                    >
                      <Settings className="w-5 h-5 mr-2" />
                      Configurer les Actions
                    </button>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="w-48 h-48 relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 to-emerald-600/20 rounded-full animate-pulse"></div>
                    <div className="absolute inset-4 bg-gradient-to-tr from-green-500/40 to-emerald-600/40 rounded-full animate-pulse delay-75"></div>
                    <div className="absolute inset-8 bg-gradient-to-tr from-green-500/60 to-emerald-600/60 rounded-full animate-pulse delay-150"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ZapIcon className="w-16 h-16 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Paper
            elevation={3}
            sx={{
              padding: "2rem",
              borderRadius: "12px",
              background: "#ffffff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              border: "1px solid #ecfdf5",
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: "#065f46",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <UserRoundPlus />
              Création de Profil
            </Typography>
            <Box sx={{ mt: 4 }}>
              <TextField
                label="Nom du profil"
                variant="outlined"
                value={nomProfil}
                onChange={(e) => setNomProfil(e.target.value)}
                fullWidth
                margin="normal"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "&:hover fieldset": {
                      borderColor: "#10b981",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#047857",
                    },
                  },
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showDescription}
                    onChange={(e) => setShowDescription(e.target.checked)}
                    sx={{
                      color: "#10b981",
                      "&.Mui-checked": {
                        color: "#047857",
                      },
                    }}
                  />
                }
                label="Ajouter une description"
              />
              {showDescription && (
                <TextField
                  label="Description"
                  variant="outlined"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={4}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      "&:hover fieldset": {
                        borderColor: "#10b981",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#047857",
                      },
                    },
                  }}
                />
              )}
              <div className="flex items-end justify-end w-full">
                <button
                  className="btn bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold px-6 py-3 rounded-lg mt-5 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                  onClick={handleCreateProfil}
                >
                  <UserRoundPlus className="w-5 h-5 mr-2 inline" />
                  Créer Profil
                </button>
              </div>
            </Box>
          </Paper>
          <Paper
            elevation={3}
            sx={{
              padding: "2rem",
              marginTop: "20px",
              marginBottom: "20px",
              background: "#ffffff",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              border: "1px solid #ecfdf5",
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: "#065f46",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              Liste des Profils
            </Typography>

            <List sx={{ gap: 2, display: "flex", flexDirection: "column" }}>
              {profils.map((profil, index) => (
                <ListItem
                  key={profil.id}
                  button
                  onClick={() => handleSelectProfil(profil)}
                  sx={{
                    borderRadius: "8px",
                    background:
                      activeProfilId === profil.id
                        ? "linear-gradient(to right, #065f46, #047857)"
                        : "linear-gradient(to right, #059669, #10b981)",
                    padding: "1rem",
                    transition: "all 0.2s ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    marginBottom: "8px",
                  }}
                >
                  <ListItemText
                    primary={
                      <div
                        className="flex w-full text-white items-center gap-3 pb-2 border-b border-opacity-20"
                        style={{
                          borderColor: "white",
                        }}
                      >
                        <Grip className="w-5 h-5" />
                        <span className="font-bold text-lg">
                          {profil.nom_profil}
                        </span>
                      </div>
                    }
                    secondary={
                      <Typography
                        sx={{
                          mt: 1,
                          color: "#fff",
                        }}
                      >
                        {profil.description}
                      </Typography>
                    }
                  />

                  <div className="flex items-center gap-2">
                    <Tooltip title="Ajouter agent au profil" arrow>
                      <IconButton
                        sx={{
                          backgroundColor: "rgba(209,250,229,0.15)",
                        }}
                        onClick={() => handleOpenLinkModal(profil)}
                      >
                        <UserRoundPlus className="text-emerald-200" />
                      </IconButton>
                    </Tooltip>

                    {index !== 0 && index !== 1 && (
                      <Tooltip title="Modifier" arrow>
                        <IconButton
                          sx={{
                            backgroundColor: "rgba(209,250,229,0.15)",
                          }}
                          onClick={() => handleEditProfil(profil)}
                        >
                          <SquarePen className="text-emerald-200" />
                        </IconButton>
                      </Tooltip>
                    )}

                    <Tooltip title="Agents" arrow>
                      <IconButton
                        sx={{
                          backgroundColor: "rgba(209,250,229,0.15)",
                        }}
                        onClick={() => handleWatchProfil(profil)}
                      >
                        <Users className="text-emerald-200" />
                      </IconButton>
                    </Tooltip>
                    {index !== 0 && (
                      <Tooltip title="Les actions du profils" arrow>
                        <IconButton
                          sx={{
                            backgroundColor: "rgba(209,250,229,0.15)",
                          }}
                          onClick={() => handleOpenActionsModal(profil)}
                        >
                          <ZapIcon className="text-emerald-200" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {index !== 0 && index !== 1 && (
                      <Tooltip title="Activer/désactiver le profil" arrow>
                        <ToggleSwitch
                          checked={profil.activation}
                          onChange={() => handleToggleActiveProfil(profil.id)}
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "#10b981",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                              {
                                backgroundColor: "#34d399",
                              },
                          }}
                        />
                      </Tooltip>
                    )}

                    {index !== 0 && index !== 1 && (
                      <Tooltip title="Supprimer le profil" arrow>
                        <IconButton
                          sx={{
                            backgroundColor: "rgba(254,202,202,0.15)",
                          }}
                          onClick={() => handleDeleteProfil(profil.id)}
                        >
                          <Trash2 className="text-red-300" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </div>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Container>
        <ToastContainer />

        <Modal open={openEditModal} onClose={handleCloseEditModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 600,
              bgcolor: "white",
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              p: 4,
              border: "1px solid #ecfdf5",
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: "#065f46",
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 3,
              }}
            >
              <SquarePen />
              Modifier le Profil
            </Typography>

            <TextField
              label="Nom du profil"
              variant="outlined"
              value={editNomProfil}
              onChange={(e) => setEditNomProfil(e.target.value)}
              fullWidth
              margin="normal"
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  "&:hover fieldset": {
                    borderColor: "#10b981",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#047857",
                  },
                },
              }}
            />

            <TextField
              label="Description"
              variant="outlined"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              fullWidth
              multiline
              rows={4}
              margin="normal"
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  "&:hover fieldset": {
                    borderColor: "#10b981",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#047857",
                  },
                },
              }}
            />

            <button
              onClick={handleUpdateProfil}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <SquarePen size={20} className="mr-2 inline" />
              Mettre à jour le profil
            </button>
          </Box>
        </Modal>

        <Modal open={openViewModal} onClose={handleCloseViewModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 600,
              bgcolor: "#ffffff",
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              p: 4,
              border: "1px solid #ecfdf5",
            }}
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-green-100 pb-3">
                <Typography
                  variant="h5"
                  className="flex items-center gap-3 font-bold text-green-800"
                >
                  <Users className="w-5 h-5 text-green-600" />
                  Agents liés au Profil
                </Typography>
                <IconButton onClick={handleCloseViewModal} size="small">
                  <X className="w-5 h-5 text-gray-500" />
                </IconButton>
              </div>

              {selectedProfil && (
                <div className="flex items-center gap-2 px-4 py-3 bg-green-600 rounded-lg">
                  <Folder className="w-5 h-5 text-green-100" />
                  <Typography
                    variant="subtitle1"
                    className="font-medium text-green-100"
                  >
                    {selectedProfil.nom_profil}
                  </Typography>
                </div>
              )}

              <div className="max-h-[400px] overflow-y-auto">
                <List className="space-y-2">
                  {linkedAgents.map((agent) => (
                    <ListItem
                      key={agent.id}
                      className="py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-lg"
                    >
                      <div className="flex items-center gap-4 w-full">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <UserRound className="w-5 h-5 text-white" />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <Typography className="font-medium text-white truncate">
                            {agent.nom} {agent.prenom}
                          </Typography>
                          <Typography className="text-sm text-green-100">
                            {agent.nom_role} • {agent.nom_service}
                          </Typography>
                        </div>

                        <IconButton
                          edge="end"
                          onClick={() => handleRemoveLinkedAgent(agent.id)}
                          className="text-green-100 hover:text-red-200"
                        >
                          <Trash2 className="w-5 h-5" />
                        </IconButton>
                      </div>
                    </ListItem>
                  ))}
                </List>
              </div>

              <button
                onClick={handleCloseViewModal}
                className="w-full px-4 py-2 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                Fermer
              </button>
            </div>
          </Box>
        </Modal>

        <Modal open={openActionsModal} onClose={handleCloseActionsModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxWidth: "700px",
              bgcolor: "#ffffff",
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              p: 4,
              border: "1px solid #ecfdf5",
            }}
          >
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-green-100">
              <ZapIcon className="w-6 h-6 text-green-500" />
              <Typography variant="h5" className="font-bold text-green-800">
                Actions du Profil{" "}
                <span className="text-green-600">
                  {selectedActionProfil && selectedActionProfil.nom_profil}
                </span>
              </Typography>
            </div>

            <div className="max-h-[60vh] overflow-y-auto pr-2">
              {Object.entries(groupActionsBySection(actions)).map(
                ([section, actions]) => (
                  <Accordion
                    key={section}
                    sx={{
                      mb: 2,
                      border: "1px solid #d1fae5",
                      borderRadius: "8px !important",
                      "&:before": {
                        display: "none",
                      },
                      boxShadow: "none",
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon className="text-green-600" />}
                      sx={{
                        borderRadius: "8px",
                        background: "#f0fdf4",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <ZapIcon className="w-5 h-5 text-green-500" />
                        <Typography className="font-semibold text-green-700">
                          {section}
                        </Typography>
                      </div>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List>
                        {actions.map((action) => (
                          <ListItem
                            key={action.id}
                            className="py-2 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div className="p-2 rounded-lg bg-green-500">
                                <ZapIcon className="w-4 h-4 text-white" />
                              </div>
                              <ListItemText
                                primary={action.action}
                                className="text-gray-700"
                              />
                            </div>
                            <IconButton
                              edge="end"
                              onClick={() => handleRemoveAction(action)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="w-5 h-5" />
                            </IconButton>
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                )
              )}
            </div>

            <div className="flex justify-end mt-4 pt-3 border-t border-green-100">
              <button
                onClick={handleCloseActionsModal}
                className="px-6 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 font-medium transition-colors"
              >
                Fermer
              </button>
            </div>
          </Box>
        </Modal>

        <Modal open={openLinkModal} onClose={handleCloseLinkModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 600,
              bgcolor: "#ffffff",
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              p: 4,
              border: "1px solid #ecfdf5",
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: "#065f46",
                borderBottom: "1px solid #d1fae5",
                pb: 2,
              }}
            >
              Lier des Agents au Profil{" "}
              <span className="font-semibold text-green-600">
                {selectedProfil && selectedProfil.nom_profil}
              </span>
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", mt: 3 }}>
              <TextField
                label="Rechercher un agent"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "&:hover fieldset": {
                      borderColor: "#10b981",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#047857",
                    },
                  },
                }}
              />

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#065f46",
                  mb: 2,
                }}
              >
                Agents
              </Typography>

              <List
                sx={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  bgcolor: "#f0fdf4",
                  borderRadius: "8px",
                  p: 2,
                }}
              >
                {filteredAgents.map((agent) => (
                  <ListItem
                    key={agent.id}
                    sx={{
                      borderRadius: "8px",
                      mb: 1,
                      "&:hover": {
                        bgcolor: "#ecfdf5",
                      },
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedAgents.includes(agent.id)}
                          onChange={() => handleToggleAgent(agent.id)}
                          sx={{
                            color: "#10b981",
                            "&.Mui-checked": {
                              color: "#047857",
                            },
                          }}
                        />
                      }
                      label={
                        <span className="text-gray-700 font-medium">
                          {`${agent.prenom} ${agent.nom} - Fonction: ${agent.nom_role} - ${agent.nom_service}`}
                        </span>
                      }
                    />
                  </ListItem>
                ))}
              </List>

              <button
                onClick={handleLinkAgentsToSelectedProfil}
                className="flex items-center justify-center gap-2 px-6 py-3 mt-4 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <Link2Icon className="w-5 h-5" />
                Lier Agents au Profil
              </button>
            </Box>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default ProfilPage;
