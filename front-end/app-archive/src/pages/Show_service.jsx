import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "daisyui/dist/full.css";
import Side_bar from "../Components/Side_bar";
import TopBar from "../Components/Top_bar";
import {
  LayoutList,
  MessageCircleCode,
  Plus,
  SquarePen,
  Trash2,
  ChevronUp,
  ChevronDown,
  Network,
  Download,
  ArrowUpToLine,
} from "lucide-react";
import { Tooltip } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Select from "react-select";

const fetchDirectories = async () => {
  const response = await axios.get("http://localhost:3000/services/directory");
  return response.data;
};

const deleteService = async (id) => {
  await axios.delete(`http://localhost:3000/services/${id}`);
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
  await axios.delete(`http://localhost:3000/services/directory/${id}`);
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
    onError: () => {
      toast.error("Échec lors de la suppression du service.");
    },
  });

  const updateMutation = useMutation(updateService, {
    onSuccess: () => {
      queryClient.invalidateQueries("directories");
      toast.success("Service mis à jour avec succès !");
      setEditModalOpen(false);
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
    onError: () => {
      toast.error("Échec lors de la suppression de la direction.");
    },
  });

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
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

  const handleDeleteDirectory = (directoryId) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cette direction ?")
    ) {
      deleteDirectoryMutation.mutate(directoryId, {
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
          <li key={directory.directory_id} className="w-full">
            <button
              className="btn relative btn-outline border-t-cyan-800 w-full text-left flex justify-between items-center"
              onClick={() => toggleDirectory(directory.directory_id)}
            >
              <div className="absolute -top-2 -left-2 bg-gray-900 rounded-full px-2 py-1">
                <p className="text-[10px] z-[5] text-white">{directory.code}</p>
              </div>
              <div className="flex items-center p-2 rounded-full bg-white">
                <Network className="mr-2 text-gray-800" />
                <span
                  className="text-sm text-gray-800 overflow-hidden whitespace-nowrap text-ellipsis"
                  style={{ maxWidth: "600px" }} // Adjust the maxWidth as needed
                >
                  {directory.nom_directory}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {expandedDirectory === directory.directory_id ? (
                  <>
                    <Tooltip title="Modifier la direction">
                      <button
                        className="btn btn-outline btn-primary btn-sm"
                        onClick={() => handleEditDirectory(directory)}
                      >
                        <SquarePen className="mr-1" />
                      </button>
                    </Tooltip>
                    <Tooltip title="Supprimer la direction">
                      <button
                        className="btn btn-outline btn-error btn-sm"
                        onClick={() =>
                          handleDeleteDirectory(directory.directory_id)
                        }
                      >
                        <Trash2 className="mr-1" />
                      </button>
                    </Tooltip>
                    <ChevronUp />
                  </>
                ) : (
                  <ChevronDown />
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
      <table className="table w-full mt-2">
        <thead className="sticky top-0 rounded-lg bg-gray-400 text-black">
          <tr>
            <th className="text-lg p-4">Code service</th>
            <th className="text-lg p-4">Nom service</th>
            <th className="text-lg p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {parsedServices.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center p-4 text-gray-500">
                Aucun service disponible pour ce répertoire.
              </td>
            </tr>
          ) : (
            parsedServices.map((service) => (
              <tr
                key={service.id}
                className="hover:bg-gray-200 rounded-lg bg-gray-100 transition duration-200"
              >
                <td className="flex items-center p-4 text-base text-gray-800">
                  <MessageCircleCode className="mr-2" />
                  {service.code}
                </td>
                <td className="p-4 text-base text-gray-800">
                  {service.nom_service}
                </td>
                <td className="text-right p-4 text-base text-gray-800">
                  <div className="flex flex-col sm:flex-row justify-end items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <Tooltip title="Modifier">
                      <button
                        className="btn btn-outline btn-primary btn-sm mr-2 hover:bg-indigo-100 transition duration-300 rounded-md"
                        onClick={() => handleEdit(service)}
                      >
                        <SquarePen className="mr-1" />
                      </button>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <button
                        className="btn btn-outline btn-error btn-sm hover:bg-red-100 transition duration-300 rounded-md"
                        onClick={() => handleDelete(service.id)}
                      >
                        <Trash2 className="mr-1" />
                      </button>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    );
  };

  const directoryOptions = directories.map((directory) => ({
    value: directory.directory_id,
    label: directory.nom_directory,
  }));

  return (
    <div className="flex min-h-screen mt-8 bg-gray-300 to-gray-900">
      <Side_bar isVisible={true} />
      <div className="flex-1 flex flex-col ">
        <TopBar position="fixed" title="Services" />

        <div className="container w-[90%] mx-auto mt-16 bg-white rounded-xl shadow-2xl flex flex-col h-auto">
          <div className="bg-white w-full rounded-lg shadow-md p-6 ">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-extrabold text-gray-800 flex justify-start w-full">
                <LayoutList size="28px" className="mr-3 ml-2 text-red-600" />
                Directions
              </h1>
            </div>

            <div className="flex flex-row-reverse w-full justify-between rounded-lg border-2 p-4 border-gray-300 space-x-2 mb-4">
              <button
                className="btn btn-primary bg-gray-400  text-black hover:bg-gray-500 transition duration-300 shadow-md"
                onClick={() => setOpenModal(true)}
              >
                <Plus size={20} className="mr-2" />
                Nouveau
              </button>
              <div className="flex items-center space-x-2">
                <button
                  className="btn btn-secondary bg-gray-600 text-white hover:bg-gray-400 transition duration-300 rounded-lg shadow-md"
                  onClick={() => {
                    /* Logic for import */
                  }}
                >
                  <Download size={20} className="mr-2" />
                  Importer
                </button>
                <button
                  className="btn btn-secondary bg-gray-500 text-gray-100 hover:bg-gray-400 transition duration-300 rounded-lg shadow-md"
                  onClick={() => {
                    /* Logic for export */
                  }}
                >
                  <ArrowUpToLine size={20} className="mr-2" />
                  Exporter
                </button>
              </div>
            </div>
            <div className="border-t border-gray-700 my-4"></div>

            <div className="flex justify-start mb-4">
              <div
                className="w-full flex flex-col justify-start items-start gap-2
              "
              >
                <h2 className="text-lg font-bold text-gray-800">Rechercher</h2>
                <input
                  type="text"
                  placeholder="Rechercher une direction ou un service..."
                  className="input input-bordered w-full max-w-lg bg-white text-black border-2 border-gray-300 rounded-lg shadow-md"
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-start items-center mb-4">
              <h2 className="text-lg font-bold flex text-gray-800">
                <LayoutList size="28px" className="mr-3 ml-2 text-red-600" />
                Liste des directions et services
              </h2>
            </div>

            <div className="overflow-x-auto">
              <div className="h-[600px] py-4 rounded-lg bg-gray-300 px-10 overflow-y-auto">
                {renderDirectoryList()}
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
          onClick={() => setOpenModal(false)}
        >
          <div
            className="modal-box bg-white text-black rounded-lg shadow-lg transform transition-all duration-300 max-w-lg w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => setOpenModal(false)}
            >
              ✕
            </button>
            <h3 className="font-bold text-lg">Créer un nouveau</h3>
            <div className="form-control">
              <label className="label">Que voulez-vous créer ?</label>
              <select
                value={creationType}
                onChange={(e) => handleCreationTypeChange(e.target.value)}
                className="input w-full input-bordered mb-2 border-2 border-gray-300 max-w-lg bg-white text-black"
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
                    <label className="label">Répertoires</label>
                    <Select
                      options={directoryOptions}
                      onChange={(selectedOption) =>
                        setCurrentService({
                          ...currentService,
                          directory_id: selectedOption.value,
                        })
                      }
                      className="mb-2"
                    />
                  </div>
                  <div className="form-control mt-4">
                    <label className="label">Code du service</label>
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
                    <label className="label">Nom du service</label>
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
                </>
              )}
              {creationType === "direction" && (
                <>
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
                </>
              )}
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
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          onClick={() => setEditModalOpen(false)}
        >
          <div
            className="modal-box bg-white text-black rounded-lg shadow-lg transform transition-all duration-300 max-w-lg w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => setEditModalOpen(false)}
            >
              ✕
            </button>
            <h3 className="font-bold text-lg">Modifier le service</h3>
            <form onSubmit={handleUpdate}>
              <div className="form-control">
                <label className="label">Répertoires</label>
                <select
                  value={currentService.directory_id}
                  onChange={(e) =>
                    setCurrentService({
                      ...currentService,
                      directory_id: e.target.value,
                    })
                  }
                  className="input w-full input-bordered mb-2 border-2 border-gray-300 max-w-lg bg-white text-black"
                >
                  <option value="" disabled>
                    Choisir un répertoire
                  </option>
                  {directories.map((directory) => (
                    <option
                      key={directory.directory_id}
                      value={directory.directory_id}
                    >
                      {directory.nom_directory}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-control mt-4">
                <label className="label">Code du service</label>
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
                <label className="label">Nom du service</label>
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
