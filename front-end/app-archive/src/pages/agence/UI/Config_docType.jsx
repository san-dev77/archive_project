import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar_agence from "../../../Components/Sidebar_agence";
import TopBar from "../../../Components/Top_bar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "daisyui/dist/full.css";
import Loader_component from "../../../Components/Loader";

import {
  Calendar,
  ClipboardList,
  FileSliders,
  Link2,
  Save,
} from "lucide-react";

export default function ConfigDocType() {
  const { id } = useParams(); // Get the document type ID from the URL
  const [docType, setDocType] = useState();
  const [loading, setLoading] = useState(true);
  const [selectedRelation, setSelectedRelation] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [metadataName, setMetadataName] = useState("");
  const [metadataType, setMetadataType] = useState("text");

  const [metadataList, setMetadataList] = useState([]);

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
    <div className="flex min-h-screen bg-gray-300">
      <Sidebar_agence isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar position="fixed" title="Configuration du Type de Document" />
        <div className="container w-full mx-auto px-4 py-8 mt-20">
          <div className="bg-gray-800 w-full rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <FileSliders className="h-8 w-8 text-[#00B7FF] mr-2" />
                Configuration du Type de Document
              </h1>
            </div>

            <div className="bg-[#3a3a3a] rounded-lg p-6 space-y-6">
              {/* Document Type Name Section */}
              <div className="bg-[#2a2a2a] border border-[#4a4a4a] rounded-lg p-4">
                <h2 className="text-xl flex items-center font-bold text-white mb-3">
                  <ClipboardList className="h-6 w-6 text-[#00B7FF] mr-2" />
                  Type de Document
                </h2>
                <div className="bg-[#404040] p-3 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-[#00B7FF] mr-2" />
                  <span className="text-white font-medium">
                    {docType
                      ? docType.nom_document_type.toUpperCase()
                      : "chargement..."}
                  </span>
                </div>
              </div>

              {/* Relations Section */}
              <div className="bg-[#2a2a2a] border border-[#4a4a4a] rounded-lg p-4">
                <h2 className="text-xl flex items-center font-bold text-white mb-4">
                  <Link2 className="h-6 w-6 text-[#00B7FF] mr-2" />
                  Association
                </h2>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  {/* Radio Options */}
                  <label className="flex items-center bg-[#404040] p-3 rounded-lg cursor-pointer hover:bg-[#505050] transition-colors duration-200">
                    <input
                      type="radio"
                      name="relation"
                      value="agence"
                      checked={selectedRelation === "agence"}
                      onChange={() => setSelectedRelation("agence")}
                      className="radio radio-info"
                    />
                    <span className="ml-2 text-white">Agence</span>
                  </label>

                  <label className="flex items-center bg-[#404040] p-3 rounded-lg cursor-pointer hover:bg-[#505050] transition-colors duration-200">
                    <input
                      type="radio"
                      name="relation"
                      value="caisse"
                      checked={selectedRelation === "caisse"}
                      onChange={() => setSelectedRelation("caisse")}
                      className="radio radio-info"
                    />
                    <span className="ml-2 text-white">Caisse</span>
                  </label>

                  <label className="flex items-center bg-[#404040] p-3 rounded-lg cursor-pointer hover:bg-[#505050] transition-colors duration-200">
                    <input
                      type="radio"
                      name="relation"
                      value="guichet"
                      checked={selectedRelation === "guichet"}
                      onChange={() => setSelectedRelation("guichet")}
                      className="radio radio-info"
                    />
                    <span className="ml-2 text-white">Guichet</span>
                  </label>
                </div>

                {selectedRelation && (
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveConfiguration}
                      className="bg-[#00B7FF] hover:bg-[#0096FF] text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
                    >
                      <Save className="h-5 w-5 mr-2" />
                      Enregistrer la configuration
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal with updated styling */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#2a2a2a] rounded-lg shadow-xl p-6 w-full max-w-lg mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">
                Créer une Métadonnée
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Nom de la métadonnée
                </label>
                <input
                  type="text"
                  placeholder="Nom de la métadonnée"
                  value={metadataName}
                  onChange={(e) => setMetadataName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#3a3a3a] text-white border border-[#4a4a4a] rounded-lg focus:ring-2 focus:ring-[#00B7FF] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Type de métadonnée
                </label>
                <select
                  value={metadataType}
                  onChange={(e) => setMetadataType(e.target.value)}
                  className="w-full px-3 py-2 bg-[#3a3a3a] text-white border border-[#4a4a4a] rounded-lg focus:ring-2 focus:ring-[#00B7FF] focus:border-transparent"
                >
                  <option value="text">Texte</option>
                  <option value="number">Numérique</option>
                  <option value="date">Date</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#4a4a4a] text-white rounded-lg hover:bg-[#5a5a5a] transition-colors duration-200"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreateMetadata}
                  className="px-4 py-2 bg-[#00B7FF] text-white rounded-lg hover:bg-[#0096FF] transition-colors duration-200"
                >
                  Créer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
