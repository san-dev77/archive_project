// front-end/app-archive/src/components/PieceUploadModal.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { Eye } from "lucide-react";

const PieceUploadModal = ({ onClose, documentTypeId }) => {
  console.log("Composant PieceUploadModal rendu");

  const [files, setFiles] = useState([]); // État pour stocker les fichiers
  const [relatedPieces, setRelatedPieces] = useState([]); // État pour stocker les pièces liées
  const [selectedPieces, setSelectedPieces] = useState({}); // État pour suivre les pièces sélectionnées
  const [previewFiles, setPreviewFiles] = useState([]); // État pour stocker les fichiers à prévisualiser
  const [isPreviewOpen, setIsPreviewOpen] = useState(false); // État pour gérer l'ouverture de la modale de prévisualisation

  useEffect(() => {
    const fetchRelatedPieces = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/agence/piece/linked/${documentTypeId}`
        );
        setRelatedPieces(response.data); // Stocke les pièces liées
      } catch (error) {
        toast.error("Erreur lors de la récupération des pièces liées.");
      }
    };

    if (documentTypeId) {
      fetchRelatedPieces(); // Appelle la fonction si documentTypeId est défini
    }
  }, [documentTypeId]);

  const handleFileChange = (e, pieceId) => {
    console.log("Événement de changement de fichier déclenché."); // Log pour vérifier si la fonction est appelée
    const selectedFiles = Array.from(e.target.files); // Prend tous les fichiers sélectionnés
    console.log("Fichiers sélectionnés:", selectedFiles); // Log pour vérifier les fichiers sélectionnés

    if (selectedFiles.length > 0) {
      const newFiles = selectedFiles.map((file) => {
        console.log("Fichier ajouté:", file); // Log pour inspecter chaque fichier
        return { pieceId, file }; // Crée un tableau d'objets fichier
      });

      // Vérifiez que les fichiers sont bien ajoutés
      console.log("Nouveaux fichiers avant mise à jour:", newFiles);

      setFiles((prev) => [...prev, ...newFiles]); // Met à jour l'état avec les nouveaux fichiers
      console.log("Nouveaux fichiers ajoutés:", newFiles); // Log pour vérifier les nouveaux fichiers ajoutés
    } else {
      console.log("Aucun fichier sélectionné."); // Log si aucun fichier n'est sélectionné
    }
  };

  const handleCheckboxChange = (pieceId) => {
    setSelectedPieces((prev) => ({
      ...prev,
      [pieceId]: !prev[pieceId], // Inverse l'état de la case à cocher
    }));
  };

  const handleUploadForPiece = async (pieceId) => {
    const formData = new FormData();
    const pieceFiles = files.filter(({ pieceId: id }) => id === pieceId); // Filtrer les fichiers pour la pièce sélectionnée

    // Ajouter les fichiers au FormData
    pieceFiles.forEach(({ file }) => {
      formData.append("files", file); // Ajoute chaque fichier
    });

    // Créer un objet contenant les autres données
    const data = {
      piece_id: pieceId, // Ajoute pieceId
      type: "caisse",
      fileNames: pieceFiles.map(({ file }) => file.name), // Ajoute les noms des fichiers
    };

    // Ajouter les autres données au FormData
    formData.append("data", JSON.stringify(data)); // Ajoute l'objet data

    try {
      console.log(
        "Contenu de FormData avant l'envoi:",
        Array.from(formData.entries())
      );

      await axios.post(
        `http://localhost:3000/agence/piece/upload-pieces/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(
        `Les fichiers pour la pièce ${pieceId} ont été importés avec succès.`
      );
    } catch (error) {
      toast.error(
        `Erreur lors de l'importation des fichiers pour la pièce ${pieceId}.`
      );
    }
  };

  const handlePreviewFiles = (pieceId) => {
    const pieceFiles = files.filter(({ pieceId: id }) => id === pieceId); // Filtrer les fichiers pour la pièce sélectionnée
    setPreviewFiles(pieceFiles); // Met à jour l'état avec les fichiers à prévisualiser
    setIsPreviewOpen(true); // Ouvre la modale de prévisualisation
  };

  // Fonction pour fermer la modale de prévisualisation
  const closePreviewModal = () => {
    setIsPreviewOpen(false);
  };

  return (
    <>
      {/* Modale principale */}
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
          <h3 className="font-bold text-lg">Importer des fichiers</h3>
          {relatedPieces.map((piece) => (
            <div
              key={piece.id}
              className="flex items-center mt-2 mb-3 p-3 rounded-lg bg-gray-500 shadow-md shadow-gray-800"
            >
              <input
                type="checkbox"
                checked={selectedPieces[piece.id] || false}
                onChange={() => handleCheckboxChange(piece.id)}
                name="ckeckbox"
                className="mr-2 checkbox checkbox-info border-2 border-white"
              />
              <span className="flex-1 text-lg font-semibold text-white">
                {piece.nom_piece}
              </span>
              <input
                type="file"
                id={`file-upload-${piece.id}`}
                onChange={(e) => handleFileChange(e, piece.id)}
                className="hidden"
                accept="application/pdf" // Limiter aux fichiers PDF
                multiple
              />
              <label
                htmlFor={`file-upload-${piece.id}`}
                className={`btn border-t-neutral-700 bg-gray-300 text-black hover:bg-gray-400 transition duration-300 rounded-lg ml-2 cursor-pointer ${
                  !selectedPieces[piece.id]
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Choisir des fichiers
              </label>
              <button
                type="button"
                className="btn btn-primary ml-2"
                onClick={() => handleUploadForPiece(piece.id)}
                disabled={
                  !selectedPieces[piece.id] ||
                  !files.some(({ pieceId }) => pieceId === piece.id)
                }
              >
                Envoyer
              </button>
              <button
                type="button"
                className="ml-2"
                onClick={() => handlePreviewFiles(piece.id)}
              >
                <Eye className="fas fa-eye text-white" />
                {/* Icône pour prévisualiser */}
              </button>
            </div>
          ))}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              className="btn btn-outline btn-error w-full"
              onClick={onClose}
            >
              Annuler
            </button>
          </div>
        </div>
      </div>

      {/* Modale de prévisualisation */}
      {isPreviewOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal-box bg-white text-black rounded-lg shadow-lg p-4">
            <h3 className="font-bold text-lg">Fichiers uploadés</h3>
            {previewFiles.map(({ file }, index) => (
              <div key={index} className="mt-2">
                <h4>{file.name}</h4>
                <object
                  data={URL.createObjectURL(file)} // Crée une URL pour le fichier PDF
                  type="application/pdf"
                  width="500"
                  height="500"
                >
                  <p>
                    Votre navigateur ne supporte pas les PDF. Téléchargez le
                    fichier <a href={URL.createObjectURL(file)}>ici</a>.
                  </p>
                </object>
              </div>
            ))}
            <button
              className="btn btn-outline btn-error mt-4"
              onClick={closePreviewModal}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
};

PieceUploadModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  documentTypeId: PropTypes.string.isRequired,
  rowId: PropTypes.string.isRequired,
};

export default PieceUploadModal;
