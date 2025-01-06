import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Upload,
  TriangleAlert,
  UngroupIcon,
  Grid2x2Check,
  SquareCheckBig,
  Settings,
  Eye,
} from "lucide-react";
import { pdfjs } from "react-pdf"; // Importez les composants nécessaires
import { Link } from "react-router-dom";
import Swal from "sweetalert2"; // Importer SweetAlert

// Configurez le worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.min.mjs`; // Mettez à jour l'URL

const PieceSelectionDialog = ({
  open,
  onClose,
  documentTypeId,
  documentId,
  onLoadAll,
}) => {
  const [pieces, setPieces] = useState([]);
  const [selectedPieces, setSelectedPieces] = useState([]);
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [previewFile, setPreviewFile] = useState(null);
  const [documentIdState, setDocumentIdState] = useState(documentId); // Ajout de l'état pour documentId
  const [selectionMode, setSelectionMode] = useState("pieces"); // Ajout de l'état pour le mode de sélection
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false); // État pour contrôler l'ouverture de la modale
  const [currentFiles, setCurrentFiles] = useState([]); // État pour stocker les fichiers à afficher

  useEffect(() => {
    const fetchPieces = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/pieces/relations/${documentTypeId}`
        );
        setPieces(response.data);
      } catch (error) {
        setErrorMessage("Failed to fetch pieces");
      } finally {
        setLoading(false);
      }
    };

    if (documentId) {
      fetchPieces();
    }
  }, [documentId]);

  const handlePieceChange = (event) => {
    const { value, checked } = event.target;
    setSelectedPieces((prev) => {
      if (checked) {
        return [...prev, value];
      } else {
        return prev.filter((item) => item !== value);
      }
    });
  };

  const handleFileChange = (event, pieceId) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prev) => ({
      ...prev,
      [pieceId]: prev[pieceId]
        ? [...prev[pieceId], ...selectedFiles]
        : selectedFiles,
    }));
    setPreviewFile(URL.createObjectURL(selectedFiles[0]));
  };

  const handleUploadAll = async () => {
    const formData = new FormData();

    selectedPieces.forEach((pieceId) => {
      const file = files[pieceId];
      if (file) {
        formData.append("files", file);
      }
    });

    formData.append("document_id", documentId);
    formData.append(
      "pieces",
      JSON.stringify(
        selectedPieces.map((pieceId) => ({
          piece_id: pieceId,
          filePath: files[pieceId].name,
        }))
      )
    );

    try {
      console.log("FormData entries:", ...formData.entries());
      // const response = await axios.post(
      //   `http://localhost:3000/documents/${documentId}/pieces`,
      //   formData,
      //   {
      //     headers: { "Content-Type": "multipart/form-data" },
      //   }
      // );
      // console.log("Response:", response);
      // if (response.data.message === "Document pieces added successfully") {
      //   setSuccessMessage("Fichiers chargés avec succès");
      //   onLoadAll();
      // } else {
      //   setErrorMessage(
      //     "Échec du chargement des fichiers, essayez de nouveau avec un autre fichier mais de type pdf"
      //   );
      // }
    } catch (error) {
      console.error("Erreur:", error);
      setErrorMessage("Échec du chargement des fichiers");
    }
  };

  const handleModeChange = (mode) => {
    setSelectionMode(mode);
    setSelectedPieces([]); // Réinitialiser les pièces sélectionnées
    setFiles({}); // Réinitialiser les fichiers
  };

  const handleUploadBatch = async () => {
    const formData = new FormData();

    Object.values(files).forEach((file) => {
      formData.append("files", file);
    });

    formData.append("document_id", documentId);
    formData.append(
      "file_names",
      JSON.stringify(Object.values(files).map((file) => ({ name: file.name })))
    );

    try {
      const response = await axios.post(
        `http://localhost:3000/documents/${documentId}/lot`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Response:", response.data);
      if (response.data.message === "Document pieces added successfully") {
        // Correction ici
        setSuccessMessage("Fichiers chargés en lot avec succès");
        Swal.fire({
          // Afficher SweetAlert
          icon: "success",
          title: "Succès",
          text: "Fichiers chargés en lot avec succès!",
        });
        onLoadAll();
      } else {
        setErrorMessage(
          "Échec du chargement des fichiers en lot, essayez de nouveau avec un autre fichier mais de type pdf"
        );
      }
    } catch (error) {
      console.error("Erreur:", error);
      setErrorMessage("Échec du chargement des fichiers en lot");
    }
  };

  // Fonction pour ouvrir la modale avec les fichiers
  const openPreviewModal = (files) => {
    setCurrentFiles(files);
    setIsPreviewModalOpen(true);
  };

  const handleUploadPiece = async (pieceId) => {
    const formData = new FormData();
    const filesForPiece = files[pieceId]; // Récupérer tous les fichiers pour cette pièce

    if (filesForPiece) {
      filesForPiece.forEach((file) => {
        formData.append("files", file); // Ajouter chaque fichier à FormData
      });
    }

    formData.append("document_id", documentId);
    formData.append("piece_id", pieceId);

    try {
      const response = await axios.post(
        `http://localhost:3000/documents/${documentId}/pieces`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.data.message === "Document pieces added successfully") {
        setSuccessMessage("Fichiers chargés avec succès");
        Swal.fire({
          // Afficher SweetAlert
          icon: "success",
          title: "Succès",
          text: "Fichiers chargés avec succès pour cette pièce!",
        });
        onLoadAll();
      } else {
        setErrorMessage(
          "Échec du chargement des fichiers, essayez de nouveau avec un autre fichier mais de type pdf"
        );
      }
    } catch (error) {
      console.error("Erreur:", error);
      setErrorMessage("Échec du chargement des fichiers");
    }
  };

  return (
    <div className={`modal ${open ? "modal-open" : ""}`}>
      <div className="modal-box w-11/12 max-w-5xl z-50 bg-gray-300 text-black">
        <h3 className="font-bold text-lg flex items-center justify-center">
          <Upload className="mr-2" />
          Chargement des fichiers joints
        </h3>
        <div className="py-4">
          {/* Étape de sélection du mode */}
          <div className="flex justify-around mb-4">
            <button
              className={`btn ${
                selectionMode === "pieces"
                  ? " bg-gray-700 text-white"
                  : "btn-outline btn-default text-black"
              }`}
              onClick={() => handleModeChange("pieces")}
            >
              <UngroupIcon
                color={selectionMode === "pieces" ? "white" : "gray"}
                className="text-gray-800"
              />
              Téléversement par pièces
            </button>
            <button
              className={`btn ${
                selectionMode === "lot"
                  ? " bg-gray-700 text-white"
                  : "btn-outline btn-default text-black"
              }`}
              onClick={() => handleModeChange("lot")}
            >
              <Grid2x2Check
                color={selectionMode === "lot" ? "white" : "gray"}
                className="text-gray-800"
              />
              Téléversement par lot
            </button>
          </div>

          {selectionMode === "pieces" ? (
            // Affichage du mode par pièces
            <>
              {loading ? (
                <div className="flex justify-center">
                  <div className="spinner"></div>
                </div>
              ) : pieces.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-red-500 text-xl">
                    Aucune pièce configuré.
                  </p>
                  <TriangleAlert size={100} color="orangered" />
                  <Link
                    className="btn btn-outline flex gap-2 btn-default border-black text-black mt-10"
                    to="/pieces"
                  >
                    <Settings />
                    Configurer maintenant
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {pieces.map((piece) => (
                    <div
                      key={piece.id}
                      className="border border-gray-700 p-4 rounded-lg flex justify-between items-center"
                    >
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          value={piece.id}
                          onChange={handlePieceChange}
                          className="checkbox bg-gray-700"
                        />
                        <span className="ml-2 cursor-pointer">
                          {piece.nom_piece}
                        </span>
                      </label>
                      <div className="flex items-center justify-between">
                        <input
                          type="file"
                          id={`file-upload-${piece.id}`}
                          className="hidden "
                          onChange={(event) =>
                            handleFileChange(event, piece.id)
                          }
                          multiple
                          disabled={
                            !selectedPieces.includes(piece.id.toString())
                          }
                        />
                        <label htmlFor={`file-upload-${piece.id}`}>
                          <button
                            className={`btn ${
                              files[piece.id]
                                ? "btn glass bg-blue-900 text-white"
                                : "btn-outline btn-primary"
                            }`}
                            onClick={() =>
                              document
                                .getElementById(`file-upload-${piece.id}`)
                                .click()
                            }
                            disabled={
                              !selectedPieces.includes(piece.id.toString())
                            }
                          >
                            {files[piece.id]
                              ? "Ajouter plus"
                              : "Choisir fichier"}
                          </button>
                        </label>
                        {files[piece.id] && (
                          <div className="flex items-center">
                            <button
                              onClick={() => openPreviewModal(files[piece.id])} // Ouvrir la modale avec les fichiers
                              className="btn btn-outline btn-info ml-2"
                            >
                              <Eye className="w-4 h-4" />{" "}
                            </button>
                            <button
                              onClick={() => handleUploadPiece(piece.id)} // Envoyer le fichier pour cette pièce
                              className="btn btn-outline btn-success ml-2"
                            >
                              Envoyer
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <Link
                    className="btn btn-outline flex gap-2 btn-default border-black text-black mt-10"
                    to="/pieces"
                  >
                    <Settings />
                    Configurer de nouvelles pièces
                  </Link>
                </div>
              )}
            </>
          ) : (
            // Affichage du mode par lot
            <div className="flex flex-col items-center">
              <div
                className="border-2 border-dashed border-primary rounded-lg p-8 bg-blue-100 text-center cursor-pointer"
                onClick={() =>
                  document.getElementById("file-upload-batch").click()
                }
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const filesArray = Array.from(e.dataTransfer.files);
                  const newFiles = {};
                  filesArray.forEach((file) => {
                    newFiles[file.name] = file; // Stocker les fichiers par nom
                  });
                  setFiles(newFiles);
                }}
              >
                <input
                  type="file"
                  id="file-upload-batch"
                  multiple
                  className="hidden"
                  onChange={(event) => {
                    const filesArray = Array.from(event.target.files);
                    const newFiles = {};
                    filesArray.forEach((file) => {
                      newFiles[file.name] = file; // Stocker les fichiers par nom
                    });
                    setFiles(newFiles);
                  }}
                />
                <p className="text-primary text-lg">
                  Glissez-déposez vos fichiers ici ou cliquez pour sélectionner
                </p>
              </div>
              <div className="mt-4">
                {Object.keys(files).map((fileName) => (
                  <p
                    key={fileName}
                    className="text-primary underline cursor-pointer"
                    onClick={() =>
                      window.open(
                        URL.createObjectURL(files[fileName]),
                        "_blank"
                      )
                    }
                  >
                    {fileName}{" "}
                    {/* Afficher les fichiers téléversés avec possibilité de clic */}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {successMessage && (
          <div className="alert alert-success text-white">
            <div>
              <span
                className={`${successMessage ? "text-white" : "text-gray-200"}`}
              >
                <SquareCheckBig />
                {successMessage}
              </span>
            </div>
          </div>
        )}
        {errorMessage && (
          <div className="alert alert-error">
            <div>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        <div className="modal-action">
          {selectionMode != "pieces" && (
            <button
              onClick={
                selectionMode === "pieces" ? handleUploadAll : handleUploadBatch
              }
              className="btn btn-outline btn-info"
            >
              Charger tout
            </button>
          )}
          <button onClick={onClose} className="btn btn-outline btn-error">
            Annuler
          </button>
        </div>
      </div>

      {/* Modale pour afficher les fichiers */}
      {isPreviewModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Fichiers sélectionnés</h3>
            <div className="py-4">
              {currentFiles.map((file) => (
                <div key={file.name} className="flex items-center">
                  <iframe
                    src={URL.createObjectURL(file)} // Afficher le contenu du fichier dans un iframe
                    className="w-full h-64" // Ajuster la taille de l'iframe
                    title={file.name}
                  />
                </div>
              ))}
            </div>
            <div className="modal-action">
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="btn"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PieceSelectionDialog;
