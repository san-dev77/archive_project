import { useState, useEffect } from "react";
import axios from "axios";
import Side_bar from "../Components/Side_bar";
import TopBar from "../Components/Top_bar";
import {
  Plus,
  SquarePen,
  Trash2,
  Bookmark,
  Ungroup,
  LayoutList,
  Settings,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "daisyui/dist/full.css";
import { Tooltip } from "@mui/material";
import { showDeleteConfirmation } from "../utils/alerts"; // Importer la fonction

const toastOptions = {
  style: {
    backgroundColor: "#fff", // Fond sombre
    color: "#000", // Texte blanc
  },
  progressStyle: {
    background: "#4caf50", // Barre de progression verte
  },
};

export default function CreatePiece() {
  const [code_piece, setCode] = useState("");
  const [nom_piece, setName] = useState("");
  const [pieces, setPieces] = useState([]);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPiece, setCurrentPiece] = useState({
    id: "",
    code_piece: "",
    nom_piece: "",
  });

  useEffect(() => {
    fetchPieces();
  }, []);

  const fetchPieces = async () => {
    try {
      const response = await axios.get("http://localhost:3000/pieces");
      setPieces(response.data);
    } catch (error) {
      console.error("Error fetching pieces:", error);
      toast.error("Erreur lors de la récupération des pièces", toastOptions);
    }
  };

  const handleEdit = (piece) => {
    setCurrentPiece(piece);
    setEditMode(true);
    setOpenModal(true);
  };

  const handleDelete = async (pieceId) => {
    const confirmed = await showDeleteConfirmation(); // Afficher l'alerte de confirmation

    if (confirmed) {
      try {
        await axios.delete(`http://localhost:3000/pieces/${pieceId}`);
        fetchPieces(); // Rafraîchir la liste des pièces
        toast.success("Pièce supprimée avec succès !");
      } catch (error) {
        console.error("Erreur lors de la suppression de la pièce :", error);
        toast.error("Échec lors de la suppression de la pièce.");
      }
    } else {
      toast.info("Suppression annulée."); // Optionnel : informer que la suppression a été annulée
    }
  };

  const handlePieceCreated = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:3000/pieces", {
        code_piece,
        nom_piece,
      });
      setCode("");
      setName("");
      fetchPieces();
      toast.success("Pièce créée avec succès !", toastOptions);
      setOpenModal(false);
    } catch (error) {
      console.error("Error creating piece:", error);
      toast.error("Échec lors de la création de la pièce.", toastOptions);
    }
  };

  const handlePieceUpdated = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:3000/pieces/${currentPiece.id}`, {
        code_piece: currentPiece.code_piece,
        nom_piece: currentPiece.nom_piece,
      });
      fetchPieces();
      toast.success("Pièce mise à jour avec succès !", toastOptions);
      setOpenModal(false);
      setEditMode(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la pièce:", error);
      toast.error("Échec lors de la mise à jour de la pièce.", toastOptions);
    }
  };

  const filteredPieces = pieces.filter(
    (piece) =>
      piece.nom_piece.toLowerCase().includes(search.toLowerCase()) ||
      piece.code_piece.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-300">
      <Side_bar isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar position="fixed" title="Pièces" />
        <div className="container w-full mx-auto px-4 py-8 mt-20">
          <div className="bg-gray-800 w-full rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <LayoutList className="h-8 w-8 text-[#00B7FF] mr-2" />
                Liste des Pièces
              </h1>
              <div className="flex gap-3">
                <button
                  onClick={() => setOpenModal(true)}
                  className="bg-white hover:bg-gray-700 text-black hover:text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Nouvelle Pièce
                </button>
                <button
                  onClick={() => {
                    window.location.href = "/pieces";
                  }}
                  className="bg-white hover:bg-gray-700 text-black hover:text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
                >
                  <Settings className="h-5 w-5 mr-2" />
                  Configurer
                </button>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-white mb-1">
                    Rechercher une pièce
                  </label>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher par code ou nom..."
                    className="w-full px-4 py-2 bg-[#3a3a3a] text-white border border-[#4a4a4a] rounded-lg focus:ring-2 focus:ring-[#00B7FF] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#3a3a3a] rounded-lg p-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#2a2a2a] text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">Code de la pièce</th>
                      <th className="px-4 py-3 text-left">Nom de la pièce</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPieces.map((piece, index) => (
                      <tr
                        key={piece.id}
                        className={`border-b border-[#4a4a4a] hover:bg-[#2a2a2a] transition-colors duration-200`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <Ungroup className="h-5 w-5 text-[#00B7FF] mr-2" />
                            <span className="text-white">{piece.code_piece}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <Bookmark className="h-5 w-5 text-[#00B7FF] mr-2" />
                            <span className="text-white">{piece.nom_piece}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(piece)}
                              className="p-2 text-[#00B7FF] hover:bg-[#404040] rounded-lg transition-colors duration-200"
                            >
                              <SquarePen className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(piece.id)}
                              className="p-2 text-red-500 hover:bg-[#404040] rounded-lg transition-colors duration-200"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {openModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#2a2a2a] rounded-lg shadow-xl p-6 w-full max-w-lg mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">
                  {editMode ? "Modifier la pièce" : "Nouvelle pièce"}
                </h3>
                <button
                  onClick={() => setOpenModal(false)}
                  className="text-gray-400 hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={editMode ? handlePieceUpdated : handlePieceCreated}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-white mb-1">
                    Code de la pièce
                  </label>
                  <input
                    type="text"
                    value={editMode ? currentPiece.code_piece : code_piece}
                    onChange={(e) =>
                      editMode
                        ? setCurrentPiece({
                            ...currentPiece,
                            code_piece: e.target.value,
                          })
                        : setCode(e.target.value)
                    }
                    required
                    className="w-full px-3 py-2 bg-[#3a3a3a] text-white border border-[#4a4a4a] rounded-lg focus:ring-2 focus:ring-[#00B7FF] focus:border-transparent"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-white mb-1">
                    Nom de la pièce
                  </label>
                  <input
                    type="text"
                    value={editMode ? currentPiece.nom_piece : nom_piece}
                    onChange={(e) =>
                      editMode
                        ? setCurrentPiece({
                            ...currentPiece,
                            nom_piece: e.target.value,
                          })
                        : setName(e.target.value)
                    }
                    required
                    className="w-full px-3 py-2 bg-[#3a3a3a] text-white border border-[#4a4a4a] rounded-lg focus:ring-2 focus:ring-[#00B7FF] focus:border-transparent"
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
                    {editMode ? "Mettre à jour" : "Ajouter"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
}
