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
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
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
      toast.error("Erreur lors de la récupération des pièces");
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
      toast.success("Pièce créée avec succès !");
      setOpenModal(false);
    } catch (error) {
      console.error("Error creating piece:", error);
      toast.error("Échec lors de la création de la pièce.");
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
      toast.success("Pièce mise à jour avec succès !");
      setOpenModal(false);
      setEditMode(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la pièce:", error);
      toast.error("Échec lors de la mise à jour de la pièce.");
    }
  };

  const filteredPieces = pieces.filter(
    (piece) =>
      piece.nom_piece.toLowerCase().includes(search.toLowerCase()) ||
      piece.code_piece.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Side_bar isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar position="fixed" title="Pièces" />
        <div className="container w-full mx-auto px-4 py-8 mt-20">
          <div className="bg-white w-full rounded-xl shadow-xl p-6 border border-green-100">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-green-800 flex items-center">
                <LayoutList className="h-8 w-8 text-green-600 mr-2" />
                Liste des Pièces
              </h1>
              <div className="flex gap-3">
                <button
                  onClick={() => setOpenModal(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-5 py-2.5 rounded-lg flex items-center transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Nouvelle Pièce
                </button>
                <button
                  onClick={() => {
                    window.location.href = "/pieces";
                  }}
                  className="bg-white border border-green-500 text-green-600 hover:bg-green-50 px-5 py-2.5 rounded-lg flex items-center transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <Settings className="h-5 w-5 mr-2" />
                  Configurer
                </button>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rechercher une pièce
                  </label>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher par code ou nom..."
                    className="w-full px-4 py-2.5 bg-white text-gray-800 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 shadow-inner">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800">
                    <tr>
                      <th className="text-left p-3 rounded-tl-lg font-semibold">
                        Code de la pièce
                      </th>
                      <th className="text-left p-3 font-semibold">
                        Nom de la pièce
                      </th>
                      <th className="text-right p-3 rounded-tr-lg font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPieces.map((piece) => (
                      <tr
                        key={piece.id}
                        className="border-b border-green-100 hover:bg-white/50 transition-colors duration-200"
                      >
                        <td className="p-3">
                          <div className="flex items-center">
                            <Ungroup className="h-5 w-5 text-green-500 mr-2" />
                            <span className="text-gray-800">
                              {piece.code_piece}
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center">
                            <Bookmark className="h-5 w-5 text-green-500 mr-2" />
                            <span className="text-gray-800">
                              {piece.nom_piece}
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(piece)}
                              className="p-2 bg-green-500/20 text-green-600 hover:bg-green-500/30 rounded-lg transition-colors duration-200"
                            >
                              <SquarePen className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(piece.id)}
                              className="p-2 bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded-lg transition-colors duration-200"
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
                {editMode ? "Modifier la pièce" : "Nouvelle pièce"}
              </h3>

              <form
                onSubmit={editMode ? handlePieceUpdated : handlePieceCreated}
              >
                <div className="form-control mt-2">
                  <label className="label text-gray-700 font-medium">
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
                    className="input py-2.5 px-4 border-2 border-green-200 rounded-lg bg-white text-gray-800 focus:border-green-500 focus:ring focus:ring-green-200 transition-all duration-200"
                  />
                </div>

                <div className="form-control mt-4">
                  <label className="label text-gray-700 font-medium">
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
                    className="input py-2.5 px-4 border-2 border-green-200 rounded-lg bg-white text-gray-800 focus:border-green-500 focus:ring focus:ring-green-200 transition-all duration-200"
                  />
                </div>

                <div className="modal-action flex justify-center items-center mt-6 space-x-4">
                  <button
                    type="submit"
                    className="btn px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    {editMode ? "Mettre à jour" : "Ajouter"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenModal(false)}
                    className="btn px-6 py-2.5 bg-white border border-red-500 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-300"
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
    </div>
  );
}
