import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const FileUploadModal = ({ onClose }) => {
  const [files, setFiles] = useState([]); // État pour stocker les fichiers

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files)); // Met à jour l'état avec les fichiers sélectionnés
  };

  const handleUpload = async () => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file); // Ajoute chaque fichier au FormData
    });

    try {
      await axios.post("http://localhost:3000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Fichiers importés avec succès.");
      onClose(); // Ferme la modale après l'envoi
    } catch (error) {
      toast.error("Erreur lors de l'importation des fichiers.");
    }
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
        className="modal-box bg-white text-black rounded-lg shadow-lg transform transition-all duration-300 max-w-lg w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="btn btn-sm btn-circle absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>
        <h3 className="font-bold text-lg">Importer des fichiers</h3>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="mt-4"
        />
        <div className="modal-action flex justify-center items-center mt-4">
          <button
            className="btn border-t-neutral-700 w-[40%] bg-gray-300 text-black hover:bg-gray-400 transition duration-300 rounded-lg"
            onClick={handleUpload}
          >
            Envoyer
          </button>
          <button
            type="button"
            className="btn btn-outline btn-error w-[40%] mt-2"
            onClick={onClose}
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;
