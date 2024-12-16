import { useState, useEffect } from "react";
import axios from "axios";
import Side_bar from "../Components/Side_bar";
import TopBar from "../Components/Top_bar";
import {
  Plus,
  SquarePen,
  Trash2,
  ChevronDown,
  ChevronUp,
  Settings,
  Layers3,
  ServerOff,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "daisyui/dist/full.css";
import { Tooltip } from "@mui/material";
import Select from "react-select";
import Loader_component from "../Components/Loader";
import { showDeleteConfirmation } from "../utils/alerts";
import Swal from "sweetalert2";

export default function ShowDocType() {
  const [directories, setDirectories] = useState([]);
  const [servicesData, setServicesData] = useState([]);
  const [expandedDirectory, setExpandedDirectory] = useState(null);
  const [expandedService, setExpandedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDocType, setNewDocType] = useState({ name: "", serviceId: "" });
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDirectories();
    fetchServicesAndDirectories();
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
        await axios.delete(`http://localhost:3000/document-types/${docTypeId}`);
        fetchDirectories();
        toast.success("Type de document supprimé avec succès !");
      } catch (error) {
        console.error("Error deleting document type:", error);
        toast.error("Failed to delete document type.");
      }
    } else {
      toast.info("Suppression annulée.");
    }
  };

  const handleEdit = (docType) => {
    // Open modal with pre-filled data for editing
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
      console.log(newDocType);
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
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error updating document type:", error);
      toast.error("Failed to update document type.");
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

  const serviceOptions = servicesData.map((directory) => ({
    label: directory.nom_directory,
    options: directory.services.map((service) => ({
      value: service.id,
      label: service.nom_service,
    })),
  }));

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredDirectories = directories.filter((directory) =>
    directory.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

              <button
                className="btn btn-primary ml-auto mb-4 bg-gray-300 text-black hover:bg-gray-400 transition duration-300 rounded-lg shadow-md"
                onClick={handleOpenModal}
              >
                <Plus size={20} className="mr-2" />
                Nouveau
              </button>
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
            <div className="overflow-x-auto">
              <div className="h-[600px] bg-gray-300 py-2 rounded-lg px-4 overflow-y-auto">
                {filteredDirectories.length === 0 ? (
                  <div className="text-center text-gray-900 mt-4">
                    <ServerOff className="text-red-500 mr-2" size={30} />
                    Aucun répertoire disponible.
                  </div>
                ) : (
                  <ul className="list-none w-full">
                    {filteredDirectories.map((directory) => (
                      <li key={directory.id} className="w-full">
                        <button
                          className="btn bg-gray-300 text-black hover:bg-gray-400 transition duration-300 rounded-lg shadow-md w-full text-left flex justify-between items-center"
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
                            {directory.services.map((service) => (
                              <li key={service.id} className="w-full">
                                <button
                                  className="btn btn-outline border-t-cyan-800 w-full text-left flex justify-between items-center"
                                  onClick={() => toggleService(service.id)}
                                >
                                  <div className="flex items-center p-2 rounded-full bg-gray-200">
                                    <Settings className="mr-2" />
                                    {service.name}
                                  </div>
                                  {expandedService === service.id ? (
                                    <ChevronUp />
                                  ) : (
                                    <ChevronDown />
                                  )}
                                </button>
                                {expandedService === service.id && (
                                  <table className="table w-full mt-2">
                                    <thead className="sticky top-0 rounded-lg bg-gray-400 text-black">
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
                                          <td className="text-right p-4 text-base text-gray-800">
                                            <Tooltip title="Modifier">
                                              <button
                                                className="btn btn-outline btn-primary btn-sm mr-2 hover:bg-indigo-100 transition duration-300 rounded-md"
                                                onClick={() =>
                                                  handleEdit(docType)
                                                }
                                              >
                                                <SquarePen className="mr-1" />
                                              </button>
                                            </Tooltip>
                                            <Tooltip title="Supprimer">
                                              <button
                                                className="btn btn-outline btn-error btn-sm hover:bg-red-100 transition duration-300 rounded-md"
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

      <ToastContainer />
    </div>
  );
}
