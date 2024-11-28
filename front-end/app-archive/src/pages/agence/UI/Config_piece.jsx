import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar_agence from "../../../Components/Sidebar_agence";
import TopBar from "../../../Components/Top_bar";
import { useQuery } from "react-query";
import { GitBranchPlus, Link, Link2Off, Ungroup } from "lucide-react";
import Select from "react-select";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPieces, setSelectedPieces] = useState([]);

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
        setIsModalOpen(false);
        setSelectedPieces([]);
      })
      .catch((error) => {
        toast.error("Erreur lors de l'ajout des relations.");
        console.error(error);
      });
  };

  const handleSearch = (value) => {
    console.log(value);
  };

  const handleDeletePiece = (pieceId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette pièce ?")) {
      axios
        .delete(`http://localhost:3000/agence/piece/${pieceId}`)
        .then(() => {
          toast.success("Pièce supprimée avec succès !");
        })
        .catch((error) => {
          toast.error("Erreur lors de la suppression de la pièce.");
          console.error(error);
        });
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
    <div className="flex min-h-screen mt-8 bg-gray-300 to-gray-900">
      <Sidebar_agence isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar position="fixed" title="Config Pièces" />

        <div className="container w-[90%] mx-auto mt-16 bg-white rounded-xl shadow-2xl flex flex-col h-auto">
          <div className="bg-white w-full rounded-lg shadow-md p-6">
            <div className="flex flex-col gap-4 justify-between items-center mb-4">
              <div className="flex gap-2 justify-between items-center w-full">
                <h1 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
                  <Link className="w-6 h-6" />
                  Config Pièces
                </h1>
              </div>

              <div className="flex justify-start gap-2 rounded-lg bg-gray-200 p-4 items-center w-full my-4">
                <label
                  htmlFor="documentType"
                  className="text-gray-800 font-bold"
                >
                  Sélectionner un type de document :
                </label>
                <Select
                  options={documentTypes.map((type) => ({
                    value: type.id,
                    label: type.nom_document_type,
                  }))}
                  value={selectedType}
                  onChange={handleTypeChange}
                  className="w-64 text-black"
                />
              </div>

              <div className="border-t border-gray-700 my-4"></div>

              <div className="flex space-x-4 justify-between items-center w-full">
                <div className="flex flex-col w-1/2 justify-start items-start gap-2">
                  {/* Rechercher */}
                  <label htmlFor="search" className="text-gray-800 font-bold">
                    Rechercher :
                  </label>
                  <input
                    type="text"
                    placeholder="Rechercher"
                    className="input input-bordered bg-gray-200 w-full max-w-xs"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>

                <button
                  className="btn btn-outline bg-gray-800 text-white hover:bg-gray-600"
                  onClick={() => setIsModalOpen(true)}
                >
                  <GitBranchPlus className="w-6 h-6" />
                  Ajouter Relation
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="h-[600px] py-4 rounded-lg bg-gray-300 px-10 overflow-y-auto">
                {renderPiecesList()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="modal-box bg-white text-black rounded-lg shadow-lg transform transition-all duration-300 max-w-lg w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <h3 className="font-bold text-lg">Ajouter une nouvelle relation</h3>
            <div className="mt-4">{renderAllPiecesList()}</div>
            <div className="flex justify-end mt-4">
              <button
                className="btn btn-outline bg-gray-800 text-white hover:bg-gray-600"
                onClick={handleAddRelations}
                disabled={selectedPieces.length === 0 || !selectedType.value}
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
