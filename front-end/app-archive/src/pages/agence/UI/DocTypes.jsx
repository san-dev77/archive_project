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
  Network,
  ArrowUpToLine,
  Download,
  Settings,
} from "lucide-react";
import { Tooltip } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

const deleteDocumentType = async (id) => {
  await axios.delete(`http://localhost:3000/agence/document-type/${id}`);
};

const updateDocumentType = async (docType) => {
  await axios.put(
    `http://localhost:3000/agence/document-type/${docType.id}`,
    docType
  );
};

const createDocumentType = async (docType) => {
  console.log(docType);

  await axios.post("http://localhost:3000/agence/document-type", docType);
};

const fetchDocumentTypes = async () => {
  const response = await axios.get(
    "http://localhost:3000/agence/document-type"
  );
  return response.data;
};

export default function DocType() {
  const [searchText, setSearchText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentDocType, setCurrentDocType] = useState({
    id: "",
    nom_document_type: "",
  });
  const [expandedDocType, setExpandedDocType] = useState(null);

  const queryClient = useQueryClient();
  const { data: document_type = [] } = useQuery(
    "document-type",
    fetchDocumentTypes
  );

  const filteredDocumentTypes = document_type.filter((docType) =>
    docType.nom_document_type.toLowerCase().includes(searchText.toLowerCase())
  );

  const deleteMutation = useMutation(deleteDocumentType, {
    onSuccess: () => {
      queryClient.invalidateQueries("document-type");
      toast.success("Type de document supprimé avec succès !");
    },
    onError: () => {
      toast.error("Échec lors de la suppression du type de document.");
    },
  });

  const updateMutation = useMutation(updateDocumentType, {
    onSuccess: () => {
      queryClient.invalidateQueries("document-type");
      toast.success("Type de document mis à jour avec succès !");
      setEditModalOpen(false);
    },
    onError: () => {
      toast.error("Échec lors de la mise à jour du type de document.");
    },
  });

  const createMutation = useMutation(createDocumentType, {
    onSuccess: () => {
      queryClient.invalidateQueries("document-type");
      toast.success("Type de document créé avec succès !");
      setOpenModal(false);
    },
    onError: () => {
      toast.error("Échec lors de la création du type de document.");
    },
  });

  const navigate = useNavigate();

  const handleLinkPage = () => {
    navigate("/agence/show-links");
  };
  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const handleEdit = (docType) => {
    setCurrentDocType(docType);
    setEditModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentDocType.id) {
      updateMutation.mutate(currentDocType);
    } else {
      createMutation.mutate(currentDocType);
    }
    setCurrentDocType({ id: "", nom_document_type: "" });
  };

  const toggleDocType = (docTypeId) => {
    if (expandedDocType === docTypeId) {
      setExpandedDocType(null);
    } else {
      setExpandedDocType(docTypeId);
    }
  };

  const handleSettings = (docTypeId) => {
    navigate(`/agence/config-docType/${docTypeId}`);
  };

  const renderDocTypeList = () => {
    if (filteredDocumentTypes.length === 0) {
      return (
        <div className="text-center text-gray-900 mt-4">
          Aucun type de document disponible.
        </div>
      );
    }

    return (
      <ul className="list-none w-full">
        {filteredDocumentTypes.map((docType) => (
          <li key={docType.id} className="w-full">
            <button
              className="btn btn-default relative btn-outline border-t-cyan-800 w-full text-left flex justify-between items-center"
              onClick={() => toggleDocType(docType.id)}
            >
              {/* 
              Affiche une petite bulle au dessus de l'element
              <div className="absolute -top-2 -left-2 bg-gray-900 rounded-full px-2 py-1">
                <p className="text-[10px] z-[5] text-white">
                  {docType.nom_document_type}
                </p>
              </div> */}
              <div className="flex items-center p-2 rounded-full bg-white">
                <Network className="mr-2 text-gray-800" />
                <span
                  className="text-sm text-gray-800 overflow-hidden whitespace-nowrap text-ellipsis"
                  style={{ maxWidth: "600px" }}
                >
                  {docType.nom_document_type}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {expandedDocType === docType.id ? (
                  <>
                    <Tooltip title="Parametrer ce type">
                      <button
                        className="btn btn-outline bg-gray-600 text-white hover:bg-orange-600 transition duration-300 rounded-md"
                        onClick={() => handleSettings(docType.id)}
                      >
                        <Settings className="mr-1" />
                      </button>
                    </Tooltip>
                    <Tooltip title="Modifier le type de document">
                      <button
                        className="btn btn-outline bg-gray-600 text-white hover:bg-blue-600 transition duration-300 rounded-md"
                        onClick={() => handleEdit(docType)}
                      >
                        <SquarePen className="mr-1" />
                      </button>
                    </Tooltip>
                    <Tooltip title="Supprimer le type de document">
                      <button
                        className="btn btn-outline bg-gray-600 text-white hover:bg-red-600 transition duration-300 rounded-md"
                        onClick={() => handleDelete(docType.id)}
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
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="flex min-h-screen mt-8 bg-gray-300 to-gray-900">
      <Sidebar_agence isVisible={true} />
      <div className="flex-1 flex flex-col ">
        <TopBar position="fixed" title="Types de documents" />

        <div className="container w-[90%] mx-auto mt-16 bg-white rounded-xl shadow-2xl flex flex-col h-auto">
          <div className="bg-white w-full rounded-lg shadow-md p-6 ">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-extrabold text-gray-800 flex justify-start w-full">
                <LayoutList size="28px" className="mr-3 ml-2 text-red-600" />
                Types de documents
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

            <div className="flex justify-between mb-4">
              <div className="w-full flex flex-col justify-start items-start gap-2">
                <h2 className="text-lg font-bold text-gray-800">Rechercher</h2>
                <input
                  type="text"
                  placeholder="Rechercher un type de document..."
                  className="input input-bordered w-full max-w-lg bg-white text-black border-2 border-gray-300 rounded-lg shadow-md"
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>

              <div
                className="flex items-center  mr-10"
                onClick={handleLinkPage}
              ></div>
            </div>

            <div className="flex justify-start items-center mb-4">
              <h2 className="text-lg font-bold flex text-gray-800">
                <LayoutList size="28px" className="mr-3 ml-2 text-red-600" />
                Liste des types de documents
              </h2>
            </div>

            <div className="overflow-x-auto">
              <div className="h-[600px] py-4 rounded-lg bg-gray-300 px-10 overflow-y-auto">
                {renderDocTypeList()}
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
              {currentDocType.id
                ? "Modifier l'agence"
                : "Créer une nouvelle agence"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-control mt-4">
                <label className="label">Nom du type de document</label>
                <input
                  type="text"
                  value={currentDocType.nom_document_type}
                  onChange={(e) =>
                    setCurrentDocType({
                      ...currentDocType,
                      nom_document_type: e.target.value,
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
                  {currentDocType.id ? "Mettre à jour" : "Ajouter"}
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
            <h3 className="font-bold text-lg">Modifier le type de document</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-control mt-4">
                <label className="label">Nom du type de document</label>
                <input
                  type="text"
                  value={currentDocType.nom_document_type}
                  onChange={(e) =>
                    setCurrentDocType({
                      ...currentDocType,
                      nom_document_type: e.target.value,
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
                  {currentDocType.id ? "Mettre à jour" : "Ajouter"}
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
