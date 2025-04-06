import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Zap,
  X,
  DatabaseZap,
  FolderTree,
  Folder,
  StretchHorizontal,
  Menu,
  LayoutGrid,
  FolderCheck,
  SearchCheckIcon,
  ListTodo,
  Building2,
} from "lucide-react";

const SpeedMenuBtn = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Shift") {
        setIsOpen(true);
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === "Shift") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const mainMenuItems = [
    {
      title: "Archives",
      description: "Gestion des archives et documents",
      icon: <FolderTree size={24} />,
      color: "bg-blue-600",
    },
    {
      title: "Agences",
      description: "Gestion des agences",
      icon: <Folder size={24} />,
      color: "bg-green-600",
    },
  ];

  const archiveMenuItems = [
    {
      title: "Méta-données",
      description: "Gérer les métadonnées et leur types",
      icon: <DatabaseZap size={24} />,
      color: "bg-blue-600",
      path: "/users",
    },
    {
      title: "Gestion des Profils",
      description: "Configurer les profils d'accès",
      icon: <Shield size={24} />,
      color: "bg-green-600",
      path: "/profil",
    },
    {
      title: "Gestion des Actions",
      description: "Définir les permissions et droits",
      icon: <Zap size={24} />,
      color: "bg-blue-800",
      path: "/rights",
    },
    {
      title: "Configurer les pièces",
      description: "Configurer les pièces pour chaque type de documents",
      icon: <StretchHorizontal size={24} />,
      color: "bg-red-400",
      path: "/pieces",
    },
    {
      title: "Les Méta-données des directions",
      description: "Manipuler les méta-données des directions",
      icon: <DatabaseZap size={24} />,
      color: "bg-orange-600",
      path: "/meta_dir",
    },
    {
      title: "Les dossiers des directions",
      description: "Afficher, modifier, supprimer les documents de directions",
      icon: <Folder size={24} />,
      color: "bg-red-700",
      path: "/docs_dir",
    },
    {
      title: "Structures système",
      description: "Vérifier l'arborescence de dossiers créé",
      icon: <FolderTree size={24} />,
      color: "bg-gray-600",
      path: "/tree",
    },
  ];

  const agenceMenuItems = [
    {
      title: "Accueuil agences",
      description: "Découvrir la partie section gestion des agences",
      icon: <LayoutGrid size={24} className="text-blue-500" />,
      color: "bg-blue-100",
      path: "/agences",
    },
    {
      title: "Liste des agences",
      description: "Découvrir la partie section gestion des agences",
      icon: <Building2 size={24} className="text-green-500" />,
      color: "bg-green-100",
      path: "/agence_page",
    },
    {
      title: "Les types de documents",
      description: "Découvrir la partie section gestion des agences",
      icon: <LayoutGrid size={24} className="text-red-500" />,
      color: "bg-red-100",
      path: "/agence/document-type",
    },
    {
      title: "Voir la liste des caisses",
      description: "Afficher, modifier ou configurer les caisses",
      icon: <ListTodo size={24} className="text-yellow-500" />,
      color: "bg-yellow-100",
      path: "/caisse",
    },
    {
      title: "Voir la liste des guichets",
      description: "Afficher, modifier ou configurer les guichets",
      icon: <ListTodo size={24} className="text-purple-500" />,
      color: "bg-purple-100",
      path: "/guichet",
    },
    {
      title: "Recherche avancée",
      description:
        "Effectuer des récherches avancées et poussées sur vos données",
      icon: <SearchCheckIcon size={24} className="text-indigo-500" />,
      color: "bg-indigo-100",
      path: "/agence/search",
    },
    {
      title: "Dossier",
      description: "Visualiser vos dossiers et attacher leur des fichiers",
      icon: <FolderCheck size={24} className="text-pink-500" />,
      color: "bg-pink-100",
      path: "/dossier",
    },
    {
      title: "Configuration méta-données",
      description: "Afficher, modifier ou configurer les méta-données",
      icon: <DatabaseZap size={24} className="text-teal-500" />,
      color: "bg-teal-100",
      path: "/agence/meta_agence",
    },
    {
      title: "Voir la lise de toutes les pièces",
      description: "Afficher, modifier ou configurer les pièces",
      icon: <StretchHorizontal size={24} className="text-orange-500" />,
      color: "bg-orange-100",
      path: "/agence_createPiece",
    },
    // Ajoutez d'autres items pour le menu agences ici
  ];

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("sidebarZIndex", "20");
  };

  const handleSectionSelect = (section) => {
    setSelectedSection(section);
  };

  return (
    <div className="relative z-[100]">
      <button
        onClick={() => setIsOpen(true)}
        className="p-4 rounded-lg bg-gray-800 text-white shadow-lg hover:bg-gray-700 transition-colors"
      >
        <Menu size={24} />
      </button>

      {isOpen && (
        <div className="fixed ml-64 inset-0 bg-black/50 flex items-center justify-center z-[150]">
          <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-white">
              {selectedSection ? selectedSection : "Menu Rapide"}
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {!selectedSection ? (
                mainMenuItems.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleSectionSelect(item.title)}
                    className="bg-[#2a2a2a] border border-[#4a4a4a] p-6 rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer hover:bg-[#404040]"
                  >
                    <div
                      className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}
                    >
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-white">
                      {item.title}
                    </h3>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-2">
                  <button
                    onClick={() => setSelectedSection(null)}
                    className="mb-4 text-gray-400 hover:text-gray-200 flex items-center gap-2 transition-colors"
                  >
                    ← Retour
                  </button>
                  <div className="grid md:grid-cols-3 gap-6">
                    {(selectedSection === "Archives"
                      ? archiveMenuItems
                      : agenceMenuItems
                    ).map((item, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          navigate(item.path);
                          handleClose();
                        }}
                        className="bg-[#2a2a2a] border border-[#4a4a4a] p-6 rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer hover:bg-[#404040]"
                      >
                        <div
                          className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}
                        >
                          {item.icon}
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-white">
                          {item.title}
                        </h3>
                        <p className="text-gray-400">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeedMenuBtn;
