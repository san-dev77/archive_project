import React, { useState, useEffect } from "react";
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
  Divider,
  Fab,
  Modal,
  Switch,
  Tooltip,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { LinkOutlined } from "@mui/icons-material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Blend,
  Grip,
  Link2Icon,
  SquarePen,
  Trash2,
  UserRound,
  UserRoundPlus,
  Users,
  Zap,
  ZapIcon,
} from "lucide-react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const ItemTypes = {
  AGENT: "agent",
};

const AgentDetails = ({ agent }) => (
  <Box>
    <Typography variant="h6">{agent.nom}</Typography>
    <Typography variant="body2">Email: {agent.email}</Typography>
    <Typography variant="body2">Téléphone: {agent.telephone}</Typography>
    <Typography variant="body2">Adresse: {agent.adresse}</Typography>
  </Box>
);

const ToggleSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "deepskyblue",
    boxShadow: "0 0 0 1px deepskyblue", // Utilisation d'une couleur fixe
    "&:hover": {
      backgroundColor: "deepskyblue",
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#1976d2", // Utilisation d'une couleur fixe
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
  const [openModal, setOpenModal] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [showAgentList, setShowAgentList] = useState(false);
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
        const response = await axios.get("http://localhost:3000/agents");
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
    try {
      await axios.delete(`http://localhost:3000/profil/${id}`);
      setProfils(profils.filter((profil) => profil.id !== id));
      toast.success("Profil supprimé avec succès!", toastOptions);
    } catch (error) {
      console.error("Erreur lors de la suppression du profil:", error);
      toast.error("Erreur lors de la suppression du profil.", toastOptions);
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

  const handleCloseModal = () => {
    setSelectedProfil(null);
    setOpenModal(false);
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

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModalDuplicate = () => {
    setOpenModal(false);
  };

  const handleToggleAgent = (agentId) => {
    setSelectedAgents((prevSelected) =>
      prevSelected.includes(agentId)
        ? prevSelected.filter((id) => id !== agentId)
        : [...prevSelected, agentId]
    );
  };

  const handleLinkAgentsToProfil = async () => {
    try {
      await axios.post("http://localhost:3000/link-agents-profil", {
        agentIds: selectedAgents,
        profilId: selectedProfil.id,
      });
      toast.success("Agents liés au profil avec succès!", toastOptions);
      setSelectedAgents([]);
    } catch (error) {
      console.error("Erreur lors de la liaison des agents au profil:", error);
      toast.error(
        "Erreur lors de la liaison des agents au profil.",
        toastOptions
      );
    }
  };

  const handleSelectProfil = (profil) => {
    setSelectedProfil(profil);
    setActiveProfilId(profil.id);
    setShowAgentList(true);
  };

  const handleDeselectProfil = () => {
    setSelectedProfil(null);
    setActiveProfilId(null);
    setShowAgentList(false);
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
        setShowAgentList(false);
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
  const navigate = useNavigate();
  const handleRightPage = () => {
    navigate("/rights");
  };

  const filteredAgents = agents.filter((agent) =>
    `${agent.prenom} ${agent.nom}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleRemoveAgent = (agentId) => {
    setSelectedAgents((prevSelected) =>
      prevSelected.filter((id) => id !== agentId)
    );
  };

  const handleRemoveLinkedAgent = async (agentId) => {
    try {
      await axios.delete(
        `http://localhost:3000/unlink-agent-profil/${agentId}/${selectedProfil.id}`
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
  };

  const handleRemoveAction = async (actionId) => {
    console.log(actionId);
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
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: "flex", height: "100vh" }}>
        <SideBar isVisible={true} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <TopBar />
          <Container style={{ padding: "20px", flex: 1, overflowY: "auto" }}>
            <Paper style={{ padding: "20px", marginTop: "70px" }}>
              <Typography variant="h4" gutterBottom>
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
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showDescription}
                      onChange={(e) => setShowDescription(e.target.checked)}
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
                  />
                )}
                <button
                  className="btn btn-outline border-t-neutral-700 mt-5"
                  onClick={handleCreateProfil}
                >
                  Créer Profil
                </button>
              </Box>
            </Paper>
            <Paper style={{ padding: "20px", marginTop: "20px" }}>
              <Typography variant="h4" gutterBottom>
                Liste des Profils
              </Typography>
              <List>
                {profils.map((profil) => (
                  <ListItem
                    sx={{
                      borderRadius: "20px",
                      boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.4)",
                      transition: "background-color 0.3s",
                    }}
                    key={profil.id}
                    button
                    onClick={() => handleSelectProfil(profil)}
                    style={{
                      borderRadius: "20px",
                      backgroundColor:
                        activeProfilId === profil.id ? "gray" : "transparent",
                      color: activeProfilId === profil.id ? "white" : "black",
                      transition: "background-color 0.3s",
                    }}
                  >
                    <ListItemText
                      primary={
                        <div
                          style={{
                            padding: "5px",
                            borderBottom: "1px solid #000",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Grip style={{ marginRight: "8px" }} />{" "}
                          {profil.nom_profil}
                        </div>
                      }
                      secondary={profil.description}
                    />
                    <Tooltip title="Ajouter agent au profil">
                      <IconButton
                        edge="end"
                        aria-label="link"
                        onClick={() => handleOpenLinkModal(profil)}
                      >
                        <UserRoundPlus style={{ color: "cyan" }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Modifier">
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => handleEditProfil(profil)}
                      >
                        <SquarePen style={{ color: "lightgreen" }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Agents">
                      <IconButton
                        edge="end"
                        aria-label="view"
                        onClick={() => handleWatchProfil(profil)}
                      >
                        <Users style={{ color: "deepskyblue" }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Les actions du profils">
                      <IconButton
                        edge="end"
                        aria-label="actions"
                        onClick={() => handleOpenActionsModal(profil)}
                      >
                        <ZapIcon style={{ color: "yellow" }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Activer/désactiver le profil">
                      <ToggleSwitch
                        checked={profil.activation}
                        onChange={() => {
                          console.log(
                            "Profil avant appel de handleToggleActiveProfil:",
                            profil
                          );
                          handleToggleActiveProfil(profil.id);
                        }}
                        name="toggleActive"
                        inputProps={{ "aria-label": "secondary checkbox" }}
                      />
                    </Tooltip>
                    <Tooltip title="Supprimer le profil">
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteProfil(profil.id)}
                      >
                        <Trash2 style={{ color: "crimson" }} />
                      </IconButton>
                    </Tooltip>
                    <Divider fullWidth />
                  </ListItem>
                ))}
              </List>
            </Paper>
            <Tooltip title="Nouvaux droits">
              <Fab
                aria-label="add-action"
                onClick={() => handleRightPage()}
                style={{
                  position: "fixed",
                  bottom: 16,
                  right: 56,
                  backgroundColor: "gray",
                  color: "white",
                }}
              >
                + <Zap />
              </Fab>
            </Tooltip>
          </Container>
        </div>
        <ToastContainer />

        <Modal open={openEditModal} onClose={handleCloseEditModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 600,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Modifier Profil
            </Typography>
            <TextField
              label="Nom du profil"
              variant="outlined"
              value={editNomProfil}
              onChange={(e) => setEditNomProfil(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              variant="outlined"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              fullWidth
              margin="normal"
            />
            <button
              className="btn btn-outline border-t-neutral-700 mt-5"
              onClick={handleUpdateProfil}
              style={{ marginTop: "20px" }}
            >
              Mettre à jour
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
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Blend
                size="30px"
                style={{ color: "gray", marginRight: "10px" }}
              />
              Agents liés au Profil
            </Typography>
            {selectedProfil && (
              <Typography variant="h6" gutterBottom>
                <LinkOutlined />
                {selectedProfil.nom_profil}
              </Typography>
            )}
            <List style={{ maxHeight: "400px", overflowY: "auto" }}>
              {linkedAgents.map((agent) => (
                <ListItem
                  sx={{ borderBottom: "1px solid #000" }}
                  key={agent.id}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: "40px",
                      padding: "10px",
                      margin: "0 10px",
                      borderRadius: "50%",
                      backgroundColor: "gray",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <UserRound color="white" size={24} />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${agent.nom} ${agent.prenom}`}
                    secondary={`Fonction: ${agent.nom_role}, service: ${agent.nom_service} `}
                  />
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleRemoveLinkedAgent(agent.id)}
                  >
                    <Trash2 style={{ color: "crimson" }} />
                  </IconButton>
                </ListItem>
              ))}
            </List>
            <button
              className="btn btn-outline border-t-neutral-700 mt-5"
              onClick={handleCloseViewModal}
              style={{ marginTop: "20px" }}
            >
              Fermer
            </button>
          </Box>
        </Modal>

        <Modal open={openActionsModal} onClose={handleCloseActionsModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 600,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Actions pour le Profil{" "}
              {selectedActionProfil && selectedActionProfil.nom_profil}
            </Typography>
            {Object.entries(groupActionsBySection(actions)).map(
              ([section, actions]) => (
                <Accordion key={section}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel-${section}-content`}
                    id={`panel-${section}-header`}
                  >
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: "#000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                      }}
                    >
                      <ZapIcon size={20} />
                      {section}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      {actions.map((action) => (
                        <ListItem button key={action.id}>
                          <ListItemIcon className="mr-20 flex justify-center gap-2 rounded-lg btn btn-outline border-t-neutral-700 items-center">
                            <ZapIcon size={20} />
                            <ListItemText
                              sx={{ color: "#000" }}
                              primary={action.action}
                            />
                          </ListItemIcon>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleRemoveAction(action)}
                          >
                            <Trash2 style={{ color: "crimson" }} />
                          </IconButton>
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              )
            )}
            <button
              className="btn btn-outline border-t-neutral-700 mt-5"
              onClick={handleCloseActionsModal}
              style={{ marginTop: "20px" }}
            >
              Fermer
            </button>
          </Box>
        </Modal>

        <Modal open={openLinkModal} onClose={handleCloseLinkModal}>
          <Box
            sx={{
              position: "absolute",
              borderRadius: "20px",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 600,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Lier des Agents au Profil{" "}
              {selectedProfil && selectedProfil.nom_profil}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", mt: 4 }}>
              <TextField
                label="Rechercher un agent"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                margin="normal"
              />
              <Typography variant="h5" gutterBottom>
                Agents
              </Typography>
              <List style={{ maxHeight: "200px", overflowY: "auto" }}>
                {filteredAgents.map((agent) => (
                  <ListItem key={agent.id}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedAgents.includes(agent.id)}
                          onChange={() => handleToggleAgent(agent.id)}
                        />
                      }
                      label={`${agent.prenom} ${agent.nom} - Fonction: ${agent.nom_role} - ${agent.nom_service}`}
                    />
                  </ListItem>
                ))}
              </List>
              <button
                className="btn btn-outline border-t-neutral-700 mt-5"
                onClick={handleLinkAgentsToSelectedProfil}
              >
                <Link2Icon />
                Lier Agents au Profil
              </button>
            </Box>
          </Box>
        </Modal>
      </div>
    </DndProvider>
  );
};

export default ProfilPage;
