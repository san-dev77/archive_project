import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "daisyui/dist/full.css";
import Side_bar from "../Components/Side_bar";
import TopBar from "../Components/Top_bar";
import {
  LayoutList,
  Plus,
  SquarePen,
  Trash2,
  ChevronUp,
  ChevronDown,
  Network,
  Cog,
} from "lucide-react";
import { Tooltip } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Select from "react-select";
import { showDeleteConfirmation } from "../utils/alerts";
import Swal from "sweetalert2";

const fetchDirectories = async () => {
  const response = await axios.get("http://localhost:3000/services/directory");
  return response.data;
};

const deleteService = async (id) => {
  const response = await axios.delete(`http://localhost:3000/services/${id}`);
  if (response.status === 200) {
    Swal.fire({
      title: "warning",
      text: JSON.stringify(response.data.message),
      icon: "warning",
      confirmButtonText: "OK",
    });
    throw new Error(response.data.reason);
  } else {
    Swal.fire({
      title: "Succès",
      text: "Service supprimé avec succès !",
      icon: "success",
      confirmButtonText: "OK",
    });
  }
};

const updateService = async (service) => {
  await axios.put(`http://localhost:3000/services/${service.id}`, service);
};

const createService = async (service) => {
  await axios.post("http://localhost:3000/services", service);
};

const updateDirection = async (direction) => {
  await axios.put(`http://localhost:3000/services/directory/${direction.id}`, {
    code: direction.code,
    nom_directory: direction.nom_service,
  });
};

const deleteDirectory = async (id) => {
  const response = await axios.delete(
    `http://localhost:3000/services/directory/${id}`
  );
  if (response.status === 400) {
    throw new Error(response.data.reason);
  }
};

export default function ShowDirection() {
  const [searchText, setSearchText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState({
    id: "",
    nom_service: "",
    code: "",
    directory_id: "",
  });
  const [expandedDirectory, setExpandedDirectory] = useState(null);
  const [creationType, setCreationType] = useState(""); // New state to track creation type
  const [editDirectionModalOpen, setEditDirectionModalOpen] = useState(false); // Nouvel état pour la modale d'édition des directions

  const queryClient = useQueryClient();

  const { data: directories = [] } = useQuery("directories", fetchDirectories);

  const deleteMutation = useMutation(deleteService, {
    onSuccess: () => {
      queryClient.invalidateQueries("directories");
      toast.success("Service supprimé avec succès !");
    },
  });

  const updateMutation = useMutation(updateService, {
    onSuccess: () => {
      queryClient.invalidateQueries("directories");
      toast.success("Service mis à jour avec succès !");
      setEditModalOpen(false);

      Swal.fire({
        title: "Mise à jour réussie",
        text: "La mise à jour prendra effet après la réactualisation de la page.",
        icon: "info",
        confirmButtonText: "OK",
      });
    },
    onError: () => {
      toast.error("Échec lors de la mise à jour du service.");
    },
  });

  const createMutation = useMutation(createService, {
    onSuccess: () => {
      queryClient.invalidateQueries("directories");
      toast.success("Service créé avec succès !");
      setOpenModal(false);
    },
    onError: () => {
      toast.error("Échec lors de la création du service.");
    },
  });

  const updateDirectionMutation = useMutation(updateDirection, {
    onSuccess: () => {
      queryClient.invalidateQueries("directories");
      toast.success("Direction mise à jour avec succès !");
      setEditDirectionModalOpen(false);
    },
    onError: () => {
      toast.error("Échec lors de la mise à jour de la direction.");
    },
  });

  const deleteDirectoryMutation = useMutation(deleteDirectory, {
    onSuccess: () => {
      queryClient.invalidateQueries("directories");
      toast.success("Direction supprimée avec succès !");
    },
  });

  const handleDelete = async (id) => {
    const confirmed = await showDeleteConfirmation();

    if (confirmed) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (service) => {
    setCurrentService(service);
    setEditModalOpen(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateMutation.mutate(currentService);
  };

  const handleCreationTypeChange = (type) => {
    setCreationType(type);
    setCurrentService({ id: "", nom_service: "", code: "", directory_id: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (creationType === "service") {
      createMutation.mutate(currentService);
    } else if (creationType === "direction") {
      // Call the API to create a direction
      axios
        .post("http://localhost:3000/services/directory", {
          code: currentService.code,
          nom_directory: currentService.nom_service,
        })
        .then(() => {
          queryClient.invalidateQueries("directories");
          toast.success("Direction créée avec succès !");
          setOpenModal(false);
        })
        .catch(() => {
          toast.error("Échec lors de la création de la direction.");
        });
    }
    setCurrentService({ id: "", nom_service: "", code: "", directory_id: "" });
  };

  const toggleDirectory = (directoryId) => {
    if (expandedDirectory === directoryId) {
      setExpandedDirectory(null);
    } else {
      setExpandedDirectory(directoryId);
    }
  };

  const filteredDirectories = directories.filter((directory) => {
    // Vérifiez si le nom de la direction correspond au texte de recherche
    const directoryMatches = directory.nom_directory
      .toLowerCase()
      .includes(searchText.toLowerCase());

    // Vérifiez si l'un des services dans la direction correspond au texte de recherche
    const services = directory.services
      .split("|")
      .map((service) => JSON.parse(service));
    const serviceMatches = services.some((service) =>
      service?.nom_service?.toLowerCase().includes(searchText.toLowerCase())
    );

    // Retournez true si soit la direction soit l'un des services correspond
    return directoryMatches || serviceMatches;
  });

  const handleDeleteDirectory = async (directory) => {
    const services = directory.services
      .split("|")
      .map((service) => JSON.parse(service));
    console.log(services);

    if (
      services.length > 1 ||
      (services.length === 1 && services[0].id !== null)
    ) {
      Swal.fire({
        title: "Erreur",
        text: "Impossible de supprimer la direction car elle contient des services.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const confirmed = await showDeleteConfirmation();

    if (confirmed) {
      deleteDirectoryMutation.mutate(directory.directory_id, {
        onSuccess: () => {
          queryClient.invalidateQueries("directories");
        },
      });
    }
  };

  const handleEditDirectory = (directory) => {
    // Logique pour mettre à jour une direction
    setCurrentService({
      id: directory.directory_id,
      nom_service: directory.nom_directory,
      code: directory.code,
      directory_id: directory.directory_id,
    });
    setEditDirectionModalOpen(true); // Ouvrir la modale d'édition des directions
  };

  const renderDirectoryList = () => {
    if (filteredDirectories.length === 0) {
      return (
        <div className="text-center text-gray-900 mt-4">
          Aucun répertoire disponible.
        </div>
      );
    }

    return (
      <ul className="list-none w-full">
        {filteredDirectories.map((directory) => (
          <li
            key={directory.directory_id}
            className="w-full overflow-visible bg-white"
          >
            <button
              className="btn relative w-full text-left flex justify-between items-center bg-black/30 hover:bg-black/40 text-white border-none rounded-lg p-3 transition-all duration-300 overflow-visible"
              onClick={() => toggleDirectory(directory.directory_id)}
            >
              <div className="absolute -top-2 -left-2 bg-orange-500 rounded-full px-2 py-0.5">
                <p className="text-xs font-bold">{directory.code}</p>
              </div>
              <div className="flex items-center pl-6">
                <Network className="mr-2 text-orange-300" size={20} />
                <span className="text-base font-semibold">
                  {directory.nom_directory}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                {expandedDirectory === directory.directory_id && (
                  <>
                    <Tooltip title="Modifier la direction">
                      <button
                        className="btn btn-sm btn-circle bg-blue-500 border-0 text-white hover:bg-blue-600"
                        onClick={() => handleEditDirectory(directory)}
                      >
                        <SquarePen size={16} />
                      </button>
                    </Tooltip>
                    <Tooltip title="Supprimer la direction">
                      <button
                        className="btn btn-sm btn-circle bg-red-500 border-0 text-white hover:bg-red-600"
                        onClick={() => handleDeleteDirectory(directory)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </Tooltip>
                  </>
                )}
                {expandedDirectory === directory.directory_id ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </div>
            </button>
            {expandedDirectory === directory.directory_id &&
              renderServiceTable(directory.services)}
          </li>
        ))}
      </ul>
    );
  };

  const renderServiceTable = (services) => {
    const parsedServices = services
      .split("|")
      .map((service) => JSON.parse(service));

    return (
      <div className="mt-2 bg-black/20 rounded-lg p-3">
        <table className="table w-full">
          <thead className="bg-black/30 text-white">
            <tr>
              <th className="text-base p-3">Code service</th>
              <th className="text-base p-3">Nom service</th>
              <th className="text-base p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {parsedServices.filter(
              (service) => service.code || service.nom_service
            ).length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center p-4 text-gray-500">
                  Aucun service disponible pour ce répertoire.
                </td>
              </tr>
            ) : (
              parsedServices.map(
                (service) =>
                  (service.code || service.nom_service) && (
                    <tr
                      key={service.id}
                      className="hover:bg-gray-200 rounded-lg bg-gray-100 transition duration-200"
                    >
                      <td className="flex items-center p-4 text-base text-gray-800">
                        <Cog className="mr-2" />
                        {service.code}
                      </td>
                      <td className="p-4 text-base text-gray-800">
                        {service.nom_service}
                      </td>
                      <td className="text-right p-4 text-base text-gray-800">
                        <div className="flex flex-col sm:flex-row justify-end items-center space-y-2 sm:space-y-0 sm:space-x-2">
                          <Tooltip title="Modifier">
                            <button
                              className="btn  btn-primary btn-circle bg-gray-600 text-white  hover:bg-indigo-400 transition duration-300 "
                              onClick={() => handleEdit(service)}
                            >
                              <SquarePen className="" />
                            </button>
                          </Tooltip>
                          <Tooltip title="Supprimer">
                            <button
                              className="btn btn-circle bg-gray-600 text-white hover:bg-red-500 transition duration-300 "
                              onClick={() => handleDelete(service.id)}
                            >
                              <Trash2 className="" />
                            </button>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  )
              )
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const directoryOptions = directories.map((directory) => ({
    value: directory.directory_id,
    label: directory.nom_directory,
  }));

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Side_bar isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar position="fixed" title="Services" />
        <div className="container w-full mx-auto px-4 py-8 mt-20">
          <div className="bg-white w-full rounded-xl shadow-xl p-6 border border-green-100">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-green-800 flex items-center">
                <LayoutList className="h-8 w-8 text-green-600 mr-2" />
                Liste des Directions
              </h1>
              <button
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-5 py-2.5 rounded-lg flex items-center transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                onClick={() => setOpenModal(true)}
              >
                <Plus className="h-5 w-5 mr-2" />
                Nouveau
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rechercher une direction ou un service
                  </label>
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white text-gray-800 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 shadow-inner">
              <div className="space-y-4">
                {filteredDirectories.map((directory) => (
                  <div
                    key={directory.directory_id}
                    className="border border-green-100 rounded-xl shadow-sm "
                  >
                    <button
                      className="btn relative w-full text-left flex justify-between items-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-none rounded-t-xl p-4 transition-all duration-300"
                      onClick={() => toggleDirectory(directory.directory_id)}
                    >
                      <div className="absolute -top-2 -left-2 bg-gradient-to-r from-green-400 to-teal-500 rounded-full px-3 py-1 shadow-md">
                        <p className="text-xs font-bold text-white">
                          {directory.code}
                        </p>
                      </div>
                      <div className="flex items-center pl-6">
                        <Network className="mr-3 text-green-300" size={22} />
                        <span className="text-base font-semibold">
                          {directory.nom_directory}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {expandedDirectory === directory.directory_id && (
                          <>
                            <button
                              className="p-2 bg-green-500/30 text-white hover:bg-green-500/50 rounded-lg transition-colors duration-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditDirectory(directory);
                              }}
                            >
                              <SquarePen size={18} />
                            </button>
                            <button
                              className="p-2 bg-red-500/30 text-white hover:bg-red-500/50 rounded-lg transition-colors duration-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteDirectory(directory);
                              }}
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                        {expandedDirectory === directory.directory_id ? (
                          <ChevronUp size={22} className="text-green-300" />
                        ) : (
                          <ChevronDown size={22} className="text-green-300" />
                        )}
                      </div>
                    </button>

                    {expandedDirectory === directory.directory_id && (
                      <div className="p-4 bg-white">
                        <table className="w-full border-collapse">
                          <thead className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800">
                            <tr>
                              <th className="text-left p-3 rounded-tl-lg font-semibold">
                                Code service
                              </th>
                              <th className="text-left p-3 font-semibold">
                                Nom service
                              </th>
                              <th className="text-right p-3 rounded-tr-lg font-semibold">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {directory.services
                              .split("|")
                              .map((service) => JSON.parse(service))
                              .filter(
                                (service) => service.code || service.nom_service
                              ).length === 0 ? (
                              <tr>
                                <td
                                  colSpan="3"
                                  className="text-center p-5 text-gray-500 italic"
                                >
                                  Aucun service disponible pour cette direction.
                                </td>
                              </tr>
                            ) : (
                              directory.services
                                .split("|")
                                .map((service) => JSON.parse(service))
                                .map(
                                  (service) =>
                                    (service.code || service.nom_service) && (
                                      <tr
                                        key={service.id}
                                        className="border-b border-green-50 hover:bg-green-50/50 transition-colors duration-200"
                                      >
                                        <td className="flex items-center p-4 text-base text-gray-800">
                                          <Cog className="mr-2 text-green-500" />
                                          <span className="font-medium">
                                            {service.code}
                                          </span>
                                        </td>
                                        <td className="p-4 text-base text-gray-800">
                                          {service.nom_service}
                                        </td>
                                        <td className="text-right p-4">
                                          <div className="flex justify-end space-x-2">
                                            <button
                                              className="p-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors duration-200"
                                              onClick={() =>
                                                handleEdit(service)
                                              }
                                            >
                                              <SquarePen size={18} />
                                            </button>
                                            <button
                                              className="p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors duration-200"
                                              onClick={() =>
                                                handleDelete(service.id)
                                              }
                                            >
                                              <Trash2 size={18} />
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    )
                                )
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
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
              Créer un nouveau
            </h3>
            <div className="form-control">
              <label className="label text-gray-700 font-medium">
                Que voulez-vous créer ?
              </label>
              <select
                value={creationType}
                onChange={(e) => handleCreationTypeChange(e.target.value)}
                className="select w-full border-2 border-green-200 rounded-lg py-2.5 px-4 mb-4 bg-white text-gray-800 focus:border-green-500 focus:ring focus:ring-green-200 transition-all duration-200"
              >
                <option value="" disabled>
                  Choisir une option
                </option>
                <option value="direction">Direction</option>
                <option value="service">Service</option>
              </select>
            </div>
            <form onSubmit={handleSubmit}>
              {creationType === "service" && (
                <>
                  <div className="form-control">
                    <label className="label text-gray-700 font-medium">
                      Directions
                    </label>
                    <Select
                      options={directoryOptions}
                      onChange={(selectedOption) =>
                        setCurrentService({
                          ...currentService,
                          directory_id: selectedOption.value,
                        })
                      }
                      className="mb-4 text-gray-800"
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
                  <div className="form-control mt-2">
                    <label className="label text-gray-700 font-medium">
                      Code du service
                    </label>
                    <input
                      type="text"
                      value={currentService.code}
                      onChange={(e) =>
                        setCurrentService({
                          ...currentService,
                          code: e.target.value,
                        })
                      }
                      className="input py-2.5 px-4 border-2 border-green-200 rounded-lg bg-white text-gray-800 focus:border-green-500 focus:ring focus:ring-green-200 transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="form-control mt-4">
                    <label className="label text-gray-700 font-medium">
                      Nom du service
                    </label>
                    <input
                      type="text"
                      value={currentService.nom_service}
                      onChange={(e) =>
                        setCurrentService({
                          ...currentService,
                          nom_service: e.target.value,
                        })
                      }
                      className="input py-2.5 px-4 border-2 border-green-200 rounded-lg bg-white text-gray-800 focus:border-green-500 focus:ring focus:ring-green-200 transition-all duration-200"
                      required
                    />
                  </div>
                </>
              )}
              {creationType === "direction" && (
                <>
                  <div className="form-control mt-2">
                    <label className="label text-gray-700 font-medium">
                      Code de la direction
                    </label>
                    <input
                      type="text"
                      value={currentService.code}
                      onChange={(e) =>
                        setCurrentService({
                          ...currentService,
                          code: e.target.value,
                        })
                      }
                      className="input py-2.5 px-4 border-2 border-green-200 rounded-lg bg-white text-gray-800 focus:border-green-500 focus:ring focus:ring-green-200 transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="form-control mt-4">
                    <label className="label text-gray-700 font-medium">
                      Nom de la direction
                    </label>
                    <input
                      type="text"
                      value={currentService.nom_service}
                      onChange={(e) =>
                        setCurrentService({
                          ...currentService,
                          nom_service: e.target.value,
                        })
                      }
                      className="input py-2.5 px-4 border-2 border-green-200 rounded-lg bg-white text-gray-800 focus:border-green-500 focus:ring focus:ring-green-200 transition-all duration-200"
                      required
                    />
                  </div>
                </>
              )}
              <div className="modal-action flex justify-center items-center mt-6 space-x-4">
                <button
                  type="submit"
                  className="btn px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  Ajouter
                </button>
                <button
                  type="button"
                  className="btn px-6 py-2.5 bg-white border border-red-500 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-300"
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
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setEditModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg mx-4 transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => setEditModalOpen(false)}
            >
              ✕
            </button>
            <h3 className="font-bold text-green-800 text-xl mb-4">
              Modifier le service
            </h3>
            <form onSubmit={handleUpdate}>
              <div className="form-control mt-2">
                <label className="label text-gray-700 font-medium">
                  Code du service
                </label>
                <input
                  type="text"
                  value={currentService.code}
                  onChange={(e) =>
                    setCurrentService({
                      ...currentService,
                      code: e.target.value,
                    })
                  }
                  className="input py-2.5 px-4 border-2 border-green-200 rounded-lg bg-white text-gray-800 focus:border-green-500 focus:ring focus:ring-green-200 transition-all duration-200"
                  required
                />
              </div>
              <div className="form-control mt-4">
                <label className="label text-gray-700 font-medium">
                  Nom du service
                </label>
                <input
                  type="text"
                  value={currentService.nom_service}
                  onChange={(e) =>
                    setCurrentService({
                      ...currentService,
                      nom_service: e.target.value,
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
                  Mettre à jour
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

      {editDirectionModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          onClick={() => setEditDirectionModalOpen(false)}
        >
          <div
            className="modal-box bg-white text-black rounded-lg shadow-lg transform transition-all duration-300 max-w-lg w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => setEditDirectionModalOpen(false)}
            >
              ✕
            </button>
            <h3 className="font-bold text-lg">Modifier la direction</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateDirectionMutation.mutate(currentService);
              }}
            >
              <div className="form-control mt-4">
                <label className="label">Code de la direction</label>
                <input
                  type="text"
                  value={currentService.code}
                  onChange={(e) =>
                    setCurrentService({
                      ...currentService,
                      code: e.target.value,
                    })
                  }
                  className="input input-bordered border-2 border-gray-300 bg-white text-black"
                  required
                />
              </div>
              <div className="form-control mt-4">
                <label className="label">Nom de la direction</label>
                <input
                  type="text"
                  value={currentService.nom_service}
                  onChange={(e) =>
                    setCurrentService({
                      ...currentService,
                      nom_service: e.target.value,
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
                  Mettre à jour
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-error w-[40%] mt-2"
                  onClick={() => setEditDirectionModalOpen(false)}
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
