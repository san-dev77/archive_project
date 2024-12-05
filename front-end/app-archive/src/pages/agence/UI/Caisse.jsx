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
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import SideBar_agence from "../../../Components/Sidebar_agence";
import TopBar from "../../../Components/Top_bar";
import Loader_component from "../../../Components/Loader";

export default function ShowCaisse() {
  const [caisses, setCaisses] = useState([]);
  const [agenciesData, setAgenciesData] = useState([]);
  const [showRelatedDocuments, setShowRelatedDocuments] = useState(false);
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
    try {
      console.log(newCaisse);

      await axios.post("http://localhost:3000/caisse", newCaisse);
      setNewCaisse({ code_caisse: "", nom_caisse: "", agence_id: "" });
      fetchCaisses();
      toast.success("Nouvelle caisse créée avec succès !");
      setOpenModal(false);
    } catch (error) {
      console.error("Error creating caisse:", error);
      toast.error("Failed to create caisse.");
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
    try {
      await axios.delete(`http://localhost:3000/caisse/${caisseId}`);
      fetchCaisses();
      toast.success("Caisse supprimée avec succès !");
    } catch (error) {
      console.error("Error deleting caisse:", error);
      toast.error("Failed to delete caisse.");
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

  const handleFetchRelatedDocuments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/relations/caisse`
      );
      if (response.data && Array.isArray(response.data)) {
        setRelatedDocuments(response.data);
        setShowRelatedDocuments(!showRelatedDocuments);
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
        <div className="container w-[90%] mx-auto mt-28 bg-white rounded-xl shadow-2xl flex flex-col min-h-screen">
          <div className="bg-white w-full rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-extrabold text-gray-800 flex justify-start w-full">
                <PackageCheck size="28px" className="mr-3 ml-2 text-red-600" />
                Caisses
              </h1>

              <button
                className="btn btn-primary ml-auto mb-4 bg-gray-300 text-black hover:bg-gray-400 transition duration-300 rounded-lg shadow-md"
                onClick={handleOpenModal}
              >
                <Plus size={20} className="mr-2" />
                Nouveau
              </button>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start mb-4 w-full">
              <div className="flex items-start flex-col w-1/2">
                <h2 className="text-lg font-bold text-gray-800 mr-4 w-full">
                  Rechercher :
                </h2>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Rechercher..."
                  className="input w-full input-bordered border-2 border-gray-300 bg-white text-black rounded-lg p-2"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <div className="h-[600px] bg-gray-300 py-2 rounded-lg px-4 overflow-y-auto">
                {Object.keys(groupedCaisses).length === 0 ? (
                  <div className="text-center text-gray-900 mt-4">
                    <ServerOff className="text-red-500 mr-2" size={30} />
                    Aucune caisse disponible.
                  </div>
                ) : (
                  <ul className="list-none w-full">
                    {Object.entries(groupedCaisses).map(
                      ([agencyId, agency]) => (
                        <li key={agencyId} className="w-full">
                          <button
                            className="btn bg-gray-300 text-black hover:bg-gray-400 transition duration-300 rounded-lg shadow-md w-full text-left flex justify-between items-center"
                            onClick={() => toggleAgency(agencyId)}
                          >
                            <div className="flex text-black items-center p-2 rounded-full bg-white">
                              <Landmark className="mr-2" />
                              {agency.nom_agence}
                            </div>
                            {expandedAgency === agencyId ? (
                              <ChevronUp />
                            ) : (
                              <ChevronDown />
                            )}
                          </button>
                          {expandedAgency === agencyId && (
                            <ul className="list-none w-full mt-2 ml-1 border-l-2 border-gray-300 pl-4">
                              {agency.caisses.map((caisse) => (
                                <li
                                  key={caisse.id}
                                  className="w-full flex flex-col justify-between items-start"
                                >
                                  <div
                                    className="flex text-black w-full items-center justify-between p-2 rounded-lg shadow-md bg-white cursor-pointer hover:bg-gray-200 transition duration-300"
                                    onClick={() => {
                                      handleFetchRelatedDocuments(caisse.id);
                                    }}
                                  >
                                    <span className="flex items-center">
                                      <Box className="mr-2" />
                                      {caisse.code_caisse}
                                    </span>

                                    <div className="flex">
                                      <button
                                        className="btn btn-outline bg-gray-600 text-white hover:bg-blue-600 transition duration-300 rounded-md"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditCaisse(caisse);
                                        }}
                                      >
                                        <SquarePen className="mr-1" />
                                      </button>
                                      <button
                                        className="btn btn-outline bg-gray-600 text-white hover:bg-red-600 transition duration-300 rounded-md"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteCaisse(caisse.id);
                                        }}
                                      >
                                        <Trash2 className="mr-1" />
                                      </button>
                                    </div>
                                  </div>
                                  {relatedDocuments.length > 0 && (
                                    <ul className="list-none w-full mt-2 ml-1 border-l-2 border-gray-300 pl-4">
                                      {relatedDocuments.map((doc) => (
                                        <li
                                          key={doc.id}
                                          className="text-black w-full "
                                        >
                                          <div className="flex items-center justify-between w-full p-1 bg-gray-200 rounded-md shadow-sm">
                                            <span className="flex items-center">
                                              <PackageCheck className="mr-2 text-green-600" />
                                              {doc.nom_document_type}
                                            </span>

                                            <button
                                              className="btn btn-outline btn-error btn-sm"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleUnlinkCaisse(doc.id);
                                              }}
                                            >
                                              <Trash2 />
                                            </button>
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      )
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {openModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          onClick={handleCloseModal}
        >
          <div
            className="modal-box bg-white text-black rounded-lg shadow-lg transform transition-all duration-300 max-w-lg w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={handleCloseModal}
            >
              ✕
            </button>
            <h3 className="font-bold text-lg">
              {newCaisse.id
                ? "Modifier la caisse"
                : "Ajouter une nouvelle caisse"}
            </h3>
            <form
              onSubmit={
                newCaisse.id ? handleCaisseUpdated : handleCaisseCreated
              }
            >
              <div className="form-control">
                <label className="label">Sélectionner une agence</label>
                <Select
                  value={agencyOptions.find(
                    (option) => option.value === newCaisse.agence_id
                  )}
                  onChange={handleAgencyChange}
                  options={agencyOptions}
                  className="mb-2"
                  placeholder="Choisir une agence"
                  isClearable
                />
              </div>
              <div className="form-control mt-4">
                <label className="label">Code de la caisse</label>
                <input
                  type="text"
                  value={newCaisse.code_caisse}
                  onChange={(e) =>
                    setNewCaisse({ ...newCaisse, code_caisse: e.target.value })
                  }
                  className="input input-bordered border-2 border-gray-300 bg-white text-black"
                  required
                />
              </div>
              <div className="form-control mt-4">
                <label className="label">Nom de la caisse</label>
                <input
                  type="text"
                  value={newCaisse.nom_caisse}
                  onChange={(e) =>
                    setNewCaisse({ ...newCaisse, nom_caisse: e.target.value })
                  }
                  className="input input-bordered border-2 border-gray-300 bg-white text-black"
                  required
                />
              </div>
              <div className="modal-action flex justify-center items-center">
                <button
                  type="submit"
                  className="btn border-t-neutral-700 w-[40%] bg-gray-300 text-black hover:bg-gray-400 transition duration-300 rounded-lg"
                >
                  {newCaisse.id ? "Mettre à jour" : "Ajouter"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-error w-[40%] mt-2"
                  onClick={handleCloseModal}
                >
                  Annuler
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
