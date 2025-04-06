import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "daisyui/dist/full.css";
import SideBar_up from "../components/Sidebar_up";
import TopBar from "../../../Components/Top_bar";
import { LayoutList, Plus, SquarePen, Trash2, Cog } from "lucide-react";
import { Tooltip } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { showDeleteConfirmation } from "../../../utils/alerts";
import Swal from "sweetalert2";

// Fonction pour récupérer les services d'une direction spécifique
const fetchServicesByDirectory = async () => {
  const directoryId = localStorage.getItem("directory_id");
  if (!directoryId) {
    throw new Error("ID de direction non trouvé");
  }
  const response = await axios.get(
    `http://localhost:3000/services/service_dir/${directoryId}`
  );
  return response.data;
};

// Fonction pour supprimer un service
const deleteService = async (id) => {
  const response = await axios.delete(`http://localhost:3000/services/${id}`);
  if (response.status === 200) {
    Swal.fire({
      title: "Avertissement",
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

// Fonction pour mettre à jour un service
const updateService = async (service) => {
  await axios.put(`http://localhost:3000/services/${service.id}`, service);
};

// Fonction pour créer un service
const createService = async (service) => {
  const directoryId = localStorage.getItem("directory_id");
  await axios.post("http://localhost:3000/services", {
    ...service,
    directory_id: directoryId,
  });
};

export default function Service_up() {
  const [searchText, setSearchText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState({
    id: "",
    nom_service: "",
    code: "",
  });

  const queryClient = useQueryClient();

  // Récupérer les services de la direction
  const {
    data: services = [],
    isLoading,
    error,
  } = useQuery("servicesByDirectory", fetchServicesByDirectory);

  // Mutation pour supprimer un service
  const deleteMutation = useMutation(deleteService, {
    onSuccess: () => {
      queryClient.invalidateQueries("servicesByDirectory");
      toast.success("Service supprimé avec succès !");
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Mutation pour mettre à jour un service
  const updateMutation = useMutation(updateService, {
    onSuccess: () => {
      queryClient.invalidateQueries("servicesByDirectory");
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

  // Mutation pour créer un service
  const createMutation = useMutation(createService, {
    onSuccess: () => {
      queryClient.invalidateQueries("servicesByDirectory");
      toast.success("Service créé avec succès !");
      setOpenModal(false);
    },
    onError: () => {
      toast.error("Échec lors de la création du service.");
    },
  });

  // Gérer la suppression d'un service
  const handleDelete = async (id) => {
    const confirmed = await showDeleteConfirmation();
    if (confirmed) {
      deleteMutation.mutate(id);
    }
  };

  // Gérer l'édition d'un service
  const handleEdit = (service) => {
    setCurrentService(service);
    setEditModalOpen(true);
  };

  // Gérer la mise à jour d'un service
  const handleUpdate = (e) => {
    e.preventDefault();
    updateMutation.mutate(currentService);
  };

  // Gérer la création d'un service
  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(currentService);
    setCurrentService({ id: "", nom_service: "", code: "" });
  };

  // Filtrer les services en fonction de la recherche
  const filteredServices = services.filter(
    (service) =>
      service.nom_service.toLowerCase().includes(searchText.toLowerCase()) ||
      service.code.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-300">
      <SideBar_up />
      <div className="flex-1 flex flex-col">
        <TopBar position="fixed" title="Services" />
        <div className="container w-full mx-auto px-4 py-8 mt-20">
          <div className="bg-gray-800 w-full rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <LayoutList className="h-8 w-8 text-[#00B7FF] mr-2" />
                Liste des Services
              </h1>
              <button
                className="bg-white hover:bg-gray-700 text-black hover:text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
                onClick={() => setOpenModal(true)}
              >
                <Plus className="h-5 w-5 mr-2" />
                Nouveau Service
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-white mb-1">
                    Rechercher un service
                  </label>
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full px-4 py-2 bg-[#3a3a3a] text-white border border-[#4a4a4a] rounded-lg focus:ring-2 focus:ring-[#00B7FF] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#3a3a3a] rounded-lg p-4">
              {isLoading ? (
                <div className="text-center text-white p-4">Chargement...</div>
              ) : error ? (
                <div className="text-center text-red-500 p-4">
                  Erreur lors du chargement des services: {error.message}
                </div>
              ) : filteredServices.length === 0 ? (
                <div className="text-center text-white p-4">
                  Aucun service trouvé.
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-[#2a2a2a] text-white">
                    <tr>
                      <th className="text-left p-3 rounded-l-lg">
                        Code service
                      </th>
                      <th className="text-left p-3">Nom service</th>
                      <th className="text-right p-3 rounded-r-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredServices.map((service) => (
                      <tr
                        key={service.id}
                        className="hover:bg-[#404040] bg-[#2a2a2a] transition duration-200"
                      >
                        <td className="flex items-center p-4 text-base text-white">
                          <Cog className="mr-2 text-[#00B7FF]" />
                          {service.code}
                        </td>
                        <td className="p-4 text-base text-white">
                          {service.nom_service}
                        </td>
                        <td className="text-right p-4">
                          <div className="flex justify-end space-x-2">
                            <Tooltip title="Modifier">
                              <button
                                className="p-2 text-[#00B7FF] hover:bg-[#505050] rounded-lg transition-colors duration-200"
                                onClick={() => handleEdit(service)}
                              >
                                <SquarePen size={16} />
                              </button>
                            </Tooltip>
                            <Tooltip title="Supprimer">
                              <button
                                className="p-2 text-red-500 hover:bg-[#505050] rounded-lg transition-colors duration-200"
                                onClick={() => handleDelete(service.id)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </Tooltip>
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

      {/* Modal pour créer un nouveau service */}
      {openModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setOpenModal(false)}
        >
          <div
            className="bg-[#2a2a2a] rounded-lg shadow-xl p-6 w-full max-w-lg mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => setOpenModal(false)}
            >
              ✕
            </button>
            <h3 className="font-bold text-lg text-white">
              Créer un nouveau service
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-control mt-4">
                <label className="label text-white">Code du service</label>
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
                <label className="label text-white">Nom du service</label>
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

      {/* Modal pour modifier un service */}
      {editModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setEditModalOpen(false)}
        >
          <div
            className="bg-[#2a2a2a] rounded-lg shadow-xl p-6 w-full max-w-lg mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => setEditModalOpen(false)}
            >
              ✕
            </button>
            <h3 className="font-bold text-lg text-white">
              Modifier le service
            </h3>
            <form onSubmit={handleUpdate}>
              <div className="form-control mt-4">
                <label className="label text-white">Code du service</label>
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
                <label className="label text-white">Nom du service</label>
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

      <ToastContainer />
    </div>
  );
}
