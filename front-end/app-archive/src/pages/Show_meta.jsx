import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "daisyui/dist/full.css";
import Side_bar from "../Components/Side_bar";
import TopBar from "../Components/Top_bar";
import EditMetadata from "../pages/update/EditMetadata";
import { DatabaseZap, SquarePen, Trash2, LayoutList, Plus } from "lucide-react";
import { Tooltip } from "@mui/material";

export default function ShowMeta() {
  const [servicesData, setServicesData] = useState([]); // Add this line
  const [services, setServices] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [metadata, setMetadata] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
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
  const [metaType, setMetaType] = useState("text"); // Définir 'text' comme valeur par défaut
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

  const handleServiceSelect = (serviceId, serviceName) => {
    setSelectedService(serviceName);
    setSelectedServiceId(serviceId);
    setSelectedDocumentTypeId("");
    setSelectedDocumentTypeName("");
    setDocumentTypes([]);
    setFilteredDocumentTypes([]);
    localStorage.setItem("selectedService", serviceName);
    localStorage.setItem("selectedServiceId", serviceId);
  };

  const handleDocumentTypeSelect = (docTypeId, docTypeName) => {
    setSelectedDocumentTypeId(docTypeId);
    setSelectedDocumentTypeName(docTypeName);
    setFilteredDocumentTypes(documentTypes);
    localStorage.setItem("selectedDocumentTypeId", docTypeId);
    localStorage.setItem("selectedDocumentTypeName", docTypeName);
  };

  useEffect(() => {
    const savedService = localStorage.getItem("selectedService");
    const savedServiceId = localStorage.getItem("selectedServiceId");
    const savedDocumentTypeId = localStorage.getItem("selectedDocumentTypeId");
    const savedDocumentTypeName = localStorage.getItem(
      "selectedDocumentTypeName"
    );

    if (savedService) setSelectedService(savedService);
    if (savedServiceId) setSelectedServiceId(savedServiceId);
    if (savedDocumentTypeId) setSelectedDocumentTypeId(savedDocumentTypeId);
    if (savedDocumentTypeName)
      setSelectedDocumentTypeName(savedDocumentTypeName);
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/services/directory"
        );
        const data = response.data.map((directory) => {
          // Parse the services JSON string into an array of objects
          const services = directory.services
            .split("|")
            .map((service) => JSON.parse(service));
          return {
            ...directory,
            services, // Replace the services string with the parsed array
          };
        });
        setServicesData(data); // Store the structured data
      } catch (error) {
        console.error("Error fetching services:", error);
        setError("Failed to fetch services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedServiceId) {
      const fetchDocumentTypes = async () => {
        try {
          console.log(selectedServiceId);
          const response = await axios.get(
            `http://localhost:3000/document-types/services/${selectedServiceId}/document-types`
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
  }, [selectedServiceId]);

  useEffect(() => {
    if (selectedDocumentTypeId) {
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

      fetchMetadata();
    } else {
      setMetadata([]);
    }
  }, [selectedDocumentTypeId]);

  const handleDelete = async (id) => {
    try {
      toast.success("Metadonnée supprimée avec succès !");
      setMetadata((prevMetadata) =>
        prevMetadata.filter((meta) => meta.id !== id)
      );
    } catch (error) {
      console.error("Error deleting metadata:", error);
      toast.error("Erreur lors de la suppression de la metadonnée");
    }
  };

  const fetchMetadataRefresh = async () => {
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

  const handleEdit = (meta) => {
    setCurrentMeta(meta);
    setEditMetadataId(meta.id);
    setEditMode(true);
  };

  const handleCreateNew = () => {
    setEditMode(false);
    setModalOpen(true);
    setMetaType("text"); // Réinitialiser le type à 'text' lors de l'ouverture de la modale
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    console.log(key, metaType, selectedDocumentTypeId);
    try {
      await axios.post("http://localhost:3000/metadata", {
        key,
        metaType,
        documentTypeId: selectedDocumentTypeId,
      });
      setKey("");
      setMetaType("text"); // Réinitialiser le type à 'text' après la création
      toast.success("Métadonnée créée avec succès!");
      await fetchMetadataRefresh();
    } catch (error) {
      console.error("Error creating metadata:", error);
      toast.error("Échec de la création de la métadonnée.");
    } finally {
      setFormLoading(false);
      setCreating(false);
      setModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-300">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-300">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-300 overflow-hidden">
      <Side_bar isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <div className="container w-[90%] mx-auto mt-28 bg-white rounded-xl shadow-2xl flex flex-col h-full">
          <h1 className="text-2xl mt-4 ml-2 font-extrabold text-gray-800 flex justify-start w-full">
            <LayoutList size="28px" className="mr-3 text-indigo-600" />
            Liste des Métadonnées
          </h1>
          <div className="border-b-2 border-gray-300 w-full"></div>
          <div className="bg-gray-100 w-full rounded-lg shadow-md p-6 mb-6 flex-1 overflow-y-auto">
            <div className="flex gap-4 mb-6">
              <div className="w-full">
                <div className="form-control">
                  <label className="label text-black">
                    Sélectionner un service
                  </label>
                  <select
                    className="select select-bordered w-full text-black bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                    onChange={(e) =>
                      handleServiceSelect(
                        e.target.value,
                        e.target.options[e.target.selectedIndex].text
                      )
                    }
                    value={selectedServiceId}
                  >
                    <option value="" disabled>
                      Sélectionner un service
                    </option>
                    {servicesData.map((directory) => (
                      <optgroup
                        key={directory.directory_id}
                        label={directory.nom_directory}
                      >
                        {directory.services.map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.nom_service}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>
              <div className="w-full">
                <div className="form-control">
                  <label className="label text-black">
                    Choisissez un type de document
                  </label>
                  <select
                    className="select select-bordered w-full text-black bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                    onChange={(e) =>
                      handleDocumentTypeSelect(
                        e.target.value,
                        e.target.options[e.target.selectedIndex].text
                      )
                    }
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
                </div>
              </div>
            </div>
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                placeholder="Rechercher une métadonnée"
                className="input input-bordered w-full max-w-xs bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800"
                onChange={(e) => {
                  const searchTerm = e.target.value.toLowerCase();
                  const filteredMetadata = metadata.filter((meta) =>
                    meta.cle.toLowerCase().includes(searchTerm)
                  );
                  if (searchTerm === "") fetchMetadataRefresh();
                  setMetadata(filteredMetadata);
                }}
              />
              {selectedDocumentTypeId && (
                <button
                  className="btn btn-primary ml-auto bg-gray-300 text-black hover:bg-gray-400 transition duration-300 rounded-lg shadow-md"
                  onClick={handleCreateNew}
                >
                  <Plus size={20} className="mr-2" />
                  Nouvelle
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <div className="max-h-96 overflow-y-auto">
                <table className="table w-full border-collapse">
                  <thead className="sticky top-0 rounded-lg bg-gray-300 text-black">
                    <tr>
                      <th className="text-lg p-4"></th>
                      <th className="text-lg p-4">|</th>
                      <th className="text-lg p-4">Nom métadonnées</th>
                      <th className="text-lg p-4">|</th>
                      <th className="text-lg p-4">Type des métadonnées</th>
                      <th className="text-lg p-4">|</th>
                      <th className="text-lg p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metadata.map((meta) => (
                      <tr
                        key={meta.id}
                        className="hover:bg-gray-100 transition duration-200"
                      >
                        <td className="flex items-center justify-center bg-gray-400 rounded-lg text-white text-base mt-2">
                          <DatabaseZap className="mr-2" />
                        </td>
                        <td className="text-base text-gray-900">|</td>
                        <td className="text-base text-gray-900">{meta.cle}</td>
                        <td className="text-base text-gray-900">|</td>
                        <td className="flex items-center text-base text-gray-900">
                          {meta.metaType}
                        </td>
                        <td className="text-base text-gray-900">|</td>
                        <td className="text-right text-base text-gray-900">
                          <Tooltip title="Modifier">
                            <button
                              className="btn btn-outline btn-primary btn-sm mr-2 hover:bg-indigo-100 transition duration-300 rounded-md"
                              onClick={() => handleEdit(meta)}
                            >
                              <SquarePen className="mr-1" />
                            </button>
                          </Tooltip>
                          <Tooltip title="Supprimer">
                            <button
                              className="btn btn-outline btn-error btn-sm hover:bg-red-400 transition duration-300 rounded-md"
                              onClick={() => handleDelete(meta.id)}
                            >
                              <Trash2 className="mr-1" />
                            </button>
                          </Tooltip>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && !editMode && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="modal-box bg-white text-black rounded-lg shadow-lg transform transition-all duration-300 max-w-lg w-full flex flex-col justify-center items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => setModalOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">
              Créer une nouvelle métadonnée
            </h2>
            <form onSubmit={handleSubmit} className="w-full">
              <div className="form-control w-full">
                <label className="label">Nom du champ</label>
                <input
                  type="text"
                  className="input  input-bordered w-full mb-4 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">Type du champ</label>
                <select
                  className="select select-bordered w-full mb-4 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                  value={metaType}
                  onChange={(e) => setMetaType(e.target.value)}
                  required
                >
                  <option disabled selected>
                    Sélectionner un type
                  </option>
                  <option value="text">Texte</option>
                  <option value="Date">Date</option>
                  <option value="number">Nombre</option>
                </select>
              </div>
              <div className="modal-action flex justify-center items-center">
                <button
                  type="submit"
                  className="btn flex justify-center items-center btn-primary w-[50%] bg-gray-300 text-black hover:bg-gray-400 transition duration-300 rounded-lg"
                >
                  <Plus className="mr-2" />
                  Créer
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-error w-[40%] mt-2"
                  onClick={() => setModalOpen(false)}
                >
                  Annuler
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
