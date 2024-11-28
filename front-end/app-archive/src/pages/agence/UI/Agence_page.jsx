import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "daisyui/dist/full.css";
import Sidebar_agence from "../../../Components/Sidebar_agence";
import TopBar from "../../../Components/Top_bar";
import {
  LayoutList,
  Plus,
  SquarePen,
  Trash2,
  ChevronUp,
  ChevronDown,
  ArrowUpToLine,
  Download,
  Link2Off,
  Landmark,
  SquareCheck,
} from "lucide-react";
import { Tooltip } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "react-query";

const fetchAgences = async () => {
  const response = await axios.get("http://localhost:3000/agences");
  return response.data;
};

const deleteAgence = async (id) => {
  await axios.delete(`http://localhost:3000/agences/${id}`);
};

const updateAgence = async (agence) => {
  await axios.put(`http://localhost:3000/agences/${agence.id}`, agence);
};

const createAgence = async (agence) => {
  console.log(agence);

  await axios.post("http://localhost:3000/agences", agence);
};

const fetchDocumentsByAgence = async () => {
  const response = await axios.get(`http://localhost:3000/relations/agence`);
  return response.data;
};

export default function ShowAgence() {
  const [searchText, setSearchText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentAgence, setCurrentAgence] = useState({
    id: "",
    nom_agence: "",
    code_agence: "",
  });
  const [expandedAgence, setExpandedAgence] = useState(null);
  const [documents, setDocuments] = useState([]);

  const queryClient = useQueryClient();
  const { data: agences = [] } = useQuery("agences", fetchAgences);

  const deleteMutation = useMutation(deleteAgence, {
    onSuccess: () => {
      queryClient.invalidateQueries("agences");
      toast.success("Agence supprimée avec succès !");
    },
    onError: () => {
      toast.error("Échec lors de la suppression de l'agence.");
    },
  });

  const updateMutation = useMutation(updateAgence, {
    onSuccess: () => {
      queryClient.invalidateQueries("agences");
      toast.success("Agence mise à jour avec succès !");
      setEditModalOpen(false);
    },
    onError: () => {
      toast.error("Échec lors de la mise à jour de l'agence.");
    },
  });

  const createMutation = useMutation(createAgence, {
    onSuccess: () => {
      queryClient.invalidateQueries("agences");
      toast.success("Agence créée avec succès !");
      setOpenModal(false);
    },
    onError: () => {
      toast.error("Échec lors de la création de l'agence.");
    },
  });

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const handleEdit = (agence) => {
    setCurrentAgence(agence);
    setEditModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentAgence.id) {
      updateMutation.mutate(currentAgence);
    } else {
      createMutation.mutate(currentAgence);
    }
    setCurrentAgence({ id: "", nom_agence: "", code_agence: "" });
  };

  const toggleAgence = async (agenceId) => {
    if (expandedAgence === agenceId) {
      setExpandedAgence(null);
      setDocuments([]);
    } else {
      setExpandedAgence(agenceId);
      try {
        const docs = await fetchDocumentsByAgence(agenceId);
        setDocuments(docs);
      } catch (error) {
        toast.error("Échec lors de la récupération des documents.");
      }
    }
  };

  const renderDocuments = () => {
    if (documents.length === 0) {
      return (
        <div className="text-center text-gray-900 mt-2">
          Aucun document lié.
        </div>
      );
    }

    return (
      <ul className="list-disc pl-5 mt-4 list-style-none">
        {documents.map((doc) => (
          <li
            key={doc.id}
            className="text-gray-800 w-full bg-gray-100 p-2 rounded-lg shadow-md flex justify-between items-center"
          >
            <span className="font-semibold flex items-center text-blue-600">
              <SquareCheck className="mr-2" />
              {doc.nom_document_type}
            </span>
            <button
              className="btn btn-outline btn-error btn-sm"
              onClick={() => handleDeleteDocument(doc.id)}
            >
              <Tooltip title="Détacher de l'élément">
                <Link2Off className="mr-1" />
              </Tooltip>
            </button>
          </li>
        ))}
      </ul>
    );
  };

  const handleDeleteDocument = async (documentId) => {
    try {
      await axios.delete(
        `http://localhost:3000/relations/unlink-agence/${documentId}`
      );
      setDocuments((prevDocuments) =>
        prevDocuments.filter((doc) => doc.id !== documentId)
      );
      toast.success("Document détaché avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Échec lors du détachement du document.");
    }
  };

  const filteredAgences = agences.filter((agence) =>
    agence.nom_agence.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderAgenceList = () => {
    if (filteredAgences.length === 0) {
      return (
        <div className="text-center text-gray-900 mt-4">
          Aucune agence disponible.
        </div>
      );
    }

    return (
      <ul className="list-none w-full">
        {filteredAgences.map((agence) => (
          <li key={agence.id} className="w-full">
            <button
              className="btn relative btn-outline border-t-cyan-800 w-full text-left flex justify-between items-center"
              onClick={() => toggleAgence(agence.id)}
            >
              <div className="absolute -top-2 -left-2 bg-gray-900 rounded-full px-2 py-1">
                <p className="text-[10px] z-[5] text-white">
                  {agence.code_agence}
                </p>
              </div>
              <div className="flex items-center p-2 rounded-full bg-white">
                <Landmark className="mr-2 text-gray-800" />
                <span
                  className="text-sm text-gray-800 overflow-hidden whitespace-nowrap text-ellipsis"
                  style={{ maxWidth: "600px" }}
                >
                  {agence.nom_agence}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {expandedAgence === agence.id ? (
                  <>
                    <Tooltip title="Modifier l'agence">
                      <button
                        className="btn btn-outline bg-gray-600 text-white hover:bg-blue-600 transition duration-300 rounded-md"
                        onClick={() => handleEdit(agence)}
                      >
                        <SquarePen className="mr-1" />
                      </button>
                    </Tooltip>
                    <Tooltip title="Supprimer l'agence">
                      <button
                        className="btn btn-outline bg-gray-600 text-white hover:bg-red-600 transition duration-300 rounded-md"
                        onClick={() => handleDelete(agence.id)}
                      >
                        <Trash2 className="mr-1" />
                      </button>
                    </Tooltip>
                    <ChevronUp />
                  </>
                ) : (
                  <ChevronDown />
                )}
              </div>
            </button>
            {expandedAgence === agence.id && renderDocuments()}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="flex min-h-screen mt-8 bg-gray-300 to-gray-900">
      <Sidebar_agence isVisible={true} />
      <div className="flex-1 flex flex-col ">
        <TopBar position="fixed" title="Agences" />

        <div className="container w-[90%] mx-auto mt-16 bg-white rounded-xl shadow-2xl flex flex-col h-auto">
          <div className="bg-white w-full rounded-lg shadow-md p-6 ">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-extrabold text-gray-800 flex justify-start w-full">
                <LayoutList size="28px" className="mr-3 ml-2 text-red-600" />
                Agences
              </h1>
            </div>

            <div className="flex flex-row-reverse w-full justify-between rounded-lg border-2 p-4 border-gray-300 space-x-2 mb-4">
              <div className="flex items-center justify-center gap-4">
                <button className="btn btn-primary bg-gray-600 text-white hover:bg-gray-800 transition duration-300 shadow-md">
                  <Download size={20} className="mr-2" />
                  Importer
                </button>
                <button className="btn btn-primary text-white bg-gray-400  hover:bg-gray-700 transition duration-300 shadow-md">
                  <ArrowUpToLine size={20} className="mr-2" />
                  Exporter
                </button>
              </div>
              <button
                className="btn btn-primary bg-gray-400 text-white hover:bg-gray-500 transition duration-300 shadow-md"
                onClick={() => setOpenModal(true)}
              >
                <Plus size={20} className="mr-2" />
                Nouveau
              </button>
            </div>
            <div className="border-t border-gray-700 my-4"></div>

            <div className="flex justify-start mb-4">
              <div className="w-full flex flex-col justify-start items-start gap-2">
                <h2 className="text-lg font-bold text-gray-800">Rechercher</h2>
                <input
                  type="text"
                  placeholder="Rechercher une agence..."
                  className="input input-bordered w-full max-w-lg bg-white text-black border-2 border-gray-300 rounded-lg shadow-md"
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-start items-center mb-4">
              <h2 className="text-lg font-bold flex text-gray-800">
                <LayoutList size="28px" className="mr-3 ml-2 text-red-600" />
                Liste des agences
              </h2>
            </div>

            <div className="overflow-x-auto">
              <div className="h-[600px] py-4 rounded-lg bg-gray-300 px-10 overflow-y-auto">
                {renderAgenceList()}
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
          onClick={() => setOpenModal(false)}
        >
          <div
            className="modal-box bg-white text-black rounded-lg shadow-lg transform transition-all duration-300 max-w-lg w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => setOpenModal(false)}
            >
              ✕
            </button>
            <h3 className="font-bold text-lg">
              {currentAgence.id
                ? "Modifier l'agence"
                : "Créer une nouvelle agence"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-control mt-4">
                <label className="label">Code de l&apos;agence</label>
                <input
                  type="text"
                  value={currentAgence.code_agence}
                  onChange={(e) =>
                    setCurrentAgence({
                      ...currentAgence,
                      code_agence: e.target.value,
                    })
                  }
                  className="input input-bordered border-2 border-gray-300 bg-white text-black"
                  required
                />
              </div>
              <div className="form-control mt-4">
                <label className="label">Nom de l&apos;agence</label>
                <input
                  type="text"
                  value={currentAgence.nom_agence}
                  onChange={(e) =>
                    setCurrentAgence({
                      ...currentAgence,
                      nom_agence: e.target.value,
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
                  {currentAgence.id ? "Mettre à jour" : "Ajouter"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-error w-[40%] mt-2"
                  onClick={() => setOpenModal(false)}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          onClick={() => setEditModalOpen(false)}
        >
          <div
            className="modal-box bg-white text-black rounded-lg shadow-lg transform transition-all duration-300 max-w-lg w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => setEditModalOpen(false)}
            >
              ✕
            </button>
            <h3 className="font-bold text-lg">Modifier l&apos;agence</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-control mt-4">
                <label className="label">Code de l&apos;agence</label>
                <input
                  type="text"
                  value={currentAgence.code_agence}
                  onChange={(e) =>
                    setCurrentAgence({
                      ...currentAgence,
                      code_agence: e.target.value,
                    })
                  }
                  className="input input-bordered border-2 border-gray-300 bg-white text-black"
                  required
                />
              </div>
              <div className="form-control mt-4">
                <label className="label">Nom de l&apos;agence</label>
                <input
                  type="text"
                  value={currentAgence.nom_agence}
                  onChange={(e) =>
                    setCurrentAgence({
                      ...currentAgence,
                      nom_agence: e.target.value,
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
                  {currentAgence.id ? "Mettre à jour" : "Ajouter"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-error w-[40%] mt-2"
                  onClick={() => setEditModalOpen(false)}
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
