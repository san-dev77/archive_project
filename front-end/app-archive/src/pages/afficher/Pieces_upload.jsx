import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, TriangleAlert, FileUp, UngroupIcon, Grid2x2Check, UploadCloudIcon, SquareCheckBig } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf'; // Importez les composants nécessaires

// Configurez le worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.min.mjs`; // Mettez à jour l'URL

const PieceSelectionDialog = ({ open, onClose, onSave, documentTypeId, documentId, onLoadAll }) => {
  const [pieces, setPieces] = useState([]);
  const [selectedPieces, setSelectedPieces] = useState([]);
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [previewFile, setPreviewFile] = useState(null);
  const [documentIdState, setDocumentIdState] = useState(documentId); // Ajout de l'état pour documentId
  const [selectionMode, setSelectionMode] = useState('pieces'); // Ajout de l'état pour le mode de sélection

  useEffect(() => {
    const fetchPieces = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/pieces/relations/${documentTypeId}`);
        setPieces(response.data);
      } catch (error) {
        setErrorMessage('Failed to fetch pieces');
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
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFiles((prev) => ({
        ...prev,
        [pieceId]: selectedFile,
      }));
      setPreviewFile(URL.createObjectURL(selectedFile));
    }
  };

  const handleUploadAll = async () => {
    const formData = new FormData();

    selectedPieces.forEach(pieceId => {
      const file = files[pieceId];
      if (file) {
        formData.append('files', file);
      }
    });

    formData.append('document_id', documentId);
    formData.append('pieces', JSON.stringify(selectedPieces.map(pieceId => ({
      piece_id: pieceId,
      filePath: files[pieceId].name
    }))));

    try {
      console.log('FormData entries:', ...formData.entries());
      const response = await axios.post(`http://localhost:3000/documents/${documentId}/pieces`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Response:', response);
      if (response.data.message === "Document pieces added successfully") {
        setSuccessMessage('Fichiers chargés avec succès');
        onLoadAll();
      } else {
        setErrorMessage('Échec du chargement des fichiers, essayez de nouveau avec un autre fichier mais de type pdf');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setErrorMessage('Échec du chargement des fichiers');
    }
  };

  const handleSave = () => {
    onSave(selectedPieces);
    onClose();
  };

  const handleModeChange = (mode) => {
    setSelectionMode(mode);
    setSelectedPieces([]); // Réinitialiser les pièces sélectionnées
    setFiles({}); // Réinitialiser les fichiers
  };

  const handleUploadBatch = async () => {
    const formData = new FormData();

    Object.values(files).forEach(file => {
      formData.append('files', file);
    });

    formData.append('document_id', documentId);
    formData.append('file_names', JSON.stringify(Object.values(files).map(file => ({ name: file.name }))));

    try {
      const response = await axios.post(`http://localhost:3000/documents/${documentId}/lot`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Response:', response.data);
      if (response.data.message === "Document pieces added successfully") { // Correction ici
        setSuccessMessage('Fichiers chargés en lot avec succès');
        onLoadAll();
      } else {
        setErrorMessage('Échec du chargement des fichiers en lot, essayez de nouveau avec un autre fichier mais de type pdf');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setErrorMessage('Échec du chargement des fichiers en lot');
    }
  };

  return (
    <div className={`modal ${open ? 'modal-open' : ''}`}>
      <div className="modal-box w-11/12 max-w-5xl bg-gray-300 text-black">
        <h3 className="font-bold text-lg flex items-center justify-center">
          <Upload className="mr-2" />
          Chargement des fichiers joints
        </h3>
        <div className="py-4">
          {/* Étape de sélection du mode */}
          <div className="flex justify-around mb-4">
            <button className={`btn ${selectionMode === 'pieces' ? ' bg-gray-700 text-white' : 'btn-outline btn-default text-black'}`} onClick={() => handleModeChange('pieces')}>
              <UngroupIcon color={selectionMode === 'pieces' ? 'white' : 'gray'} className='text-gray-800'/>
              Téléversement par pièces
            </button>
            <button className={`btn ${selectionMode === 'lot' ? ' bg-gray-700 text-white' : 'btn-outline btn-default text-black'}`} onClick={() => handleModeChange('lot')}>
              <Grid2x2Check color={selectionMode === 'lot' ? 'white' : 'gray'} className='text-gray-800'/>
              Téléversement par lot
            </button>
          </div>

          {selectionMode === 'pieces' ? (
            // Affichage du mode par pièces
            <>
              {loading ? (
                <div className="flex justify-center">
                  <div className="spinner"></div>
                </div>
              ) : pieces.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-red-500 text-xl">Aucune pièce trouvée</p>
                  <TriangleAlert size={100} color="orangered" />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {pieces.map((piece) => (
                    <div key={piece.id} className="border border-gray-700 p-4 rounded-lg flex justify-between items-center">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          value={piece.id}
                          onChange={handlePieceChange}
                          className="checkbox bg-gray-700"
                        />
                        <span className="ml-2 cursor-pointer">{piece.nom_piece}</span>
                      </label>
                      <div>
                        <input
                          type="file"
                          id={`file-upload-${piece.id}`}
                          className="hidden"
                          onChange={(event) => handleFileChange(event, piece.id)}
                          disabled={!selectedPieces.includes(piece.id.toString())} // Convertir piece.id en chaîne
                        />
                        <label htmlFor={`file-upload-${piece.id}`}>
                          <button
                            className={`btn ${files[piece.id] ? 'btn glass bg-blue-900 text-white' : 'btn-outline btn-primary'}`}
                            onClick={() => document.getElementById(`file-upload-${piece.id}`).click()}
                            disabled={!selectedPieces.includes(piece.id.toString())} // Convertir piece.id en chaîne
                          >
                            {files[piece.id] ? 'Changer' : 'Choisir fichier'}
                          </button>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            // Affichage du mode par lot
            <div className="flex flex-col items-center">
              <div
                className="border-2 border-dashed border-primary rounded-lg p-8 bg-blue-100 text-center cursor-pointer"
                onClick={() => document.getElementById('file-upload-batch').click()}
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
                <p className="text-primary text-lg">Glissez-déposez vos fichiers ici ou cliquez pour sélectionner</p>
              </div>
              <div className="mt-4">
                {Object.keys(files).map((fileName) => (
                  <p key={fileName} className="text-primary underline cursor-pointer" onClick={() => window.open(URL.createObjectURL(files[fileName]), '_blank')}>
                    {fileName} {/* Afficher les fichiers téléversés avec possibilité de clic */}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {successMessage && (
          <div className="alert alert-success text-white">
            <div>
              <span className={`${successMessage ? 'text-white' : 'text-gray-200'}`}>
              <SquareCheckBig/>
                {successMessage}</span>
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
          
          <button
            onClick={selectionMode === 'pieces' ? handleUploadAll : handleUploadBatch}
            className="btn btn-outline btn-info"
          >
            Charger tout
          </button>
          <button onClick={onClose} className="btn btn-outline btn-error">
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default PieceSelectionDialog;