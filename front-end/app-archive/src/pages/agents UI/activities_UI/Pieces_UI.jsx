import { useState, useEffect } from "react";
import axios from "axios";
import {
  FileBadge2,
  Plus,
  ServerOff,
  SquarePen,
  Trash2,
  Settings,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "daisyui/dist/full.css";
import SideBar_UI from "../components_UI/Sidebar_UI";
import TopBar_UI from "../components_UI/Top_bar_UI";

export default function Pieces_UI() {
  const [pieces, setPieces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newPiece, setNewPiece] = useState({ code_piece: "", nom_piece: "" });
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [permissionError, setPermissionError] = useState(false);

  useEffect(() => {
    fetchPieces();
  }, []);

  const fetchPieces = async () => {
    try {
      const response = await axios.get("http://localhost:3000/pieces");
      setPieces(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching pieces:", error);
      setError("Failed to fetch pieces");
      setLoading(false);
    }
  };

  const hasPermission = (action) => {
    const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
    return permissions.some((permission) => permission.action === action);
  };

  const handleEdit = (piece) => {
    if (hasPermission("edit")) {
      setSelectedPiece(piece);
      setEditModalOpen(true);
    } else {
      setPermissionError(true);
    }
  };

  const handleDelete = async (pieceId) => {
    if (hasPermission("delete")) {
      try {
        await axios.delete(`http://localhost:3000/pieces/${pieceId}`);
        setPieces(pieces.filter((piece) => piece.id !== pieceId));
        toast.success("Pièce supprimée avec succès");
      } catch (error) {
        console.error("Error deleting piece:", error);
        toast.error("Erreur lors de la suppression de la pièce");
      }
    } else {
      setPermissionError(true);
    }
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/pieces",
        newPiece
      );
      setPieces([...pieces, response.data]);
      toast.success("Pièce créée avec succès");
      setOpenModal(false);
      setNewPiece({ code_piece: "", nom_piece: "" });
    } catch (error) {
      console.error("Error creating piece:", error);
      toast.error("Erreur lors de la création de la pièce");
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      await axios.put(
        `http://localhost:3000/pieces/${selectedPiece.id}`,
        selectedPiece
      );
      fetchPieces();
      toast.success("Pièce mise à jour avec succès");
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating piece:", error);
      toast.error("Erreur lors de la mise à jour de la pièce");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <SideBar_UI isVisible={true} />
      <div className="flex-1 flex w-full flex-col">
        <TopBar_UI position="fixed" title="Pièces" />
        <div className="container w-full mx-auto px-6 py-8 mt-20">
          <div className="bg-white w-full rounded-xl shadow-xl p-8 border border-green-100">
            <div className="flex gap-5 justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-green-800 flex items-center">
                <FileBadge2 className="h-10 w-10 text-green-600 mr-3" />
                Gestion des Pièces
              </h1>
              <div className="flex gap-3">
                <button
                  onClick={() => (window.location.href = "/link_piece_UI")}
                  className="bg-green-100 text-green-600 px-6 py-3 rounded-lg flex items-center transition-all duration-300 hover:bg-green-200 border border-green-200"
                >
                  <Settings className="h-5 w-5 mr-2" />
                  Configurer
                </button>
                <button
                  onClick={() => setOpenModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Nouvelle Pièce
                </button>
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-6 shadow-inner border border-green-200">
              <div className="overflow-x-auto w-full">
                {pieces.length === 0 ? (
                  <div className="text-center py-12">
                    <ServerOff className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">
                      Aucune pièce disponible
                    </p>
                  </div>
                ) : (
                  <table className="w-full rounded-xl overflow-hidden">
                    <thead>
                      <tr className="bg-green-100 text-green-800">
                        <th className="p-4 text-left font-semibold">Code</th>
                        <th className="p-4 text-left font-semibold">Nom</th>
                        <th className="p-4 text-right font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pieces.map((piece) => (
                        <tr
                          key={piece.id}
                          className="border-b border-green-100 hover:bg-green-50 transition-colors duration-200"
                        >
                          <td className="flex items-center p-4 text-base text-gray-800">
                            <FileBadge2 className="mr-3 text-green-600" />
                            {piece.code_piece}
                          </td>
                          <td className="p-4 text-base text-gray-800">
                            {piece.nom_piece}
                          </td>
                          <td className="text-right p-4">
                            <div className="flex justify-end items-center space-x-3">
                              <button
                                className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-all duration-300"
                                onClick={() => handleEdit(piece)}
                              >
                                <SquarePen className="h-5 w-5" />
                              </button>
                              <button
                                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-300"
                                onClick={() => handleDelete(piece.id)}
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
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

        {/* Modal Create */}
        {openModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
            <div className="bg-white text-gray-800 rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-8 transform transition-all duration-300 border border-green-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-green-800">
                  Nouvelle pièce
                </h3>
                <button
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setOpenModal(false)}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Code de la pièce
                  </label>
                  <input
                    type="text"
                    value={newPiece.code_piece}
                    onChange={(e) =>
                      setNewPiece({ ...newPiece, code_piece: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-green-50 border border-green-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nom de la pièce
                  </label>
                  <input
                    type="text"
                    value={newPiece.nom_piece}
                    onChange={(e) =>
                      setNewPiece({ ...newPiece, nom_piece: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-green-50 border border-green-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                    onClick={() => setOpenModal(false)}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    Ajouter
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Edit */}
        {editModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
            <div className="bg-white text-gray-800 rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-8 border border-green-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-green-800">
                  Modifier la pièce
                </h3>
                <button
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setEditModalOpen(false)}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Code de la pièce
                  </label>
                  <input
                    type="text"
                    value={selectedPiece?.code_piece || ""}
                    onChange={(e) =>
                      setSelectedPiece({
                        ...selectedPiece,
                        code_piece: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-green-50 border border-green-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nom de la pièce
                  </label>
                  <input
                    type="text"
                    value={selectedPiece?.nom_piece || ""}
                    onChange={(e) =>
                      setSelectedPiece({
                        ...selectedPiece,
                        nom_piece: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-green-50 border border-green-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                    onClick={() => setEditModalOpen(false)}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    Mettre à jour
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Permission Error */}
        {permissionError && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
            <div className="bg-white text-gray-800 rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-8 border border-red-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-red-600">
                  Erreur de permission
                </h3>
                <button
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setPermissionError(false)}
                >
                  ✕
                </button>
              </div>
              <p className="text-center text-lg mb-8">
                Vous n&apos;avez pas la permission d&apos;effectuer cette
                action.
              </p>
              <div className="flex justify-center">
                <button
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  onClick={() => setPermissionError(false)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
