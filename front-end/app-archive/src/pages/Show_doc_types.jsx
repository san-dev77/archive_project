import { useState, useEffect } from "react";
import axios from "axios";
import TopBar from "../Components/Top_bar";
import {
  SquarePen,
  Trash2,
  ChevronDown,
  ChevronUp,
  Settings,
  Layers3,
  Plus,
  Database,
  Settings2Icon,
  Layers2,
  ArrowLeftRight,
  Zap,
  Network,
  Cog,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "daisyui/dist/full.css";
import { Tooltip } from "@mui/material";
import Select from "react-select";
import Loader_component from "../Components/Loader";
import { showDeleteConfirmation } from "../utils/alerts";
import Swal from "sweetalert2";
import Side_bar from "../Components/Side_bar";
import { useQuery, useMutation, useQueryClient } from "react-query";

export default function ShowDocType() {
  const [directories, setDirectories] = useState([]);
  const [servicesData, setServicesData] = useState([]);
  const [expandedDirectory, setExpandedDirectory] = useState(null);
  const [expandedService, setExpandedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDocType, setNewDocType] = useState({ name: "", serviceId: "" });
  const [DocTypeDir, setDocTypeDir] = useState({
    name_docType_dir: "",
  });
  const [openModal, setOpenModal] = useState(false);
  const [newModal, setNewModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMetadataModal, setShowMetadataModal] = useState(false);
  const [viewMode] = useState("grid");
  const [showAlternateContent, setShowAlternateContent] = useState(false);
  const [docTypeDirData, setDocTypeDirData] = useState([]);
  const [selectedDirectory, setSelectedDirectory] = useState(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    fetchDirectories();
    fetchServicesAndDirectories();
    fetchDocTypeDir();
  }, []);

  const fetchDirectories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/document-types");
      if (response.data && Array.isArray(response.data)) {
        setDirectories(response.data);
      } else {
        console.error("Invalid data format for directories:", response.data);
        setError("Invalid data format for directories");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching directories:", error);
      setError("Failed to fetch directories");
      setLoading(false);
    }
  };

  const fetchServicesAndDirectories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/services/directory"
      );
      if (response.data && Array.isArray(response.data)) {
        const data = response.data.map((directory) => {
          const services = directory.services
            .split("|")
            .map((service) => {
              try {
                return JSON.parse(service);
              } catch (e) {
                console.error("Error parsing service:", service, e);
                return null;
              }
            })
            .filter((service) => service !== null);
          return {
            ...directory,
            services,
          };
        });
        setServicesData(data);
      } else {
        console.error(
          "Invalid data format for services and directories:",
          response.data
        );
        setError("Invalid data format for services and directories");
      }
    } catch (error) {
      console.error("Error fetching services and directories:", error);
      setError("Failed to fetch services and directories");
    }
  };

  const fetchDocTypeDir = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/document-types/docType_dir"
      );

      console.log(response.data);

      if (response.data && Array.isArray(response.data)) {
        console.log("data", response.data);
        setDocTypeDirData(response.data);
      } else {
        console.error("Invalid data format for docType_dir:", response.data);
        setError("Invalid data format for docType_dir");
      }
    } catch (error) {
      console.error("Error fetching docType_dir:", error);
      setError("Failed to fetch docType_dir");
    }
  };

  const toggleDirectory = (directoryId) => {
    setExpandedDirectory(
      expandedDirectory === directoryId ? null : directoryId
    );
  };

  const toggleService = (serviceId) => {
    setExpandedService(expandedService === serviceId ? null : serviceId);
  };

  const deleteMutation = useMutation(
    (docTypeId) =>
      axios.delete(`http://localhost:3000/document-types/${docTypeId}`),
    {
      onSuccess: (response) => {
        console.log(response.data.message);
        if (response.data.message.includes("Impossible")) {
          Swal.fire({
            title: "Erreur",
            text: response.data.message,
            icon: "error",
            confirmButtonColor: "#444",
            confirmButtonText: "OK",
          });
        } else {
          Swal.fire({
            title: "Succès",
            text: response.data.message,
            icon: "success",
            confirmButtonColor: "#444",
            confirmButtonText: "OK",
          });
        }
        queryClient.invalidateQueries("directories");
        fetchDirectories();
      },
      onError: (error) => {
        console.error("Error deleting document type:", error);
        toast.error("Échec de la suppression du type de document.");
      },
    }
  );

  const deleteDirMutation = useMutation(
    (docTypeId) =>
      axios.delete(
        `http://localhost:3000/document-types/doctype_dir/${docTypeId}`
      ),
    {
      onSuccess: (response) => {
        console.log(response.data.message);
        if (response.data.message.includes("Impossible")) {
          Swal.fire({
            title: "Erreur",
            text: response.data.message,
            icon: "error",
            confirmButtonColor: "#444",
            confirmButtonText: "OK",
          });
        } else {
          Swal.fire({
            title: "Succès",
            text: response.data.message,
            icon: "success",
            confirmButtonColor: "#444",
            confirmButtonText: "OK",
          });
        }
        queryClient.invalidateQueries("docTypeDir");
        fetchDocTypeDir();
      },
      onError: (error) => {
        console.error("Error deleting document type directory:", error);
        toast.error("Échec de la suppression du type de document.");
      },
    }
  );

  const updateMutation = useMutation(
    (docType) =>
      axios.put(`http://localhost:3000/document-types/${docType.id}`, {
        name: docType.name,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("directories");
        fetchDirectories();
        toast.success("Type de document mis à jour avec succès !");
        setOpenModal(false);

        Swal.fire({
          title: "Mise à jour réussie",
          text: "La mise à jour prendra effet après la réactualisation de la page.",
          icon: "info",
          confirmButtonColor: "#444",
          confirmButtonText: "OK",
        });
      },
      onError: (error) => {
        console.error("Error updating document type:", error);
        toast.error("Échec de la mise à jour du type de document.");
      },
    }
  );

  const createMutation = useMutation(
    (docType) => axios.post("http://localhost:3000/document-types", docType),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("directories");
        fetchDirectories();
        toast.success("Nouveau type de document créé avec succès !");
        setOpenModal(false);
      },
      onError: (error) => {
        console.error("Error creating document type:", error);
        toast.error("Échec de la création du type de document.");
      },
    }
  );

  const createDirMutation = useMutation(
    (docTypeDir) =>
      axios.post(
        "http://localhost:3000/document-types/doctype_dir",
        docTypeDir
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("docTypeDir");
        fetchDocTypeDir();
        fetchDirectories();
        toast.success("Nouveau type de document créé avec succès !");
        setNewModal(false);
      },
      onError: (error) => {
        console.error("Error creating document type directory:", error);
        toast.error("Échec de la création du type de document.");
      },
    }
  );

  const updateDirMutation = useMutation(
    (docTypeDir) =>
      axios.put(
        `http://localhost:3000/document-types/doctype_dir/${docTypeDir.id}`,
        {
          name_docType_dir: docTypeDir.name_docType_dir,
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("docTypeDir");
        fetchDocTypeDir();
        toast.success("Type de document mis à jour avec succès !");
        setNewModal(false);
      },
      onError: (error) => {
        console.error("Error updating document type directory:", error);
        toast.error("Échec de la mise à jour du type de document.");
      },
    }
  );

  const handleDelete = async (docTypeId) => {
    const confirmed = await showDeleteConfirmation();

    if (confirmed) {
      deleteMutation.mutate(docTypeId);
    }
  };

  const handleDelete_dir = async (docType) => {
    const confirmed = await showDeleteConfirmation();

    if (confirmed) {
      deleteDirMutation.mutate(docType.docTypeDirId);
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

  const handleEdit_dir = (docType) => {
    console.log(docType);
    setDocTypeDir({
      id: docType.docTypeDirId,
      name_docType_dir: docType.docTypeName,
    });
    setSelectedDirectory(docType.directoryId);
    setNewModal(true);
  };

  const handleDocumentTypeCreated = async (event) => {
    event.preventDefault();
    createMutation.mutate(newDocType);
  };

  const handleCreateDocumentTypeDirections = async (event) => {
    event.preventDefault();

    // Si on est en mode édition
    if (DocTypeDir.id) {
      updateDirMutation.mutate(DocTypeDir);
      return;
    }

    // Mode création
    if (!selectedDirectory) {
      toast.error("Veuillez sélectionner une direction");
      return;
    }

    const DocTypeDirectory = {
      name_docType_dir: DocTypeDir.name_docType_dir,
      directoryId: selectedDirectory,
    };

    createDirMutation.mutate(DocTypeDirectory);
  };

  const handleDocumentTypeUpdated = async (event) => {
    event.preventDefault();
    updateMutation.mutate(newDocType);
  };

  const handleOpenModal = () => {
    if (showAlternateContent) {
      setDocTypeDir({ name_docType_dir: "" });
      setSelectedDirectory(null);
      setNewModal(true);
    } else {
      setOpenModal(true);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewModal(false);
    setNewDocType({ name: "", serviceId: "" });
    setSelectedDirectory(null);
  };

  const handleServiceChange = (selectedOption) => {
    setNewDocType({
      ...newDocType,
      serviceId: selectedOption ? selectedOption.value : "",
    });
  };

  const serviceOptions = servicesData.map((directory) => ({
    label: directory.nom_directory,
    dir_id: directory.directory_id,
    options: directory.services.map((service) => ({
      value: service.id,
      label: service.nom_service,
    })),
  }));

  const directoryOptions = servicesData.map((directory) => ({
    value: directory.directory_id,
    label: directory.nom_directory,
  }));

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredDirectories = directories.filter((directory) =>
    directory.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShowMetadataModal = () => {
    setShowMetadataModal(true);
  };

  const handleCloseMetadataModal = () => {
    setShowMetadataModal(false);
  };

  useEffect(() => {
    if (showAlternateContent) {
      fetchDocTypeDir();
    }
  }, [showAlternateContent]);

  if (loading) return <Loader_component />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Side_bar isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar position="fixed" title="Types de documents" />
        <div className="container w-full mx-auto px-4 py-8 mt-20">
          <div className="bg-white w-full rounded-xl shadow-xl p-6 border border-green-100">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-green-800 flex items-center">
                <Layers3 className="h-8 w-8 text-green-600 mr-2" />
                Types de documents
              </h1>
              <div className="flex gap-4">
                <button
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-5 py-2.5 rounded-lg flex items-center transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                  onClick={handleOpenModal}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Nouveau
                </button>
                <button
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
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
                    Rechercher un type de document
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Rechercher..."
                    className="w-full px-4 py-2.5 bg-white text-gray-800 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            <div className="flex rounded-xl p-4 border border-green-200 bg-green-50 w-full justify-between items-center mb-6 hover:border-green-300 transition-all duration-300">
              <label className="font-semibold flex items-center text-green-800">
                <ArrowLeftRight className="mr-3 text-green-600" />
                Mode Direction
              </label>
              <input
                type="checkbox"
                checked={showAlternateContent}
                onChange={() => setShowAlternateContent(!showAlternateContent)}
                className="toggle toggle-lg bg-gray-200 checked:bg-green-500"
              />
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 shadow-inner">
              <div className="space-y-4">
                {showAlternateContent ? (
                  <div className="overflow-x-auto">
                    <div className="h-[600px] w-full bg-white py-2 rounded-lg px-4 overflow-y-auto">
                      <ul className="list-none w-full grid grid-cols-1 gap-4">
                        {docTypeDirData.map((item) => (
                          <div
                            key={item.id}
                            className="border border-green-100 rounded-xl shadow-sm"
                          >
                            <button
                              className="btn relative w-full text-left flex justify-between items-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-none rounded-t-xl p-4 transition-all duration-300"
                              onClick={() => {
                                item.expanded = !item.expanded;
                                setDocTypeDirData([...docTypeDirData]);
                              }}
                            >
                              <div className="flex items-center pl-6">
                                <Network
                                  className="mr-3 text-green-300"
                                  size={22}
                                />
                                <span className="text-base font-semibold">
                                  {item.directoryName}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                {item.expanded ? (
                                  <ChevronUp
                                    size={22}
                                    className="text-green-300"
                                  />
                                ) : (
                                  <ChevronDown
                                    size={22}
                                    className="text-green-300"
                                  />
                                )}
                              </div>
                            </button>
                            {item.expanded && (
                              <div className="p-4 bg-white">
                                <table className="w-full border-collapse">
                                  <thead className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800">
                                    <tr>
                                      <th className="text-left p-3 rounded-tl-lg font-semibold">
                                        Type de document
                                      </th>
                                      <th className="text-right p-3 rounded-tr-lg font-semibold">
                                        Actions
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {item.docTypes.map((docType) => (
                                      <tr
                                        key={docType.docTypeDirId}
                                        className="border-b border-green-50 hover:bg-green-50/50 transition-colors duration-200"
                                      >
                                        <td className="flex items-center p-4 text-base text-gray-800">
                                          <Layers2 className="mr-2 text-green-500" />
                                          <span className="font-medium">
                                            {docType.docTypeName}
                                          </span>
                                        </td>
                                        <td className="text-right p-4">
                                          <div className="flex justify-end space-x-2">
                                            <button
                                              className="p-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors duration-200"
                                              onClick={() =>
                                                handleEdit_dir(docType)
                                              }
                                            >
                                              <SquarePen size={18} />
                                            </button>
                                            <button
                                              className="p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors duration-200"
                                              onClick={() =>
                                                handleDelete_dir(docType)
                                              }
                                            >
                                              <Trash2 size={18} />
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <ul
                    className={`list-none w-full ${
                      viewMode === "grid" ? "grid grid-cols-1 gap-4" : ""
                    }`}
                  >
                    {filteredDirectories.map((directory) => (
                      <div
                        key={directory.id}
                        className="border border-green-100 rounded-xl shadow-sm"
                      >
                        <button
                          className="btn relative w-full text-left flex justify-between items-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-none rounded-t-xl p-4 transition-all duration-300"
                          onClick={() => toggleDirectory(directory.id)}
                        >
                          <div className="flex items-center pl-6">
                            <Network
                              className="mr-3 text-green-300"
                              size={22}
                            />
                            <span className="text-base font-semibold">
                              {directory.name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {expandedDirectory === directory.id ? (
                              <ChevronUp size={22} className="text-green-300" />
                            ) : (
                              <ChevronDown
                                size={22}
                                className="text-green-300"
                              />
                            )}
                          </div>
                        </button>

                        {expandedDirectory === directory.id && (
                          <div className="p-4 bg-white">
                            <div className="mb-4">
                              <h3 className="text-lg font-semibold text-green-800 flex items-center mb-2">
                                <Settings className="mr-2 text-green-600" />
                                Services
                              </h3>
                            </div>
                            <ul className="list-none w-full space-y-3">
                              {directory.services.map((service) => (
                                <li key={service.id} className="w-full">
                                  <button
                                    className="btn w-full text-left flex justify-between items-center bg-green-100 hover:bg-green-200 text-green-800 border-none rounded-lg p-3 transition-all duration-200"
                                    onClick={() => toggleService(service.id)}
                                  >
                                    <div className="flex items-center">
                                      <Cog className="mr-2 text-green-600" />
                                      <span className="font-medium">
                                        {service.name}
                                      </span>
                                    </div>
                                    {expandedService === service.id ? (
                                      <ChevronUp
                                        size={18}
                                        className="text-green-600"
                                      />
                                    ) : (
                                      <ChevronDown
                                        size={18}
                                        className="text-green-600"
                                      />
                                    )}
                                  </button>
                                  {expandedService === service.id && (
                                    <table className="w-full border-collapse mt-2">
                                      <thead className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800">
                                        <tr>
                                          <th className="text-left p-3 rounded-tl-lg font-semibold">
                                            Type de document
                                          </th>
                                          <th className="text-right p-3 rounded-tr-lg font-semibold">
                                            Actions
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {service.documentTypes.map(
                                          (docType) => (
                                            <tr
                                              key={docType.id}
                                              className="border-b border-green-50 hover:bg-green-50/50 transition-colors duration-200"
                                            >
                                              <td className="flex items-center p-4 text-base text-gray-800">
                                                <Layers3 className="mr-2 text-green-500" />
                                                <span className="font-medium">
                                                  {docType.name}
                                                </span>
                                              </td>
                                              <td className="text-right p-4">
                                                <div className="flex justify-end space-x-2">
                                                  <button
                                                    className="p-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors duration-200"
                                                    onClick={() =>
                                                      handleEdit(docType)
                                                    }
                                                  >
                                                    <SquarePen size={18} />
                                                  </button>
                                                  <button
                                                    className="p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors duration-200"
                                                    onClick={() =>
                                                      handleDelete(docType.id)
                                                    }
                                                  >
                                                    <Trash2 size={18} />
                                                  </button>
                                                </div>
                                              </td>
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                    </table>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {openModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setOpenModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg mx-4 transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => setOpenModal(false)}
            >
              ✕
            </button>
            <h3 className="font-bold text-green-800 text-xl mb-4">
              {newDocType.id
                ? "Modifier le type de document"
                : "Ajouter un nouveau type de document"}
            </h3>
            <form
              onSubmit={
                newDocType.id
                  ? handleDocumentTypeUpdated
                  : handleDocumentTypeCreated
              }
            >
              {!newDocType.id && (
                <div className="form-control">
                  <label className="label text-gray-700 font-medium">
                    Sélectionner un service
                  </label>
                  <Select
                    value={serviceOptions
                      .flatMap((group) => group.options)
                      .find((option) => option.value === newDocType.serviceId)}
                    onChange={handleServiceChange}
                    options={serviceOptions}
                    className="mb-4 text-gray-800"
                    placeholder="Choisir un service"
                    isClearable
                    theme={(theme) => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        primary: "#10b981",
                        primary25: "#ecfdf5",
                      },
                    })}
                  />
                </div>
              )}
              <div className="form-control mt-4">
                <label className="label text-gray-700 font-medium">
                  Nom du type de document
                </label>
                <input
                  type="text"
                  value={newDocType.name}
                  onChange={(e) =>
                    setNewDocType({ ...newDocType, name: e.target.value })
                  }
                  className="input py-2.5 px-4 border-2 border-green-200 rounded-lg bg-white text-gray-800 focus:border-green-500 focus:ring focus:ring-green-200 transition-all duration-200"
                  required
                />
              </div>
              <div className="modal-action flex justify-center items-center mt-6 space-x-4">
                <button
                  type="submit"
                  className="btn px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  {newDocType.id ? "Mettre à jour" : "Ajouter"}
                </button>
                <button
                  type="button"
                  className="btn px-6 py-2.5 bg-white border border-red-500 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-300"
                  onClick={handleCloseModal}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {newModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg mx-4 transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
              onClick={handleCloseModal}
            >
              ✕
            </button>
            <h3 className="font-bold text-green-800 text-xl mb-4">
              {DocTypeDir.id
                ? "Modifier le type de document (Mode direction)"
                : "Nouveau type de document (Mode direction)"}
            </h3>
            <form onSubmit={handleCreateDocumentTypeDirections}>
              <div className="form-control">
                {!DocTypeDir.id && (
                  <>
                    <label className="label text-gray-700 font-medium">
                      Sélectionner une direction
                    </label>
                    <Select
                      value={directoryOptions.find(
                        (opt) => opt.value === selectedDirectory
                      )}
                      onChange={(selectedOption) =>
                        setSelectedDirectory(
                          selectedOption ? selectedOption.value : null
                        )
                      }
                      options={directoryOptions}
                      className="mb-4 text-gray-800"
                      placeholder="Choisir une direction"
                      isClearable
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary: "#10b981",
                          primary25: "#ecfdf5",
                        },
                      })}
                    />
                  </>
                )}
              </div>
              <div className="form-control mt-4">
                <label className="label text-gray-700 font-medium">
                  Nom du type de document
                </label>
                <input
                  type="text"
                  value={DocTypeDir.name_docType_dir}
                  onChange={(e) =>
                    setDocTypeDir({
                      ...DocTypeDir,
                      name_docType_dir: e.target.value,
                    })
                  }
                  className="input py-2.5 px-4 border-2 border-green-200 rounded-lg bg-white text-gray-800 focus:border-green-500 focus:ring focus:ring-green-200 transition-all duration-200"
                  required
                />
              </div>
              <div className="modal-action flex justify-center items-center mt-6 space-x-4">
                <button
                  type="submit"
                  className="btn px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  {DocTypeDir.id ? "Mettre à jour" : "Ajouter"}
                </button>
                <button
                  type="button"
                  className="btn px-6 py-2.5 bg-white border border-red-500 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-300"
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
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handleCloseMetadataModal}
        >
          <div
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl mx-4 transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
              onClick={handleCloseMetadataModal}
            >
              ✕
            </button>
            <h3 className="font-bold text-green-800 text-xl mb-4 text-center">
              Configuration du système
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                onClick={() => (window.location.href = "/pieces")}
              >
                <div className="text-center">
                  <Settings2Icon
                    className="mx-auto text-green-600 mb-4"
                    size={48}
                  />
                  <h4 className="text-xl font-bold text-green-800 mb-2">
                    Pièces
                  </h4>
                  <p className="text-gray-600">
                    Configuration et gestion des pièces
                  </p>
                </div>
              </div>

              <div
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                onClick={() => (window.location.href = "/metadata")}
              >
                <div className="text-center">
                  <Database className="mx-auto text-green-600 mb-4" size={48} />
                  <h4 className="text-xl font-bold text-green-800 mb-2">
                    Méta-données pour les services
                  </h4>
                  <p className="text-gray-600">
                    Gestion des méta-données par service
                  </p>
                </div>
              </div>

              <div
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                onClick={() => (window.location.href = "/meta_dir")}
              >
                <div className="text-center">
                  <Zap className="mx-auto text-green-600 mb-4" size={48} />
                  <h4 className="text-xl font-bold text-green-800 mb-2">
                    Méta-données par direction
                  </h4>
                  <p className="text-gray-600">Configuration par direction</p>
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
