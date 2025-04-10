import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "daisyui/dist/full.css";
import Side_bar from "../components_UI/Sidebar_UI";
import TopBar from "../components_UI/Top_bar_UI";
import { DatabaseZap, SquarePen, Trash2, Plus } from "lucide-react";

export default function ShowMeta() {
  const [documentTypes, setDocumentTypes] = useState([]);
  const [metadata, setMetadata] = useState([]);
  const [selectedDocumentTypeId, setSelectedDocumentTypeId] = useState("");
  const [selectedDocumentTypeName, setSelectedDocumentTypeName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMeta, setSelectedMeta] = useState(null);
  const [permissionError, setPermissionError] = useState(false);
  const [metadataFields, setMetadataFields] = useState([
    { key: "", metaType: "text", required: false },
  ]);

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
      const docType = documentTypes.find(
        (dt) => dt.id === selectedDocumentTypeId
      );
      if (docType) {
        setSelectedDocumentTypeName(docType.name);
      }
    } else {
      setMetadata([]);
    }
  }, [selectedDocumentTypeId, documentTypes]);

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

  const updateMetadataField = (index, field, value) => {
    const updatedFields = [...metadataFields];
    updatedFields[index][field] = value;
    setMetadataFields(updatedFields);
  };

  const addMetadataField = () => {
    setMetadataFields([
      ...metadataFields,
      { key: "", metaType: "text", required: false },
    ]);
  };

  const removeMetadataField = (index) => {
    const updatedFields = [...metadataFields];
    updatedFields.splice(index, 1);
    setMetadataFields(updatedFields);
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      const creationPromises = metadataFields.map((field) =>
        axios.post("http://localhost:3000/metadata", {
          key: field.key,
          metaType: field.metaType,
          required: field.required,
          documentTypeId: selectedDocumentTypeId,
        })
      );

      await Promise.all(creationPromises);

      toast.success("Métadonnées créées avec succès!");
      fetchMetadata();
      setOpenModal(false);
      setMetadataFields([{ key: "", metaType: "text", required: false }]);
    } catch (error) {
      console.error("Error creating metadata:", error);
      toast.error("Échec de la création des métadonnées.");
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
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500"></div>
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
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Side_bar isVisible={true} />
      <div className="flex-1 flex w-full flex-col">
        <TopBar position="fixed" title="Métadonnées" />
        <div className="container w-full mx-auto px-6 py-8 mt-20">
          <div className="bg-white w-full rounded-xl shadow-xl p-8 border border-green-100">
            <div className="flex gap-5 justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-green-800 flex items-center">
                <DatabaseZap className="h-10 w-10 text-green-600 mr-3" />
                Gestion des Métadonnées
              </h1>
              <div className="flex gap-3">
                <select
                  className="bg-green-100 text-green-700 px-6 py-3 rounded-lg flex items-center transition-all duration-300 border border-green-200"
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
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center transition-all duration-300 transform hover:scale-105 shadow-lg"
                  disabled={!selectedDocumentTypeId}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Nouvelle Métadonnée
                </button>
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-6 shadow-inner border border-green-200">
              <div className="overflow-x-auto w-full">
                {metadata.length === 0 ? (
                  <div className="text-center py-12">
                    <DatabaseZap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">
                      Aucune métadonnée disponible
                    </p>
                  </div>
                ) : (
                  <table className="w-full rounded-xl overflow-hidden">
                    <thead>
                      <tr className="bg-green-100 text-green-800">
                        <th className="p-4 text-left font-semibold">Nom</th>
                        <th className="p-4 text-left font-semibold">Type</th>
                        <th className="p-4 text-left font-semibold">
                          Obligatoire
                        </th>
                        <th className="p-4 text-right font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {metadata.map((meta) => (
                        <tr
                          key={meta.id}
                          className="border-b border-green-100 hover:bg-green-50 transition-colors duration-200"
                        >
                          <td className="flex items-center p-4 text-base text-gray-800">
                            <DatabaseZap className="mr-3 text-green-600" />
                            {meta.cle}
                          </td>
                          <td className="p-4 text-base text-gray-800">
                            {meta.metaType}
                          </td>
                          <td className="p-4 text-base text-gray-800">
                            {meta.required ? "Oui" : "Non"}
                          </td>
                          <td className="p-4">
                            <div className="flex justify-end space-x-2">
                              <button
                                className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-all duration-300"
                                onClick={() => handleEdit(meta)}
                              >
                                <SquarePen className="h-5 w-5" />
                              </button>
                              <button
                                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-300"
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
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <div className="bg-white text-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 p-8 transform transition-all duration-300 border border-green-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-green-800">
                  Nouvelles métadonnées
                </h3>
                <button
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setOpenModal(false)}
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Ajoutez des métadonnées pour le type de document:{" "}
                <span className="font-medium text-green-700">
                  {selectedDocumentTypeName}
                </span>
              </p>
              <form onSubmit={handleCreate} className="space-y-6">
                {metadataFields.map((field, index) => (
                  <div
                    key={index}
                    className="flex gap-4 mb-6 items-end bg-green-50 p-4 rounded-lg border border-green-200"
                  >
                    <div className="form-control flex-1">
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Nom du champ
                      </label>
                      <input
                        type="text"
                        value={field.key}
                        onChange={(e) =>
                          updateMetadataField(index, "key", e.target.value)
                        }
                        className="w-full px-4 py-2 bg-white border border-green-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                        required
                        placeholder="Ex: Numéro de facture, Date d'émission..."
                      />
                    </div>
                    <div className="form-control w-1/4">
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Type
                      </label>
                      <select
                        value={field.metaType}
                        onChange={(e) =>
                          updateMetadataField(index, "metaType", e.target.value)
                        }
                        className="w-full px-4 py-2 bg-white border border-green-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                        required
                      >
                        <option value="text">Texte</option>
                        <option value="Date">Date</option>
                        <option value="number">Nombre</option>
                      </select>
                    </div>
                    <div className="form-control">
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Obligatoire
                      </label>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="toggle toggle-success"
                          checked={field.required}
                          onChange={(e) =>
                            updateMetadataField(
                              index,
                              "required",
                              e.target.checked
                            )
                          }
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          {field.required ? "Oui" : "Non"}
                        </span>
                      </div>
                    </div>
                    {metadataFields.length > 1 && (
                      <button
                        type="button"
                        className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                        onClick={() => removeMetadataField(index)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}

                <div className="flex justify-center mt-6">
                  <button
                    type="button"
                    className="px-6 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center"
                    onClick={addMetadataField}
                  >
                    <Plus className="mr-2" />
                    Ajouter un champ
                  </button>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    type="button"
                    className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                    onClick={() => setOpenModal(false)}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    Créer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Edit */}
        {editModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <div className="bg-white text-gray-800 rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-8 border border-green-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-green-800">
                  Modifier la métadonnée
                </h3>
                <button
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setEditModalOpen(false)}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
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
                    className="w-full px-4 py-2 bg-green-50 border border-green-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
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
                    className="w-full px-4 py-2 bg-green-50 border border-green-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                    required
                  >
                    <option value="text">Texte</option>
                    <option value="Date">Date</option>
                    <option value="number">Nombre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Obligatoire
                  </label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="toggle toggle-success"
                      checked={selectedMeta?.required || false}
                      onChange={(e) =>
                        setSelectedMeta({
                          ...selectedMeta,
                          required: e.target.checked,
                        })
                      }
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      {selectedMeta?.required ? "Oui" : "Non"}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                    onClick={() => setEditModalOpen(false)}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
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
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <div className="bg-white text-gray-800 rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-8 border border-red-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-red-600">
                  Erreur de permission
                </h3>
                <button
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setPermissionError(false)}
                >
                  ✕
                </button>
              </div>
              <p className="text-center text-lg mb-8 text-gray-700">
                Vous n&apos;avez pas la permission d&apos;effectuer cette
                action.
              </p>
              <div className="flex justify-center">
                <button
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
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
