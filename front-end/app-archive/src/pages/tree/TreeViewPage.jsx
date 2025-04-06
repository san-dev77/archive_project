import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FolderIcon,
  ChevronDown,
  ChevronUp,
  FolderOpenIcon,
  FileTextIcon,
  DownloadIcon,
  EyeIcon,
  FileIcon,
  BarChart2,
  Clock,
  Calendar,
  Search,
  UploadIcon,
  FolderTree,
} from "lucide-react";
import Side_bar from "../../Components/Side_bar";
import TopBar from "../../Components/Top_bar";
import { Tooltip } from "@mui/material";
import { useQuery } from "react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const fetchTreeData = async () => {
  const response = await axios.get("http://localhost:3000/tree/tree");
  return response.data;
};

const fetchUploadsData = async () => {
  const response = await axios.get(
    "http://localhost:3000/tree/uploads-content"
  );
  return response.data;
};

const formatFileSize = (size) => {
  if (!size || size === 0) return "Espace occupé très faible";

  const units = ["o", "Ko", "Mo", "Go", "To"];
  let index = 0;
  let fileSize = size;

  while (fileSize >= 1024 && index < units.length - 1) {
    fileSize /= 1024;
    index++;
  }

  return `${fileSize.toFixed(2)} ${units[index]}`;
};

const TreeNode = ({ node, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const toggleOpen = () => {
    if (node.type === "directory") {
      setIsOpen(!isOpen);
    }
  };

  const toggleDetails = (e) => {
    e.stopPropagation();
    setShowDetails(!showDetails);
  };

  const handleFileClick = (path) => {
    console.log("Fichier sélectionné:", path);
    toast.info(`Fichier sélectionné: ${node.name}`);
  };

  const handleDownload = (e, path) => {
    e.stopPropagation();
    console.log("Téléchargement du fichier:", path);
    toast.success(`Téléchargement de ${node.name} démarré`);
  };

  const handlePreview = (e, path) => {
    e.stopPropagation();
    console.log("Aperçu du fichier:", path);
    toast.info(`Aperçu de ${node.name}`);
  };

  // Générer des statistiques fictives pour la démonstration
  const lastModified = new Date(
    Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
  );
  const formattedDate = format(lastModified, "dd MMM yyyy", { locale: fr });
  const accessCount = Math.floor(Math.random() * 100);

  // Calculer le nombre de fichiers pour les dossiers
  const fileCount =
    node.type === "directory" && node.children
      ? node.children.filter((child) => child.type === "file").length
      : 0;

  const folderCount =
    node.type === "directory" && node.children
      ? node.children.filter((child) => child.type === "directory").length
      : 0;

  const indent = level * 20;

  // Remplacer la ligne existante de fileSize par:
  const fileSize = formatFileSize(node.size);

  return (
    <div className="tree-node w-full mb-3">
      <div
        className={`node-content flex flex-col rounded-xl overflow-hidden shadow-lg transition-all duration-200 hover:shadow-2xl ${
          node.type === "directory"
            ? "bg-gradient-to-r from-[#1a2a3a] to-[#2a3a4a] hover:from-[#1d2d3d] hover:to-[#2d3d4d]"
            : "bg-gradient-to-r from-[#2a2a3a] to-[#3a3a4a] hover:from-[#2d2d3d] hover:to-[#3d3d4d]"
        }`}
        style={{ marginLeft: `${indent}px` }}
      >
        <div
          className="flex items-center p-5 cursor-pointer group"
          onClick={
            node.type === "directory"
              ? toggleOpen
              : () => handleFileClick(node.path)
          }
        >
          <div className="flex items-center flex-1">
            <div
              className={`icon-container p-3 rounded-full mr-4 transform transition-transform group-hover:scale-110 ${
                node.type === "directory"
                  ? "bg-blue-500/20"
                  : "bg-purple-500/20"
              }`}
            >
              {node.type === "directory" ? (
                isOpen ? (
                  <FolderOpenIcon size={28} className="text-[#00B7FF]" />
                ) : (
                  <FolderIcon size={28} className="text-[#00B7FF]" />
                )
              ) : (
                <FileTextIcon size={28} className="text-purple-400" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="node-name text-white font-medium text-lg tracking-wide">
                {node.name}
              </span>
              <div className="flex items-center mt-1 space-x-3">
                <span className="text-gray-400 text-xs">
                  {node.type === "directory"
                    ? `${fileCount} fichier${
                        fileCount !== 1 ? "s" : ""
                      }, ${folderCount} dossier${folderCount !== 1 ? "s" : ""}`
                    : fileSize}
                </span>
                <span className="text-gray-500 text-xs">•</span>
                <span className="text-gray-400 text-xs">{formattedDate}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              className="p-2.5 text-gray-400 hover:text-white hover:bg-[#505050] rounded-full transition-all duration-200 transform hover:scale-105"
              onClick={toggleDetails}
            >
              <BarChart2 size={20} />
            </button>

            {node.type === "file" && (
              <>
                <Tooltip title="Aperçu">
                  <button
                    className="p-2.5 text-gray-400 hover:text-[#00B7FF] hover:bg-[#505050] rounded-full transition-all duration-200 transform hover:scale-105"
                    onClick={(e) => handlePreview(e, node.path)}
                  >
                    <EyeIcon size={20} />
                  </button>
                </Tooltip>
                <Tooltip title="Télécharger">
                  <button
                    className="p-2.5 text-gray-400 hover:text-[#00B7FF] hover:bg-[#505050] rounded-full transition-all duration-200 transform hover:scale-105"
                    onClick={(e) => handleDownload(e, node.path)}
                  >
                    <DownloadIcon size={20} />
                  </button>
                </Tooltip>
              </>
            )}

            {node.type === "directory" && (
              <span className="text-gray-400 transition-transform duration-200">
                {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </span>
            )}
          </div>
        </div>

        {showDetails && (
          <div className="bg-[#1a1a1a] p-5 border-t border-gray-700/50">
            <div className="grid grid-cols-3 gap-5">
              <div className="stat-card bg-[#2a2a2a] p-4 rounded-xl hover:bg-[#2d2d2d] transition-colors duration-200">
                <div className="flex items-center text-gray-400 mb-2">
                  <Calendar size={16} className="mr-2" />
                  <span className="text-sm">Date de modification</span>
                </div>
                <div className="text-white font-medium">{formattedDate}</div>
              </div>

              <div className="stat-card bg-[#2a2a2a] p-4 rounded-xl hover:bg-[#2d2d2d] transition-colors duration-200">
                <div className="flex items-center text-gray-400 mb-2">
                  <Clock size={16} className="mr-2" />
                  <span className="text-sm">Taille</span>
                </div>
                <div className="text-white font-medium">{fileSize}</div>
              </div>

              <div className="stat-card bg-[#2a2a2a] p-4 rounded-xl hover:bg-[#2d2d2d] transition-colors duration-200">
                <div className="flex items-center text-gray-400 mb-2">
                  <BarChart2 size={16} className="mr-2" />
                  <span className="text-sm">Nombre d'accès</span>
                </div>
                <div className="text-white font-medium">{accessCount} fois</div>
              </div>
            </div>

            {node.type === "directory" && node.children && (
              <div className="mt-4 p-4 bg-[#2a2a2a] rounded-xl">
                <div className="flex items-center text-gray-400 mb-3">
                  <FileIcon size={16} className="mr-2" />
                  <span className="text-sm">Contenu du dossier</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {node.children.slice(0, 5).map((child, idx) => (
                    <span
                      key={idx}
                      className={`text-sm px-3 py-1.5 rounded-full transition-colors duration-200 ${
                        child.type === "directory"
                          ? "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                          : "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                      }`}
                    >
                      {child.name}
                    </span>
                  ))}
                  {node.children.length > 5 && (
                    <span className="text-sm px-3 py-1.5 rounded-full bg-gray-500/20 text-gray-300 hover:bg-gray-500/30 transition-colors duration-200">
                      +{node.children.length - 5} plus
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {isOpen && node.children && node.children.length > 0 && (
        <div className="children mt-3">
          {node.children.map((child, index) => (
            <TreeNode
              key={`${child.name}-${index}`}
              node={child}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const TreeViewPage = () => {
  const [searchText, setSearchText] = useState("");
  const [viewMode, setViewMode] = useState("tree"); // tree ou grid
  const [activeTab, setActiveTab] = useState("archives"); // archives ou uploads

  const {
    data: treeData = [],
    isLoading: isTreeLoading,
    error: treeError,
  } = useQuery("treeData", fetchTreeData, {
    refetchOnWindowFocus: false,
  });

  const {
    data: uploadsData = {},
    isLoading: isUploadsLoading,
    error: uploadsError,
  } = useQuery("uploadsData", fetchUploadsData, {
    refetchOnWindowFocus: false,
  });

  // Fonction récursive pour rechercher dans l'arborescence
  const searchInTree = (nodes, searchTerm) => {
    if (!nodes) return [];

    return nodes.filter((node) => {
      const nameMatch = node.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Si c'est un dossier, rechercher aussi dans les enfants
      if (node.type === "directory" && node.children) {
        const matchingChildren = searchInTree(node.children, searchTerm);
        // Si des enfants correspondent, on clone le nœud avec seulement les enfants correspondants
        if (matchingChildren.length > 0) {
          return true;
        }
      }

      return nameMatch;
    });
  };

  const filteredTreeData = searchText
    ? searchInTree(treeData, searchText)
    : treeData;

  // Préparer les données d'uploads pour l'affichage
  const getUploadsTreeData = () => {
    if (!uploadsData || Object.keys(uploadsData).length === 0) return [];

    // Créer une structure d'arbre pour les uploads et agence_uploads
    return Object.keys(uploadsData).map((key) => {
      if (uploadsData[key].error) {
        return {
          name: key,
          type: "directory",
          size: 0,
          children: [],
          error: uploadsData[key].error,
        };
      }

      return {
        name: key,
        type: "directory",
        size: uploadsData[key].size,
        children: uploadsData[key].content || [],
      };
    });
  };

  const uploadsTreeData = getUploadsTreeData();
  const filteredUploadsData = searchText
    ? searchInTree(uploadsTreeData, searchText)
    : uploadsTreeData;

  // Fonction pour obtenir un gradient de couleur basé sur l'utilisation de l'espace
  const getSpaceUsageGradient = (size) => {
    const sizeInMB = size / (1024 * 1024);
    if (sizeInMB < 10) return "from-emerald-600 to-emerald-800";
    if (sizeInMB < 100) return "from-blue-600 to-blue-800";
    if (sizeInMB < 500) return "from-amber-500 to-amber-700";
    return "from-rose-600 to-rose-800";
  };

  // Fonction pour obtenir une icône basée sur l'utilisation de l'espace
  const getSpaceUsageIcon = (size) => {
    const sizeInMB = size / (1024 * 1024);
    if (sizeInMB < 10) return "text-emerald-400";
    if (sizeInMB < 100) return "text-blue-400";
    if (sizeInMB < 500) return "text-amber-400";
    return "text-rose-400";
  };

  // Fonction pour obtenir un message de recommandation
  const getSpaceUsageRecommendation = (size) => {
    const sizeInMB = size / (1024 * 1024);
    if (sizeInMB < 10) return "Espace utilisé optimal";
    if (sizeInMB < 100) return "Utilisation normale";
    if (sizeInMB < 500) return "Envisagez un nettoyage";
    return "Nettoyage recommandé";
  };

  // Calculer l'espace total utilisé
  const totalSpace = Object.keys(uploadsData).reduce((total, key) => {
    if (uploadsData[key].error) return total;
    return total + (uploadsData[key].size || 0);
  }, 0);

  const totalSpaceFormatted = formatFileSize(totalSpace);

  return (
    <div className="flex min-h-screen bg-slate-300">
      <Side_bar isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar position="fixed" title="Explorateur de fichiers" />
        <div className="container w-full mx-auto px-4 py-8 mt-20">
          <div className="bg-slate-800 w-full rounded-xl shadow-2xl p-6 border border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <FolderIcon className="h-8 w-8 text-cyan-400 mr-2" />
                Explorateur de fichiers
              </h1>
            </div>

            <div className="mb-6 border-b border-slate-600">
              <div className="flex space-x-1">
                <button
                  className={`px-6 py-3 rounded-t-lg transition-all duration-300 flex items-center ${
                    activeTab === "archives"
                      ? "bg-slate-900 text-cyan-400 border-b-2 border-cyan-400 transform -translate-y-1"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                  onClick={() => setActiveTab("archives")}
                >
                  <FolderTree className="h-5 w-5 mr-2" />
                  Arborescence
                </button>
                <button
                  className={`px-6 py-3 rounded-t-lg transition-all duration-300 flex items-center ${
                    activeTab === "uploads"
                      ? "bg-slate-900 text-cyan-400 border-b-2 border-cyan-400 transform -translate-y-1"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                  onClick={() => setActiveTab("uploads")}
                >
                  <UploadIcon className="h-5 w-5 mr-2" />
                  Uploads
                </button>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher un fichier ou dossier..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                      viewMode === "tree"
                        ? "bg-cyan-600 text-white"
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                    onClick={() => setViewMode("tree")}
                  >
                    Vue Liste
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                      viewMode === "grid"
                        ? "bg-cyan-600 text-white"
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                    onClick={() => setViewMode("grid")}
                  >
                    Grille
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 shadow-inner border border-slate-800">
              {activeTab === "archives" ? (
                isTreeLoading ? (
                  <div className="flex flex-col justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-600 border-t-cyan-400 mb-4"></div>
                    <p className="text-white text-lg">
                      Chargement des archives...
                    </p>
                  </div>
                ) : treeError ? (
                  <div className="text-center text-rose-500 p-4 bg-rose-900/20 rounded-lg border border-rose-800">
                    Une erreur est survenue lors du chargement des données
                  </div>
                ) : filteredTreeData.length === 0 ? (
                  <div className="text-center text-white p-6 bg-slate-800/50 rounded-lg">
                    Aucun fichier ou dossier trouvé
                  </div>
                ) : viewMode === "tree" ? (
                  <div className="space-y-4">
                    {filteredTreeData.map((node, index) => (
                      <TreeNode key={`${node.name}-${index}`} node={node} />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTreeData.map((node, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg shadow-md cursor-pointer transition-all duration-200 bg-gradient-to-r from-slate-700 to-slate-800 border border-slate-700"
                        onClick={() => {
                          if (node.type === "file") {
                            handleFileClick(node.path);
                          } else if (node.type === "directory") {
                            setViewMode("tree");
                          }
                        }}
                      >
                        <div className="flex items-center">
                          <div className="p-3 rounded-full mr-3 bg-slate-600/50">
                            {node.type === "directory" ? (
                              <FolderIcon size={24} className="text-cyan-400" />
                            ) : (
                              <FileTextIcon
                                size={24}
                                className="text-purple-400"
                              />
                            )}
                          </div>
                          <div>
                            <h3 className="text-white font-medium">
                              {node.name}
                            </h3>
                            <p className="text-slate-300 text-xs">
                              {node.type === "directory"
                                ? "Dossier"
                                : "Fichier"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : isUploadsLoading ? (
                <div className="flex flex-col justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-600 border-t-cyan-400 mb-4"></div>
                  <p className="text-white text-lg">
                    Chargement des uploads...
                  </p>
                </div>
              ) : uploadsError ? (
                <div className="text-center text-rose-500 p-4 bg-rose-900/20 rounded-lg border border-rose-800">
                  Une erreur est survenue lors du chargement des données
                  d'uploads
                </div>
              ) : filteredUploadsData.length === 0 ? (
                <div className="text-center text-white p-6 bg-slate-800/50 rounded-lg">
                  Aucun fichier ou dossier trouvé dans les uploads
                </div>
              ) : (
                <div>
                  <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 mb-6">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <BarChart2 className="h-6 w-6 text-cyan-400 mr-2" />
                      Tableau de bord de l'espace disque
                    </h2>

                    <div className="bg-slate-700/50 rounded-lg p-4 mb-4 border border-slate-600">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-medium text-white">
                          Espace total utilisé
                        </h3>
                        <span className="text-lg font-bold text-white bg-slate-900/70 px-3 py-1 rounded-full">
                          {totalSpaceFormatted}
                        </span>
                      </div>

                      <div className="w-full bg-slate-800 rounded-full h-3 mb-3">
                        <div
                          className="h-3 rounded-full bg-cyan-600"
                          style={{
                            width: `${Math.min(
                              (totalSpace / (1024 * 1024 * 1024)) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-slate-800/70 p-3 rounded-lg">
                          <div className="text-slate-300 text-xs mb-1">
                            Fichiers
                          </div>
                          <div className="text-white font-medium">
                            {Object.keys(uploadsData).reduce((count, key) => {
                              if (uploadsData[key].error) return count;
                              return (
                                count +
                                (uploadsData[key].content?.filter(
                                  (item) => item.type === "file"
                                ).length || 0)
                              );
                            }, 0)}
                          </div>
                        </div>

                        <div className="bg-slate-800/70 p-3 rounded-lg">
                          <div className="text-slate-300 text-xs mb-1">
                            Dossiers
                          </div>
                          <div className="text-white font-medium">
                            {Object.keys(uploadsData).reduce((count, key) => {
                              if (uploadsData[key].error) return count;
                              return (
                                count +
                                (uploadsData[key].content?.filter(
                                  (item) => item.type === "directory"
                                ).length || 0)
                              );
                            }, 0)}
                          </div>
                        </div>

                        <div className="bg-slate-800/70 p-3 rounded-lg">
                          <div className="text-slate-300 text-xs mb-1">
                            Dernière analyse
                          </div>
                          <div className="text-white font-medium">
                            {format(new Date(), "dd/MM/yyyy", { locale: fr })}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.keys(uploadsData).map((key) => {
                        if (uploadsData[key].error) return null;

                        const size = uploadsData[key].size;
                        const sizeText = formatFileSize(size);
                        const gradientClass = getSpaceUsageGradient(size);
                        const recommendation =
                          getSpaceUsageRecommendation(size);
                        const percentage = Math.min(
                          Math.floor((size / (1024 * 1024 * 1024)) * 100),
                          100
                        );

                        return (
                          <div
                            key={key}
                            className={`bg-gradient-to-r ${gradientClass} rounded-lg p-5 shadow-md border border-slate-700`}
                          >
                            <div className="flex justify-between items-center mb-3">
                              <h3 className="text-lg font-medium text-white">
                                {key}
                              </h3>
                              <span className="text-sm font-bold text-white bg-black/30 px-3 py-1 rounded-full">
                                {sizeText}
                              </span>
                            </div>

                            <div className="relative w-full bg-black/30 rounded-full h-3 mb-3">
                              <div
                                className="h-3 rounded-full bg-white/70"
                                style={{ width: `${percentage}%` }}
                              ></div>
                              <div className="absolute -top-6 right-0 text-xs text-white/80"></div>
                            </div>

                            <div className="mt-3 pt-3 border-t border-white/10">
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-white mr-2"></div>
                                <span className="text-xs text-white/90">
                                  {recommendation}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {viewMode === "tree" ? (
                    <div className="space-y-4">
                      {filteredUploadsData.map((node, index) => (
                        <TreeNode key={`${node.name}-${index}`} node={node} />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredUploadsData.map((node, index) => {
                        const gradientClass = getSpaceUsageGradient(
                          node.size || 0
                        );

                        return (
                          <div
                            key={index}
                            className={`p-5 rounded-xl shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border border-slate-700 bg-gradient-to-r ${gradientClass}`}
                            onClick={() => {
                              if (node.type === "file") {
                                handleFileClick(node.path);
                              } else if (node.type === "directory") {
                                setViewMode("tree");
                              }
                            }}
                          >
                            <div className="flex items-center mb-3">
                              <div className="p-3 rounded-full mr-3 bg-black/30">
                                <FolderIcon size={24} className="text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-white font-medium truncate">
                                  {node.name}
                                </h3>
                                <p className="text-white/70 text-xs">
                                  {formatFileSize(node.size)} •{" "}
                                  {node.children?.length || 0} éléments
                                </p>
                              </div>
                            </div>

                            <div className="w-full bg-black/30 rounded-full h-2 mb-2">
                              <div
                                className="h-2 rounded-full bg-white/70"
                                style={{
                                  width: `${Math.min(
                                    (node.size / (1024 * 1024 * 100)) * 100,
                                    100
                                  )}%`,
                                }}
                              ></div>
                            </div>

                            <div className="flex justify-between text-xs text-white/70 mt-3">
                              <span>
                                {getSpaceUsageRecommendation(node.size)}
                              </span>
                              <span>{format(new Date(), "dd/MM/yyyy")}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
};

export default TreeViewPage;
