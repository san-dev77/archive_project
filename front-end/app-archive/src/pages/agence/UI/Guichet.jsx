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
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import SideBar_agence from "../../../Components/Sidebar_agence";
import TopBar from "../../../Components/Top_bar";
import Loader_component from "../../../Components/Loader";
import { showDeleteConfirmation } from "../../../utils/alerts";
import Swal from "sweetalert2";

export default function ShowGuichet() {
  const [guichets, setGuichets] = useState([]);
  const [agenciesData, setAgenciesData] = useState([]);
  const [newGuichet, setNewGuichet] = useState({
    code_guichet: "",
    nom_guichet: "",
    agence_id: "",
  });
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedAgency, setExpandedAgency] = useState(null);

  useEffect(() => {
    fetchGuichets();
    fetchAgencies();
  }, []);

  const fetchGuichets = async () => {
    try {
      const response = await axios.get("http://localhost:3000/guichet/agence/");
      if (response.data && Array.isArray(response.data)) {
        setGuichets(response.data);
      } else {
        console.error("Invalid data format for guichets:", response.data);
        setError("Invalid data format for guichets");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching guichets:", error);
      setError("Failed to fetch guichets");
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

  const handleGuichetCreated = async (event) => {
    event.preventDefault();

    if (!newGuichet.code_guichet || !newGuichet.agence_id) {
      toast.error("Tous les champs doivent être remplis.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/guichet",
        newGuichet
      );

      if (response.code === "ERR_BAD_REQUEST") {
        if (response.data?.message) {
          toast.error(response.data.message);
        } else {
          toast.error("Une erreur est survenue");
        }
        return;
      }

      setNewGuichet({ code_guichet: "", nom_guichet: "", agence_id: "" });
      fetchGuichets();
      toast.success("Nouveau guichet créé avec succès !");
      setOpenModal(false);
    } catch (error) {
      console.error("Error creating guichet:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Une erreur est survenue lors de la création du guichet.";
      toast.error(errorMessage);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewGuichet({ code_guichet: "", nom_guichet: "", agence_id: "" });
  };

  const handleAgencyChange = (selectedOption) => {
    setNewGuichet({
      ...newGuichet,
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

  const groupedGuichets = guichets.reduce((acc, guichet) => {
    const { agence_id, nom_agence, ...guichetData } = guichet;
    if (!acc[agence_id]) {
      acc[agence_id] = { nom_agence, guichets: [] };
    }
    acc[agence_id].guichets.push(guichetData);
    return acc;
  }, {});

  const toggleAgency = (agencyId) => {
    setExpandedAgency(expandedAgency === agencyId ? null : agencyId);
  };

  const handleEditGuichet = async (guichet) => {
    setNewGuichet({
      id: guichet.id,
      code_guichet: guichet.code_guichet,
      nom_guichet: guichet.nom_guichet,
      agence_id: guichet.agence_id,
    });
    setOpenModal(true);

    try {
      const response = await axios.get(
        `http://localhost:3000/relations/guichet`
      );
      if (response.data && Array.isArray(response.data)) {
        console.log();
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

  const handleDeleteGuichet = async (guichetId) => {
    const confirm = await showDeleteConfirmation();
    if (confirm) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/guichet/${guichetId}`
        );
        if (response.status === 200) {
          fetchGuichets();
          toast.success("Guichet supprimé avec succès !");
        } else {
          Swal.fire({
            icon: "error",
            title: "Erreur",
            text:
              response.data.message || "Échec de la suppression du guichet.",
          });
        }
      } catch (error) {
        console.error("Error deleting guichet:", error);
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

  const handleGuichetUpdated = async (event) => {
    event.preventDefault();
    try {
      console.log(newGuichet);

      await axios.put(`http://localhost:3000/guichet/${newGuichet.id}`, {
        code_guichet: newGuichet.code_guichet,
        nom_guichet: newGuichet.nom_guichet,
        id: newGuichet.id,
      });
      setNewGuichet({ code_guichet: "", nom_guichet: "", agence_id: "" });
      fetchGuichets();
      toast.success("Guichet mis à jour avec succès !");
      setOpenModal(false);
    } catch (error) {
      console.error("Error updating guichet:", error);
      toast.error("Failed to update guichet.");
    }
  };

  // const handleFetchRelatedDocuments = async () => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:3000/relations/guichet`
  //     );
  //     if (response.data && Array.isArray(response.data)) {
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
        <TopBar position="fixed" title="Guichets" />
        <div className="container w-full mx-auto px-4 py-8 mt-20">
          <div className="bg-gray-800 w-full rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <PackageCheck className="h-8 w-8 text-[#00B7FF] mr-2" />
                Gestion des Guichets
              </h1>
              <button
                onClick={handleOpenModal}
                className="bg-white hover:bg-gray-700 text-black hover:text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
              >
                <Plus className="h-5 w-5 mr-2" />
                Nouveau Guichet
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-white mb-1">
                    Rechercher un guichet
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
              {Object.keys(groupedGuichets).length === 0 ? (
                <div className="text-center py-8">
                  <ServerOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300">Aucun guichet disponible</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(groupedGuichets).map(([agencyId, agency]) => (
                    <div key={agencyId} className="bg-[#4a4a4a] rounded-lg p-4">
                      <button
                        onClick={() => toggleAgency(agencyId)}
                        className="w-full flex justify-between items-center text-white hover:text-[#00B7FF] transition-colors duration-200"
                      >
                        <span className="font-medium">{agency.nom_agence}</span>
                        {expandedAgency === agencyId ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </button>

                      {expandedAgency === agencyId && (
                        <div className="mt-4 space-y-3">
                          {agency.guichets.map((guichet) => (
                            <div
                              key={guichet.id}
                              className="bg-[#5a5a5a] rounded-lg p-4 flex justify-between items-center"
                            >
                              <div className="text-white">
                                <p className="font-medium">
                                  {guichet.nom_guichet}
                                </p>
                                <p className="text-sm text-gray-300">
                                  Code: {guichet.code_guichet}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditGuichet(guichet)}
                                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                                >
                                  <SquarePen className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteGuichet(guichet.id)
                                  }
                                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {newGuichet.id ? "Modifier le guichet" : "Nouveau guichet"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={
                newGuichet.id ? handleGuichetUpdated : handleGuichetCreated
              }
              className="space-y-4"
            >
              {!newGuichet.id && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Agence
                  </label>
                  <Select
                    value={agencyOptions.find(
                      (option) => option.value === newGuichet.agence_id
                    )}
                    onChange={handleAgencyChange}
                    options={agencyOptions}
                    className="basic-single"
                    classNamePrefix="select"
                    placeholder="Sélectionner une agence"
                    isClearable
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code du guichet
                </label>
                <input
                  type="text"
                  value={newGuichet.code_guichet}
                  onChange={(e) =>
                    setNewGuichet({
                      ...newGuichet,
                      code_guichet: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00B7FF]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du guichet
                </label>
                <input
                  type="text"
                  value={newGuichet.nom_guichet}
                  onChange={(e) =>
                    setNewGuichet({
                      ...newGuichet,
                      nom_guichet: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00B7FF]"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#00B7FF] rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {newGuichet.id ? "Mettre à jour" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
