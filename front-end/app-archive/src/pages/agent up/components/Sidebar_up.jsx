import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookMarked,
  Layers2,
  Layers3,
  ChevronDown,
  ChevronUp,
  Zap,
  Album,
  Users,
  Building2,
  FolderArchive,
} from "lucide-react";
import axios from "axios";
import "daisyui/dist/full.css";
import logo from "../../../assets/icones/logo 3.jpg";

const SideBar_up = () => {
  const [showDocuments, setShowDocuments] = useState(false);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
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

    // Charger les services
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:3000/services");
        setServices(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des services:", error);
      }
    };

    fetchDocumentTypes();
    fetchServices();
  }, []);

  return (
    <div className="z-50 sticky top-0 h-screen bg-gray-900 shadow-lg flex flex-col px-2 py-2 w-64">
      {/* Logo section */}
      <div className="flex p-6 h-[50px] items-center gap-2 mb-4">
        <img
          src={logo}
          alt="logo_BMS"
          className="w-12 h-12 rounded-full bg-white shadow-md"
        />
        <h1 className="text-white text-lg font-bold">Digi Doc</h1>
      </div>

      <div className="divider"></div>

      {/* Navigation Menu */}
      <nav className="flex flex-col gap-2">
        <Link
          to="/agent_up"
          className="flex items-center gap-2 p-3 text-white hover:bg-gray-800 rounded-lg"
        >
          <LayoutDashboard size={24} />
          <span>Dashboard</span>
        </Link>

        <Link
          to="/agent_data_up"
          className="flex items-center gap-2 p-3 text-white hover:bg-gray-800 rounded-lg"
        >
          <Users size={24} />
          <span>Gestion des agents</span>
        </Link>

        {/* Services section */}
        <Link
          to="/service_up"
          className="flex items-center gap-2 p-3 text-white hover:bg-gray-800 rounded-lg"
        >
          <Building2 size={24} />
          <span>Services</span>
        </Link>

        <Link
          to="/type_doc_up"
          className="flex items-center gap-2 p-3 text-white hover:bg-gray-800 rounded-lg"
        >
          <Layers3 size={24} />
          <span>Types de documents</span>
        </Link>

        <Link
          to="/piece_up"
          className="flex items-center gap-2 p-3 text-white hover:bg-gray-800 rounded-lg"
        >
          <Album size={24} />
          <span>Pièces</span>
        </Link>
        <Link
          to="/doc_up"
          className="flex items-center gap-2 p-3 text-white hover:bg-gray-800 rounded-lg"
        >
          <FolderArchive size={24} />
          <span>Dossiers</span>
        </Link>

        {/* <Link
          to="/meta_up"
          className="flex items-center gap-2 p-3 text-white hover:bg-gray-800 rounded-lg"
        >
          <Zap size={24} />
          <span>Méta-données</span>
        </Link> */}
      </nav>
    </div>
  );
};

export default SideBar_up;
