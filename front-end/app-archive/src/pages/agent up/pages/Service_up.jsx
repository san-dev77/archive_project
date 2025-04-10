import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "daisyui/dist/full.css";
import SideBar_up from "../components/Sidebar_up";
import { LayoutList, Plus, SquarePen, Trash2, Cog } from "lucide-react";
import { Tooltip } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { showDeleteConfirmation } from "../../../utils/alerts";
import Swal from "sweetalert2";
import TopBar_up from "../components/Topbar_up";

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
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <SideBar_up />
      <div className="flex-1 flex flex-col">
        <TopBar_up position="fixed" title="Services" />
        <div className="container w-full mx-auto px-4 py-8 mt-20">
          <div className="bg-white w-full rounded-xl shadow-xl p-6 border border-green-100">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-green-800 flex items-center">
                <LayoutList className="h-8 w-8 text-green-600 mr-2" />
                Liste des Services
              </h1>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
                onClick={() => setOpenModal(true)}
              >
                <Plus className="h-5 w-5 mr-2" />
                Nouveau Service
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rechercher un service
                  </label>
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              {isLoading ? (
                <div className="text-center text-green-800 p-4">
                  Chargement...
                </div>
              ) : error ? (
                <div className="text-center text-red-500 p-4">
                  Erreur lors du chargement des services: {error.message}
                </div>
              ) : filteredServices.length === 0 ? (
                <div className="text-center text-gray-600 p-4">
                  Aucun service trouvé.
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-green-100 text-green-800">
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
                        className="hover:bg-green-100/50 bg-white border-b border-green-100 transition duration-200"
                      >
                        <td className="flex items-center p-4 text-base text-gray-800">
                          <Cog className="mr-2 text-green-600" />
                          {service.code}
                        </td>
                        <td className="p-4 text-base text-gray-800">
                          {service.nom_service}
                        </td>
                        <td className="text-right p-4">
                          <div className="flex justify-end space-x-2">
                            <Tooltip title="Modifier">
                              <button
                                className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200"
                                onClick={() => handleEdit(service)}
                              >
                                <SquarePen size={16} />
                              </button>
                            </Tooltip>
                            <Tooltip title="Supprimer">
                              <button
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setOpenModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4 border border-green-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-4 top-4 p-2 hover:bg-green-100 rounded-full transition-colors"
              onClick={() => setOpenModal(false)}
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold text-green-800 mb-4">
              Créer un nouveau service
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-control mt-4">
                <label className="label font-medium text-gray-700">
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
                  className="input input-bordered w-full mb-4 bg-green-50 text-gray-800 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  required
                />
              </div>
              <div className="form-control mt-4">
                <label className="label font-medium text-gray-700">
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
                  className="input input-bordered w-full mb-4 bg-green-50 text-gray-800 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  required
                />
              </div>
              <div className="modal-action flex justify-center items-center mt-6 space-x-4">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Ajouter
                </button>
                <button
                  type="button"
                  className="px-6 py-2.5 bg-white border border-red-500 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-300"
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setEditModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4 border border-green-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-4 top-4 p-2 hover:bg-green-100 rounded-full transition-colors"
              onClick={() => setEditModalOpen(false)}
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold text-green-800 mb-4">
              Modifier le service
            </h3>
            <form onSubmit={handleUpdate}>
              <div className="form-control mt-4">
                <label className="label font-medium text-gray-700">
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
                  className="input input-bordered w-full mb-4 bg-green-50 text-gray-800 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  required
                />
              </div>
              <div className="form-control mt-4">
                <label className="label font-medium text-gray-700">
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
                  className="input input-bordered w-full mb-4 bg-green-50 text-gray-800 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  required
                />
              </div>
              <div className="modal-action flex justify-center items-center mt-6 space-x-4">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Mettre à jour
                </button>
                <button
                  type="button"
                  className="px-6 py-2.5 bg-white border border-red-500 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-300"
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
