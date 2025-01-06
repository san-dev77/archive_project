import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Grid,
  BookMarked,
  Settings,
  ScanSearch,
  Search,
  Building2,
  Layers3,
  Network,
  ChevronDown,
  ChevronRight,
  X,
  BadgeInfo,
  Frown,
} from "lucide-react";
import axios from "axios";
import "daisyui/dist/full.css";
import logo from "../assets/icones/logo 3.jpg";

const SideBar = () => {
  const navigate = useNavigate();
  const [directories, setDirectories] = useState([]);
  const [showDirectories, setShowDirectories] = useState(false);
  const [expandedDirectory, setExpandedDirectory] = useState(null);
  const [, setShowMoreIndicator] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResultsMessage, setNoResultsMessage] = useState("");

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

    checkShowMoreIndicator();
    window.addEventListener("resize", checkShowMoreIndicator);

    return () => {
      window.removeEventListener("resize", checkShowMoreIndicator);
    };
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleDirectoriesClick = () => {
    setShowDirectories(!showDirectories);
  };

  const handleDirectoryClick = (directoryId) => {
    setExpandedDirectory(
      expandedDirectory === directoryId ? null : directoryId
    );
  };

  const handleSettingsClick = () => {
    navigate("/settings");
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

  const handleSearchClick = () => {
    setShowSearchModal(true);
  };

  return (
    <>
      <div className="sticky top-0 h-screen z-50 scrollbar-state bg-gray-800 shadow-lg flex flex-col justify-between items-center px-2 py-2 w-64">
        <div className="flex flex-col items-center space-y-4 w-full overflow-y-auto max-h-[80vh]">
          {/* Le logo */}
          <div className="flex p-6 h-[50px] text-left w-full items-start justify-start ">
            <div className="flex items-center justify-normal w-full gap-2 align-middle h-full">
              <img
                src={logo}
                alt="logo_BMS"
                className="w-12 h-12 rounded-full bg-white shadow-md"
              />
              <h1 className="text-white text-2x font-bold">
                Digi Doc solution
              </h1>
            </div>
          </div>
          {/* Le logo */}

          <div className="divider "></div>

          <ul className="menu p-0 w-full overflow-hidden">
            <li className="w-full">
              <div
                className="cursor-pointer p-2 text-white flex items-start justify-start gap-1 w-full rounded-lg bg-gray-800 hover:bg-gray-600 transition-colors duration-300"
                onClick={() => handleNavigate("/app-archive")}
              >
                <LayoutDashboard
                  color="white"
                  size="24px"
                  className="transition-transform duration-300 ease-in-out transform hover:scale-110"
                />
                <span className="text-sm ml-2">Dashboard</span>
              </div>
            </li>
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
                      onClick={handleSettingsClick}
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
            className="flex items-center justify-center p-2 rounded-lg cursor-pointer border-2 border-gray-100 transition-transform duration-300 ease-in-out transform hover:bg-gray-500"
            onClick={handleSettingsClick}
          >
            <Settings size={28} color="white" />
            <h1 className="text-white ml-2">Paramètres</h1>
          </div>
        </div>
      </div>
      {showSearchModal && (
        <div className="fixed inset-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl mx-4">
            <div className="flex text-black justify-between items-center mb-4">
              <Search className="" size={40} />

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
                className="bg-gray-600 text-white p-2 rounded-r hover:bg-gray-800 transition-colors duration-300"
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
              {noResultsMessage && (
                <div className="text-red-500 text-center font-bold text-2xl flex flex-col justify-center mt-4">
                  <Frown className="w-full flex justify-center" size={40} />

                  {noResultsMessage}
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
