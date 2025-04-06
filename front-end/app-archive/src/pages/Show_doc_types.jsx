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
  const [newModal, setNewModal] = useState(false); // New state for the new modal
  const [searchTerm, setSearchTerm] = useState("");
  const [showMetadataModal, setShowMetadataModal] = useState(false);
  const [viewMode] = useState("grid");
  const [showAlternateContent, setShowAlternateContent] = useState(false);
  const [docTypeDirData, setDocTypeDirData] = useState([]);
  const [selectedDirectory, setSelectedDirectory] = useState(null); // New state for selected directory

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
            fetchDirectories();
          });
        } else {
          Swal.fire({
            title: "Succès",
            text: response.data.message,
            icon: "success",
            confirmButtonColor: "#444",
            confirmButtonText: "OK",
          }).then(() => {
            fetchDirectories();
          });
        }
      } catch (error) {
        console.error("Error deleting document type:", error);
        toast.error("Échec de la suppression du type de document.");
      }
    }
  };
  const handleDelete_dir = async (docTypeId) => {
    const confirmed = await showDeleteConfirmation();

    console.log(docTypeId);

    if (confirmed) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/document-types/doctype_dir/${docTypeId.docTypeDirId}`
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
            fetchDocTypeDir();
            // Force re-render by resetting the state
            setDocTypeDirData((prevData) => [...prevData]);
          });
        } else {
          Swal.fire({
            title: "Succès",
            text: response.data.message,
            icon: "success",
            confirmButtonColor: "#444",
            confirmButtonText: "OK",
          }).then(() => {
            fetchDocTypeDir();
            // Force re-render by resetting the state
            setDocTypeDirData((prevData) => [...prevData]);
          });
        }
      } catch (error) {
        console.error("Error deleting document type:", error);
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
    try {
      await axios.post("http://localhost:3000/document-types", newDocType);
      setNewDocType({ name: "", serviceId: "" });
      fetchDirectories();
      toast.success("Nouveau type de document créé avec succès !");
      setOpenModal(false);
    } catch (error) {
      console.error("Error creating document type:", error);
      toast.error("Failed to create document type.");
    }
  };

  const handleCreateDocumentTypeDirections = async (event) => {
    event.preventDefault();

    // Si on est en mode édition
    if (DocTypeDir.id) {
      try {
        console.log(DocTypeDir);

        await axios.put(
          `http://localhost:3000/document-types/doctype_dir/${DocTypeDir.id}`,
          {
            name_docType_dir: DocTypeDir.name_docType_dir,
          }
        );
        setDocTypeDir({ name_docType_dir: "" });
        fetchDocTypeDir();
        toast.success("Type de document mis à jour avec succès !");
        setNewModal(false);
      } catch (error) {
        console.error("Error updating document type:", error);
        toast.error("Échec de la mise à jour du type de document.");
      }
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

    try {
      await axios.post(
        "http://localhost:3000/document-types/doctype_dir",
        DocTypeDirectory
      );
      setDocTypeDir({ name_docType_dir: "" });
      fetchDirectories();
      fetchDocTypeDir();
      fetchServicesAndDirectories();
      toast.success("Nouveau type de document créé avec succès !");
      setNewModal(false);
    } catch (error) {
      console.error("Error creating document type:", error);
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
    } catch (error) {
      console.error("Error updating document type:", error);
      toast.error("Failed to update document type.");
    }
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
    setNewModal(false); // Close the new modal
    setNewDocType({ name: "", serviceId: "" });
    setSelectedDirectory(null); // Reset selected directory
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
      fetchDocTypeDir(); // Fetch docType_dir data when the switch is checked
    }
  }, [showAlternateContent]);

  if (loading) return <Loader_component />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-300">
      <Side_bar isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar position="fixed" title="Types de documents" />
        <div className="container w-full mx-auto px-4 py-8 mt-20">
          <div className="bg-gray-800 w-full rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <Layers3 className="h-8 w-8 text-[#00B7FF] mr-2" />
                Types de documents
              </h1>
              <div className="flex gap-4">
                <button
                  className="bg-white hover:bg-gray-700 text-black hover:text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
                  onClick={handleOpenModal}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Nouveau
                </button>
                <button
                  className="bg-white hover:bg-gray-700 text-black hover:text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
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
                  <label className="block text-sm font-medium text-white mb-1">
                    Rechercher un type de document
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Rechercher..."
                    className="w-full px-4 py-2 bg-[#3a3a3a] text-white border border-[#4a4a4a] rounded-lg focus:ring-2 focus:ring-[#00B7FF] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex rounded-xl p-4 border-2 border-[#4a4a4a] bg-[#3a3a3a] w-full justify-between items-center mb-6 hover:border-[#00B7FF] transition-all duration-300">
              <label className="font-semibold flex items-center text-white">
                <ArrowLeftRight className="mr-3 text-[#00B7FF]" />
                Mode Direction
              </label>
              <input
                type="checkbox"
                checked={showAlternateContent}
                onChange={() => setShowAlternateContent(!showAlternateContent)}
                className="toggle toggle-lg bg-gray-600 checked:bg-[#00B7FF]"
              />
            </div>

            <div className="bg-[#3a3a3a] rounded-lg p-4">
              <div className="overflow-x-auto">
                <div className="h-[600px] bg-gray-800 py-4 rounded-xl px-6 overflow-y-auto shadow-inner">
                  {showAlternateContent ? (
                    <div className="overflow-x-auto">
                      <div className="h-[600px] w-full bg-gray-800 py-2 rounded-lg px-4 overflow-y-auto">
                        <ul
                          className={`list-none w-full grid grid-cols-1 gap-4`}
                        >
                          {docTypeDirData.map((item) => (
                            <li
                              key={item.id}
                              className={`w-full border rounded-lg p-4`}
                            >
                              <button
                                className={`btn w-full  bg-gray-700 hover:bg-gray-400 transition duration-300 rounded-lg shadow-md text-left flex justify-between items-center`}
                                onClick={() => {
                                  // Toggle the expanded state for document types
                                  item.expanded = !item.expanded;
                                  setDocTypeDirData([...docTypeDirData]); // Update state to trigger re-render
                                }}
                              >
                                <div className="flex text-black items-center p-2 rounded-full bg-white">
                                  <Settings className="mr-2" />
                                  {item.directoryName}
                                </div>
                              </button>
                              {item.expanded && ( // Check if the document types should be displayed
                                <ul className="list-none mt-2 bg-white p-3 rounded-lg">
                                  <span className="text-black flex gap-2 items-center justify-center border-b-2 border-black font-bold text-lg text-center">
                                    <Layers3 />
                                    Les types de documents par direction
                                  </span>
                                  {item.docTypes.map((docType) => (
                                    <li
                                      key={docType.docTypeDirId}
                                      className="p-2  flex items-start gap-1 justify-start rounded-lg w-full bg-slate-800 text-white font-bold"
                                    >
                                      <Layers2 />
                                      {docType.docTypeName}
                                      <div className="flex items-end justify-end gap-2 w-full">
                                        <Tooltip title="Modifier">
                                          <button
                                            className="btn btn-outline btn-circle bg-gray-700 text-white hover:bg-indigo-400 transition duration-300 "
                                            onClick={() =>
                                              handleEdit_dir(docType)
                                            }
                                          >
                                            <SquarePen className="" />
                                          </button>
                                        </Tooltip>
                                        <Tooltip title="Supprimer">
                                          <button
                                            className="btn btn-outline btn-circle bg-gray-700 text-white  hover:bg-red-500 transition duration-300"
                                            onClick={() =>
                                              handleDelete_dir(docType)
                                            }
                                          >
                                            <Trash2 className="" />
                                          </button>
                                        </Tooltip>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
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
                        <li
                          key={directory.id}
                          className={`w-full ${
                            viewMode === "grid"
                              ? "border border-white rounded-lg p-4"
                              : ""
                          }`}
                        >
                          <button
                            className={`btn ${
                              viewMode === "grid"
                                ? "w-full bg-gray-500 hover:bg-gray-400"
                                : "bg-gray-500 w-full  text-black hover:bg-gray-400"
                            } transition duration-300 rounded-lg shadow-md text-left flex justify-between items-center`}
                            onClick={() => toggleDirectory(directory.id)}
                          >
                            <div className="flex text-black items-center p-2 rounded-full bg-white">
                              <Settings className="mr-2" />
                              {directory.name}
                            </div>
                            {expandedDirectory === directory.id ? (
                              <ChevronUp />
                            ) : (
                              <ChevronDown />
                            )}
                          </button>
                          {expandedDirectory === directory.id && (
                            <ul className="list-none w-full mt-2 ml-1 border-l-2 border-gray-300 pl-4">
                              <span className="text-white flex items-center justify-center gap-2 font-bold text-2xl">
                                <Settings className="mr-2" />
                                Services
                              </span>
                              {directory.services.map((service) => (
                                <li key={service.id} className="w-full">
                                  <button
                                    className="btn btn-outline border-t-cyan-800 w-full text-left flex justify-between items-center"
                                    onClick={() => toggleService(service.id)}
                                  >
                                    <div className="flex items-center p-2 rounded-full text-gray-700 bg-gray-200">
                                      <Settings className="mr-2" />
                                      {service.name}
                                    </div>
                                  </button>
                                  {expandedService === service.id && (
                                    <table className="table w-full mt-2">
                                      <thead className="sticky top-0 rounded-lg bg-gray-700 text-white ">
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
                                        {service.documentTypes.map(
                                          (docType) => (
                                            <tr
                                              key={docType.id}
                                              className="hover:bg-gray-200 rounded-lg bg-gray-100 transition duration-200"
                                            >
                                              <td className="flex items-center p-4 text-base text-gray-800">
                                                <Layers3
                                                  size={20}
                                                  className="mr-2"
                                                />
                                                {docType.name}
                                              </td>
                                              <td className="text-right  p-4 text-base text-gray-800">
                                                <Tooltip title="Modifier">
                                                  <button
                                                    className="btn btn-outline btn-circle bg-gray-700 text-white  hover:bg-indigo-500 transition duration-300 "
                                                    onClick={() =>
                                                      handleEdit(docType)
                                                    }
                                                  >
                                                    <SquarePen className="" />
                                                  </button>
                                                </Tooltip>
                                                <Tooltip title="Supprimer">
                                                  <button
                                                    className="btn btn-outline  bg-gray-700 text-white btn-circle hover:bg-red-500 transition duration-300 "
                                                    onClick={() =>
                                                      handleDelete(docType.id)
                                                    }
                                                  >
                                                    <Trash2 className="" />
                                                  </button>
                                                </Tooltip>
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
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-700 rounded-lg shadow-xl p-6 w-full max-w-lg mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">
                {newDocType.id
                  ? "Modifier le type de document"
                  : "Ajouter un nouveau type de document"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-200"
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
                  <label className="label">Sélectionner un service</label>
                  <Select
                    value={serviceOptions
                      .flatMap((group) => group.options)
                      .find((option) => option.value === newDocType.serviceId)}
                    onChange={handleServiceChange}
                    options={serviceOptions}
                    className="mb-2 text-black"
                    placeholder="Choisir un service"
                    isClearable
                  />
                </div>
              )}
              <div className="form-control mt-4">
                <label className="label">Nom du type de document</label>
                <input
                  type="text"
                  value={newDocType.name}
                  onChange={(e) =>
                    setNewDocType({ ...newDocType, name: e.target.value })
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
                  {newDocType.id ? "Mettre à jour" : "Ajouter"}
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

      {newModal && (
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
              {DocTypeDir.id
                ? "Modifier le type de document (Mode direction)"
                : "Nouveau type de document (Mode direction)"}
            </h3>
            <form onSubmit={handleCreateDocumentTypeDirections}>
              <div className="form-control">
                {!DocTypeDir.id && (
                  <>
                    <label className="label">Sélectionner une direction</label>
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
                      className="mb-2 text-black"
                      placeholder="Choisir une direction"
                      isClearable
                    />
                  </>
                )}
              </div>
              <div className="form-control mt-4">
                <label className="label">Nom du type de document</label>
                <input
                  type="text"
                  value={DocTypeDir.name_docType_dir}
                  onChange={(e) =>
                    setDocTypeDir({
                      ...DocTypeDir,
                      name_docType_dir: e.target.value,
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
                  {DocTypeDir.id ? "Mettre à jour" : "Ajouter"}
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

      {showMetadataModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
          onClick={handleCloseMetadataModal}
        >
          <div
            className="bg-white/90 rounded-2xl shadow-2xl p-8 max-w-4xl w-full mx-4 transform transition duration-500 hover:scale-[1.02]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={handleCloseMetadataModal}
            >
              <span className="sr-only">Fermer</span>✕
            </button>

            <div className="text-center mb-8">
              <Settings className="mx-auto text-gray-700 mb-4" size={48} />
              <h3 className="text-3xl font-bold text-gray-800">
                Configuration du système
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                onClick={() => (window.location.href = "/pieces")}
              >
                <div className=" cursor-pointer absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className=" cursor-pointer relative p-6 text-center">
                  <Settings2Icon
                    className="mx-auto text-gray-700 group-hover:text-blue-600 transition-colors mb-4"
                    size={48}
                  />
                  <h4 className="text-xl font-bold text-gray-800 mb-2">
                    Pièces
                  </h4>
                  <p className="text-gray-600">
                    Configuration et gestion des pièces
                  </p>
                </div>
              </div>

              <div
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                onClick={() => (window.location.href = "/metadata")}
              >
                <div className=" cursor-pointer absolute inset-0 bg-gradient-to-br from-gray-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className=" cursor-pointer relative p-6 text-center">
                  <Database
                    className="mx-auto text-gray-700 group-hover:text-green-600 transition-colors mb-4"
                    size={48}
                  />
                  <h4 className="text-xl font-bold text-gray-800 mb-2">
                    Méta-données pour les services
                  </h4>
                  <p className="text-gray-600">
                    Gestion des méta-données par service
                  </p>
                </div>
              </div>

              <div
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                onClick={() => (window.location.href = "/meta_dir")}
              >
                <div className=" cursor-pointer absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="cursor-pointer relative p-6 text-center">
                  <Zap
                    className="mx-auto text-gray-700 group-hover:text-yellow-600 transition-colors mb-4"
                    size={48}
                  />
                  <h4 className="text-xl font-bold text-gray-800 mb-2">
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
