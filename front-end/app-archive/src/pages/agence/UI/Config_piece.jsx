import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar_agence from "../../../Components/Sidebar_agence";
import TopBar from "../../../Components/Top_bar";
import { useQuery } from "react-query";
import {
  GitBranchPlus,
  Link,
  Link2Off,
  Ungroup,
  Plus,
  ServerOff,
  SquarePen,
} from "lucide-react";
import Select from "react-select";
import Swal from "sweetalert2";
import { showDeleteConfirmation } from "../../../utils/alerts";
import Loader_component from "../../../Components/Loader";

const fetchAllPieces = async () => {
  const response = await axios.get("http://localhost:3000/agence/piece");
  console.log(response.data);
  return response.data;
};

const fetchPieces = async (document_type_id) => {
  const response = await axios.get(
    `http://localhost:3000/agence/piece/linked/${document_type_id}`
  );
  console.log(response.data);
  return response.data;
};

const fetchDocumentTypes = async () => {
  const response = await axios.get(
    "http://localhost:3000/agence/document-type"
  );

  console.log(response.data);

  return response.data;
};

export default function ConfigPiece() {
  const [selectedType, setSelectedType] = useState({
    value: "",
    label: "Choisir un type de document",
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRelationModalOpen, setIsRelationModalOpen] = useState(false);
  const [selectedPieces, setSelectedPieces] = useState([]);
  const [code_piece, setCode] = useState("");
  const [nom_piece, setName] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [currentPiece, setCurrentPiece] = useState({
    id: "",
    code_piece: "",
    nom_piece: "",
  });

  const { data: allPieces = [] } = useQuery("allPieces", fetchAllPieces);
  const { data: documentTypes = [] } = useQuery(
    "documentTypes",
    fetchDocumentTypes
  );

  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (selectedType.value) {
      fetchPieces(selectedType.value).then(setPieces);
    }
  }, [selectedType]);

  const handleTypeChange = (selectedOption) => {
    setSelectedType(selectedOption);
  };

  const handlePieceSelection = (pieceId) => {
    setSelectedPieces((prevSelected) =>
      prevSelected.includes(pieceId)
        ? prevSelected.filter((id) => id !== pieceId)
        : [...prevSelected, pieceId]
    );
  };

  const handleAddRelations = () => {
    axios
      .post(`http://localhost:3000/agence/piece/link-piece`, {
        pieceIds: selectedPieces,
        documentTypeId: selectedType.value,
      })
      .then(() => {
        toast.success("Relations ajoutées avec succès !");
        setIsRelationModalOpen(false);
        setSelectedPieces([]);
        if (selectedType.value) {
          fetchPieces(selectedType.value).then(setPieces);
        }
      })
      .catch((error) => {
        toast.error("Erreur lors de l'ajout des relations.");
        console.error(error);
      });
  };

  const handleSearch = (value) => {
    console.log(value);
  };

  const handleDeletePiece = async (pieceId) => {
    const confirm = await showDeleteConfirmation();
    if (confirm) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/agence/piece/${pieceId}`
        );
        if (response.status === 200) {
          // Refresh des données
          if (selectedType.value) {
            await fetchPieces(selectedType.value).then(setPieces);
          }
          toast.success("Pièce supprimée avec succès !");
        } else {
          Swal.fire({
            icon: "error",
            title: "Erreur",
            text:
              response.data.message || "Échec de la suppression de la pièce.",
          });
        }
      } catch (error) {
        console.error("Error deleting piece:", error);
        const errorMessage =
          error.response?.data?.message ||
          "Une erreur est survenue lors de la suppression.";
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: errorMessage,
        });
      }
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
      // Refresh des données
      const updatedPieces = await fetchAllPieces();
      if (selectedType.value) {
        const updatedLinkedPieces = await fetchPieces(selectedType.value);
        setPieces(updatedLinkedPieces);
      }
      toast.success("Pièce créée avec succès !");
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating piece:", error);
      toast.error("Échec lors de la création de la pièce.");
    }
  };

  const renderPiecesList = () => {
    if (pieces.length === 0) {
      return (
        <tr>
          <td colSpan="3" className="text-center p-4 text-gray-500">
            Aucune pièce disponible.
          </td>
        </tr>
      );
    }

    return (
      <table className="table w-full border-collapse rounded-lg">
        <thead className="sticky top-0 rounded-lg bg-gray-400 text-black">
          <tr>
            <th className="text-lg p-4">
              <Ungroup className="w-6 h-6" />
            </th>
            <td className="">|</td>
            <th className="text-lg p-4">Nom de la pièce</th>
            <td className="">|</td>
            <th className="text-lg p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pieces.map((piece, index) => (
            <tr
              key={piece.id}
              className={`hover:bg-gray-100 transition duration-200 ${
                index % 2 === 0 ? "bg-gray-200" : "bg-white"
              }`}
            >
              <td className="py-2 px-4 bg-gray-400 ml-2 p-3 rounded-lg flex justify-center items-center">
                <Link className="w-6 h-6" color="white" />
              </td>
              <td className="">|</td>
              <td className="py-2 px-4 text-gray-800 font-bold text-lg">
                {piece.nom_piece}
              </td>
              <td className="">|</td>
              <td className="text-right p-4 flex gap-2">
                <button
                  className="btn btn-md  bg-gray-600 text-white hover:bg-red-500"
                  onClick={() => handleDeletePiece(piece.id)}
                >
                  <Link2Off className="w-6 h-6" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderAllPiecesList = () => {
    return (
      <ul className="list-none w-full">
        {allPieces.map((piece) => (
          <li key={piece.id} className="w-full">
            <div
              className="flex justify-start items-center p-2 bg-gray-200 hover:bg-gray-300 cursor-pointer rounded-lg shadow-md w-full"
              onClick={() => handlePieceSelection(piece.id)}
            >
              <input
                type="checkbox"
                className="checkbox checkbox-info"
                name="piece"
                id={piece.id}
                checked={selectedPieces.includes(piece.id)}
                onChange={() => handlePieceSelection(piece.id)}
              />
              <label
                htmlFor={piece.id}
                className="text-gray-800 ml-2 cursor-pointer"
              >
                {piece.nom_piece}
              </label>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-300">
      <Sidebar_agence isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar position="fixed" title="Config Pièces" />
        <div className="container w-full mx-auto px-4 py-8 mt-20">
          <div className="bg-gray-800 w-full rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <Link className="h-8 w-8 text-[#00B7FF] mr-2" />
                Configuration des Pièces
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-white hover:bg-gray-700 text-black hover:text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Nouvelle Pièce
                </button>
                <button
                  onClick={() => setIsRelationModalOpen(true)}
                  className="bg-white hover:bg-gray-700 text-black hover:text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
                  disabled={!selectedType.value}
                >
                  <GitBranchPlus className="h-5 w-5 mr-2" />
                  Ajouter Relation
                </button>
              </div>
            </div>

            <div className="bg-[#3a3a3a] rounded-lg p-6 space-y-6">
              <div className="flex items-center space-x-4 bg-[#2a2a2a] p-4 rounded-lg">
                <label className="text-white font-medium whitespace-nowrap">
                  Type de document :
                </label>
                <Select
                  options={documentTypes.map((type) => ({
                    value: type.id,
                    label: type.nom_document_type,
                  }))}
                  value={selectedType}
                  onChange={handleTypeChange}
                  className="flex-1"
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: "#3a3a3a",
                      borderColor: "#4a4a4a",
                      color: "white",
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: "#3a3a3a",
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? "#4a4a4a" : "#3a3a3a",
                      color: "white",
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: "white",
                    }),
                  }}
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Rechercher une pièce..."
                    className="w-full px-4 py-2 bg-[#2a2a2a] text-white border border-[#4a4a4a] rounded-lg focus:ring-2 focus:ring-[#00B7FF] focus:border-transparent"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-[#2a2a2a] rounded-lg overflow-hidden">
                {pieces.length === 0 ? (
                  <div className="text-center py-8">
                    <ServerOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-300">
                      Aucune pièce disponible pour ce type de document
                    </p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-[#4a4a4a] text-white">
                      <tr>
                        <th className="p-4 text-left">
                          <Ungroup className="w-6 h-6 text-[#00B7FF]" />
                        </th>
                        <th className="p-4 text-left">Nom de la pièce</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pieces.map((piece, index) => (
                        <tr
                          key={piece.id}
                          className={`border-t border-[#4a4a4a] hover:bg-[#3a3a3a] transition-colors duration-200`}
                        >
                          <td className="p-4">
                            <Link className="w-6 h-6 text-[#00B7FF]" />
                          </td>
                          <td className="p-4 text-white">{piece.nom_piece}</td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeletePiece(piece.id)}
                              className="p-2 text-red-500 hover:bg-[#4a4a4a] rounded-lg transition-colors duration-200"
                            >
                              <Link2Off className="w-5 h-5" />
                            </button>
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
      </div>

      {/* Modal Création */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#2a2a2a] rounded-lg shadow-xl p-6 w-full max-w-lg mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">
                Créer une nouvelle pièce
              </h3>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setCode("");
                  setName("");
                }}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePieceCreated}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-white mb-1">
                  Code de la pièce
                </label>
                <input
                  type="text"
                  value={code_piece}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2 bg-[#3a3a3a] text-white border border-[#4a4a4a] rounded-lg focus:ring-2 focus:ring-[#00B7FF] focus:border-transparent"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-1">
                  Nom de la pièce
                </label>
                <input
                  type="text"
                  value={nom_piece}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#3a3a3a] text-white border border-[#4a4a4a] rounded-lg focus:ring-2 focus:ring-[#00B7FF] focus:border-transparent"
                  required
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#4a4a4a] rounded-lg hover:bg-[#5a5a5a] focus:outline-none focus:ring-2 focus:ring-[#6a6a6a]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#00B7FF] rounded-lg hover:bg-[#0096FF] focus:outline-none focus:ring-2 focus:ring-[#00B7FF]"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Relations */}
      {isRelationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#2a2a2a] rounded-lg shadow-xl p-6 w-full max-w-lg mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">
                Ajouter une nouvelle relation
              </h3>
              <button
                onClick={() => {
                  setIsRelationModalOpen(false);
                  setSelectedPieces([]);
                }}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-2 max-h-[60vh] overflow-y-auto pr-2">
              {allPieces.map((piece) => (
                <div
                  key={piece.id}
                  className="flex items-center p-3 bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded-lg cursor-pointer"
                  onClick={() => handlePieceSelection(piece.id)}
                >
                  <input
                    type="checkbox"
                    className="checkbox checkbox-info"
                    checked={selectedPieces.includes(piece.id)}
                    onChange={() => handlePieceSelection(piece.id)}
                  />
                  <span className="text-white ml-3">{piece.nom_piece}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 bg-[#00B7FF] text-white rounded-lg hover:bg-[#0096FF] disabled:opacity-50"
                onClick={handleAddRelations}
                disabled={selectedPieces.length === 0}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
