import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "daisyui/dist/full.css";
import Side_bar from "../components_UI/Sidebar_UI";
import TopBar from "../components_UI/Top_bar_UI";
import EditMetadata from "../../update/EditMetadata";
import {
  DatabaseZap,
  SquarePen,
  Trash2,
  LayoutList,
  Plus,
  Layers3,
} from "lucide-react";
import { Tooltip } from "@mui/material";

export default function ShowMeta() {
  const [documentTypes, setDocumentTypes] = useState([]);
  const [metadata, setMetadata] = useState([]);
  const [selectedDocumentTypeId, setSelectedDocumentTypeId] = useState("");
  const [selectedDocumentTypeName, setSelectedDocumentTypeName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [key, setKey] = useState("");
  const [metaType, setMetaType] = useState("text");
  const [openModal, setOpenModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMeta, setSelectedMeta] = useState(null);
  const [permissionError, setPermissionError] = useState(false);
  const serviceName = localStorage.getItem("service");

  useEffect(() => {
    const savedServiceId = localStorage.getItem("serviceId");

    if (savedServiceId) {
      fetchDocumentTypes(savedServiceId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchDocumentTypes = async (serviceId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/document-types/services/${serviceId}/document-types`
      );
      setDocumentTypes(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching document types:", error);
      setError("Failed to fetch document types");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDocumentTypeId) {
      fetchMetadata();
    } else {
      setMetadata([]);
    }
  }, [selectedDocumentTypeId]);

  const fetchMetadata = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/metadata/type/${selectedDocumentTypeId}`
      );
      setMetadata(response.data);
    } catch (error) {
      console.error("Error fetching metadata:", error);
      setError("Failed to fetch metadata");
    }
  };

  const hasPermission = (action) => {
    const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
    return permissions.some((permission) => permission.action === action);
  };

  const handleEdit = (meta) => {
    if (hasPermission("edit")) {
      setSelectedMeta(meta);
      setEditModalOpen(true);
    } else {
      setPermissionError(true);
    }
  };

  const handleDelete = async (id) => {
    if (hasPermission("delete")) {
      try {
        await axios.delete(`http://localhost:3000/metadata/${id}`);
        setMetadata(metadata.filter((meta) => meta.id !== id));
        toast.success("Métadonnée supprimée avec succès !");
      } catch (error) {
        console.error("Error deleting metadata:", error);
        toast.error("Erreur lors de la suppression de la métadonnée");
      }
    } else {
      setPermissionError(true);
    }
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      console.log(key, metaType, selectedDocumentTypeId);

      await axios.post("http://localhost:3000/metadata", {
        key,
        metaType,
        documentTypeId: selectedDocumentTypeId,
      });
      toast.success("Métadonnée créée avec succès!");
      fetchMetadata();
      setOpenModal(false);
      setKey("");
      setMetaType("text");
    } catch (error) {
      console.error("Error creating metadata:", error);
      toast.error("Échec de la création de la métadonnée.");
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:3000/metadata/${selectedMeta.id}`, {
        cle: selectedMeta.cle,
        metaType: selectedMeta.metaType,
        documentTypeId: selectedDocumentTypeId,
      });
      fetchMetadata();
      toast.success("Métadonnée mise à jour avec succès!");
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating metadata:", error);
      toast.error("Échec de la mise à jour de la métadonnée.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-300">
      <Side_bar isVisible={true} />
      <div className="flex-1 flex w-full flex-col">
        <TopBar position="fixed" title="Métadonnées" />
        <div className="container w-full mx-auto px-6 py-8 mt-20">
          <div className="bg-gradient-to-br from-gray-600 to-gray-900 w-full backdrop-blur-lg rounded-xl shadow-2xl p-8">
            <div className="flex gap-5 justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-white flex items-center">
                <DatabaseZap className="h-10 w-10 text-cyan-400 mr-3" />
                Gestion des Métadonnées
              </h1>
              <div className="flex gap-3">
                <select
                  className="bg-indigo-500/20 text-indigo-400 px-6 py-3 rounded-lg flex items-center transition-all duration-300"
                  onChange={(e) => setSelectedDocumentTypeId(e.target.value)}
                  value={selectedDocumentTypeId}
                >
                  <option value="" disabled>
                    Sélectionner un type de document
                  </option>
                  {documentTypes.map((docType) => (
                    <option key={docType.id} value={docType.id}>
                      {docType.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setOpenModal(true)}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg flex items-center transition-all duration-300 transform hover:scale-105 shadow-lg"
                  disabled={!selectedDocumentTypeId}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Nouvelle Métadonnée
                </button>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
              <div className="overflow-x-auto w-full">
                {metadata.length === 0 ? (
                  <div className="text-center py-12">
                    <DatabaseZap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-300 text-lg">
                      Aucune métadonnée disponible
                    </p>
                  </div>
                ) : (
                  <table className="w-full rounded-xl overflow-hidden">
                    <thead>
                      <tr className="bg-gray-700/50 text-white">
                        <th className="p-4 text-left font-semibold">Nom</th>
                        <th className="p-4 text-left font-semibold">Type</th>
                        <th className="p-4 text-right font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {metadata.map((meta) => (
                        <tr
                          key={meta.id}
                          className="border-b border-gray-700/30 hover:bg-gray-700/30 transition-colors duration-200"
                        >
                          <td className="flex items-center p-4 text-base text-white">
                            <DatabaseZap className="mr-3 text-cyan-400" />
                            {meta.cle}
                          </td>
                          <td className="p-4 text-base text-white">
                            {meta.metaType}
                          </td>
                          <td className="p-4">
                            <div className="flex justify-end space-x-2">
                              <button
                                className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-all duration-300"
                                onClick={() => handleEdit(meta)}
                              >
                                <SquarePen className="h-5 w-5" />
                              </button>
                              <button
                                className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-300"
                                onClick={() => handleDelete(meta.id)}
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Create */}
        {openModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
            <div className="bg-gray-900 text-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-8 transform transition-all duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Nouvelle métadonnée</h3>
                <button
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => setOpenModal(false)}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nom du champ
                  </label>
                  <input
                    type="text"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Type du champ
                  </label>
                  <select
                    value={metaType}
                    onChange={(e) => setMetaType(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors"
                    required
                  >
                    <option value="text">Texte</option>
                    <option value="Date">Date</option>
                    <option value="number">Nombre</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    onClick={() => setOpenModal(false)}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
                  >
                    Ajouter
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Edit */}
        {editModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
            <div className="bg-gray-900 text-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Modifier la métadonnée</h3>
                <button
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => setEditModalOpen(false)}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nom du champ
                  </label>
                  <input
                    type="text"
                    value={selectedMeta?.cle || ""}
                    onChange={(e) =>
                      setSelectedMeta({
                        ...selectedMeta,
                        cle: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Type du champ
                  </label>
                  <select
                    value={selectedMeta?.metaType || ""}
                    onChange={(e) =>
                      setSelectedMeta({
                        ...selectedMeta,
                        metaType: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors"
                    required
                  >
                    <option value="text">Texte</option>
                    <option value="Date">Date</option>
                    <option value="number">Nombre</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    onClick={() => setEditModalOpen(false)}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
                  >
                    Mettre à jour
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Permission Error */}
        {permissionError && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
            <div className="bg-gray-900 text-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-red-500">
                  Erreur de permission
                </h3>
                <button
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => setPermissionError(false)}
                >
                  ✕
                </button>
              </div>
              <p className="text-center text-lg mb-8">
                Vous n&apos;avez pas la permission d&apos;effectuer cette
                action.
              </p>
              <div className="flex justify-center">
                <button
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                  onClick={() => setPermissionError(false)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
