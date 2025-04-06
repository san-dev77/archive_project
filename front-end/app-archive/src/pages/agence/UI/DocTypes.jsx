import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "daisyui/dist/full.css";
import Sidebar_agence from "../../../Components/Sidebar_agence";
import TopBar from "../../../Components/Top_bar";
import {
  Plus,
  SquarePen,
  Trash2,
  Settings,
  StretchHorizontal,
  DatabaseZap,
  Settings2Icon,
  ServerOff,
  PackageCheck,
  Layers2,
} from "lucide-react";
import { Tooltip } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Loader_component from "../../../Components/Loader";

const deleteDocumentType = async (id) => {
  console.log("Tentative de suppression de l'ID:", id);
  const response = await axios.delete(
    `http://localhost:3000/agence/document-type/${id}`
  );
  if (response.status !== 200) {
    throw new Error("Failed to delete document type");
  }
  return response.data;
};

const updateDocumentType = async (docType) => {
  await axios.put(
    `http://localhost:3000/agence/document-type/${docType.id}`,
    docType
  );
};

const createDocumentType = async (docType) => {
  return await axios.post(
    "http://localhost:3000/agence/document-type",
    docType
  );
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
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [currentDocType, setCurrentDocType] = useState({
    id: "",
    nom_document_type: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const queryClient = useQueryClient();
  const { data: document_type = [] } = useQuery(
    "document-type",
    fetchDocumentTypes,
    {
      onSuccess: () => setLoading(false),
      onError: (err) => {
        setError(err.message);
        setLoading(false);
      },
    }
  );

  const deleteMutation = useMutation(deleteDocumentType, {
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        "Échec lors de la suppression du type de document.";
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: errorMessage,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries("document-type");
      toast.success("Type de document supprimé avec succès !");
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
    onSuccess: (data) => {
      if (data.data && data.data.exists) {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Ce type de document existe déjà.",
        });
      } else {
        queryClient.invalidateQueries("document-type");
        toast.success("Type de document créé avec succès !");
        setOpenModal(false);
      }
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error ||
        "Échec lors de la création du type de document.";
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: errorMessage,
      });
    },
  });

  const navigate = useNavigate();

  const handleDelete = (id) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est irréversible !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#333",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer!",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
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

  const handleSettings = (docTypeId) => {
    navigate(`/agence/config-docType/${docTypeId}`);
  };

  const filteredDocumentTypes = document_type.filter((docType) =>
    docType.nom_document_type.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderDocTypeList = () => {
    if (filteredDocumentTypes.length === 0) {
      return (
        <div className="text-center py-8">
          <ServerOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-300">Aucun type de document disponible</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto w-full">
        <table className="w-full rounded-lg">
          <thead className="rounded-lg">
            <tr className="bg-gray-100 rounded-lg w-full  text-black">
              <th className="p-4 text-left">Type de document</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocumentTypes.map((docType) => (
              <tr
                key={docType.id}
                className="border-b border-gray-600 hover:bg-gray-600/30"
              >
                <td className="flex items-center p-4 text-base text-white">
                  <Layers2 className="mr-2" />
                  {docType.nom_document_type}
                </td>
                <td className="text-right p-4">
                  <div className="flex flex-col sm:flex-row justify-end items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <Tooltip title="Paramètres">
                      <button
                        className="btn btn-circle bg-gray-600 text-white hover:bg-orange-500 transition duration-300"
                        onClick={() => handleSettings(docType.id)}
                      >
                        <Settings />
                      </button>
                    </Tooltip>
                    <Tooltip title="Modifier">
                      <button
                        className="btn btn-circle bg-gray-600 text-white hover:bg-indigo-400 transition duration-300"
                        onClick={() => handleEdit(docType)}
                      >
                        <SquarePen />
                      </button>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <button
                        className="btn btn-circle bg-gray-600 text-white hover:bg-red-500 transition duration-300"
                        onClick={() => handleDelete(docType.id)}
                      >
                        <Trash2 />
                      </button>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const handleConfigOpen = () => {
    setConfigModalOpen(true);
  };

  const handleConfigClose = () => {
    setConfigModalOpen(false);
  };

  const renderConfigModal = () => {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 100,
        }}
        onClick={handleConfigClose}
      >
        <div
          className="modal-box bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-xl shadow-2xl transform transition-all duration-300 max-w-4xl w-full mx-4 p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="btn btn-sm btn-circle absolute right-4 top-4 bg-gray-700 hover:bg-gray-600 border-0"
            onClick={handleConfigClose}
          >
            ✕
          </button>

          <h3 className="font-bold text-2xl mb-8 text-center">Configuration</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-gray-700 hover:bg-gray-600 transition-colors duration-300 rounded-xl shadow-lg p-6">
              <div className="card-body text-center">
                <div className="flex items-center justify-center w-full">
                  <DatabaseZap size={50} />
                </div>
                <h2 className="card-title text-xl mb-4 justify-center">
                  Configurer les méta données
                </h2>
                <p className="mb-6 text-gray-300">
                  Gérez et configurez les différents types de documents
                </p>
                <button
                  className="btn bg-white hover:bg-orange-600 text-black border-0 w-full"
                  onClick={() => navigate("/agence/meta_agence")}
                >
                  Configurer
                </button>
              </div>
            </div>

            <div className="card bg-gray-700 hover:bg-gray-600 transition-colors duration-300 rounded-xl shadow-lg p-6">
              <div className="card-body text-center">
                <div className="flex items-center justify-center w-full">
                  <StretchHorizontal size={50} />
                </div>
                <h2 className="card-title text-xl mb-4 justify-center">
                  Configuration des pièces
                </h2>
                <p className="mb-6 text-gray-300">
                  Accédez aux autres paramètres de configuration
                </p>
                <button
                  className="btn bg-white hover:bg-orange-600 text-black border-0 w-full"
                  onClick={() => navigate("/agence/config-piece")}
                >
                  Configurer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader_component className="loader" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-300">
      <Sidebar_agence isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar position="fixed" title="Types de documents" />
        <div className="container w-full mx-auto px-4 py-8 mt-20">
          <div className="bg-gray-800 w-full rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <PackageCheck className="h-8 w-8 text-[#00B7FF] mr-2" />
                Gestion des Types de Documents
              </h1>
              <button
                onClick={() => setOpenModal(true)}
                className="bg-white hover:bg-gray-700 text-black hover:text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
              >
                <Plus className="h-5 w-5 mr-2" />
                Nouveau Type
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-white mb-1">
                    Rechercher un type de document
                  </label>
                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Rechercher par nom..."
                    className="w-full px-4 py-2 bg-[#3a3a3a] text-white border border-[#4a4a4a] rounded-lg focus:ring-2 focus:ring-[#00B7FF] focus:border-transparent"
                  />
                </div>
                <button
                  className="btn bg-[#3a3a3a] text-white hover:bg-[#4a4a4a] border-0"
                  onClick={handleConfigOpen}
                >
                  <Settings2Icon className="h-5 w-5 mr-2" />
                  Configuration
                </button>
              </div>
            </div>

            <div className="bg-[#3a3a3a] rounded-lg p-4">
              {renderDocTypeList()}
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
            zIndex: 100,
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
                ? "Modifier le type de document"
                : "Créer un nouveau type de document"}
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
            zIndex: 100,
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

      {configModalOpen && renderConfigModal()}

      <ToastContainer />
    </div>
  );
}
