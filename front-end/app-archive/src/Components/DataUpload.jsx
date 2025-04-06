import { useState, useRef } from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import axios from "axios";
import "./Loader.css";

export default function FileUploader({ onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [importType, setImportType] = useState(null);
  const [openFileModal, setOpenFileModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [processedItems, setProcessedItems] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const cancelTokenRef = useRef(null);

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

      // Set total items for progress tracking
      setTotalItems(jsonData.length);
      setProcessedItems(0);

      // Estimate time (assuming ~100ms per item)
      setEstimatedTime(Math.ceil(jsonData.length * 0.1));

      // Extraction des noms de colonnes (headers)
      const headers = Object.keys(jsonData[0] || {});
      console.log("Noms des colonnes :", headers);

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
      const meta_data = {
        doc_type_name: importType,
        headers: headers,
      };

      // Create cancel token
      cancelTokenRef.current = axios.CancelToken.source();

      try {
        // Send metadata
        await axios.post(
          "http://localhost:3000/agence/metadata/import_col",
          meta_data
        );

        // Send data in chunks of 100
        const chunkSize = 100;
        for (let i = 0; i < formattedData.length; i += chunkSize) {
          const chunk = formattedData.slice(i, i + chunkSize);
          await axios.post(apiUrl, chunk, {
            cancelToken: cancelTokenRef.current.token,
            onUploadProgress: (progressEvent) => {
              const newProcessed = Math.min(
                i + chunkSize,
                formattedData.length
              );
              setProcessedItems(newProcessed);
              setProgress((newProcessed / formattedData.length) * 100);
            },
          });
        }

        setLoading(false);
        toast.success("Données importées avec succès !");
        onClose();
        setSelectedFile(null);
        setImportType(null);
      } catch (error) {
        if (axios.isCancel(error)) {
          toast.info("Import annulé");
        } else {
          console.error("Erreur lors de l'appel de l'API :", error);
          toast.error("Une erreur s'est produite lors de l'importation.");
        }
        setLoading(false);
      }
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  const handleCancel = () => {
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel();
      setLoading(false);
      setProgress(0);
      setProcessedItems(0);
    }
  };

  return (
    <div>
      {loading && (
        <div className="fixed z-[1000] inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 ">
          <div className="w-full max-w-md p-6">
            <div className="bg-[#2a2a2a] rounded-lg p-6">
              <div className="mb-4">
                <div className="flex justify-between text-white mb-2">
                  <span>Progression :</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-[#3a3a3a] rounded-full h-4">
                  <div
                    className="bg-[#00B7FF] h-4 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="text-white space-y-2">
                <p>
                  Éléments traités : {processedItems} / {totalItems}
                </p>
                <p>
                  Temps estimé restant :{" "}
                  {Math.max(0, Math.ceil(estimatedTime * (1 - progress / 100)))}
                  s
                </p>
              </div>

              <button
                onClick={handleCancel}
                className="mt-4 w-full px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
              >
                Annuler l'importation
              </button>
            </div>
          </div>
        </div>
      )}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div
          className="bg-[#2a2a2a] rounded-lg shadow-xl p-6 w-full max-w-lg mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">
              Importer un fichier
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-1">
              Type d&apos;importation
            </label>
            <select
              className="w-full px-3 py-2 bg-[#3a3a3a] text-white border border-[#4a4a4a] rounded-lg focus:ring-2 focus:ring-[#00B7FF] focus:border-transparent"
              value={importType}
              onChange={(e) => setImportType(e.target.value)}
            >
              <option value="">Sélectionnez un type</option>
              <option value="journée de caisse">Journée de Caisse</option>
              <option value="journée de guichet">Journée de Guichet</option>
              <option value="dossier">Dossier</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-1">
              Fichier
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full px-3 py-2 bg-[#3a3a3a] text-white border border-[#4a4a4a] rounded-lg focus:ring-2 focus:ring-[#00B7FF] focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#00B7FF] file:text-white hover:file:bg-[#0096FF]"
            />
          </div>

          {selectedFile && (
            <div className="mb-6 p-4 bg-[#3a3a3a] rounded-lg border border-[#4a4a4a]">
              <h4 className="text-sm font-medium text-white mb-2">
                Prévisualisation du fichier :
              </h4>
              <p className="text-gray-300 text-sm">{selectedFile.name}</p>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-[#4a4a4a] rounded-lg hover:bg-[#5a5a5a] focus:outline-none focus:ring-2 focus:ring-[#6a6a6a]"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleFileUpload}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-[#00B7FF] rounded-lg hover:bg-[#0096FF] focus:outline-none focus:ring-2 focus:ring-[#00B7FF] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Envoyer
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
