import { useState, useEffect } from "react";
import axios from "axios";
import {
  SquarePen,
  Trash2,
  ChevronDown,
  ChevronUp,
  Layers3,
  Plus,
  Settings,
  Database,
  Zap,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "daisyui/dist/full.css";
import { Tooltip } from "@mui/material";
import Select from "react-select";
import Loader_component from "../../../Components/Loader";
import { showDeleteConfirmation } from "../../../utils/alerts";
import Swal from "sweetalert2";
import SideBar_up from "../components/Sidebar_up";
import TopBar_up from "../components/Topbar_up";

export default function DoctypeUp() {
  const [services, setServices] = useState([]);
  const [expandedService, setExpandedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDocType, setNewDocType] = useState({ name: "", serviceId: "" });
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const directoryId = localStorage.getItem("directory_id");
  const [showMetadataModal, setShowMetadataModal] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/services/service_dir/${directoryId}`
      );
      if (response.data && Array.isArray(response.data)) {
        console.log(response);

        // Récupérer les types de documents pour chaque service
        const servicesWithDocTypes = await Promise.all(
          response.data.map(async (service) => {
            try {
              const docTypesResponse = await axios.get(
                `http://localhost:3000/document-types/services/${service.id}/document-types`
              );

              return {
                ...service,
                documentTypes: docTypesResponse.data || [],
              };
            } catch (error) {
              console.error(
                `Erreur lors de la récupération des types de documents pour le service ${service.id}:`,
                error
              );
              return {
                ...service,
                documentTypes: [],
              };
            }
          })
        );
        setServices(servicesWithDocTypes);
      } else {
        console.error(
          "Format de données invalide pour les services:",
          response.data
        );
        setError("Format de données invalide pour les services");
      }
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des services:", error);
      setError("Échec de la récupération des services");
      setLoading(false);
    }
  };

  const toggleService = (serviceId) => {
    setExpandedService(expandedService === serviceId ? null : serviceId);
  };

  const handleDelete = async (docTypeId) => {
    const confirmed = await showDeleteConfirmation();

    if (confirmed) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/document-types/${docTypeId}`
        );
        console.log(response.data.message);

        if (response.data.message.includes("Impossible")) {
          Swal.fire({
            title: "Erreur",
            text: response.data.message,
            icon: "error",
            confirmButtonColor: "#444",
            confirmButtonText: "OK",
          }).then(() => {
            fetchServices();
          });
        } else {
          Swal.fire({
            title: "Succès",
            text: response.data.message,
            icon: "success",
            confirmButtonColor: "#444",
            confirmButtonText: "OK",
          }).then(() => {
            fetchServices();
          });
        }
      } catch (error) {
        console.error(
          "Erreur lors de la suppression du type de document:",
          error
        );
        toast.error("Échec de la suppression du type de document.");
      }
    }
  };

  const handleEdit = (docType) => {
    setNewDocType({
      id: docType.id,
      name: docType.name,
      serviceId: docType.serviceId,
    });
    setOpenModal(true);
  };

  const handleDocumentTypeCreated = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:3000/document-types", newDocType);
      setNewDocType({ name: "", serviceId: "" });
      fetchServices();
      toast.success("Nouveau type de document créé avec succès !");
      setOpenModal(false);
    } catch (error) {
      console.error("Erreur lors de la création du type de document:", error);
      toast.error("Échec de la création du type de document.");
    }
  };

  const handleDocumentTypeUpdated = async (event) => {
    event.preventDefault();

    try {
      await axios.put(`http://localhost:3000/document-types/${newDocType.id}`, {
        name: newDocType.name,
      });
      setNewDocType({ name: "", serviceId: "" });
      fetchServices();
      toast.success("Type de document mis à jour avec succès !");
      setOpenModal(false);

      Swal.fire({
        title: "Mise à jour réussie",
        text: "La mise à jour prendra effet après la réactualisation de la page.",
        icon: "info",
        confirmButtonColor: "#444",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du type de document:",
        error
      );
      toast.error("Échec de la mise à jour du type de document.");
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewDocType({ name: "", serviceId: "" });
  };

  const handleServiceChange = (selectedOption) => {
    setNewDocType({
      ...newDocType,
      serviceId: selectedOption ? selectedOption.value : "",
    });
  };

  const serviceOptions = services.map((service) => ({
    value: service.id,
    label: service.nom_service,
  }));

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredServices = services.filter((service) =>
    service.nom_service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShowMetadataModal = () => {
    setShowMetadataModal(true);
  };

  const handleCloseMetadataModal = () => {
    setShowMetadataModal(false);
  };

  if (loading) return <Loader_component />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <SideBar_up isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar_up position="fixed" title="Types de documents" />
        <div className="container w-full mx-auto px-4 py-8 mt-20">
          <div className="bg-white w-full rounded-xl shadow-xl p-6 border border-green-100">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-green-800 flex items-center">
                <Layers3 className="h-8 w-8 text-green-600 mr-2" />
                Types de documents
              </h1>
              <div className="flex gap-4">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
                  onClick={handleOpenModal}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Nouveau
                </button>
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
                  onClick={handleShowMetadataModal}
                >
                  <Settings className="h-5 w-5 mr-2" />
                  Configuration
                </button>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rechercher un service
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Rechercher..."
                    className="w-full px-4 py-2 bg-white border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="overflow-x-auto">
                <div className="h-[600px] bg-white py-4 rounded-xl px-6 overflow-y-auto shadow-inner">
                  <ul className="list-none w-full grid grid-cols-1 gap-4">
                    {filteredServices.map((service) => (
                      <li
                        key={service.id}
                        className="w-full border border-green-200 rounded-lg p-4"
                      >
                        <button
                          className="w-full bg-green-100 hover:bg-green-200 transition duration-300 rounded-lg shadow-md text-left flex justify-between items-center p-4"
                          onClick={() => toggleService(service.id)}
                        >
                          <div className="flex text-green-800 items-center">
                            <Settings className="mr-2 text-green-600" />
                            {service.nom_service}
                          </div>
                          {expandedService === service.id ? (
                            <ChevronUp className="text-green-600" />
                          ) : (
                            <ChevronDown className="text-green-600" />
                          )}
                        </button>
                        {expandedService === service.id && (
                          <table className="table w-full mt-2">
                            <thead className="sticky top-0 rounded-lg bg-green-100 text-green-800">
                              <tr>
                                <th className="text-lg p-4">
                                  Type de document
                                </th>
                                <th className="text-lg p-4 text-right">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {service.documentTypes &&
                                service.documentTypes.map((docType) => (
                                  <tr
                                    key={docType.id}
                                    className="hover:bg-green-50 rounded-lg bg-white border-b border-green-100 transition duration-200"
                                  >
                                    <td className="flex items-center p-4 text-base text-gray-800">
                                      <Layers3
                                        size={20}
                                        className="mr-2 text-green-600"
                                      />
                                      {docType.name}
                                    </td>
                                    <td className="text-right p-4 text-base text-gray-800">
                                      <Tooltip title="Modifier">
                                        <button
                                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition duration-300 mx-1"
                                          onClick={() => handleEdit(docType)}
                                        >
                                          <SquarePen />
                                        </button>
                                      </Tooltip>
                                      <Tooltip title="Supprimer">
                                        <button
                                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition duration-300 mx-1"
                                          onClick={() =>
                                            handleDelete(docType.id)
                                          }
                                        >
                                          <Trash2 />
                                        </button>
                                      </Tooltip>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {openModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4 border border-green-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-green-800">
                {newDocType.id
                  ? "Modifier le type de document"
                  : "Ajouter un nouveau type de document"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={
                newDocType.id
                  ? handleDocumentTypeUpdated
                  : handleDocumentTypeCreated
              }
            >
              {!newDocType.id && (
                <div className="form-control">
                  <label className="label font-medium text-gray-700">
                    Sélectionner un service
                  </label>
                  <Select
                    value={serviceOptions.find(
                      (option) => option.value === newDocType.serviceId
                    )}
                    onChange={handleServiceChange}
                    options={serviceOptions}
                    className="mb-2 text-black"
                    placeholder="Choisir un service"
                    isClearable
                  />
                </div>
              )}
              <div className="form-control mt-4">
                <label className="label font-medium text-gray-700">
                  Nom du type de document
                </label>
                <input
                  type="text"
                  value={newDocType.name}
                  onChange={(e) =>
                    setNewDocType({ ...newDocType, name: e.target.value })
                  }
                  className="input input-bordered w-full mb-4 bg-green-50 text-gray-800 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  required
                />
              </div>
              <div className="modal-action flex justify-center items-center mt-6 space-x-4">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  {newDocType.id ? "Mettre à jour" : "Ajouter"}
                </button>
                <button
                  type="button"
                  className="px-6 py-2.5 bg-white border border-red-500 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-300"
                  onClick={handleCloseModal}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMetadataModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
          onClick={handleCloseMetadataModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full mx-4 transform transition duration-500 hover:scale-[1.02] border border-green-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-green-100 transition-colors"
              onClick={handleCloseMetadataModal}
            >
              <span className="sr-only">Fermer</span>✕
            </button>

            <div className="text-center mb-8">
              <Settings className="mx-auto text-green-600 mb-4" size={48} />
              <h3 className="text-3xl font-bold text-green-800">
                Configuration du système
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-200"
                onClick={() => (window.location.href = "/meta_up")}
              >
                <div className="cursor-pointer absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="cursor-pointer relative p-6 text-center">
                  <Database
                    className="mx-auto text-gray-700 group-hover:text-green-600 transition-colors mb-4"
                    size={48}
                  />
                  <h4 className="text-xl font-bold text-gray-800 mb-2">
                    Méta-données pour les services
                  </h4>
                  <p className="text-gray-600">
                    Gestion des méta-données pour les services
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
