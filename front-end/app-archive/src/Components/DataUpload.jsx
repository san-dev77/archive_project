import { useState } from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import axios from "axios";
import "./Loader.css";

export default function FileUploader({ onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [importType, setImportType] = useState(null);
  const [openFileModal, setOpenFileModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error("Veuillez sélectionner un fichier.");
      return;
    }

    if (!importType) {
      toast.error("Veuillez sélectionner un type d'importation.");
      return;
    }

    // Fonction pour formater les dates Excel
    function formatExcelDate(date) {
      // Si c'est déjà un objet Date valide
      if (date instanceof Date && !isNaN(date)) {
        return date.toLocaleDateString(); // Formate selon la langue locale
      }

      // Si la date est un nombre brut Excel
      if (!isNaN(date)) {
        // Excel compte les jours à partir du 1er janvier 1900
        const excelEpoch = new Date(1899, 11, 30);
        excelEpoch.setDate(excelEpoch.getDate() + Number(date));
        return excelEpoch.toLocaleDateString(); // Convertit en date locale
      }

      // Si c'est une chaîne de caractères
      if (typeof date === "string") {
        // Tente de la convertir en Date
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate)) {
          return parsedDate.toLocaleDateString(); // Si conversion valide
        } else {
          // Si la chaîne ne peut pas être convertie, retourne telle quelle
          return date;
        }
      }

      // Si aucune conversion n'a fonctionné, retourne la valeur brute
      return date;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });
      console.log("Données JSON :", jsonData);

      if (!Array.isArray(jsonData) || jsonData.length === 0) {
        toast.error("Le fichier ne contient pas de données valides.");
        return;
      }

      const formattedData = jsonData.map((item) => {
        switch (importType) {
          case "journée de guichet":
            return {
              AGENCE: item["AGENCE"],
              CODE_AGENCE: item["CODE AGENCE"],
              DATE: formatExcelDate(item["DATE"]) || "Date invalide",
              TYPE_DE_JOURNEE: item["TYPE DE JOURNEE"],
              NOM_ET_PRENOM_DU_CAISSIER: item["NOM ET PRENOM DU CAISSIER"],
              CODE_BOITE: item["CODE BOITE "] || "Code boîte manquant",
            };

          case "dossier":
            return {
              AGENCE: item["AGENCE"],
              CODE_AGENCE: item["CODE AGENCE"],
              DATE: formatExcelDate(item["DATE"])
                .split("/")
                .reverse()
                .map((part) => part.padStart(2, "0"))
                .join("/"),
              CODE_DEFINITIF: item["CODE DEFINITIF"],
            };

          case "journée de caisse":
            return {
              AGENCE: item["AGENCE"],
              CODE_AGENCE: item["CODE AGENCE"],
              DATE: formatExcelDate(item["DATE"]),
              // .split("/")
              // .reverse()
              // .map((part) => part.padStart(2, "0"))
              // .join("/"),
              CODE_CAISSE: item["CODE CAISSE"],
              TYPE_DE_JOURNEE: item["TYPE DE JOURNEE"],
              NOM_ET_PRENOM_DU_CAISSIER: item["NOM ET PRENOM DU CAISSIER"],
              CODE_DEFINITIF: item["CODE DEFINITIF"],
            };

          default:
            return {};
        }
      });

      let apiUrl;
      switch (importType) {
        case "journée de caisse":
          apiUrl = "http://localhost:3000/agence/import/import-caisse";
          break;
        case "journée de guichet":
          apiUrl = "http://localhost:3000/agence/import/import-guichet";
          break;
        case "dossier":
          apiUrl = "http://localhost:3000/agence/import/import-dossiers";
          break;
        default:
          toast.error("Type d'importation non valide.");
          return;
      }

      console.log(formattedData);

      setLoading(true);

      await axios.post(apiUrl, formattedData);
      setLoading(false);

      toast.success("Fichiers importés avec succès !");

      onClose();
      setSelectedFile(null);
      setImportType(null);
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  return (
    <div>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="wrapper">
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="shadow"></div>
            <div className="shadow"></div>
            <div className="shadow"></div>
            <p className="text-white  mt-56 font-bold text-5xl">
              Import des données...
            </p>
          </div>
        </div>
      )}
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
          <h3 className="font-bold text-lg">Importer un fichier</h3>
          <div className="form-control mt-4">
            <label className="label">Type d&apos;importation</label>
            <select
              className="select select-bordered border-2 border-gray-300 bg-white text-black"
              value={importType}
              onChange={(e) => setImportType(e.target.value)}
            >
              <option value="">Sélectionnez un type</option>
              <option value="journée de caisse">Journée de Caisse</option>
              <option value="journée de guichet">Journée de Guichet</option>
              <option value="dossier">Dossier</option>
            </select>
          </div>
          <div className="form-control mt-4">
            <input
              type="file"
              onChange={handleFileChange}
              className="input input-bordered border-2 border-gray-300 bg-white text-black"
            />
          </div>
          {selectedFile && (
            <div className="mt-4">
              <h4 className="font-bold">Prévisualisation du fichier :</h4>
              <p>{selectedFile.name}</p>
            </div>
          )}
          <div className="modal-action flex justify-center items-center mt-4">
            <button
              type="button"
              className="btn border-t-neutral-700 w-[40%] bg-gray-300 text-black hover:bg-gray-400 transition duration-300 rounded-lg"
              onClick={handleFileUpload}
              disabled={loading}
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
      {openFileModal && (
        <FileUploadModal onClose={() => setOpenFileModal(false)} />
      )}
    </div>
  );
}

// Fonction pour convertir un nombre de série Excel en date
