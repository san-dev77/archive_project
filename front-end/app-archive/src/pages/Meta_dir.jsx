import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "daisyui/dist/full.css";
import Side_bar from "../Components/Side_bar";
import TopBar from "../Components/Top_bar";
import EditMetadata from "../pages/update/EditMetadata";
import Select from "react-select";
import {
  DatabaseZap,
  SquarePen,
  Trash2,
  LayoutList,
  Plus,
  Layers3,
  Settings,
  FileText,
  Calendar,
  Hash,
} from "lucide-react";
import { Tooltip } from "@mui/material";
import Swal from "sweetalert2";
import { showDeleteConfirmation } from "../utils/alerts";

export default function Meta_dir() {
  const [directoriesData, setDirectoriesData] = useState([]);
  const [services, setServices] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [metadata, setMetadata] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [selectedDir, setSelectedDir] = useState("");
  const [selectedDirId, setselectedDirId] = useState("");
  const [selectedDocumentTypeId, setSelectedDocumentTypeId] = useState("");
  const [selectedDocumentTypeName, setSelectedDocumentTypeName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const [creating, setCreating] = useState(false);
  const [key, setKey] = useState("");
  const [metaType, setMetaType] = useState("text");
  const [modalOpen, setModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentMeta, setCurrentMeta] = useState({
    id: "",
    key: "",
    metaType: "",
  });
  const [editMetadataId, setEditMetadataId] = useState(null);
  const [filteredServices, setFilteredServices] = useState([]);
  const [filteredDocumentTypes, setFilteredDocumentTypes] = useState([]);
  const [metadataFields, setMetadataFields] = useState([
    { key: "", metaType: "text", required: false },
  ]);

  const handleServiceSelect = (dirId, dirName) => {
    setSelectedDir(dirName);
    setselectedDirId(dirId);
    setSelectedDocumentTypeId("");
    setSelectedDocumentTypeName("");
    setDocumentTypes([]);
    setFilteredDocumentTypes([]);
  };

  const handleDocumentTypeSelect = (docTypeId, docTypeName) => {
    setSelectedDocumentTypeId(docTypeId);
    setSelectedDocumentTypeName(docTypeName);
    setFilteredDocumentTypes(documentTypes);
  };

  useEffect(() => {
    const fetchDirectories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/services/directory"
        );
        const data = response.data.map((directory) => {
          return {
            directory_id: directory.directory_id,
            nom_directory: directory.nom_directory,
            code: directory.code,
          };
        });
        setDirectoriesData(data);
      } catch (error) {
        console.error("Error fetching services:", error);
        setError("Failed to fetch services");
      } finally {
        setLoading(false);
      }
    };

    fetchDirectories();
  }, []);

  useEffect(() => {
    if (selectedDirId) {
      const fetchDocumentTypes = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/document-types/doctype/${selectedDirId}`
          );
          setDocumentTypes(response.data);
          setFilteredDocumentTypes(response.data);
        } catch (error) {
          console.error("Error fetching document types:", error);
          setError("Failed to fetch document types");
        }
      };

      fetchDocumentTypes();
    } else {
      setDocumentTypes([]);
      setFilteredDocumentTypes([]);
    }
  }, [selectedDirId]);

  useEffect(() => {
    if (selectedDocumentTypeId) {
      const fetchMetadata = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/metadata/meta_dir/${selectedDocumentTypeId}`
          );
          setMetadata(response.data);
        } catch (error) {
          console.error("Error fetching metadata:", error);
          setError("Failed to fetch metadata");
        }
      };

      fetchMetadata();
    } else {
      setMetadata([]);
    }
  }, [selectedDocumentTypeId]);

  const handleDelete = async (id) => {
    const confirmed = await showDeleteConfirmation();
    if (confirmed) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/metadata/meta_dir/${id}`
        );
        if (response.status === 200) {
          toast.success("Metadonnée supprimée avec succès !");
          Swal.fire({
            title: "Succès",
            text: "Meta-donnée supprimé avec succès !",
            icon: "success",
            confirmButtonColor: "#444",
            confirmButtonText: "OK",
          });
          setMetadata((prevMetadata) =>
            prevMetadata.filter((meta) => meta.id !== id)
          );
        }
      } catch (error) {
        console.error("Error deleting metadata:", error);
        toast.error("Erreur lors de la suppression de la metadonnée");
      }
    }
  };

  const fetchMetadataRefresh = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/metadata/meta_dir/${selectedDocumentTypeId}`
      );
      setMetadata(response.data);
    } catch (error) {
      console.error("Error fetching metadata:", error);
      setError("Failed to fetch metadata");
    }
  };

  const handleEdit = (meta) => {
    setCurrentMeta(meta);
    setEditMetadataId(meta.id);
    setEditMode(true);
  };

  const addMetadataField = () => {
    setMetadataFields([
      ...metadataFields,
      { key: "", metaType: "text", required: false },
    ]);
  };

  const removeMetadataField = (index) => {
    setMetadataFields(metadataFields.filter((_, i) => i !== index));
  };

  const updateMetadataField = (index, field, value) => {
    const newFields = [...metadataFields];
    newFields[index] = { ...newFields[index], [field]: value };
    setMetadataFields(newFields);
  };

  const handleCreateNew = () => {
    setEditMode(false);
    setModalOpen(true);
    setMetadataFields([{ key: "", metaType: "text", required: false }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await Promise.all(
        metadataFields.map((field) =>
          axios.post("http://localhost:3000/metadata/meta_dir", {
            key: field.key,
            metaType: field.metaType,
            required: field.required,
            documentTypeId: selectedDocumentTypeId,
          })
        )
      );
      setMetadataFields([{ key: "", metaType: "text", required: false }]);
      toast.success("Métadonnées créées avec succès!");
      Swal.fire({
        title: "Elements créés !",
        text: "Meta-données créées avec succès !",
        icon: "success",
        confirmButtonColor: "#444",
        confirmButtonText: "OK",
      });
      await fetchMetadataRefresh();
    } catch (error) {
      console.error("Error creating metadata:", error);
      toast.error("Échec de la création des métadonnées.");
    } finally {
      setFormLoading(false);
      setCreating(false);
      setModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-gray-300 to-gray-400">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-gray-300 to-gray-400">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-300 to-gray-400">
      <Side_bar isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <div className="container w-full mx-auto px-4 py-8 mt-20">
          <div className="bg-gray-800 w-full rounded-lg shadow-xl p-6 border-l-4 border-[#00B7FF]">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <LayoutList className="h-8 w-8 text-[#00B7FF] mr-2" />
                Gestion des Métadonnées par Direction
              </h1>

              <div className="stats shadow bg-gray-700 text-white">
                <div className="stat">
                  <div className="stat-figure text-[#00B7FF]">
                    <DatabaseZap className="h-6 w-6" />
                  </div>
                  <div className="stat-title text-gray-300">
                    Total Métadonnées
                  </div>
                  <div className="stat-value text-[#00B7FF]">
                    {metadata.length}
                  </div>
                  <div className="stat-desc text-gray-400">
                    Pour {selectedDocumentTypeName || "aucun type"}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#3a3a3a] rounded-lg p-6 shadow-inner">
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="w-full md:w-1/2">
                  <div className="form-control">
                    <label className="label flex items-start justify-start text-white font-medium">
                      <Settings className="mr-2 text-[#00B7FF]" />
                      Direction
                    </label>
                    <div className="relative">
                      <Select
                        className="text-sm"
                        classNamePrefix="select"
                        placeholder="Sélectionner une direction"
                        onChange={(selectedOption) =>
                          handleServiceSelect(
                            selectedOption.value,
                            selectedOption.label
                          )
                        }
                        value={directoriesData
                          .map((directory) => ({
                            value: directory.directory_id,
                            label: directory.nom_directory,
                          }))
                          .find(
                            (directory) => directory.value === selectedDirId
                          )}
                        options={directoriesData.map((directory) => ({
                          value: directory.directory_id,
                          label: directory.nom_directory,
                        }))}
                        styles={{
                          control: (base) => ({
                            ...base,
                            backgroundColor: "#2a2a2a",
                            borderColor: "#4a4a4a",
                            color: "white",
                            borderRadius: "0.5rem",
                            padding: "0.25rem",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                          }),
                          menu: (base) => ({
                            ...base,
                            backgroundColor: "#2a2a2a",
                            borderRadius: "0.5rem",
                            overflow: "hidden",
                            zIndex: 100,
                          }),
                          option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isFocused
                              ? "#4a4a4a"
                              : "#2a2a2a",
                            color: "white",
                            padding: "0.75rem 1rem",
                          }),
                          singleValue: (base) => ({
                            ...base,
                            color: "white",
                          }),
                        }}
                      />
                      {!selectedDirId && (
                        <div className="text-xs text-gray-400 mt-1 ml-1">
                          Sélectionnez une direction pour continuer
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <div className="form-control">
                    <label className="label flex items-start justify-start text-white font-medium">
                      <Layers3 className="mr-2 text-[#00B7FF]" />
                      Type de document
                    </label>
                    <div className="relative">
                      <Select
                        className="text-sm"
                        classNamePrefix="select"
                        placeholder="Sélectionner un type de document"
                        isDisabled={!selectedDirId}
                        onChange={(selectedOption) =>
                          handleDocumentTypeSelect(
                            selectedOption.value,
                            selectedOption.label
                          )
                        }
                        value={documentTypes
                          .map((docType) => ({
                            value: docType.id,
                            label: docType.name_doc_type,
                          }))
                          .find(
                            (docType) =>
                              docType.value === selectedDocumentTypeId
                          )}
                        options={documentTypes.map((docType) => ({
                          value: docType.id,
                          label: docType.name_doc_type,
                        }))}
                        styles={{
                          control: (base) => ({
                            ...base,
                            backgroundColor: "#2a2a2a",
                            borderColor: "#4a4a4a",
                            color: "white",
                            borderRadius: "0.5rem",
                            padding: "0.25rem",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                          }),
                          menu: (base) => ({
                            ...base,
                            backgroundColor: "#2a2a2a",
                            borderRadius: "0.5rem",
                            overflow: "hidden",
                          }),
                          option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isFocused
                              ? "#4a4a4a"
                              : "#2a2a2a",
                            color: "white",
                            padding: "0.75rem 1rem",
                          }),
                          singleValue: (base) => ({
                            ...base,
                            color: "white",
                          }),
                        }}
                      />
                      {selectedDirId && !selectedDocumentTypeId && (
                        <div className="text-xs text-gray-400 mt-1 ml-1">
                          Sélectionnez un type de document pour voir ses
                          métadonnées
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {selectedDocumentTypeId && (
                <div className="bg-[#2a2a2a] p-4 rounded-lg mb-6 border-l-2 border-[#00B7FF]">
                  <h3 className="text-white text-lg font-medium mb-2 flex items-center">
                    <Layers3 className="h-5 w-5 mr-2 text-[#00B7FF]" />
                    Informations sur le type de document
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                    <div>
                      <p>
                        <span className="font-medium">Direction:</span>{" "}
                        {selectedDir}
                      </p>
                      <p>
                        <span className="font-medium">Type de document:</span>{" "}
                        {selectedDocumentTypeName}
                      </p>
                    </div>
                    <div>
                      <p>
                        <span className="font-medium">
                          Nombre de métadonnées:
                        </span>{" "}
                        {metadata.length}
                      </p>
                      <p>
                        <span className="font-medium">Types disponibles:</span>{" "}
                        Texte, Date, Nombre
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-6 mb-8 justify-between items-center">
                <div className="relative w-full md:w-1/2">
                  <input
                    type="text"
                    placeholder="Rechercher une métadonnée..."
                    className="px-4 py-3 bg-[#2a2a2a] text-white border border-[#4a4a4a] rounded-lg focus:ring-2 focus:ring-[#00B7FF] focus:border-transparent w-full pl-10"
                    onChange={(e) => {
                      const searchTerm = e.target.value.toLowerCase();
                      const filteredMetadata = metadata.filter((meta) =>
                        meta.cle.toLowerCase().includes(searchTerm)
                      );
                      if (searchTerm === "") fetchMetadataRefresh();
                      setMetadata(filteredMetadata);
                    }}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
                {selectedDocumentTypeId && (
                  <button
                    className="bg-white hover:bg-gray-200 text-black hover:text-black px-6 py-3 rounded-lg flex items-center transition-colors duration-200 shadow-md w-full md:w-auto justify-center"
                    onClick={handleCreateNew}
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Nouvelle Métadonnée
                  </button>
                )}
              </div>

              {selectedDocumentTypeId && metadata.length === 0 ? (
                <div className="bg-[#2a2a2a] rounded-lg p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <DatabaseZap className="h-16 w-16 mx-auto mb-4 text-[#00B7FF] opacity-50" />
                    <p className="text-xl font-medium">
                      Aucune métadonnée trouvée
                    </p>
                    <p className="mt-2">
                      Commencez par créer une nouvelle métadonnée pour ce type
                      de document.
                    </p>
                  </div>
                  <button
                    className="mt-4 bg-[#00B7FF] hover:bg-[#009ad3] text-white px-6 py-3 rounded-lg flex items-center transition-colors duration-200 mx-auto"
                    onClick={handleCreateNew}
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Créer une métadonnée
                  </button>
                </div>
              ) : (
                selectedDocumentTypeId && (
                  <div className="bg-[#2a2a2a] rounded-lg overflow-hidden shadow-lg border border-[#4a4a4a]">
                    <table className="w-full">
                      <thead className="bg-[#1a1a1a] text-white">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-medium"></th>
                          <th className="px-6 py-4 text-left text-sm font-medium">
                            Nom métadonnée
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-medium">
                            Type
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-medium">
                            Obligatoire
                          </th>
                          <th className="px-6 py-4 text-right text-sm font-medium">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#4a4a4a]">
                        {metadata.map((meta, index) => (
                          <tr
                            key={meta.id}
                            className={`hover:bg-[#3a3a3a] transition-colors duration-200`}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2a2a2a]">
                                {meta.metaType === "text" && (
                                  <span className="text-[#00B7FF]">
                                    <FileText className="h-5 w-5" />
                                  </span>
                                )}
                                {meta.metaType === "Date" && (
                                  <span className="text-[#00B7FF]">
                                    <Calendar className="h-5 w-5" />
                                  </span>
                                )}
                                {meta.metaType === "number" && (
                                  <span className="text-[#00B7FF]">
                                    <Hash className="h-5 w-5" />
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-white font-medium">
                              {meta.cle}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  meta.metaType === "text"
                                    ? "bg-blue-900 text-blue-200"
                                    : meta.metaType === "Date"
                                    ? "bg-green-900 text-green-200"
                                    : "bg-purple-900 text-purple-200"
                                }`}
                              >
                                {meta.metaType}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  meta.required
                                    ? "bg-red-900 text-red-200"
                                    : "bg-gray-700 text-gray-300"
                                }`}
                              >
                                {meta.required ? "Obligatoire" : "Optionnel"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-end space-x-2">
                                <Tooltip title="Modifier" arrow>
                                  <button
                                    onClick={() => handleEdit(meta)}
                                    className="p-2 text-[#00B7FF] hover:bg-[#404040] rounded-lg transition-colors duration-200"
                                  >
                                    <SquarePen className="h-5 w-5" />
                                  </button>
                                </Tooltip>
                                <Tooltip title="Supprimer" arrow>
                                  <button
                                    onClick={() => handleDelete(meta.id)}
                                    className="p-2 text-red-500 hover:bg-[#404040] rounded-lg transition-colors duration-200"
                                  >
                                    <Trash2 className="h-5 w-5" />
                                  </button>
                                </Tooltip>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}

              {!selectedDirId && (
                <div className="bg-[#2a2a2a] rounded-lg p-8 text-center">
                  <div className="text-gray-400">
                    <Settings className="h-16 w-16 mx-auto mb-4 text-[#00B7FF] opacity-50" />
                    <p className="text-xl font-medium">
                      Sélectionnez une direction
                    </p>
                    <p className="mt-2">
                      Veuillez choisir une direction pour afficher les types de
                      documents disponibles.
                    </p>
                  </div>
                </div>
              )}

              {selectedDirId && !selectedDocumentTypeId && (
                <div className="bg-[#2a2a2a] rounded-lg p-8 text-center">
                  <div className="text-gray-400">
                    <Layers3 className="h-16 w-16 mx-auto mb-4 text-[#00B7FF] opacity-50" />
                    <p className="text-xl font-medium">
                      Sélectionnez un type de document
                    </p>
                    <p className="mt-2">
                      Veuillez choisir un type de document pour gérer ses
                      métadonnées.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal pour créer une nouvelle métadonnée */}
      {modalOpen && !editMode && (
        <div className="fixed inset-0 flex z-50 items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="modal-box bg-white text-gray-800 rounded-2xl shadow-2xl transform transition-all duration-300 max-w-2xl w-full p-8">
            <button
              className="btn btn-circle btn-ghost absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              onClick={() => setModalOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-3xl font-bold mb-2 text-gray-800">
              Nouvelles métadonnées
            </h2>
            <p className="text-gray-600 mb-6">
              Ajoutez des métadonnées pour le type de document:{" "}
              <span className="font-medium">{selectedDocumentTypeName}</span>
            </p>

            <form onSubmit={handleSubmit}>
              {metadataFields.map((field, index) => (
                <div
                  key={index}
                  className="flex gap-4 mb-6 items-end bg-gray-50 p-4 rounded-lg border border-gray-200"
                >
                  <div className="form-control flex-1">
                    <label className="label font-medium text-gray-700">
                      Nom du champ
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full bg-white text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                      value={field.key}
                      onChange={(e) =>
                        updateMetadataField(index, "key", e.target.value)
                      }
                      required
                      placeholder="Ex: Numéro de facture, Date d'émission..."
                    />
                  </div>
                  <div className="form-control w-1/4">
                    <label className="label font-medium text-gray-700">
                      Type
                    </label>
                    <select
                      className="select select-bordered w-full bg-white text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                      value={field.metaType}
                      onChange={(e) =>
                        updateMetadataField(index, "metaType", e.target.value)
                      }
                      required
                    >
                      <option value="text">Texte</option>
                      <option value="Date">Date</option>
                      <option value="number">Nombre</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label font-medium text-gray-700">
                      Obligatoire
                    </label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
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
                      className="btn btn-circle btn-error"
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
                  className="btn btn-outline border-gray-300 text-gray-700 hover:bg-gray-100"
                  onClick={addMetadataField}
                >
                  <Plus className="mr-2" />
                  Ajouter un champ
                </button>
              </div>

              <div className="modal-action flex justify-between items-center mt-8">
                <button
                  type="button"
                  className="btn btn-outline border-gray-300 text-gray-700 hover:bg-gray-100 px-6"
                  onClick={() => setModalOpen(false)}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn flex justify-center items-center bg-gray-800 text-white hover:bg-gray-900 transition duration-300 rounded-lg px-8"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <span className="loading loading-spinner loading-sm mr-2"></span>
                  ) : (
                    <Plus className="mr-2" />
                  )}
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editMetadataId && (
        <EditMetadata
          id={editMetadataId}
          onClose={() => setEditMetadataId(null)}
          onUpdate={fetchMetadataRefresh}
        />
      )}

      <ToastContainer />
    </div>
  );
}
