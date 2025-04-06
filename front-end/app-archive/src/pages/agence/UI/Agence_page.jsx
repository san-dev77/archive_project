import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "daisyui/dist/full.css";
import Sidebar_agence from "../../../Components/Sidebar_agence";
import TopBar from "../../../Components/Top_bar";
import {
  Plus,
  SquarePen,
  Trash2,
  Landmark,
  PackageCheck,
  FolderCog,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Swal from "sweetalert2";
import DocumentListModal from "../../../Components/DocTypeListAgence";

const fetchAgences = async () => {
  const response = await axios.get("http://localhost:3000/agences");
  return response.data;
};

const deleteAgence = async (id) => {
  const response = await axios.delete(`http://localhost:3000/agences/${id}`);
  if (response.status !== 204) {
    throw new Error("Failed to delete agence");
  }
};

const updateAgence = async (agence) => {
  await axios.put(`http://localhost:3000/agences/${agence.id}`, agence);
};

const createAgence = async (agence) => {
  return await axios.post("http://localhost:3000/agences", agence);
};

const fetchDocumentTypes = async () => {
  const response = await axios.get(
    `http://localhost:3000/agence/document-type/agence`
  );
  console.log(response);

  return response.data;
};

export default function ShowAgence() {
  const [searchText, setSearchText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [currentAgence, setCurrentAgence] = useState({
    id: "",
    nom_agence: "",
    code_agence: "",
  });
  const [documentTypes, setDocumentTypes] = useState([]);
  const [showDocumentModal, setShowDocumentModal] = useState(false);

  const queryClient = useQueryClient();
  const { data: agences = [] } = useQuery("agences", fetchAgences);

  const deleteMutation = useMutation(deleteAgence, {
    onError: (error) => {
      console.error("Erreur lors de la suppression de l'agence:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Échec lors de la suppression de l'agence.";

      // Structure for error message
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: errorMessage,
      });

      // Separate structure for logging the error
      toast.error("Erreur lors de la suppression de l'agence.");
    },
    onSuccess: () => {
      console.log("Suppression réussie");
      queryClient.invalidateQueries("agences");
      toast.success("Agence supprimée avec succès !");

      // Structure for success message
      Swal.fire({
        icon: "success",
        title: "Supprimée !",
        text: "L'agence a été supprimée avec succès.",
      });
    },
  });

  const updateMutation = useMutation(updateAgence, {
    onSuccess: () => {
      queryClient.invalidateQueries("agences");
      toast.success("Agence mise à jour avec succès !");
      setOpenModal(false); // Close modal after update
    },
    onError: () => {
      toast.error("Échec lors de la mise à jour de l'agence.");
    },
  });

  const createMutation = useMutation(createAgence, {
    onSuccess: (data) => {
      if (data.data && data.data.exists) {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Le code de l'agence existe déjà.",
        });
      } else {
        queryClient.invalidateQueries("agences");
        toast.success("Agence créée avec succès !");
        setOpenModal(false);
      }
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error || "Échec lors de la création de l'agence.";
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: errorMessage,
      });
    },
  });

  const handleEdit = (agence) => {
    setCurrentAgence(agence);
    setOpenModal(true); // Open modal for editing
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentAgence.id) {
      updateMutation.mutate(currentAgence);
    } else {
      createMutation.mutate(currentAgence);
    }
    setCurrentAgence({ id: "", nom_agence: "", code_agence: "" });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous ne pourrez pas revenir en arrière !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("ID de l'agence à supprimer:", id);
        deleteMutation.mutate(id);
      }
    });
  };

  const handleShowDocuments = async () => {
    const types = await fetchDocumentTypes();
    setDocumentTypes(types);
    setShowDocumentModal(true);
  };

  const filteredAgences = agences.filter((agence) =>
    agence.nom_agence.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-300">
      <Sidebar_agence isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar position="fixed" title="Agences" />
        <div className="container w-full mx-auto px-4 py-8 mt-20">
          <div className="bg-gray-800 w-full rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <PackageCheck className="h-8 w-8 text-[#00B7FF] mr-2" />
                Gestion des Agences
              </h1>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setCurrentAgence({
                      id: "",
                      nom_agence: "",
                      code_agence: "",
                    }); // Reset currentAgence for new agency
                    setOpenModal(true);
                  }}
                  className="bg-white hover:bg-gray-700 text-black hover:text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Nouvelle Agence
                </button>
                <button
                  onClick={handleShowDocuments}
                  className="bg-white  gap-2 hover:bg-gray-700 text-black hover:text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
                >
                  <FolderCog />
                  Dossiers
                </button>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-white mb-1">
                    Rechercher une agence
                  </label>
                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Rechercher par nom..."
                    className="w-full px-4 py-2 bg-[#3a3a3a] text-white border border-[#4a4a4a] rounded-lg focus:ring-2 focus:ring-[#00B7FF] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#3a3a3a] rounded-lg p-4">
              {filteredAgences.length === 0 ? (
                <div className="text-center py-8">
                  <Landmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300">Aucune agence disponible</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAgences.map((agence) => (
                    <div
                      key={agence.id}
                      className="bg-[#2a2a2a] border border-[#4a4a4a] rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Landmark className="h-5 w-5 text-[#00B7FF] mr-2" />
                          <span className="font-medium text-white">
                            {agence.code_agence}
                          </span>
                          <span className="text-gray-400 ml-2">
                            ({agence.nom_agence})
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(agence)}
                            className="p-2 text-[#00B7FF] hover:bg-[#404040] rounded-lg transition-colors duration-200"
                          >
                            <SquarePen className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(agence.id)}
                            className="p-2 text-red-500 hover:bg-[#404040] rounded-lg transition-colors duration-200"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {openModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setOpenModal(false)}
        >
          <div
            className="bg-[#2a2a2a] rounded-lg shadow-xl p-6 w-full max-w-lg mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">
                {currentAgence.id
                  ? "Modifier l'agence"
                  : "Ajouter une nouvelle agence"}
              </h3>
              <button
                onClick={() => setOpenModal(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-white mb-1">
                  Code de l&apos;agence
                </label>
                <input
                  type="text"
                  value={currentAgence.code_agence}
                  onChange={(e) =>
                    setCurrentAgence({
                      ...currentAgence,
                      code_agence: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-[#3a3a3a] text-white border border-[#4a4a4a] rounded-lg focus:ring-2 focus:ring-[#00B7FF] focus:border-transparent"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-1">
                  Nom de l&apos;agence
                </label>
                <input
                  type="text"
                  value={currentAgence.nom_agence}
                  onChange={(e) =>
                    setCurrentAgence({
                      ...currentAgence,
                      nom_agence: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-[#3a3a3a] text-white border border-[#4a4a4a] rounded-lg focus:ring-2 focus:ring-[#00B7FF] focus:border-transparent"
                  required
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#4a4a4a] rounded-lg hover:bg-[#5a5a5a] focus:outline-none focus:ring-2 focus:ring-[#6a6a6a]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#00B7FF] rounded-lg hover:bg-[#0096FF] focus:outline-none focus:ring-2 focus:ring-[#00B7FF]"
                >
                  {currentAgence.id ? "Mettre à jour" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDocumentModal && (
        <DocumentListModal
          documentTypes={documentTypes}
          onClose={() => setShowDocumentModal(false)}
        />
      )}

      <ToastContainer />
    </div>
  );
}
