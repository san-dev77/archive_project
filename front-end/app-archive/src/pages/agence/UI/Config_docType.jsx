import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Sidebar_agence from "../../../Components/Sidebar_agence";
import TopBar from "../../../Components/Top_bar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "daisyui/dist/full.css";
import Loader_component from "../../../Components/Loader";
import DataUpload from "../../../Components/DataUpload";

import {
  Calendar,
  ClipboardList,
  FileSliders,
  FileSymlink,
  Link2,
  Save,
  Upload,
} from "lucide-react";

export default function ConfigDocType() {
  const { id } = useParams(); // Get the document type ID from the URL
  const [docType, setDocType] = useState();
  const [loading, setLoading] = useState(true);
  const [selectedRelation, setSelectedRelation] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [metadataName, setMetadataName] = useState("");
  const [metadataType, setMetadataType] = useState("text");
  const [fileModalOpen, setFileModalOpen] = useState(false);

  const [metadataList, setMetadataList] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchDocTypeDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/agence/document-type/${id}`
        );
        setDocType(response.data);
        console.log(response.data);

        setLoading(false);
      } catch (error) {
        toast.error(
          "Erreur lors de la récupération des détails du type de document."
        );

        setLoading(false);
      }
    };

    fetchDocTypeDetails();
  }, [id]);

  useEffect(() => {
    const fetchMetadata = async () => {
      if (selectedRelation) {
        try {
          const response = await axios.get(
            `http://localhost:3000/agence/metadata/nom-type/${id}`
          );

          if (response.data.length === 0) {
            toast.info(
              "Aucune donnée trouvée. Veuillez créer une nouvelle entrée."
            );
          } else {
            setMetadataList(response.data);
          }
        } catch (error) {
          toast.error("Erreur lors de la récupération des métadonnées.");
        }
      }
    };

    fetchMetadata();
  }, [selectedRelation, id, metadataList]);

  const handleCreateMetadata = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/agence/metadata`,
        {
          id,
          nom_meta: metadataName,
          type_meta: metadataType,
        }
      );
      setMetadataList([...metadataList, response.data]);
      setIsModalOpen(false);
      toast.success("Métadonnée créée avec succès.");
    } catch (error) {
      toast.error("Erreur lors de la création de la métadonnée.");
    }
  };

  const handleFetchRelatedData = async () => {
    navigate("/agence/config-piece");
  };

  const handleSaveConfiguration = async () => {
    let apiUrl;
    switch (selectedRelation) {
      case "agence":
        apiUrl = `http://localhost:3000/agence/document-type/link-agence`;
        break;
      case "caisse":
        apiUrl = `http://localhost:3000/agence/document-type/link-caisse`;
        break;
      case "guichet":
        apiUrl = `http://localhost:3000/agence/document-type/link-guichet`;
        break;
      default:
        toast.error("Veuillez sélectionner une relation valide.");
        return;
    }

    try {
      await axios.post(apiUrl, { document_type_id: id });
      toast.success("Configuration enregistrée avec succès.");
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement de la configuration.");
    }
  };

  if (loading) {
    return <Loader_component />;
  }

  return (
    <div className="flex min-h-screen mt-8 bg-gray-100">
      <Sidebar_agence isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar position="fixed" title="Configuration du Type de Document" />

        <div className="container w-[90%] mx-auto mt-16 bg-white rounded-xl shadow-2xl flex flex-col h-auto p-8">
          <div className="bg-white w-full rounded-lg shadow-md p-6">
            <h1 className="text-3xl flex items-center justify-center font-extrabold text-gray-800 mb-6">
              <FileSliders size={32} className="mr-2" />
              Configuration du Type de Document
            </h1>
            <div className="flex flex-col space-y-6">
              <div className="flex flex-col border-b pb-4 border-gray-600 rounded-lg">
                <h2 className="text-xl flex items-center font-bold text-gray-800">
                  <ClipboardList className="mr-2" />
                  Nom du Type de Document:
                </h2>
                <p
                  style={{ fontWeight: "bold" }}
                  className="text-gray-700  p-2 rounded-lg bg-gray-200 flex items-center justify-center"
                >
                  <Calendar className="mr-2" />
                  {docType
                    ? docType[0].nom_document_type.toUpperCase()
                    : "chargement..."}
                </p>
              </div>
              <div>
                <h2 className="text-xl flex items-center font-bold text-gray-800">
                  <Link2 className="mr-2" />
                  Relier avec:
                </h2>
                <div className="flex space-x-6 justify-between border-b pb-4 border-gray-600 rounded-lg">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="relation"
                      value="agence"
                      checked={selectedRelation === "agence"}
                      onChange={() => setSelectedRelation("agence")}
                      className="radio radio-info"
                    />
                    <span className="ml-2 text-gray-700">Agence</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="relation"
                      value="caisse"
                      checked={selectedRelation === "caisse"}
                      onChange={() => setSelectedRelation("caisse")}
                      className="radio radio-info"
                    />
                    <span className="ml-2 text-gray-700">Caisse</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="relation"
                      value="guichet"
                      checked={selectedRelation === "guichet"}
                      onChange={() => setSelectedRelation("guichet")}
                      className="radio radio-info"
                    />
                    <span className="ml-2 text-gray-700">Guichet</span>
                  </label>

                  {selectedRelation && (
                    <div>
                      <button
                        onClick={handleSaveConfiguration}
                        className="btn btn-outline btn-default text-gray-900"
                      >
                        <Save />
                        Enregistrer la configuration
                      </button>
                    </div>
                  )}
                </div>
                {selectedRelation && (
                  <div className="mt-8 flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <button
                        className="btn  btn-outline  btn-default"
                        onClick={handleFetchRelatedData}
                      >
                        <FileSymlink size={20} />
                        Lier pièces
                      </button>
                    </div>

                    <div className="mt-4 flex justify-center">
                      <button
                        onClick={() => setFileModalOpen(true)}
                        className="btn btn-outline btn-default"
                      >
                        <Upload />
                        Importer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />

      {fileModalOpen && <DataUpload onClose={() => setFileModalOpen(false)} />}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">Créer une Métadonnée</h2>
            <input
              type="text"
              placeholder="Nom de la métadonnée"
              value={metadataName}
              onChange={(e) => setMetadataName(e.target.value)}
              className="border p-2 mb-4 w-full"
            />
            <select
              value={metadataType}
              onChange={(e) => setMetadataType(e.target.value)}
              className="border p-2 mb-4 w-full"
            >
              <option value="text">Texte</option>
              <option value="number">Numérique</option>
              <option value="date">Date</option>
            </select>
            <button
              onClick={handleCreateMetadata}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-300"
            >
              Créer
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="ml-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-300"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
