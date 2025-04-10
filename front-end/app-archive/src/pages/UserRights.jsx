import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideBar from "../Components/Side_bar";
import TopBar from "../Components/Top_bar";
import { Checkbox, Modal } from "@mui/material";
import axios from "axios";
import { CSSTransition } from "react-transition-group";
import "./styles/UserRights.css";
import { ListCheckIcon } from "lucide-react";

const translateAction = (action) => {
  switch (action) {
    case "view":
      return "Afficher";
    case "delete":
      return "Supprimer";
    case "edit":
      return "Modifier";
    case "search":
      return "Rechercher";
    default:
      return action;
  }
};

const translateActionToEnglish = (action) => {
  switch (action) {
    case "Afficher":
      return "view";
    case "Supprimer":
      return "delete";
    case "Modifier":
      return "edit";
    case "Rechercher":
      return "search";
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
        console.log(response);

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
    <div className="flex h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <SideBar isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <div className="p-6 mt-20 flex-1 overflow-y-auto">
          {/* Carte d'information - Similaire à Show_service et Profile_page */}
          <div className="mx-auto w-full mb-6">
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl shadow-2xl p-6 border border-green-400/30 relative">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    <ListCheckIcon className="text-green-300" />
                    Gestion des Droits Utilisateurs
                  </h2>
                  <p className="text-green-100 mb-4">
                    Configurez précisément les permissions pour chaque profil
                    utilisateur. Déterminez quelles actions peuvent être
                    effectuées par chaque profil pour assurer un contrôle
                    d'accès cohérent et sécurisé.
                  </p>
                </div>
                <div className="hidden lg:block">
                  <div className="w-48 h-48 relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 to-emerald-600/20 rounded-full animate-pulse"></div>
                    <div className="absolute inset-4 bg-gradient-to-tr from-green-500/40 to-emerald-600/40 rounded-full animate-pulse delay-75"></div>
                    <div className="absolute inset-8 bg-gradient-to-tr from-green-500/60 to-emerald-600/60 rounded-full animate-pulse delay-150"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ListCheckIcon className="w-16 h-16 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profils Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
              <div className="flex items-center gap-2 mb-4">
                <span className="p-2 bg-green-100 rounded-lg">
                  <ListCheckIcon className="h-5 w-5 text-green-600" />
                </span>
                <h2 className="text-lg font-semibold text-green-800">
                  Sélection du Profil
                </h2>
              </div>
              <div className="space-y-2">
                {profils.map((profil) => (
                  <button
                    key={profil.id}
                    onClick={() => handleSelectProfil(profil)}
                    className={`w-full font-bold text-left px-4 py-3 rounded-lg transition-all ${
                      selectedProfil && selectedProfil.id === profil.id
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                    } border`}
                  >
                    {profil.nom_profil}
                  </button>
                ))}
              </div>
            </div>

            {/* Sections Panel */}
            <CSSTransition
              in={!!selectedProfil}
              timeout={300}
              classNames="fade"
              unmountOnExit
            >
              <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
                <div className="flex items-center gap-2 mb-4">
                  <span className="p-2 bg-green-100 rounded-lg">
                    <ListCheckIcon className="h-5 w-5 text-green-600" />
                  </span>
                  <h2 className="text-lg font-semibold text-green-800">
                    Sections Disponibles
                  </h2>
                </div>
                <div className="space-y-2">
                  {Object.keys(groupedElements).map((section) => (
                    <button
                      key={section}
                      onClick={() => handleSelectSection(section)}
                      className={`w-full font-bold text-left px-4 py-3 rounded-lg transition-all ${
                        selectedSection === section
                          ? "bg-green-50 border-green-200 text-green-700"
                          : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                      } border`}
                    >
                      {section}
                    </button>
                  ))}
                </div>
              </div>
            </CSSTransition>

            {/* Actions Panel */}
            <CSSTransition
              in={!!selectedSection}
              timeout={300}
              classNames="fade"
              unmountOnExit
            >
              <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
                <div className="flex items-center gap-2 mb-4">
                  <span className="p-2 bg-green-100 rounded-lg">
                    <ListCheckIcon className="h-5 w-5 text-green-600" />
                  </span>
                  <h2 className="text-lg font-semibold text-green-800">
                    Actions - {selectedSection}
                  </h2>
                </div>
                <div className="space-y-3">
                  {groupedElements[selectedSection] &&
                    groupedElements[selectedSection].map((action) => (
                      <label
                        key={action.id}
                        className="flex items-center space-x-3 p-2 hover:bg-green-50 rounded-lg cursor-pointer"
                      >
                        <Checkbox
                          checked={action.selected || false}
                          onChange={() => handleToggleAction(action.id)}
                          sx={{
                            color: "#10b981", // text-green-500
                            "&.Mui-checked": {
                              color: "#047857", // text-green-700
                            },
                          }}
                        />
                        <span className="text-gray-700">
                          {translateAction(action.action)}
                        </span>
                      </label>
                    ))}
                </div>
              </div>
            </CSSTransition>
          </div>

          {/* Preview Button */}
          <button
            onClick={handleOpenModal}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
          >
            <ListCheckIcon className="h-5 w-5" />
            Prévisualiser les modifications
          </button>
        </div>
      </div>

      {/* Modal avec le style cohérent */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        className="flex items-center justify-center"
      >
        <div className="bg-white rounded-xl shadow-2xl w-2/3 max-h-[80vh] overflow-y-auto p-6 border border-green-100">
          <div className="border-b border-green-100 pb-4 mb-4">
            <h2 className="text-xl font-bold text-green-800 flex items-center gap-2">
              <ListCheckIcon className="h-5 w-5 text-green-600" />
              Prévisualisation des Modifications
            </h2>
          </div>

          {selectedProfil ? (
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800">
                  Profil: {selectedProfil.nom_profil}
                </h3>
              </div>

              <div className="space-y-4">
                {Object.keys(groupedElements).map(
                  (section) =>
                    groupedElements[section].filter(
                      (element) => element.selected
                    ).length > 0 && (
                      <div
                        key={section}
                        className="bg-gray-50 p-4 rounded-lg space-y-2 border border-green-50"
                      >
                        <h4 className="font-semibold text-green-700">
                          {section}
                        </h4>
                        <div className="ml-4 space-y-1">
                          {groupedElements[section]
                            .filter((element) => element.selected)
                            .map((action) => (
                              <div
                                key={action.id}
                                className="text-gray-600 flex items-center gap-2"
                              >
                                <span className="w-2 h-2 bg-green-400 rounded-full" />
                                {translateAction(action.action)}
                              </div>
                            ))}
                        </div>
                      </div>
                    )
                )}
              </div>

              <button
                onClick={handleSendToBackend}
                className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                Confirmer les modifications
              </button>
            </div>
          ) : (
            <div className="text-center text-gray-600 py-8">
              Veuillez sélectionner un profil et des éléments pour continuer.
            </div>
          )}
        </div>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default UserRights;
