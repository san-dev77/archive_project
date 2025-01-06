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
      fetchDirectories();
      toast.success("Nouveau type de document créé avec succès !");
      setOpenModal(false);
    } catch (error) {
      console.error("Error creating document type:", error);
      toast.error("Failed to create document type.");
    }
  };
  const handleCreateDocumentTypeDirections = async (event) => {
    const DocTypeDirectory = {
      name_docType_dir: DocTypeDir.name_docType_dir,
      directoryId: selectedDirectory,
    };
    console.log(DocTypeDirectory);

    event.preventDefault();
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
      toast.error("Failed to create document type.");
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
      setNewModal(true); // Open the new modal if the switch is checked
    } else {
      setOpenModal(true); // Open the regular modal otherwise
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
    options: directory.services.map((service) => ({
      value: service.id,
      label: service.nom_service,
    })),
  }));
  const directoryOptions = directories.map((directory) => ({
    value: directory.id,
    label: directory.name,
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
        <div className="container w-[90%] mx-auto mt-28 bg-white rounded-xl shadow-2xl flex flex-col min-h-screen">
          <div className="bg-white w-full rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-extrabold text-gray-800 flex justify-start w-full">
                <Layers3 size="28px" className="mr-3 ml-2 text-red-600" />
                Types de documents
              </h1>

              <div className="flex gap-3 items-end justify-end">
                <button
                  className="btn btn-primary bg-gray-500 text-white text-black hover:bg-gray-400 transition duration-300 rounded-lg shadow-md"
                  onClick={handleOpenModal}
                >
                  <Plus size={20} className="mr-2" />
                  Nouveau
                </button>
                <button
                  className="btn btn-outline flex gap-2 btn-default border-black text-black mt-10"
                  onClick={handleShowMetadataModal}
                >
                  <Settings />
                  Configuration
                </button>
              </div>
            </div>

            <div className="flex justify-start flex-col items-start mb-4 w-full">
              <h2 className="text-lg font-bold text-gray-800 mr-4">
                Rechercher :
              </h2>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Rechercher..."
                className="input w-[40%] input-bordered border-2 border-gray-300 bg-white text-black rounded-lg p-2"
              />
            </div>

            {/* Toggle Switch */}
            <div className="flex  rounded-lg p-4 border-2 border-gray-700 text-black  w-full justify-between items-end  mb-4">
              <label className="mr-2 font-bold flex items-center justify-center gap-2">
                <ArrowLeftRight className="mr-1" />
                Mode Direction
              </label>
              <input
                type="checkbox"
                checked={showAlternateContent}
                onChange={() => setShowAlternateContent(!showAlternateContent)}
                className="toggle toggle-info"
              />
            </div>

            <div className="overflow-x-auto">
              <div className="h-[600px] bg-gray-500 py-2 rounded-lg px-4 overflow-y-auto">
                {showAlternateContent ? (
                  <div className="overflow-x-auto">
                    <div className="h-[600px] bg-gray-500 py-2 rounded-lg px-4 overflow-y-auto">
                      <ul className={`list-none w-full grid grid-cols-2 gap-4`}>
                        {docTypeDirData.map((item) => (
                          <li
                            key={item.id}
                            className={`w-full border rounded-lg p-4`}
                          >
                            <button
                              className={`btn w-full bg-gray-500 hover:bg-gray-400 transition duration-300 rounded-lg shadow-md text-left flex justify-between items-center`}
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
                                          className="btn btn-outline btn-sm bg-gray-700 text-white mr-2 hover:bg-indigo-400 transition duration-300 rounded-md"
                                          onClick={() => handleEdit(docType)}
                                        >
                                          <SquarePen className="mr-1" />
                                        </button>
                                      </Tooltip>
                                      <Tooltip title="Supprimer">
                                        <button
                                          className="btn btn-outline bg-gray-700 text-white btn-sm hover:bg-red-500 transition duration-300 rounded-md"
                                          onClick={() =>
                                            handleDelete(docType.id)
                                          }
                                        >
                                          <Trash2 className="mr-1" />
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
                      viewMode === "grid" ? "grid grid-cols-2 gap-4" : ""
                    }`}
                  >
                    {filteredDirectories.map((directory) => (
                      <li
                        key={directory.id}
                        className={`w-full ${
                          viewMode === "grid" ? "border rounded-lg p-4" : ""
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
                                      {service.documentTypes.map((docType) => (
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
                                                className="btn btn-outline btn-md bg-gray-700 text-white  hover:bg-indigo-500 transition duration-300 rounded-md"
                                                onClick={() =>
                                                  handleEdit(docType)
                                                }
                                              >
                                                <SquarePen className="mr-1" />
                                              </button>
                                            </Tooltip>
                                            <Tooltip title="Supprimer">
                                              <button
                                                className="btn btn-outline bg-gray-700 text-white btn-md hover:bg-red-500 transition duration-300 rounded-md"
                                                onClick={() =>
                                                  handleDelete(docType.id)
                                                }
                                              >
                                                <Trash2 className="mr-1" />
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
                  <label className="label">Sélectionner un service</label>
                  <Select
                    value={serviceOptions
                      .flatMap((group) => group.options)
                      .find((option) => option.value === newDocType.serviceId)}
                    onChange={handleServiceChange}
                    options={serviceOptions}
                    className="mb-2"
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

      {newModal && ( // New modal for when the switch is checked
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
              Ajouter un nouveau type de document (Mode Alternatif)
            </h3>
            <form onSubmit={handleCreateDocumentTypeDirections}>
              <div className="form-control">
                <label className="label">Sélectionner une direction</label>
                <Select
                  value={directoryOptions.find(
                    (option) => option.value === selectedDirectory
                  )}
                  onChange={(option) => setSelectedDirectory(option.value)}
                  options={directoryOptions}
                  className="mb-2"
                  placeholder="Choisir une direction"
                  isClearable
                />
              </div>
              <div className="form-control mt-4">
                <label className="label">Nom du type de document</label>
                <input
                  type="text"
                  value={DocTypeDir.name_docType_dir}
                  onChange={(e) =>
                    setDocTypeDir({
                      ...DocTypeDir,
                      name_docType_dir: e.target.value.trim(),
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
                  Ajouter
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
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 100,
          }}
          onClick={handleCloseMetadataModal}
        >
          <div
            className="modal-box bg-white text-black rounded-lg shadow-lg transform transition-all duration-300 max-w-lg w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={handleCloseMetadataModal}
            >
              ✕
            </button>
            <h3 className="font-bold w-full text-2xl text-center">
              <Settings className="" size={40} />
              Choix de la configuration
            </h3>
            <div className="flex justify-around mt-4 gap-4 items-center">
              <div
                className="card  bg-gray-400 p-4  hover:bg-slate-700 transition-all hover:text-white rounded-lg shadow-md cursor-pointer"
                onClick={() => (window.location.href = "/pieces")}
              >
                <h4 className="font-bold flex w-full justify-center">
                  <Settings2Icon className="" size={40} />
                </h4>
                <p className="text-center font-bold">
                  Configuration des Pièces.
                </p>
              </div>
              <div
                className="card bg-gray-400 p-4 hover:bg-slate-700 transition-all hover:text-white  rounded-lg shadow-md cursor-pointer"
                onClick={() => (window.location.href = "/metadata")}
              >
                <h4 className="font-bold w-full flex items-center justify-center text-center">
                  <Database className="" size={40} />
                </h4>
                <p className="text-center font-bold">
                  Configurer les méta-données.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
