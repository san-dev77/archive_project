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
    <div className="sticky z-50 top-0 h-screen overflow-x-hidden scrollbar-state z-20 bg-gradient-to-b from-green-700 to-green-900 shadow-2xl flex flex-col justify-between items-center px-4 py-4 w-64">
      <div className="flex flex-col items-center space-y-4 w-full max-h-[80vh]">
        {/* Le logo */}
        <div className="flex p-4 h-[60px] text-left w-full items-center justify-start bg-green-800 rounded-xl shadow-lg">
          <div className="flex items-center justify-normal w-full gap-2 align-middle h-full">
            <img
              src={logo}
              alt="logo_BMS"
              className="w-12 h-12 rounded-full bg-white shadow-md border-2 border-green-400"
            />
            <h1 className="text-white text-2xl font-bold tracking-wide">
              Digi Doc
            </h1>
          </div>
        </div>
        {/* Le logo */}

        <div className="divider before:bg-green-500 after:bg-green-500"></div>

        <ul className="menu p-0 w-full space-y-2">
          <Link
            to="/agents_UI"
            className={`cursor-pointer flex items-center justify-start gap-1 w-full rounded-xl p-3 bg-green-800/50 text-white hover:bg-emerald-600 hover:shadow-md transition-all duration-300`}
          >
            <LayoutDashboard
              size="22px"
              className="transition-transform duration-300 ease-in-out transform group-hover:scale-110"
            />
            <span className="text-sm ml-2 font-medium">Dashboard</span>
          </Link>

          {hasViewPermission("Types de documents") && (
            <li className="w-full">
              <Link
                to="/type_doc_UI"
                className={`flex w-full items-center justify-between rounded-xl p-3 bg-green-800/50 text-white hover:bg-emerald-600 hover:shadow-md transition-all duration-300 cursor-pointer`}
              >
                <div className="flex items-center">
                  <Layers3 size="22px" />
                  <span className="text-sm ml-2 font-medium">
                    Types de documents
                  </span>
                </div>
              </Link>
            </li>
          )}

          {hasViewPermission("Pieces") && (
            <li className="w-full">
              <Link
                to="/pieces_UI"
                className={`flex w-full items-center justify-between rounded-xl p-3 bg-green-800/50 text-white hover:bg-emerald-600 hover:shadow-md transition-all duration-300 cursor-pointer`}
              >
                <div className="flex items-center">
                  <Album size="22px" />
                  <span className="text-sm ml-2 font-medium">Pièces</span>
                </div>
              </Link>
            </li>
          )}

          {hasViewPermission("Meta-donnees") && (
            <li className="w-full">
              <Link
                to="/meta_UI"
                className={`flex w-full items-center justify-between rounded-xl p-3 bg-green-800/50 text-white hover:bg-emerald-600 hover:shadow-md transition-all duration-300 cursor-pointer`}
              >
                <div className="flex items-center">
                  <Zap size="22px" />
                  <span className="text-sm ml-2 font-medium">Méta-données</span>
                </div>
              </Link>
            </li>
          )}

          {/* Dossier section */}
          {hasViewPermission("Dossiers") && (
            <li className="w-full">
              <div
                onClick={() => setShowDocuments(!showDocuments)}
                className={`flex w-full items-center justify-between rounded-xl p-3 bg-green-800/50 text-white hover:bg-emerald-600 hover:shadow-md transition-all duration-300 cursor-pointer`}
              >
                <div className="flex items-center">
                  <BookMarked size="22px" />
                  <span className="text-sm ml-2 font-medium">Dossier</span>
                </div>
                {showDocuments ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </div>

              {showDocuments && (
                <div className="mt-2 ml-6 pl-3 border-l border-green-500">
                  {documentTypes.map((docType) => (
                    <Link
                      key={docType.id}
                      to={`/document_UI/${docType.id}`}
                      className="flex items-center gap-2 p-2 text-white text-sm rounded-lg hover:bg-green-700/50 transition-all duration-200 mt-1"
                    >
                      <Layers2 size={18} className="text-green-300" />
                      <span className="font-medium">{docType.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </li>
          )}
        </ul>
      </div>

      <div className="divider before:bg-green-500 after:bg-green-500 mt-auto"></div>
    </div>
  );
};

export default SideBar_UI;
