import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Grid,
  BookMarked,
  Settings,
  ScanSearch,
  DatabaseZap,
  UserCheck,
  UserPlus2,
  Search,
  Building2,
  Layers3,
  Network,
  ChevronDown,
  ChevronRight,
  X,
  BadgeInfo,
} from "lucide-react";
import axios from "axios";
import "daisyui/dist/full.css";

const SideBar = () => {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(() => {
    // Initial state from local storage
    const savedState = localStorage.getItem("showSettings");
    return savedState === "true";
  });
  const [directories, setDirectories] = useState([]);
  const [showDirectories, setShowDirectories] = useState(false);
  const [expandedDirectory, setExpandedDirectory] = useState(null);
  const [showMoreIndicator, setShowMoreIndicator] = useState(false);
  const settingsListRef = useRef(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchDirectories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/services/directory"
        );
        console.log("response", response.data);

        console.log(response.data);
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

    checkShowMoreIndicator();
    window.addEventListener("resize", checkShowMoreIndicator);

    return () => {
      window.removeEventListener("resize", checkShowMoreIndicator);
    };
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleSettingsClick = () => {
    const newShowSettings = !showSettings;
    setShowSettings(newShowSettings);
    localStorage.setItem("showSettings", newShowSettings); // Save state to local storage
  };

  const handleDirectoriesClick = () => {
    setShowDirectories(!showDirectories);
  };

  const handleDirectoryClick = (directoryId) => {
    setExpandedDirectory(
      expandedDirectory === directoryId ? null : directoryId
    );
  };

  const handleSettingsDoubleClick = () => {
    navigate("/parametres");
  };

  const handleSearch = () => {
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
  };

  const handleServiceClick = (serviceId) => {
    navigate(`/doc_n_type/${serviceId}`);
    setShowSearchModal(false);
  };

  const handleSearchClick = () => {
    setShowSearchModal(true);
  };

  useEffect(() => {
    if (showSettings && settingsListRef.current) {
      settingsListRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [showSettings]);

  return (
    <>
      <div className="sticky top-28 ml-2 h-[70vh] overflow-y-auto overflow-x-hidden scrollbar-state rounded-lg z-20 bg-gradient-to-b from-gray-500 to-gray-800 shadow-lg flex flex-col justify-between items-center px-2 py-2 w-64">
        <div className="flex flex-col items-center space-y-4 w-full">
          <div
            className="cursor-pointer p-2 rounded-full bg-gray-800 hover:bg-gray-600 transition-colors duration-300"
            onClick={() => handleNavigate("/app-archive")}
          >
            <LayoutDashboard
              color="white"
              size="24px"
              className="transition-transform duration-300 ease-in-out transform hover:scale-110"
            />
          </div>
          <div className="divider "></div>
          <ul className="menu p-0 w-full">
            <li className="w-full">
              <div
                onClick={handleDirectoriesClick}
                className="flex w-full items-center justify-between text-white hover:text-yellow-300 transition-colors duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              >
                <div className="flex items-center">
                  <Network color="white" size="24px" />
                  <span className="text-sm ml-2">Directions</span>
                </div>
                <div className="flex items-center ">
                  {showDirectories ? (
                    <ChevronDown
                      size={16}
                      className="transition-transform duration-300 ease-in-out transform hover:scale-110"
                    />
                  ) : (
                    <ChevronRight
                      size={16}
                      className="transition-transform duration-300 ease-in-out transform hover:scale-110"
                    />
                  )}
                  <Link to="/services" className="flex items-center ml-2">
                    <Settings
                      color="white"
                      className="transition-transform duration-300 ease-in-out transform hover:scale-110"
                      size="20px"
                    />
                  </Link>
                  <div
                    onClick={handleSearchClick}
                    className="ml-2 cursor-pointer"
                  >
                    <Search
                      color="white"
                      className="transition-transform duration-300 ease-in-out transform hover:scale-110"
                      size="20px"
                    />
                  </div>
                </div>
              </div>
              {showDirectories && (
                <ul className="pl-4 w-full">
                  {directories.map((directory) => (
                    <li
                      key={directory.directory_id}
                      className="text-white w-full"
                    >
                      <div
                        onClick={() =>
                          handleDirectoryClick(directory.directory_id)
                        }
                        className="flex items-center cursor-pointer hover:text-yellow-300"
                      >
                        {expandedDirectory === directory.directory_id ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                        <Building2 className="ml-2 mr-2" size="20px" />
                        {directory.nom_directory}
                      </div>
                      {expandedDirectory === directory.directory_id && (
                        <ul className="pl-6">
                          {directory.services &&
                            directory.services
                              .split("|")
                              .map((serviceString) => {
                                const service = JSON.parse(serviceString);
                                return (
                                  <li
                                    key={service.id}
                                    className="text-white hover:text-yellow-300 pl-4 border-l-2 border-gray-500"
                                  >
                                    <Link
                                      to={`/doc_n_type/${service.id}`}
                                      className="flex items-center"
                                    >
                                      <BadgeInfo className="mr-2" size="16px" />
                                      <span
                                        className="max-w-xs overflow-hidden whitespace-nowrap overflow-ellipsis"
                                        title={service.nom_service}
                                      >
                                        {service.nom_service}
                                      </span>
                                    </Link>
                                  </li>
                                );
                              })}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li className="w-full">
              <Link
                to="/document-types"
                className="flex w-full items-center text-white hover:text-yellow-300 transition-colors duration-300 ease-in-out transform hover:scale-105"
              >
                <Layers3 color="white" size="24px" />
                <span className="text-sm ml-2">Types de documents</span>
              </Link>
            </li>
            <li className="w-full">
              <Link
                to="/create-piece"
                className="flex w-full items-center text-white hover:text-yellow-300 transition-colors duration-300 ease-in-out transform hover:scale-105"
              >
                <Grid color="white" size="24px" />
                <span className="text-sm ml-2">Pièces</span>
              </Link>
            </li>
            <li className="w-full">
              <Link
                to="/documents"
                className="flex w-full items-center text-white hover:text-yellow-300 transition-colors duration-300 ease-in-out transform hover:scale-105"
              >
                <BookMarked color="white" size="24px" />
                <span className="text-sm ml-2">Dossier</span>
              </Link>
            </li>
            <li className="w-full">
              <Link
                to="/search"
                className="flex w-full items-center text-white hover:text-yellow-300 transition-colors duration-300 ease-in-out transform hover:scale-105"
              >
                <ScanSearch color="white" size="24px" />
                <span className="text-sm ml-2">Rechercher</span>
              </Link>
            </li>
          </ul>
          <div className="divider"></div>
        </div>
        <div className="w-full">
          <div
            className="flex items-center justify-center p-2  rounded-full cursor-pointer border-2 border-gray-100  transition-transform duration-300 ease-in-out transform hover:bg-gray-500  "
            onClick={handleSettingsClick}
            onDoubleClick={handleSettingsDoubleClick}
          >
            <Settings size={28} color="white" />
            <h1 className="text-white ml-2">Paramètres</h1>
          </div>
          <div
            className={`mt-4 settings-list relative ${
              showSettings ? "block" : "hidden"
            }`}
            ref={settingsListRef}
          >
            <ul className="menu p-0 w-full">
              <li className="w-full">
                <button
                  onClick={() => handleNavigate("/profil")}
                  className="flex w-full items-center text-white hover:text-yellow-300 transition-colors duration-300 ease-in-out transform hover:scale-105"
                >
                  <span className="text-sm ml-2 flex items-center">
                    <UserCheck className="mr-2" />
                    Gestion profil
                  </span>
                </button>
              </li>
              <li className="w-full">
                <button
                  onClick={() => handleNavigate("/users")}
                  className="flex w-full items-center text-white hover:text-yellow-300 transition-colors duration-300 ease-in-out transform hover:scale-105"
                >
                  <span className="text-sm ml-2 flex items-center">
                    <UserPlus2 className="mr-2" />
                    Création utilisateurs
                  </span>
                </button>
              </li>
              <li className="w-full">
                <button
                  onClick={() => handleNavigate("/metadata")}
                  className="flex w-full items-center text-white hover:text-yellow-300 transition-colors duration-300 ease-in-out transform hover:scale-105"
                >
                  <span className="text-sm ml-2 flex items-center">
                    <DatabaseZap className="mr-2" />
                    Gestion méta-données
                  </span>
                </button>
              </li>
              <li className="w-full">
                <button
                  onClick={() => handleNavigate("/pieces")}
                  className="flex w-full items-center text-white hover:text-yellow-300 transition-colors duration-300 ease-in-out transform hover:scale-105"
                >
                  <span className="text-sm ml-2 flex items-center">
                    <Grid className="mr-2" />
                    Configuration des pièces
                  </span>
                </button>
              </li>
              <li className="w-full">
                <button
                  onClick={() => handleNavigate("/userRoles")}
                  className="flex w-full items-center text-white hover:text-yellow-300 transition-colors duration-300 ease-in-out transform hover:scale-105"
                >
                  <span className="text-sm ml-2 flex items-center">
                    <UserCheck className="mr-2" />
                    Fonctions agent
                  </span>
                </button>
              </li>
              <li className="w-full">
                <button
                  onClick={() => handleNavigate("/tree")}
                  className="flex w-full items-center text-white hover:text-yellow-300 transition-colors duration-300 ease-in-out transform hover:scale-105"
                >
                  <span className="text-sm ml-2 flex items-center">
                    <Grid className="mr-2" />
                    Structure système
                  </span>
                </button>
              </li>
              <li className="w-full">
                <button
                  onClick={() => handleNavigate("/search-config")}
                  className="flex w-full items-center text-white hover:text-yellow-300 transition-colors duration-300 ease-in-out transform hover:scale-105"
                >
                  <span className="text-sm ml-2 flex items-center">
                    <Search className="mr-2" />
                    Moteur de recherche
                  </span>
                </button>
              </li>
            </ul>
            {showMoreIndicator && (
              <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                <span className="text-white">▼</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {showSearchModal && (
        <div className="fixed inset-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Recherche de services</h2>
              <button
                onClick={() => setShowSearchModal(false)}
                className="text-gray-500 hover:text-gray-700"
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
                className="flex-grow p-2 border border-gray-300 rounded-l"
              />
              <button
                onClick={handleSearch}
                className="bg-blue-400 text-white p-2 rounded-r hover:bg-blue-800 transition-colors duration-300"
              >
                Rechercher
              </button>
            </div>
            <div className="mt-4 max-h-[60vh] overflow-y-auto">
              {searchResults.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleServiceClick(service.id)}
                  className="p-4 mb-2 bg-gray-300 rounded hover:bg-gray-200 cursor-pointer transition-colors duration-300"
                >
                  <div className="font-semibold flex items-center text-lg text-black">
                    <BadgeInfo className="mr-2" color="black" size="16px" />
                    {service.nom_service}
                  </div>
                  <div className="text-sm text-gray-600">
                    Direction: {service.directory}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SideBar;
