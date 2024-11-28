import { useState, useEffect } from "react";
import axios from "axios";
import Side_bar from "../../../Components/Sidebar_agence";
import TopBar from "../../../Components/Top_bar";
import {
  Plus,
  SquarePen,
  Trash2,
  Bookmark,
  Ungroup,
  LayoutList,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "daisyui/dist/full.css";
import { Tooltip } from "@mui/material";

const toastOptions = {
  style: {
    backgroundColor: "#fff", // Fond sombre
    color: "#000", // Texte blanc
  },
  progressStyle: {
    background: "#4caf50", // Barre de progression verte
  },
};

export default function Agence_createPiece() {
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
      const response = await axios.get("http://localhost:3000/agence/piece");
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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/agence/piece/${id}`);
      fetchPieces();
      toast.success("La pièce est supprimée avec succès!", toastOptions);
    } catch (error) {
      console.error("Error deleting document type:", error);
      toast.error("Echec lors de la suppréssion de la pièce", toastOptions);
    }
  };

  const handlePieceCreated = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:3000/agence/piece", {
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
      console.log(currentPiece);

      await axios.put(`http://localhost:3000/agence/piece/${currentPiece.id}`, {
        id: currentPiece.id,
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
    <div className="flex min-h-screen bg-gray-100">
      <Side_bar isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar position="fixed" title="Pièces" />
        <div className="container w-[90%] mx-auto mt-24 bg-white rounded-xl shadow-2xl flex flex-col h-screen">
          <h1 className="text-2xl mt-4 font-extrabold text-gray-800 flex justify-start w-full">
            <LayoutList size="28px" className="mr-3 ml-3 text-orange-600" />
            Liste des Pièces
          </h1>
          <div className="border-b-2 border-gray-300 mb-4 w-full"></div>
          <div className=" h-full bg-gray-200 w-full rounded-lg shadow-md p-6 mb-6">
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                placeholder="Rechercher une pièce"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input input-bordered w-full max-w-xs bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
              />
              <button
                className="btn btn-primary ml-auto bg-gray-300 text-black hover:bg-gray-400 transition duration-300 rounded-lg shadow-md"
                onClick={() => setOpenModal(true)}
              >
                <Plus size={20} className="mr-2" />
                Nouvelle
              </button>
            </div>

            <div className="overflow-x-auto ">
              <div className=" overflow-y-auto">
                <table className="table w-full border-collapse">
                  <thead className="sticky top-0 rounded-lg bg-gray-400 text-black">
                    <tr>
                      <th className="text-lg p-4">Code de la pièce</th>
                      <td className="">|</td>
                      <th className="text-lg p-4">Nom de la pièce</th>
                      <td className="">|</td>
                      <th className="text-lg p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPieces.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center p-4 text-gray-500"
                        >
                          Aucune pièce trouvée
                        </td>
                      </tr>
                    ) : (
                      filteredPieces.map((piece, index) => (
                        <tr
                          key={piece.id}
                          className={`hover:bg-gray-100 transition duration-200 ${
                            index % 2 === 0 ? "bg-gray-200" : "bg-white"
                          }`}
                        >
                          <td className="flex items-center btn btn-outline bg-gray-300 border-t-neutral-700 rounded-lg mt-2 justify-center p-2 text-base text-gray-800">
                            <Ungroup className="mr-2 text-gray-800" />
                            {piece.code_piece}
                          </td>
                          <td className="">|</td>
                          <td className="flex items-center p-4 text-base text-gray-800">
                            <Bookmark
                              size={20}
                              className="text-gray-800 mr-2"
                            />
                            {piece.nom_piece}
                          </td>
                          <td className="">|</td>
                          <td className="text-right p-4 text-base text-gray-800">
                            <div className="flex flex-col sm:flex-row justify-end items-center space-y-2 sm:space-y-0 sm:space-x-2">
                              <Tooltip title="Modifier">
                                <button
                                  className="btn btn-outline bg-gray-600 btn-md text-white w-full sm:w-auto hover:bg-blue-500 transition duration-300 rounded-md"
                                  onClick={() => handleEdit(piece)}
                                >
                                  <SquarePen className="mr-1" />
                                </button>
                              </Tooltip>
                              <Tooltip title="Supprimer">
                                <button
                                  className="btn btn-outline bg-gray-600 btn-md text-white btn-sm w-full sm:w-auto hover:bg-red-500 transition duration-300 rounded-md"
                                  onClick={() => handleDelete(piece.id)}
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {openModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setOpenModal(false)}
        >
          <div
            className="modal-box bg-white text-black rounded-lg shadow-lg transform transition-all duration-300 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => setOpenModal(false)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">
              {editMode ? "Modifier la pièce" : "Créer une nouvelle pièce"}
            </h2>
            <form onSubmit={editMode ? handlePieceUpdated : handlePieceCreated}>
              <div className="form-control">
                <label className="label">Code de la pièce</label>
                <input
                  type="text"
                  placeholder="Code de la pièce"
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
                  className="input input-bordered w-full mb-4 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                />
              </div>
              <div className="form-control">
                <label className="label">Nom de la pièce</label>
                <input
                  type="text"
                  placeholder="Nom de la pièce"
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
                  className="input input-bordered w-full mb-4 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                />
              </div>
              <div className="modal-action flex justify-center items-center">
                <button
                  type="submit"
                  className="btn flex justify-center items-center btn-primary w-[50%] bg-gray-300 text-black hover:bg-gray-400 transition duration-300 rounded-lg"
                >
                  <Plus className="mr-2" />
                  {editMode ? "Mettre à jour" : "Créer"}
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

      <ToastContainer />
    </div>
  );
}
