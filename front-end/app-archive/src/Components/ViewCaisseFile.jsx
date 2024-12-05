import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const ViewCaisseFile = ({ onClose }) => {
  const [pieces, setPieces] = useState([]); // État pour stocker les pièces
  const [expandedPiece, setExpandedPiece] = useState(null); // État pour gérer la pièce dont les fichiers sont affichés
  const [isFileModalOpen, setIsFileModalOpen] = useState(false); // État pour gérer l'ouverture de la modale des fichiers
  const [currentFiles, setCurrentFiles] = useState([]); // État pour stocker les fichiers à afficher dans la modale

  useEffect(() => {
    const fetchPieces = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/agence/piece/linked-caisse-piece`
        );

        console.log(response.data);

        setPieces(response.data); // Stocke les pièces récupérées
      } catch (error) {
        toast.error("Erreur lors de la récupération des pièces.");
      }
    };

    fetchPieces(); // Appelle la fonction si documentTypeId est défini
  }, []);

  // Regrouper les fichiers par piece_id
  const groupedPieces = pieces.reduce((acc, piece) => {
    const { piece_id, file_path, piece_name } = piece;
    if (!acc[piece_id]) {
      acc[piece_id] = { piece_name, file_paths: [] };
    }
    acc[piece_id].file_paths.push(file_path);
    return acc;
  }, {});

  // Fonction pour ouvrir la modale des fichiers
  const openFileModal = (file_paths) => {
    setCurrentFiles(file_paths);
    setIsFileModalOpen(true);
  };

  // Fonction pour fermer la modale des fichiers
  const closeFileModal = () => {
    setIsFileModalOpen(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
      onClick={onClose}
    >
      <div
        className="modal-box bg-white text-black rounded-lg shadow-lg transform transition-all duration-300 max-w-3xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        <button
          className="btn btn-sm btn-circle absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>
        <h3 className="font-bold text-lg">Détails des pièces</h3>
        <ul className=" pl-5 list-none">
          {Object.entries(groupedPieces).map(
            ([pieceId, { piece_name, file_paths }]) => (
              <li
                key={pieceId}
                className="mt-2 w-full p-3 rounded-lg transition-all bg-gray-500 text-white flex items-center justify-between cursor-pointer hover:bg-gray-700 shadow-lg shadow-slate-800"
              >
                <strong>{piece_name}</strong>
                <button
                  onClick={() => openFileModal(file_paths)}
                  className="ml-2 btn  btn-outline  text-white rounded-lg "
                >
                  Afficher les fichiers
                </button>
              </li>
            )
          )}
        </ul>
      </div>
      {isFileModalOpen && (
        <div
          className="fixed z-50 mt-14  inset-0 flex items-center justify-center bg-black bg-opacity-85"
          style={{ zIndex: 1000 }} // Ajout du z-index à la modale
        >
          <div
            className="modal-box bg-white w-full text-black rounded-lg shadow-lg p-4"
            style={{ width: "80%" }}
          >
            <h3 className="font-bold text-lg">
              Prévisualisation des fichiers de la pièce
            </h3>
            {currentFiles.map(
              (filePath, index) => (
                console.log(filePath),
                (
                  <div key={index} className="mt-2">
                    <h4>{filePath}</h4>
                    <object
                      data={`http://localhost:3000/agence_uploads/caisse/${filePath}`} // Utilisez l'URL du fichier sur le serveur
                      type="application/pdf"
                      width="500"
                      height="500"
                    >
                      <p>
                        Votre navigateur ne supporte pas les PDF. Téléchargez le
                        fichier{" "}
                        <a
                          href={`http://localhost:3000/agence_uploads/caisse/${filePath}`}
                        >
                          en cliquant ici.
                        </a>
                        .
                      </p>
                    </object>
                  </div>
                )
              )
            )}
            <button
              className="btn btn-outline btn-error mt-4"
              onClick={closeFileModal}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

ViewCaisseFile.propTypes = {
  onClose: PropTypes.func.isRequired,
  documentTypeId: PropTypes.string.isRequired,
};

export default ViewCaisseFile;
