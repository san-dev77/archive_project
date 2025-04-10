import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Grid,
  BookMarked,
  ScanSearch,
  Search,
  Layers3,
  Network,
  X,
  BadgeInfo,
  Frown,
  UsersRound,
  ChartNoAxesCombined,
} from "lucide-react";
import axios from "axios";
import "daisyui/dist/full.css";
import logo from "../assets/icones/logo 3.jpg";

const SideBar = () => {
  const navigate = useNavigate();
  const [directories, setDirectories] = useState([]);

  const [, setShowMoreIndicator] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResultsMessage, setNoResultsMessage] = useState("");
  const [activeItem, setActiveItem] = useState("");

  useEffect(() => {
    const fetchDirectories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/services/directory"
        );
        setDirectories(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des directories:", error);
      }
    };

    fetchDirectories();

    const checkShowMoreIndicator = () => {
      const settingsList = document.querySelector(".settings-list");
      if (
        settingsList &&
        settingsList.scrollHeight > settingsList.clientHeight
      ) {
        setShowMoreIndicator(true);
      } else {
        setShowMoreIndicator(false);
      }
    };

    // Set active item based on current path
    const path = window.location.pathname;
    setActiveItem(path);

    checkShowMoreIndicator();
    window.addEventListener("resize", checkShowMoreIndicator);

    return () => {
      window.removeEventListener("resize", checkShowMoreIndicator);
    };
  }, []);

  const handleNavigate = (path) => {
    setActiveItem(path);
    navigate(path);
  };

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setNoResultsMessage("Veuillez entrer un terme de recherche.");
      return;
    }

    const results = directories.flatMap((directory) =>
      directory.services
        .split("|")
        .map((serviceString) => JSON.parse(serviceString))
        .filter((service) =>
          service.nom_service.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((service) => ({
          ...service,
          directory: directory.nom_directory,
        }))
    );

    setSearchResults(results);
    setNoResultsMessage(results.length === 0 ? "Aucun service trouvé." : "");
  };

  const handleServiceClick = (serviceId) => {
    navigate(`/doc_n_type/${serviceId}`);
    setShowSearchModal(false);
  };

  return (
    <>
      <div className="sticky top-0 h-screen overflow-x-hidden scrollbar-state z-20 bg-gradient-to-b from-green-700 to-green-900 shadow-2xl flex flex-col justify-between items-center px-4 py-4 w-64">
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
            <div
              className={`cursor-pointer flex items-center justify-start gap-1 w-full rounded-xl p-3 ${
                activeItem === "/app-archive"
                  ? "bg-emerald-500 text-white shadow-lg"
                  : "bg-green-800/50 text-white hover:bg-emerald-600 hover:shadow-md"
              } transition-all duration-300`}
              onClick={() => handleNavigate("/app-archive")}
            >
              <LayoutDashboard
                size="22px"
                className="transition-transform duration-300 ease-in-out transform group-hover:scale-110"
              />
              <span className="text-sm ml-2 font-medium">Dashboard</span>
            </div>

            <li className="w-full">
              <div
                onClick={() => handleNavigate("/services")}
                className={`flex w-full items-center justify-between rounded-xl p-3 ${
                  activeItem === "/services"
                    ? "bg-emerald-500 text-white shadow-lg"
                    : "bg-green-800/50 text-white hover:bg-emerald-600 hover:shadow-md"
                } transition-all duration-300 cursor-pointer`}
              >
                <div className="flex items-center">
                  <Network size="22px" />
                  <span className="text-sm ml-2 font-medium">Directions</span>
                </div>
              </div>
            </li>

            <li className="w-full">
              <div
                onClick={() => handleNavigate("/document-types")}
                className={`flex w-full items-center justify-between rounded-xl p-3 ${
                  activeItem === "/document-types"
                    ? "bg-emerald-500 text-white shadow-lg"
                    : "bg-green-800/50 text-white hover:bg-emerald-600 hover:shadow-md"
                } transition-all duration-300 cursor-pointer`}
              >
                <div className="flex items-center">
                  <Layers3 size="22px" />
                  <span className="text-sm ml-2 font-medium">
                    Types de documents
                  </span>
                </div>
              </div>
            </li>

            <li className="w-full">
              <div
                onClick={() => handleNavigate("/create-piece")}
                className={`flex w-full items-center rounded-xl p-3 ${
                  activeItem === "/create-piece"
                    ? "bg-emerald-500 text-white shadow-lg"
                    : "bg-green-800/50 text-white hover:bg-emerald-600 hover:shadow-md"
                } transition-all duration-300 cursor-pointer`}
              >
                <Grid size="22px" />
                <span className="text-sm ml-2 font-medium">Pièces</span>
              </div>
            </li>

            <li className="w-full">
              <div
                onClick={() => handleNavigate("/documents")}
                className={`flex w-full items-center rounded-xl p-3 ${
                  activeItem === "/documents"
                    ? "bg-emerald-500 text-white shadow-lg"
                    : "bg-green-800/50 text-white hover:bg-emerald-600 hover:shadow-md"
                } transition-all duration-300 cursor-pointer`}
              >
                <BookMarked size="22px" />
                <span className="text-sm ml-2 font-medium">Dossier</span>
              </div>
            </li>

            <li className="w-full">
              <div
                onClick={() => handleNavigate("/search")}
                className={`flex w-full items-center rounded-xl p-3 ${
                  activeItem === "/search"
                    ? "bg-emerald-500 text-white shadow-lg"
                    : "bg-green-800/50 text-white hover:bg-emerald-600 hover:shadow-md"
                } transition-all duration-300 cursor-pointer`}
              >
                <ScanSearch size="22px" />
                <span className="text-sm ml-2 font-medium">Rechercher</span>
              </div>
            </li>

            <li className="w-full">
              <div
                onClick={() => handleNavigate("/users")}
                className={`flex w-full items-center rounded-xl p-3 ${
                  activeItem === "/users"
                    ? "bg-emerald-500 text-white shadow-lg"
                    : "bg-green-800/50 text-white hover:bg-emerald-600 hover:shadow-md"
                } transition-all duration-300 cursor-pointer`}
              >
                <UsersRound size="22px" />
                <span className="text-sm ml-2 font-medium">Utilisateurs</span>
              </div>
            </li>

            <li className="w-full">
              <div
                onClick={() => handleNavigate("/suivi")}
                className={`flex w-full items-center rounded-xl p-3 ${
                  activeItem === "/suivi"
                    ? "bg-emerald-500 text-white shadow-lg"
                    : "bg-green-800/50 text-white hover:bg-emerald-600 hover:shadow-md"
                } transition-all duration-300 cursor-pointer`}
              >
                <ChartNoAxesCombined size="22px" />
                <span className="text-sm ml-2 font-medium">Suivi</span>
              </div>
            </li>
          </ul>

          <div className="divider before:bg-green-500 after:bg-green-500"></div>

          <div
            onClick={() => setShowSearchModal(true)}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl p-3 flex items-center justify-center cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 mt-auto"
          >
            <Search size="20px" className="mr-2" />
            <span className="font-medium">Recherche rapide</span>
          </div>
        </div>
      </div>

      {showSearchModal && (
        <div className="fixed inset-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl w-full max-w-2xl mx-4 shadow-2xl border-2 border-green-500">
            <div className="flex text-black justify-between items-center mb-4">
              <Search className="text-green-600" size={32} />
              <h2 className="text-2xl font-bold text-green-800">
                Recherche de services
              </h2>
              <button
                onClick={() => setShowSearchModal(false)}
                className="text-gray-500 hover:text-red-600 transition-colors duration-300"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un service..."
                className="flex-grow p-3 border-2 border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-300 rounded-l-lg outline-none transition-all duration-300"
              />
              <button
                onClick={handleSearch}
                className="bg-green-600 text-white p-3 rounded-r-lg hover:bg-green-700 transition-colors duration-300 font-medium"
              >
                Rechercher
              </button>
            </div>
            <div className="mt-4 max-h-[60vh] overflow-y-auto">
              {searchResults.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleServiceClick(service.id)}
                  className="p-4 mb-2 bg-green-50 rounded-lg hover:bg-green-100 cursor-pointer transition-colors duration-300 border border-green-200"
                >
                  <div className="font-semibold flex items-center text-lg text-green-800">
                    <BadgeInfo className="mr-2" color="#047857" size={18} />
                    {service.nom_service}
                  </div>
                  <div className="text-sm text-gray-600 ml-6">
                    Direction: {service.directory}
                  </div>
                </div>
              ))}
              {noResultsMessage && (
                <div className="text-red-500 text-center font-bold text-2xl flex flex-col justify-center mt-4">
                  <Frown
                    className="w-full flex justify-center text-red-400"
                    size={48}
                  />
                  <p className="mt-2">{noResultsMessage}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SideBar;
