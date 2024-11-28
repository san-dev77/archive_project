import { useState } from "react";
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

const SideBar_UI = () => {
  const [showDocuments, setShowDocuments] = useState(false);
  const [documentTypes, setDocumentTypes] = useState([]);

  const handleDocumentsClick = async () => {
    setShowDocuments(!showDocuments);
    if (!showDocuments) {
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
    }
  };

  return (
    <div
      style={{
        transition: "transform 0.3s ease-in-out",
      }}
      className="relative mt-28 ml-2 h-[70vh] overflow-y-auto overflow-x-hidden scrollbar-state rounded-lg z-40 bg-gradient-to-b from-gray-600 to-gray-800 shadow-lg flex flex-col justify-between items-center py-2 w-64"
    >
      <div className="flex flex-col items-center space-y-4 w-full">
        <div className="cursor-pointer p-2 rounded-full bg-gray-800 hover:bg-gray-600 transition-colors duration-300">
          <LayoutDashboard
            color="white"
            size="24px"
            className="transition-transform duration-300 ease-in-out transform hover:scale-110"
          />
        </div>
        <div className="divider"></div>
        <ul className="menu p-0 w-full">
          <li className="w-full">
            <Link
              to="/type_doc_UI"
              className="flex w-full items-center text-white hover:text-yellow-300 transition-colors duration-300 ease-in-out transform hover:scale-105"
            >
              <Layers3 color="white" size="24px" />
              <span className="text-sm ml-2">Types de documents</span>
            </Link>
          </li>
          <li className="w-full">
            <Link
              to="/pieces_UI"
              className="flex w-full items-center text-white hover:text-yellow-300 transition-colors duration-300 ease-in-out transform hover:scale-105"
            >
              <Album color="white" size="24px" />
              <span className="text-sm ml-2">Pièces</span>
            </Link>
          </li>
          <li className="w-full">
            <Link
              to="/meta_UI"
              className="flex w-full items-center text-white hover:text-yellow-300 transition-colors duration-300 ease-in-out transform hover:scale-105"
            >
              <Zap color="white" size="24px" />
              <span className="text-sm ml-2">Méta-données</span>
            </Link>
          </li>
          <li className="w-full">
            <div
              onClick={handleDocumentsClick}
              className="flex w-full items-center justify-between text-white hover:text-yellow-300 transition-colors duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              <div className="flex items-center">
                <BookMarked color="white" size="24px" />
                <span className="text-sm ml-2">Dossier</span>
              </div>
              {showDocuments ? (
                <ChevronUp size="20px" />
              ) : (
                <ChevronDown size="20px" />
              )}
            </div>
            {showDocuments && (
              <ul className="pl-4 mt-2">
                {documentTypes.map((docType) => (
                  <li
                    key={docType.id}
                    className="text-white w-full hover:text-yellow-300 py-1"
                  >
                    <Link
                      to={`/document_UI/${docType.id}`}
                      className="flex items-center"
                    >
                      <Layers2 className="mr-2" size="20px" />
                      <span className="text-sm">{docType.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
        <div className="divider"></div>
      </div>
    </div>
  );
};

export default SideBar_UI;
