import { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  ServerOff,
  ChevronUp,
  ChevronDown,
  SquarePen,
  Trash2,
  PackageCheck,
  Landmark,
  Box,
  FolderCog,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import SideBar_agence from "../../../Components/Sidebar_agence";
import TopBar from "../../../Components/Top_bar";
import Loader_component from "../../../Components/Loader";
import Swal from "sweetalert2";
import { showDeleteConfirmation } from "../../../utils/alerts";
import DocumentListModal from "../../../Components/DocTypeListAgence";

export default function ShowCaisse() {
  const [caisses, setCaisses] = useState([]);
  const [agenciesData, setAgenciesData] = useState([]);
  // const [showRelatedDocuments, setShowRelatedDocuments] = useState(false);
  const [newCaisse, setNewCaisse] = useState({
    code_caisse: "",
    nom_caisse: "",
    agence_id: "",
  });
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedAgency, setExpandedAgency] = useState(null);
  const [relatedDocuments, setRelatedDocuments] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [showDocumentModal, setShowDocumentModal] = useState(false);

  useEffect(() => {
    fetchCaisses();
    fetchAgencies();
  }, []);

  const fetchCaisses = async () => {
    try {
      const response = await axios.get("http://localhost:3000/caisse/agence/");
      if (response.data && Array.isArray(response.data)) {
        setCaisses(response.data);
      } else {
        console.error("Invalid data format for caisses:", response.data);
        setError("Invalid data format for caisses");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching caisses:", error);
      setError("Failed to fetch caisses");
      setLoading(false);
    }
  };

  const fetchAgencies = async () => {
    try {
      const response = await axios.get("http://localhost:3000/agences");
      console.log(response.data);

      if (response.data && Array.isArray(response.data)) {
        setAgenciesData(response.data);
      } else {
        console.error("Invalid data format for agencies:", response.data);
        setError("Invalid data format for agencies");
      }
    } catch (error) {
      console.error("Error fetching agencies:", error);
      setError("Failed to fetch agencies");
    }
  };

  const handleCaisseCreated = async (event) => {
    event.preventDefault();

    if (!newCaisse.code_caisse || !newCaisse.agence_id) {
      toast.error("Tous les champs doivent être remplis.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/caisse",
        newCaisse
      );

      if (response.code === "ERR_BAD_REQUEST") {
        if (response.data?.message) {
          toast.error(response.data.message);
        } else {
          toast.error("Une erreur est survenue");
        }
        return;
      }

      setNewCaisse({ code_caisse: "", nom_caisse: "", agence_id: "" });
      fetchCaisses();
      toast.success("Nouvelle caisse créée avec succès !");
      setOpenModal(false);
    } catch (error) {
      console.error("Error creating caisse:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Une erreur est survenue lors de la création de la caisse.";
      toast.error(errorMessage);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewCaisse({ code_caisse: "", nom_caisse: "", agence_id: "" });
  };

  const handleAgencyChange = (selectedOption) => {
    setNewCaisse({
      ...newCaisse,
      agence_id: selectedOption ? selectedOption.value : "",
    });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const agencyOptions = agenciesData.map((agency) => ({
    value: agency.id,
    label: agency.nom_agence,
  }));

  const groupedCaisses = caisses.reduce((acc, caisse) => {
    const { agence_id, nom_agence, ...caisseData } = caisse;
    if (!acc[agence_id]) {
      acc[agence_id] = { nom_agence, caisses: [] };
    }
    acc[agence_id].caisses.push(caisseData);
    return acc;
  }, {});

  const toggleAgency = (agencyId) => {
    setExpandedAgency(expandedAgency === agencyId ? null : agencyId);
  };

  const handleEditCaisse = async (caisse) => {
    setNewCaisse({
      id: caisse.id,
      code_caisse: caisse.code_caisse,
      nom_caisse: caisse.nom_caisse,
      agence_id: caisse.agence_id,
    });
    setOpenModal(true);

    try {
      const response = await axios.get(
        `http://localhost:3000/relations/caisse`
      );
      if (response.data && Array.isArray(response.data)) {
        setRelatedDocuments(response.data);
      } else {
        console.error(
          "Invalid data format for related documents:",
          response.data
        );
        setError("Invalid data format for related documents");
      }
    } catch (error) {
      console.error("Error fetching related documents:", error);
      setError("Failed to fetch related documents");
    }
  };

  const handleDeleteCaisse = async (caisseId) => {
    const confirm = await showDeleteConfirmation();
    if (confirm) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/caisse/${caisseId}`
        );
        if (response.status === 200) {
          fetchCaisses();
          toast.success("Caisse supprimée avec succès !");
        } else {
          Swal.fire({
            icon: "error",
            title: "Erreur",
            text:
              response.data.message || "Échec de la suppression de la caisse.",
          });
        }
      } catch (error) {
        console.error("Error deleting caisse:", error);
        const errorMessage =
          error.response?.data?.message ||
          "Une erreur est survenue lors de la suppression.";
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: errorMessage,
        });
      }
    }
  };

  const handleCaisseUpdated = async (event) => {
    event.preventDefault();
    try {
      console.log(newCaisse);

      await axios.put(`http://localhost:3000/caisse/${newCaisse.id}`, {
        code_caisse: newCaisse.code_caisse,
        nom_caisse: newCaisse.nom_caisse,
        id: newCaisse.id,
      });
      setNewCaisse({ code_caisse: "", nom_caisse: "", agence_id: "" });
      fetchCaisses();
      toast.success("Caisse mise à jour avec succès !");
      setOpenModal(false);
    } catch (error) {
      console.error("Error updating caisse:", error);
      toast.error("Failed to update caisse.");
    }
  };

  const handleUnlinkCaisse = async (docId) => {
    const answer = confirm(
      "Cette action supprimera le type de document de toutes les caisses, êtes-vous sûr de vouloir continuer ?"
    );
    if (answer) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/relations/unlink-caisse/${docId}`
        );

        console.log(response);

        if (response.data && response.status === 200) {
          toast.success(
            "Type de documents de toutes les caisses supprimé avec succès !"
          );
          window.location.reload();
        } else {
          toast.error("Erreur lors de la suppression des types de documents.");
        }
      } catch (error) {
        console.error("Error unlinking caisse:", error);
        toast.error("Échec de la suppression des types de documents.");
      }
    }
  };

  const handleShowDocuments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/agence/document-type/relations-caisse`
      );
      console.log(response);

      setDocumentTypes(response.data);
      setShowDocumentModal(true);
    } catch (error) {
      console.error("Error fetching document types:", error);
      toast.error("Échec de la récupération des types de documents.");
    }
  };

  // const handleFetchRelatedDocuments = async () => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:3000/relations/caisse`
  //     );
  //     if (response.data && Array.isArray(response.data)) {
  //       handleShowDocuments();
  //       setRelatedDocuments(response.data);
  //       setShowRelatedDocuments(!showRelatedDocuments);
  //     } else {
  //       console.error(
  //         "Invalid data format for related documents:",
  //         response.data
  //       );
  //       setError("Invalid data format for related documents");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching related documents:", error);
  //     setError("Failed to fetch related documents");
  //   }
  // };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader_component className="loader" />
      </div>
    );
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-300">
      <SideBar_agence isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar position="fixed" title="Caisses" />
        <div className="container w-full mx-auto px-4 py-8 mt-20">
          <div className="bg-gray-800 w-full rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <PackageCheck className="h-8 w-8 text-[#00B7FF] mr-2" />
                Gestion des Caisses
              </h1>
              <button
                onClick={handleOpenModal}
                className="bg-white hover:bg-gray-700 text-black hover:text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
              >
                <Plus className="h-5 w-5 mr-2" />
                Nouvelle Caisse
              </button>

              <button
                onClick={handleShowDocuments}
                className="bg-white  gap-2 hover:bg-gray-700 text-black hover:text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
              >
                <FolderCog />
                Dossiers
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-white mb-1">
                    Rechercher une caisse
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Rechercher par code ou nom..."
                    className="w-full px-4 py-2 bg-[#3a3a3a] text-white border border-[#4a4a4a] rounded-lg focus:ring-2 focus:ring-[#00B7FF] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#3a3a3a] rounded-lg p-4">
              {Object.keys(groupedCaisses).length === 0 ? (
                <div className="text-center py-8">
                  <ServerOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300">Aucune caisse disponible</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(groupedCaisses).map(([agencyId, agency]) => (
                    <div
                      key={agencyId}
                      className="border border-[#4a4a4a] rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleAgency(agencyId)}
                        className="w-full bg-[#2a2a2a] hover:bg-[#404040] px-4 py-3 flex justify-between items-center transition-colors duration-200"
                      >
                        <div className="flex items-center">
                          <Landmark className="h-5 w-5 text-[#00B7FF] mr-2" />
                          <span className="font-medium text-white">
                            {agency.nom_agence}
                          </span>
                        </div>
                        {expandedAgency === agencyId ? (
                          <ChevronUp className="h-5 w-5 text-gray-300" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-300" />
                        )}
                      </button>

                      {expandedAgency === agencyId && (
                        <div className="p-4 space-y-2">
                          {agency.caisses.map((caisse) => (
                            <div
                              key={caisse.id}
                              className="bg-[#2a2a2a] border border-[#4a4a4a] rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <Box className="h-5 w-5 text-[#00B7FF] mr-2" />
                                  <span className="font-medium text-white">
                                    {caisse.code_caisse}
                                  </span>
                                  {caisse.nom_caisse && (
                                    <span className="text-gray-400 ml-2">
                                      ({caisse.nom_caisse})
                                    </span>
                                  )}
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleEditCaisse(caisse)}
                                    className="p-2 text-[#00B7FF] hover:bg-[#404040] rounded-lg transition-colors duration-200"
                                  >
                                    <SquarePen className="h-5 w-5" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteCaisse(caisse.id)
                                    }
                                    className="p-2 text-red-500 hover:bg-[#404040] rounded-lg transition-colors duration-200"
                                  >
                                    <Trash2 className="h-5 w-5" />
                                  </button>
                                </div>
                              </div>

                              {relatedDocuments.length > 0 && (
                                <div className="mt-4 pl-6 border-l-2 border-[#4a4a4a]">
                                  {relatedDocuments.map((doc) => (
                                    <div
                                      key={doc.id}
                                      className="flex justify-between items-center py-2"
                                    >
                                      <div className="flex items-center">
                                        <PackageCheck className="h-4 w-4 text-[#00B7FF] mr-2" />
                                        <span className="text-sm text-gray-300">
                                          {doc.nom_document_type}
                                        </span>
                                      </div>
                                      <button
                                        onClick={() =>
                                          handleUnlinkCaisse(doc.id)
                                        }
                                        className="text-red-500 hover:text-red-400"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {openModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-[#2a2a2a] rounded-lg shadow-xl p-6 w-full max-w-lg mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">
                {newCaisse.id
                  ? "Modifier la caisse"
                  : "Ajouter une nouvelle caisse"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={
                newCaisse.id ? handleCaisseUpdated : handleCaisseCreated
              }
            >
              {!newCaisse.id && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-white mb-1">
                    Agence
                  </label>
                  <Select
                    value={agencyOptions.find(
                      (option) => option.value === newCaisse.agence_id
                    )}
                    onChange={handleAgencyChange}
                    options={agencyOptions}
                    placeholder="Sélectionner une agence"
                    className="text-sm"
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: "#3a3a3a",
                        borderColor: "#4a4a4a",
                        color: "white",
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: "#3a3a3a",
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isFocused
                          ? "#4a4a4a"
                          : "#3a3a3a",
                        color: "white",
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: "white",
                      }),
                    }}
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-white mb-1">
                  Code de la caisse
                </label>
                <input
                  type="text"
                  value={newCaisse.code_caisse}
                  onChange={(e) =>
                    setNewCaisse({ ...newCaisse, code_caisse: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#3a3a3a] text-white border border-[#4a4a4a] rounded-lg focus:ring-2 focus:ring-[#00B7FF] focus:border-transparent"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-1">
                  Nom de la caisse (facultatif)
                </label>
                <input
                  type="text"
                  value={newCaisse.nom_caisse}
                  onChange={(e) =>
                    setNewCaisse({ ...newCaisse, nom_caisse: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#3a3a3a] text-white border border-[#4a4a4a] rounded-lg focus:ring-2 focus:ring-[#00B7FF] focus:border-transparent"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#4a4a4a] rounded-lg hover:bg-[#5a5a5a] focus:outline-none focus:ring-2 focus:ring-[#6a6a6a]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#00B7FF] rounded-lg hover:bg-[#0096FF] focus:outline-none focus:ring-2 focus:ring-[#00B7FF]"
                >
                  {newCaisse.id ? "Mettre à jour" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showDocumentModal && (
        <DocumentListModal
          documentTypes={documentTypes}
          onClose={() => setShowDocumentModal(false)}
        />
      )}

      <ToastContainer />
    </div>
  );
}
