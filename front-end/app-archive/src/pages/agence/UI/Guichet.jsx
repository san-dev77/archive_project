import { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  ServerOff,
  ChevronUp,
  ChevronDown,
  SquarePen,
  Trash2,
  TicketCheck,
  Landmark,
  FileSymlink,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import SideBar_agence from "../../../Components/Sidebar_agence";
import TopBar from "../../../Components/Top_bar";

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
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchGuichets();
    fetchAgencies();
    fetchDocuments();
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
    try {
      console.log(newGuichet);

      await axios.post("http://localhost:3000/guichet", newGuichet);
      setNewGuichet({ code_guichet: "", nom_guichet: "", agence_id: "" });
      fetchGuichets();
      toast.success("Nouveau guichet créé avec succès !");
      setOpenModal(false);
    } catch (error) {
      console.error("Error creating guichet:", error);
      toast.error("Failed to create guichet.");
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

  const handleEditGuichet = (guichet) => {
    setNewGuichet({
      id: guichet.id,
      code_guichet: guichet.code_guichet,
      nom_guichet: guichet.nom_guichet,
      agence_id: guichet.agence_id,
    });
    setOpenModal(true);
  };

  const handleDeleteGuichet = async (guichetId) => {
    try {
      await axios.delete(`http://localhost:3000/guichet/${guichetId}`);
      fetchGuichets();
      toast.success("Guichet supprimé avec succès !");
    } catch (error) {
      console.error("Error deleting guichet:", error);
      toast.error("Failed to delete guichet.");
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
      toast.success("Guichet mise à jour avec succès !");
      setOpenModal(false);
    } catch (error) {
      console.error("Error updating guichet:", error);
      toast.error("Failed to update guichet.");
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/relations/guichet`
      );
      if (response.data && Array.isArray(response.data)) {
        setDocuments(response.data);
      } else {
        console.error("Invalid data format for documents:", response.data);
        setError("Invalid data format for documents");
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      setError("Failed to fetch documents");
    }
  };

  const handleGuichetClick = () => {
    // Pas besoin de rappeler fetchDocuments ici
    // Vous pouvez simplement afficher les documents déjà chargés
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-300">
      <SideBar_agence isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar position="fixed" title="Guichets" />
        <div className="container w-[90%] mx-auto mt-28 bg-white rounded-xl shadow-2xl flex flex-col min-h-screen">
          <div className="bg-white w-full rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-extrabold text-gray-800 flex justify-start w-full">
                <TicketCheck size="28px" className="mr-3 ml-2 text-red-600" />
                Guichets
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
              <div className="flex items-start  flex-col w-1/2">
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
              <div className="flex items-center">
                <button className="btn btn-default rounded-lg bg-gray-600  text-white hover:bg-gray-700 transition duration-300 shadow-md mt-2 ml-2">
                  <FileSymlink size={20} />
                  Attacher pièces jointes
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <div className="h-[600px] bg-gray-300 py-2 rounded-lg px-4 overflow-y-auto">
                {Object.keys(groupedGuichets).length === 0 ? (
                  <div className="text-center text-gray-900 mt-4">
                    <ServerOff className="text-red-500 mr-2" size={30} />
                    Aucun guichet disponible.
                  </div>
                ) : (
                  <ul className="list-none w-full">
                    {Object.entries(groupedGuichets).map(
                      ([agencyId, agency]) => (
                        <li key={agencyId} className="w-full">
                          <button
                            className="btn bg-gray-300 text-black hover:bg-gray-400 transition duration-300 rounded-lg shadow-md w-full text-left flex justify-between items-center"
                            onClick={() => toggleAgency(agencyId)}
                          >
                            <div className="flex text-black  items-center p-2 rounded-full bg-white">
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
                              {agency.guichets.map((guichet) => (
                                <li
                                  key={guichet.id}
                                  className="w-full flex justify-between items-center cursor-pointer"
                                  onClick={() => handleGuichetClick(guichet.id)}
                                >
                                  <div className="flex text-black w-full items-center justify-between p-2 rounded-lg shadow-md bg-white">
                                    <span className="flex items-center">
                                      <TicketCheck className="mr-2" />
                                      {guichet.nom_guichet}
                                    </span>
                                    <span className="text-sm text-gray-500 ml-2">
                                      (Cliquez pour voir les documents)
                                    </span>

                                    <div className="flex">
                                      <button
                                        className="btn btn-outline bg-gray-600 text-white hover:bg-blue-600 transition duration-300 rounded-md"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditGuichet(guichet);
                                        }}
                                      >
                                        <SquarePen className="mr-1" />
                                      </button>
                                      <button
                                        className="btn btn-outline bg-gray-600 text-white hover:bg-red-600 transition duration-300 rounded-md"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteGuichet(guichet.id);
                                        }}
                                      >
                                        <Trash2 className="mr-1" />
                                      </button>
                                    </div>
                                  </div>
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
            {documents.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-bold">Documents liés :</h3>
                <ul>
                  {documents.map((doc) => (
                    <li key={doc.id}>
                      {console.log(doc.nom_document_type)},
                      {doc.nom_document_type}
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
              {newGuichet.id
                ? "Modifier le guichet"
                : "Ajouter un nouveau guichet"}
            </h3>
            <form
              onSubmit={
                newGuichet.id ? handleGuichetUpdated : handleGuichetCreated
              }
            >
              <div className="form-control">
                <label className="label">Sélectionner une agence</label>
                <Select
                  value={agencyOptions.find(
                    (option) => option.value === newGuichet.agence_id
                  )}
                  onChange={handleAgencyChange}
                  options={agencyOptions}
                  className="mb-2"
                  placeholder="Choisir une agence"
                  isClearable
                />
              </div>
              <div className="form-control mt-4">
                <label className="label">Code du guichet</label>
                <input
                  type="text"
                  value={newGuichet.code_guichet}
                  onChange={(e) =>
                    setNewGuichet({
                      ...newGuichet,
                      code_guichet: e.target.value,
                    })
                  }
                  className="input input-bordered border-2 border-gray-300 bg-white text-black"
                  required
                />
              </div>
              <div className="form-control mt-4">
                <label className="label">Nom du guichet</label>
                <input
                  type="text"
                  value={newGuichet.nom_guichet}
                  onChange={(e) =>
                    setNewGuichet({
                      ...newGuichet,
                      nom_guichet: e.target.value,
                    })
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
                  {newGuichet.id ? "Mettre à jour" : "Ajouter"}
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
