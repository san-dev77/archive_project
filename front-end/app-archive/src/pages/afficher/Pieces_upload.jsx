import { useState, useEffect } from "react";
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
        setSuccessMessage("Fichiers chargés en lot avec succès");
        Swal.fire({
          icon: "success",
          title: "Succès",
          text: "Fichiers chargés en lot avec succès!",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: "#4CAF50",
          color: "#fff",
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
          icon: "success",
          title: "Succès",
          text: "Fichiers chargés avec succès pour cette pièce!",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: "#4CAF50",
          color: "#fff",
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
      <div className="modal-box w-11/12 max-w-5xl z-50 bg-white text-gray-800 shadow-2xl rounded-lg">
        <h3 className="font-bold text-xl flex items-center justify-center mb-6 text-blue-800 border-b pb-3">
          <Upload className="mr-2" />
          Chargement des fichiers joints
        </h3>
        <div className="py-4">
          {/* Étape de sélection du mode */}
          <div className="flex justify-around mb-8">
            <button
              className={`btn ${
                selectionMode === "pieces"
                  ? "bg-blue-700 text-white hover:bg-blue-800"
                  : "btn-outline hover:bg-gray-100 text-gray-700"
              } transition-all duration-300 shadow-md rounded-lg px-6`}
              onClick={() => handleModeChange("pieces")}
            >
              <UngroupIcon
                color={selectionMode === "pieces" ? "white" : "gray"}
                className="mr-2"
              />
              Téléversement par pièces
            </button>
            <button
              className={`btn ${
                selectionMode === "lot"
                  ? "bg-blue-700 text-white hover:bg-blue-800"
                  : "btn-outline hover:bg-gray-100 text-gray-700"
              } transition-all duration-300 shadow-md rounded-lg px-6`}
              onClick={() => handleModeChange("lot")}
            >
              <Grid2x2Check
                color={selectionMode === "lot" ? "white" : "gray"}
                className="mr-2"
              />
              Téléversement par lot
            </button>
          </div>

          {selectionMode === "pieces" ? (
            // Affichage du mode par pièces
            <>
              {loading ? (
                <div className="flex justify-center my-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
                </div>
              ) : pieces.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-10 bg-gray-50 rounded-lg">
                  <p className="text-red-500 text-xl font-semibold mb-4">
                    Aucune pièce configurée
                  </p>
                  <TriangleAlert
                    size={100}
                    color="orangered"
                    className="mb-6"
                  />
                  <Link
                    className="btn bg-blue-600 hover:bg-blue-700 text-white flex gap-2 transition-all duration-300 shadow-lg rounded-lg px-6"
                    to="/pieces"
                  >
                    <Settings />
                    Configurer maintenant
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 max-h-[60vh] overflow-y-auto pr-2">
                  {pieces.map((piece) => (
                    <div
                      key={piece.id}
                      className="border border-gray-200 p-5 rounded-lg flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-all duration-200 shadow-sm"
                    >
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          value={piece.id}
                          onChange={handlePieceChange}
                          className="checkbox bg-blue-600 w-5 h-5"
                        />
                        <span className="ml-3 cursor-pointer font-medium">
                          {piece.nom_piece}
                        </span>
                      </label>
                      <div className="flex items-center justify-between">
                        <input
                          type="file"
                          id={`file-upload-${piece.id}`}
                          className="hidden"
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
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "btn-outline border-blue-600 text-blue-600 hover:bg-blue-50"
                            } transition-all duration-300 rounded-lg`}
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
                          <div className="flex items-center ml-3">
                            <button
                              onClick={() => openPreviewModal(files[piece.id])}
                              className="btn btn-outline border-blue-500 text-blue-500 hover:bg-blue-50 ml-2 rounded-lg"
                            >
                              <Eye className="w-4 h-4 mr-1" /> Aperçu
                            </button>
                            <button
                              onClick={() => handleUploadPiece(piece.id)}
                              className="btn bg-green-600 hover:bg-green-700 text-white ml-2 rounded-lg"
                            >
                              Envoyer
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <Link
                    className="btn btn-outline flex gap-2 border-blue-600 text-blue-600 hover:bg-blue-50 mt-6 rounded-lg"
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
                className="border-2 border-dashed border-blue-400 rounded-lg p-12 bg-blue-50 text-center cursor-pointer hover:bg-blue-100 transition-all duration-300 w-full"
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
                    newFiles[file.name] = file;
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
                      newFiles[file.name] = file;
                    });
                    setFiles(newFiles);
                  }}
                />
                <Upload className="mx-auto h-16 w-16 text-blue-500 mb-4" />
                <p className="text-blue-700 text-lg font-medium mb-2">
                  Glissez-déposez vos fichiers ici
                </p>
                <p className="text-gray-500">ou cliquez pour sélectionner</p>
              </div>
              <div className="mt-6 w-full max-h-[30vh] overflow-y-auto">
                {Object.keys(files).length > 0 && (
                  <h4 className="font-semibold text-gray-700 mb-3">
                    Fichiers sélectionnés:
                  </h4>
                )}
                {Object.keys(files).map((fileName) => (
                  <div
                    key={fileName}
                    className="flex items-center p-2 bg-gray-50 rounded-md mb-2 hover:bg-gray-100"
                  >
                    <p
                      className="text-blue-600 hover:text-blue-800 cursor-pointer flex-1"
                      onClick={() =>
                        window.open(
                          URL.createObjectURL(files[fileName]),
                          "_blank"
                        )
                      }
                    >
                      {fileName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {successMessage && (
          <div className="alert bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
            <div className="flex items-center">
              <SquareCheckBig className="text-green-500 mr-2" />
              <span className="font-medium">{successMessage}</span>
            </div>
          </div>
        )}
        {errorMessage && (
          <div className="alert bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
            <div className="flex items-center">
              <TriangleAlert className="text-red-500 mr-2" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          </div>
        )}

        <div className="modal-action border-t pt-4">
          {selectionMode === "lot" && Object.keys(files).length > 0 && (
            <button
              onClick={handleUploadBatch}
              className="btn bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300"
            >
              <Upload className="mr-2 h-4 w-4" />
              Charger les fichiers
            </button>
          )}
          <button
            onClick={onClose}
            className="btn btn-outline border-red-500 text-red-500 hover:bg-red-50 rounded-lg"
          >
            Annuler
          </button>
        </div>
      </div>

      {/* Modale pour afficher les fichiers */}
      {isPreviewModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box bg-white max-w-4xl w-11/12 p-0 rounded-lg shadow-2xl">
            <div className="bg-blue-600 text-white p-4 rounded-t-lg">
              <h3 className="font-bold text-lg">Aperçu des fichiers</h3>
            </div>
            <div className="py-6 px-4">
              {currentFiles.map((file, index) => (
                <div key={file.name} className="mb-6 last:mb-0">
                  <p className="font-medium text-gray-700 mb-2">
                    {index + 1}. {file.name}
                  </p>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <iframe
                      src={URL.createObjectURL(file)}
                      className="w-full h-96"
                      title={file.name}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="modal-action bg-gray-50 p-4 rounded-b-lg">
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="btn bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
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
