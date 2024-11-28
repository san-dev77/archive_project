import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideBar from "../Components/Side_bar";
import TopBar from "../Components/Top_bar";
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  FormControlLabel,
  Box,
  Modal,
} from "@mui/material";
import axios from "axios";
import { CSSTransition } from "react-transition-group";
import "./styles/UserRights.css";
import { ListCheckIcon } from "lucide-react";

const translateAction = (action) => {
  switch (action) {
    case "view":
      return "afficher";
    case "delete":
      return "supprimer";
    case "edit":
      return "modifier";
    default:
      return action;
  }
};

const translateActionToEnglish = (action) => {
  switch (action) {
    case "afficher":
      return "view";
    case "supprimer":
      return "delete";
    case "modifier":
      return "edit";
    default:
      return action;
  }
};

const UserRights = () => {
  const [profils, setProfils] = useState([]);
  const [selectedProfil, setSelectedProfil] = useState(null);
  const [groupedElements, setGroupedElements] = useState({});
  const [selectedSection, setSelectedSection] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [existingActions, setExistingActions] = useState([]);

  useEffect(() => {
    const fetchProfils = async () => {
      try {
        const response = await axios.get("http://localhost:3000/profil/");
        setProfils(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des profils:", error);
      }
    };

    const fetchActions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/rights/permissions"
        );
        const grouped = response.data.reduce((acc, element) => {
          const section = element.section || element.rubrique;
          if (!acc[section]) {
            acc[section] = [];
          }
          acc[section].push(element);
          return acc;
        }, {});
        setGroupedElements(grouped);
      } catch (error) {
        console.error("Erreur lors de la récupération des actions:", error);
      }
    };

    fetchProfils();
    fetchActions();
  }, []);

  useEffect(() => {
    if (selectedProfil) {
      const fetchExistingActions = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/rights/${selectedProfil.id}`
          );
          const translatedActions = response.data.map((action) => ({
            ...action,
            action: translateAction(action.action),
          }));
          setExistingActions(translatedActions);

          // Marquer les actions existantes comme sélectionnées
          setGroupedElements((prev) => {
            const newGrouped = { ...prev };
            translatedActions.forEach((existingAction) => {
              const section = existingAction.section || existingAction.rubrique;
              if (newGrouped[section]) {
                newGrouped[section] = newGrouped[section].map((element) =>
                  element.action === existingAction.action
                    ? { ...element, selected: true }
                    : element
                );
              }
            });
            return newGrouped;
          });
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des actions existantes:",
            error
          );
        }
      };

      fetchExistingActions();
    }
  }, [selectedProfil]);

  const handleSelectProfil = (profil) => {
    setSelectedProfil(profil);
    setSelectedSection(null);
  };

  const handleSelectSection = (section) => {
    setSelectedSection(section);
  };

  const handleToggleAction = (elementId) => {
    setGroupedElements((prev) => {
      const newGrouped = { ...prev };
      const section = Object.keys(newGrouped).find((section) =>
        newGrouped[section].some((element) => element.id === elementId)
      );
      newGrouped[section] = newGrouped[section].map((element) =>
        element.id === elementId
          ? { ...element, selected: !element.selected }
          : element
      );
      return newGrouped;
    });
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSendToBackend = async () => {
    // Créez un tableau d'actions sélectionnées avec le bon format
    const newActions = Object.keys(groupedElements).flatMap((section) =>
      groupedElements[section]
        .filter((element) => element.selected)
        .map((element) => ({
          id: element.id,
          action: `${section}:${translateActionToEnglish(element.action)}`,
        }))
    );

    if (newActions.length === 0) {
      toast.warn(
        "Aucun élément sélectionné. Veuillez sélectionner au moins une action."
      );
      return;
    }

    // Normaliser les actions existantes pour qu'elles aient le même format que les nouvelles actions
    const normalizedExistingActions = existingActions.map((action) => ({
      id: action.permission_id, // Utilisez `permission_id` comme `id`
      action: `${action.section}:${translateActionToEnglish(action.action)}`,
    }));

    // Log pour vérifier le format des actions avant l'envoi
    console.log("Actions à envoyer:", newActions);

    const mergedActions = [...normalizedExistingActions, ...newActions].reduce(
      (acc, action) => {
        if (!acc.some((a) => a.id === action.id)) {
          acc.push(action);
        }
        return acc;
      },
      []
    );

    const data = {
      profilId: selectedProfil.id,
      actions: mergedActions,
    };

    try {
      console.log("Données envoyées:", data);
      await axios.post("http://localhost:3000/rights/link", data);
      toast.success("Données envoyées avec succès");
    } catch (error) {
      console.error("Erreur lors de l'envoi des données:", error);
      toast.error("Erreur lors de l'envoi des données");
    }
  };

  // const handleBackPage = () => {
  //     window.location.href = '/profil';
  // };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <SideBar isVisible={true} />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          marginLeft: "0px",
          borderRadius: "20px",
        }}
      >
        <TopBar />
        <Container style={{ padding: "20px", flex: 1, overflowY: "auto" }}>
          <Paper style={{ padding: "20px", marginTop: "70px" }}>
            <Typography variant="h4" gutterBottom>
              Gestion des Droits Utilisateurs
            </Typography>

            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Box flex={1} marginRight="20px">
                <Typography variant="h5" gutterBottom>
                  1. Sélectionner un Profil
                </Typography>
                <List>
                  {profils.map((profil) => (
                    <ListItem
                      key={profil.id}
                      button
                      onClick={() => handleSelectProfil(profil)}
                      selected={
                        selectedProfil && selectedProfil.id === profil.id
                      }
                      style={{
                        backgroundColor:
                          selectedProfil && selectedProfil.id === profil.id
                            ? "#f0f0f0"
                            : "white",
                        border: "1px solid #ddd",
                        borderRadius: "5px",
                        marginBottom: "10px",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                      }}
                    >
                      <ListItemText primary={profil.nom_profil} />
                    </ListItem>
                  ))}
                </List>
              </Box>

              <CSSTransition
                in={!!selectedProfil}
                timeout={300}
                classNames="fade"
                unmountOnExit
              >
                <Box flex={1} marginRight="20px">
                  <Typography variant="h5" gutterBottom>
                    2. Sélectionner des Sections
                  </Typography>
                  <List>
                    {Object.keys(groupedElements).map((section) => (
                      <ListItem
                        key={section}
                        button
                        onClick={() => handleSelectSection(section)}
                        style={{
                          backgroundColor:
                            selectedSection === section ? "#f0f0f0" : "white",
                          border: "1px solid #ddd",
                          borderRadius: "5px",
                          marginBottom: "10px",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                        }}
                      >
                        <ListItemText primary={section} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </CSSTransition>

              <CSSTransition
                in={!!selectedSection}
                timeout={300}
                classNames="fade"
                unmountOnExit
              >
                <Box flex={1}>
                  <Typography variant="h5" gutterBottom>
                    3. Actions pour {selectedSection}
                  </Typography>
                  <Box>
                    {groupedElements[selectedSection] &&
                      groupedElements[selectedSection].map((action) => (
                        <FormControlLabel
                          key={action.id}
                          control={
                            <Checkbox
                              checked={action.selected || false}
                              onChange={() => handleToggleAction(action.id)}
                            />
                          }
                          label={translateAction(action.action)}
                        />
                      ))}
                  </Box>
                </Box>
              </CSSTransition>
            </Box>
            <button
              className="btn btn-outline border-t-neutral-700 text-black mt-5"
              onClick={handleOpenModal}
            >
              <ListCheckIcon size={20} className="mr-2" />
              Prévisualiser
            </button>
          </Paper>
        </Container>
      </div>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          style={{
            padding: "20px",
            width: "50%",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Prévisualisation des Droits Utilisateurs
          </Typography>
          {selectedProfil ? (
            <>
              <Typography variant="h6">
                Profil: {selectedProfil.nom_profil}
              </Typography>
              <Typography variant="h6">Éléments Modifiés:</Typography>
              <List>
                {Object.keys(groupedElements).map(
                  (section) =>
                    groupedElements[section].filter(
                      (element) => element.selected
                    ).length > 0 && (
                      <ListItem key={section}>
                        <ListItemText primary={section} />
                        <List>
                          {groupedElements[section]
                            .filter((element) => element.selected)
                            .map((action) => (
                              <ListItem key={action.id}>
                                <ListItemText
                                  primary={translateAction(action.action)}
                                />
                              </ListItem>
                            ))}
                        </List>
                      </ListItem>
                    )
                )}
              </List>
              <button
                className="btn btn-outline border-t-neutral-700 text-black mt-5"
                onClick={handleSendToBackend}
              >
                Envoyer
              </button>
            </>
          ) : (
            <Typography variant="h6">
              Aucun profil sélectionné. Veuillez sélectionner un profil et des
              éléments.
            </Typography>
          )}
        </Paper>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default UserRights;
