import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "daisyui/dist/full.css";
import Sidebar_agence from "../../../Components/Sidebar_agence";
import TopBar from "../../../Components/Top_bar";
import {
  ArrowUpToLine,
  Download,
  Folder,
  FolderCheck,
  RefreshCcw,
  SquarePen,
  Trash2,
} from "lucide-react";
import * as XLSX from "xlsx";

const createAgence = async (agence) => {
  await axios.post("http://localhost:3000/agences", agence);
};

export default function Dossier() {
  const [openModal, setOpenModal] = useState(false);
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [currentAgence, setCurrentAgence] = useState({
    id: "",
    nom_agence: "",
    code_agence: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [data, setData] = useState([]);
  const [filterObservation, setFilterObservation] = useState(null);
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [originalData, setOriginalData] = useState([]);
  const [importType, setImportType] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/agence/dossiers/transaction-dossiers"
        );
        setData(response.data);
        setOriginalData(response.data);
      } catch (error) {
        toast.error("Erreur lors de la récupération des données.");
      }
    };

    fetchData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    createAgence(currentAgence);
    setCurrentAgence({ id: "", nom_agence: "", code_agence: "" });
    setOpenModal(false);
  };

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

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (!Array.isArray(jsonData) || jsonData.length === 0) {
        toast.error("Le fichier ne contient pas de données valides.");
        return;
      }

      try {
        const formattedData = jsonData.map((item) => ({
          AGENCE: item["AGENCE"],
          CODE_AGENCE: item["CODE AGENCE"],
          DATE: item["DATE"],
          TYPE_DE_JOURNEE: item["TYPE DE JOURNEE"],
          CODE_CAISSE: item["CODE CAISSE"],
          NOM_ET_PRENOM_DU_CAISSIER: item["NOM ET PRENOM DU CAISSIER"],
          CODE_DEFINITIF: item["CODE DEFINITIF"],
        }));

        await axios.post(
          "http://localhost:3000/agence/import/import-csv",
          formattedData
        );
        toast.success("Fichiers importés avec succès !");
      } catch (error) {
        toast.error("Échec de l'importation du fichier.");
      }

      setFileModalOpen(false);
      setSelectedFile(null);
      setImportType(null);
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  const toggleFilter = () => {
    setFilterObservation((prev) =>
      prev === "Disponible" ? "Non Disponible" : "Disponible"
    );
  };

  const handleDateFilter = () => {
    if (selectedDate) {
      const filteredByDate = originalData.filter((item) => {
        const itemDate = new Date(item.dates).toISOString().split("T")[0];
        return itemDate === selectedDate;
      });
      setData(filteredByDate);
    }
    setDateModalOpen(false);
  };

  const resetFilter = () => {
    setData(originalData);
    setSelectedDate(null);
  };

  const filteredData = filterObservation
    ? data.filter(
        (item) =>
          item.observation.toLowerCase() === filterObservation.toLowerCase()
      )
    : data;

  return (
    <div className="flex min-h-screen mt-8 bg-gray-300 to-gray-900">
      <Sidebar_agence isVisible={true} className="w-1/4" />
      <div className="flex flex-col w-3/4">
        <TopBar position="fixed" title="Agences" />

        <div className="container w-[90%] mx-auto mt-16 bg-white rounded-xl shadow-2xl flex flex-col h-auto">
          <div className="bg-white w-full rounded-lg shadow-md p-6 ">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-extrabold text-gray-800 flex justify-start w-full">
                Dossiers
              </h1>
            </div>

            <div className="flex flex-row-reverse w-full justify-between rounded-lg border-2 p-4 border-gray-300 space-x-2 mb-4">
              <div className="flex items-center justify-between w-full gap-4">
                <button
                  className="btn btn-primary bg-gray-600 text-white hover:bg-gray-800 transition duration-300 shadow-md"
                  onClick={() => setFileModalOpen(true)}
                >
                  <Download size={20} className="mr-2" />
                  Importer
                </button>
                <button className="btn btn-primary text-white bg-gray-400  hover:bg-gray-700 transition duration-300 shadow-md">
                  <ArrowUpToLine size={20} className="mr-2" />
                  Exporter
                </button>
              </div>
            </div>
            <div className="border-t border-gray-700 my-4"></div>

            <div className="w-full rounded-lg p-2 bg-gray-500">
              <h1
                className="flex items-center gap-2 text-2xl text-white"
                style={{ fontWeight: "bold" }}
              >
                <Folder />
                Liste des dossiers
              </h1>
              <div className="flex items-center justify-end">
                <button
                  className="btn btn-default border-2 bg-gray-600 border-white text-white hover:bg-gray-700 transition duration-300 shadow-md mt-2"
                  onClick={toggleFilter}
                >
                  Filtrer par observation
                </button>
                <button
                  className="btn btn-default border-2 bg-gray-600 border-white text-white hover:bg-gray-700 transition duration-300 shadow-md mt-2 ml-2"
                  onClick={() => setDateModalOpen(true)}
                >
                  Filtrer par date
                </button>
                <button
                  className="btn btn-default border-2 rounded-full bg-gray-600 border-white text-white hover:bg-gray-700 transition duration-300 shadow-md mt-2 ml-2"
                  onClick={resetFilter}
                >
                  <RefreshCcw size={20} />
                </button>
              </div>
            </div>
            {/* Table to display data */}
            <div className="mt-4 overflow-x-auto">
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                      <div className="mr-2 p-3 rounded-full bg-gray-400">
                        <Folder size={20} color="white" />
                      </div>
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                      Agence
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                      Code Caisse
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                      Type Document
                    </th>

                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                      Date
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                      Nom & Prénom
                    </th>

                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                      Code definitif
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`${
                        index % 2 === 0 ? "bg-gray-200" : "bg-white"
                      } hover:bg-gray-300 transition duration-200`}
                    >
                      <td className="border text-center text-black border-gray-300 px-4 py-2">
                        <div className="mr-2 p-3 rounded-full bg-gray-600">
                          <FolderCheck size={20} color="white" />
                        </div>
                      </td>
                      <td className="border text-center text-black border-gray-300 px-4 py-2">
                        {item.nom_agence}
                      </td>
                      <td className="border text-black border-gray-300 px-4 py-2">
                        {item.code_caisse_nom}
                      </td>
                      <td className="border text-black border-gray-300 px-4 py-2">
                        {item.nom_document_type}
                      </td>

                      <td className="border text-black border-gray-300 px-4 py-2">
                        {new Date(item.dates).toLocaleDateString()}
                      </td>
                      <td className="border text-black border-gray-300 px-4 py-2">
                        {item.nom_prenom_caissier}
                      </td>

                      <td className="border text-black border-gray-300 px-4 py-2">
                        {item.code_definitif}
                      </td>
                      <td className="border flex items-center justify-center  text-black border-gray-300 px-4 py-2">
                        <button className="btn btn-default rounded-lg bg-gray-600  text-white hover:bg-blue-600 transition duration-300 shadow-md mt-2 ml-2">
                          <SquarePen size={20} />
                        </button>
                        <button className="btn btn-default rounded-lg bg-gray-600  text-white hover:bg-red-400 transition duration-300 shadow-md mt-2 ml-2">
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {openModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          onClick={() => setOpenModal(false)}
        >
          <div
            className="modal-box bg-white text-black rounded-lg shadow-lg transform transition-all duration-300 max-w-lg w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => setOpenModal(false)}
            >
              ✕
            </button>
            <h3 className="font-bold text-lg">
              {currentAgence.id
                ? "Modifier l'agence"
                : "Creer une nouvelle agence"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-control mt-4">
                <label className="label">Code de l&apos;agence</label>
                <input
                  type="text"
                  value={currentAgence.code_agence}
                  onChange={(e) =>
                    setCurrentAgence({
                      ...currentAgence,
                      code_agence: e.target.value,
                    })
                  }
                  className="input input-bordered border-2 border-gray-300 bg-white text-black"
                  required
                />
              </div>
              <div className="form-control mt-4">
                <label className="label">Nom de l&apos;agence</label>
                <input
                  type="text"
                  value={currentAgence.nom_agence}
                  onChange={(e) =>
                    setCurrentAgence({
                      ...currentAgence,
                      nom_agence: e.target.value,
                    })
                  }
                  className="input input-bordered border-2 border-gray-300 bg-white text-black"
                  required
                />
              </div>
              <div className="modal-action flex justify-center items-center">
                <button
                  type="submit"
                  className="btn border-t-neutral-700 w-[40%] bg-gray-300 text-black hover:bg-gray-400 transition duration-300 rounded-lg"
                >
                  {currentAgence.id ? "Mettre à jour" : "Ajouter"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-error w-[40%] mt-2"
                  onClick={() => setOpenModal(false)}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {fileModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          onClick={() => setFileModalOpen(false)}
        >
          <div
            className="modal-box bg-white text-black rounded-lg shadow-lg transform transition-all duration-300 max-w-lg w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => setFileModalOpen(false)}
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
              >
                Envoyer
              </button>
              <button
                type="button"
                className="btn btn-outline btn-error w-[40%] mt-2"
                onClick={() => setFileModalOpen(false)}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {dateModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          onClick={() => setDateModalOpen(false)}
        >
          <div
            className="modal-box bg-white text-black rounded-lg shadow-lg transform transition-all duration-300 max-w-lg w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => setDateModalOpen(false)}
            >
              ✕
            </button>
            <h3 className="font-bold text-lg">Filtrer par date</h3>
            <div className="form-control mt-4">
              <input
                type="date"
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input input-bordered border-2 border-gray-300 bg-white text-black"
              />
            </div>
            <div className="modal-action flex justify-center items-center mt-4">
              <button
                type="button"
                className="btn border-t-neutral-700 w-[40%] bg-gray-300 text-black hover:bg-gray-400 transition duration-300 rounded-lg"
                onClick={handleDateFilter}
              >
                Appliquer
              </button>
              <button
                type="button"
                className="btn btn-outline btn-error w-[40%] mt-2"
                onClick={() => setDateModalOpen(false)}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
