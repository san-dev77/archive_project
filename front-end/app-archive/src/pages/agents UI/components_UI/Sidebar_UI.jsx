import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  BookMarked,
  Layers2,
  Layers3,
  ChevronDown,
  ChevronUp,
  Zap,
  Album,
} from "lucide-react";
import axios from "axios";
import "daisyui/dist/full.css";
import logo from "../../../assets/icones/logo 3.jpg";

const SideBar_UI = () => {
  const [showDocuments, setShowDocuments] = useState(false);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);

  useEffect(() => {
    // Récupérer les permissions de l'utilisateur du localStorage
    const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
    console.log(permissions);

    setUserPermissions(permissions);

    // Charger les types de documents au montage du composant
    const fetchDocumentTypes = async () => {
      const serviceId = localStorage.getItem("serviceId");
      try {
        const response = await axios.get(
          `http://localhost:3000/document-types/services/${serviceId}/document-types`
        );
        setDocumentTypes(response.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des types de documents:",
          error
        );
      }
    };
    fetchDocumentTypes();
  }, []);

  // Fonction pour vérifier si l'utilisateur a la permission de voir une section
  const hasViewPermission = (section) => {
    return userPermissions.some(
      (permission) =>
        permission.section === section && permission.action === "view"
    );
  };

  return (
    <div className="z-50 sticky top-0 h-screen bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl flex flex-col px-4 py-4 w-64 transition-all duration-300">
      {/* Logo section */}
      <div className="flex p-4 items-center gap-3 mb-6 border-b border-gray-700 pb-6">
        <img
          src={logo}
          alt="logo_BMS"
          className="w-12 h-12 rounded-full bg-white shadow-lg transform hover:scale-105 transition-transform duration-200"
        />
        <h1 className="text-white text-xl font-bold tracking-wide">Digi Doc</h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-col gap-3">
        <Link
          to="/agents"
          className="flex items-center gap-3 p-3 text-gray-200 hover:bg-gray-700/50 rounded-lg transition-colors duration-200 hover:text-white"
        >
          <LayoutDashboard size={22} />
          <span className="font-medium">Dashboard</span>
        </Link>

        {hasViewPermission("Types de documents") && (
          <Link
            to="/type_doc_UI"
            className="flex items-center gap-3 p-3 text-gray-200 hover:bg-gray-700/50 rounded-lg transition-colors duration-200 hover:text-white"
          >
            <Layers3 size={22} />
            <span className="font-medium">Types de documents</span>
          </Link>
        )}

        {hasViewPermission("Pieces") && (
          <Link
            to="/pieces_UI"
            className="flex items-center gap-3 p-3 text-gray-200 hover:bg-gray-700/50 rounded-lg transition-colors duration-200 hover:text-white"
          >
            <Album size={22} />
            <span className="font-medium">Pièces</span>
          </Link>
        )}

        {hasViewPermission("Meta-donnees") && (
          <Link
            to="/meta_UI"
            className="flex items-center gap-3 p-3 text-gray-200 hover:bg-gray-700/50 rounded-lg transition-colors duration-200 hover:text-white"
          >
            <Zap size={22} />
            <span className="font-medium">Méta-données</span>
          </Link>
        )}

        {/* Dossier section */}
        {hasViewPermission("Dossiers") && (
          <div className="relative">
            <button
              onClick={() => setShowDocuments(!showDocuments)}
              className="flex items-center justify-between w-full p-3 text-gray-200 hover:bg-gray-700/50 rounded-lg transition-colors duration-200 hover:text-white group"
            >
              <div className="flex items-center gap-3">
                <BookMarked size={22} />
                <span className="font-medium">Dossier</span>
              </div>
              {showDocuments ? (
                <ChevronUp
                  size={18}
                  className="transform transition-transform duration-200"
                />
              ) : (
                <ChevronDown
                  size={18}
                  className="transform transition-transform duration-200"
                />
              )}
            </button>

            {showDocuments && (
              <div className="mt-2 ml-6 pl-3 border-l-2 border-gray-600 space-y-2">
                {documentTypes.map((docType) => (
                  <Link
                    key={docType.id}
                    to={`/document_UI/${docType.id}`}
                    className="flex items-center gap-3 p-2 text-gray-300 hover:bg-gray-700/30 rounded-lg transition-colors duration-200 hover:text-white"
                  >
                    <Layers2 size={18} />
                    <span className="text-sm font-medium">{docType.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </nav>
    </div>
  );
};

export default SideBar_UI;
