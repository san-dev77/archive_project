import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import {
  Building2,
  CircleHelp,
  DatabaseZap,
  FileUp,
  FolderX,
  Layers2,
  SearchCheck,
  Settings,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import TopBar from "../Components/Top_bar";
import SideBar from "../Components/Side_bar";
import Loader_component from "../Components/Loader";
import Swal from "sweetalert2";

export default function Search() {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState(null);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [metadata, setMetadata] = useState([]);
  const [metadataValues, setMetadataValues] = useState({});
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]); // Assurez-vous que c'est un tableau
  const [columnNames, setColumnNames] = useState([]); // Correction de l'état pour les noms de colonnes
  const [searchPerformed, setSearchPerformed] = useState(false); // Nouvel état pour suivre si une recherche a été effectuée
  const navigate = useNavigate(); // Hook pour la navigation
  const [, setServicesData] = useState([]); // Renommage de l'état local
  const [loading, setLoading] = useState(false); // Nouvel état pour gérer le loader
  const [hasConfig, setHasConfig] = useState(false);
  const [configDetails, setConfigDetails] = useState(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [config_meta, setConfig_meta] = useState([]);
  const [files_doc_id, setFiles_doc_id] = useState([]);
  const [files, setFiles] = useState([]); // Nouvel état pour stocker les fichiers
  const [showFilesModal, setShowFilesModal] = useState(false); // Nouvel état pour gérer l'affichage de la modale des fichiers

  const fetchServices = async () => {
    const response = await fetch("http://localhost:3000/services/directory");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    // Parse the services JSON string into an array of objects
    const structuredData = data.map((directory) => {
      const services = directory.services
        .split("|")
        .map((service) => JSON.parse(service));
      return {
        ...directory,
        services, // Replace the services string with the parsed array
      };
    });
    return structuredData;
  };

  const fetchDocumentTypes = async (serviceId) => {
    const response = await fetch(
      `http://localhost:3000/document-types/services/${serviceId}/document-types`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const fetchMetadata = async (documentTypeId) => {
    const response = await fetch(
      `http://localhost:3000/search-config/get-config/${documentTypeId}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const fetchColumnNames = async (documentTypeId) => {
    console.log("launch");

    const response = await fetch(
      `http://localhost:3000/search-result/${documentTypeId}`
    ); // Remplacez par l'URL correcte de votre API
    console.log("column data", response.data);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    return result.data; // Retourne uniquement la partie 'data' du résultat
  };

  const {
    data: servicesData,
    error: servicesError,
    isLoading: servicesLoading,
  } = useQuery("services", fetchServices);

  useEffect(() => {
    setLoading(true); // Affiche le loader lors du chargement de la page
    if (servicesData) {
      setServicesData(servicesData); // Utilisation de setServicesData pour mettre à jour l'état local
      setTimeout(() => {
        setLoading(false); // Masque le loader après le chargement des données
      }, 1500);
    }
  }, [servicesData]);

  useEffect(() => {
    if (selectedService) {
      fetchDocumentTypes(selectedService.id)
        .then(setDocumentTypes)
        .catch((error) => {
          console.error(
            "Erreur lors du chargement des types de document:",
            error
          );
        });
    }
  }, [selectedService]);

  useEffect(() => {
    if (selectedDocumentType) {
      checkConfiguration(selectedDocumentType.id);
      fetchMetadata(selectedDocumentType.id)
        .then((response) => {
          if (response.success) {
            setMetadata(response.data);
          }
        })
        .catch((error) => {
          console.error("Erreur lors de l'appel de la nouvelle API:", error);
        });
    }
  }, [selectedDocumentType]);

  useEffect(() => {
    if (selectedDocumentType) {
      fetchColumnNames(selectedDocumentType.id)
        .then((data) => {
          setColumnNames(data);
          console.log("Column names fetched:", data);
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la récupération des noms de colonnes:",
            error
          );
        });
    }
  }, [selectedDocumentType]);

  const handleMetadataChange = (metaId, value) => {
    setMetadataValues((prevValues) => ({
      ...prevValues,
      [metaId]: value,
    }));
  };

  const handleSearch = async () => {
    setLoading(true); // Affiche le loader lors du lancement de la recherche
    const selectedMetadata = Object.entries(metadataValues)
      .filter(([, value]) => value !== undefined && value !== "")
      .map(([key, value]) => ({ id: key, value }));

    if (selectedMetadata.length === 0) {
      setError(
        "Veuillez remplir au moins un champ pour les métadonnées cochées."
      );
      return;
    }

    setError(null);

    try {
      const response = await fetch("http://localhost:3000/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ metadata: selectedMetadata }),
      });

      console.log("reponse:", response);

      const result = await response.json();
      console.log("Search result:", result);
      setFiles_doc_id(result[0]);
      console.log("Updated files_doc_id:", result[0]);

      setSearchResults(result); // Assurez-vous que c'est un tableau
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
    } finally {
      const timeoutDuration = searchPerformed ? 1000 : 1500; // Durée du loader
      setTimeout(() => {
        setLoading(false); // Masque le loader après la durée définie
      }, timeoutDuration);
      setSearchPerformed(true); // Indique qu'une recherche a été effectuée
    }
  };

  useEffect(() => {
    if (files_doc_id) {
      const fetchFiles = async (files_doc_id) => {
        console.log("files_doc", files_doc_id);

        const response = await fetch(
          `http://localhost:3000/search/get_files/${files_doc_id}`
        );
        const result = await response.json();
        console.log("files", result);

        if (result.length === 0) {
          Swal.fire({
            title: "Aucun fichier trouvé",
            text: "Aucun fichier n'a été trouvé pour cet identifiant.",
            icon: "info",
          });
        } else {
          setFiles(result);
        }
      };
      fetchFiles(files_doc_id);
    }
  }, [files_doc_id]);

  const groupedResults = [];

  if (Array.isArray(searchResults) && searchResults.length > 0) {
    searchResults.forEach((resultArray) => {
      if (!Array.isArray(resultArray)) return; // Ignore les nombres bruts

      const row = {};
      resultArray.forEach((meta) => {
        if (meta && typeof meta === "object" && meta.metadata_name) {
          row[meta.metadata_name] = meta.value;
        }
      });

      if (Object.keys(row).length > 0) {
        groupedResults.push(row);
      }
    });
  }

  const checkConfiguration = async (documentTypeId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/search-config/check/${documentTypeId}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("true", result);

      setHasConfig(result.exists);
      setConfig_meta(result.metadataNames);
      if (result.exists) {
        setConfigDetails(true);
        setShowConfigModal(true);
      } else {
        // Si pas de config, proposer d'en créer une
        Swal.fire({
          title: "Aucune configuration",
          text: "Aucune configuration n'existe pour ce type de document. Voulez-vous en créer une ?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Oui, créer",
          cancelButtonText: "Non, plus tard",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/search-config");
          }
        });
      }
    } catch (error) {
      console.error(
        "Erreur lors de la vérification de la configuration:",
        error
      );
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-slate-100">
      {loading && <Loader_component />}
      <SideBar isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <div className="w-full px-4 py-8 mt-20">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <CircleHelp className="h-8 w-8 text-green-600 mr-2" />
                Que recherchez-vous ?
              </h1>

              <div className="flex gap-2">
                {hasConfig && (
                  <button
                    className="bg-green-50 border-2 shadow-md border-green-200 text-green-700 p-2 rounded-lg hover:bg-green-100 transition flex items-center gap-2"
                    onClick={() => setShowConfigModal(true)}
                  >
                    <DatabaseZap size={20} />
                    Voir la configuration
                  </button>
                )}
                <button
                  className="bg-gray-50 hover:bg-gray-100 text-gray-700 p-2 rounded-lg shadow-md transition flex items-center gap-2"
                  onClick={() => navigate("/search-config")}
                >
                  <Settings size={20} />
                  Configuration
                </button>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="space-y-4">
                {/* Service Selection */}
                <div className="mb-4 w-full">
                  <label className="flex font-bold items-start justify-start gap-2 mb-2 text-gray-700">
                    <Building2 size={20} className="text-green-600" />
                    Sélectionnez un service:
                  </label>
                  <select
                    className="w-full px-4 py-2 bg-white text-gray-700 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    onChange={(e) => {
                      const service = servicesData
                        .flatMap((directory) => directory.services)
                        .find(
                          (service) => service.id === parseInt(e.target.value)
                        );
                      setSelectedService(service);
                    }}
                  >
                    <option value=""> Sélectionnez un service</option>
                    {servicesData &&
                      servicesData.map((directory) => (
                        <optgroup
                          key={directory.directory_id}
                          label={directory.nom_directory}
                        >
                          {directory.services.map((service) => (
                            <option key={service.id} value={service.id}>
                              {service.nom_service}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                  </select>
                </div>

                {/* Document Type Selection */}
                {selectedService && (
                  <div className="mb-4 w-full">
                    <label className="flex font-bold items-start justify-start gap-2 mb-2 text-gray-700">
                      <Layers2 size={20} className="text-green-600" />
                      Sélectionnez un type de document:
                    </label>
                    <select
                      className="w-full px-4 py-2 bg-white text-gray-700 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      onChange={(e) =>
                        setSelectedDocumentType(
                          documentTypes.find(
                            (docType) => docType.id === parseInt(e.target.value)
                          )
                        )
                      }
                    >
                      <option value="">Sélectionnez un type de document</option>
                      {documentTypes &&
                        documentTypes.map((docType) => (
                          <option key={docType.id} value={docType.id}>
                            {docType.name}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                {/* Metadata Selection */}
                {selectedDocumentType && (
                  <div className="mb-4 w-full">
                    <label className="flex font-bold items-start justify-start gap-2 text-2x mb-2 text-gray-700">
                      <DatabaseZap size={25} className="text-green-600" />
                      Sélectionnez un ou plusieurs critères de recherche:
                    </label>
                    <div className="grid bg-white p-4 rounded-lg border border-slate-200 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {metadata &&
                        metadata.map((meta) => (
                          <div
                            key={meta.id}
                            className="flex flex-col items-start mb-2"
                          >
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={`meta-${meta.id}`}
                                className="mr-2 checkbox checkbox-success"
                                onChange={(e) =>
                                  handleMetadataChange(
                                    meta.id,
                                    e.target.checked ? "" : undefined
                                  )
                                }
                              />
                              <label
                                htmlFor={`meta-${meta.id}`}
                                className="font-bold text-gray-700 cursor-pointer"
                              >
                                {meta.name}
                              </label>
                            </div>
                            {metadataValues[meta.id] !== undefined && (
                              <input
                                type="text"
                                name={`meta-${meta.id}`}
                                className="w-full px-3 py-2 mt-2 bg-white text-gray-700 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder={`Entrez la valeur pour ${meta.name}`}
                                value={metadataValues[meta.id]}
                                onChange={(e) =>
                                  handleMetadataChange(meta.id, e.target.value)
                                }
                              />
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Search Button */}
                <button
                  className="w-full px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-center gap-2"
                  onClick={handleSearch}
                >
                  <span>Lancer la recherche</span>
                  <SearchCheck size={20} />
                </button>

                {/* Search Results */}
                {searchPerformed && (
                  <div className="mt-8">
                    {groupedResults.length > 0 ? (
                      <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                        <div className="flex items-center gap-4 mb-6">
                          <SearchCheck size={24} className="text-green-600" />
                          <h4 className="text-2xl font-bold text-gray-800">
                            Résultats de la recherche
                          </h4>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse rounded-lg overflow-hidden">
                            <thead>
                              <tr className="bg-green-50">
                                {columnNames.map((column) => (
                                  <th
                                    key={column.id}
                                    className="px-6 py-4 text-left text-gray-700 font-semibold text-sm uppercase tracking-wider"
                                  >
                                    {column.meta_key}
                                  </th>
                                ))}
                                <th className="px-6 py-4 text-left text-gray-700 font-semibold text-sm uppercase tracking-wider">
                                  Fichiers chargés
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                              {groupedResults.map((result, index) => (
                                <tr
                                  key={index}
                                  className="bg-white hover:bg-green-50 transition-colors"
                                >
                                  {columnNames.map((column) => {
                                    const value =
                                      result[column.meta_key] || "-";
                                    return (
                                      <td
                                        key={column.id}
                                        className="px-6 py-4 text-gray-700"
                                      >
                                        {value}
                                      </td>
                                    );
                                  })}
                                  <td className="px-6 py-4">
                                    <button
                                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                                      onClick={() => setShowFilesModal(true)}
                                    >
                                      <FileUp size={16} />
                                      Voir les fichiers
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-lg border border-slate-200">
                        <FolderX size={80} className="text-red-500 mb-4" />
                        <h4 className="text-2xl font-bold text-gray-800 mb-2">
                          Aucun résultat trouvé
                        </h4>
                        <p className="text-gray-600 text-center">
                          Essayez de modifier vos critères de recherche ou
                          vérifiez les informations saisies.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showConfigModal && configDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl max-w-3xl w-full mx-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl text-gray-800 font-bold flex items-center gap-3">
                <Building2 className="text-green-600" size={32} />
                Configuration : {selectedDocumentType.name}
              </h3>
              <button
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                onClick={() => setShowConfigModal(false)}
              >
                <svg
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-green-50 p-6 rounded-xl shadow-md border border-green-100">
                <div className="flex items-center gap-3 mb-4">
                  <DatabaseZap className="text-green-600" size={24} />
                  <h4 className="text-xl font-semibold text-gray-800">
                    Critères de Recherche
                  </h4>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CircleHelp className="text-gray-500 mt-1" size={20} />
                    <p className="text-gray-600">
                      Les critères suivants sont configurés pour optimiser vos
                      recherches et l'extraction des données :
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 space-y-3 border border-green-100">
                    <div className="flex items-center gap-2">
                      <SearchCheck className="text-green-600" size={20} />
                      <span className="text-gray-700 font-medium">
                        Champs de recherche configurés :
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {config_meta.map((meta, index) => (
                        <div
                          key={index}
                          className="bg-green-50 px-4 py-2 rounded-lg text-gray-700 flex items-center gap-2 border border-green-100"
                        >
                          <Layers2 size={16} />
                          {meta}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
                  onClick={() => setShowConfigModal(false)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showFilesModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowFilesModal(false)}
        >
          <div
            className="bg-white overflow-y-auto max-h-[80vh] p-6 rounded-xl w-full max-w-4xl mx-4 shadow-xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl text-gray-800 font-bold flex items-center gap-3">
                <FileUp className="text-green-600" />
                Documents associés
              </h3>
              <button
                onClick={() => setShowFilesModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {!files.pieces || Object.keys(files.pieces).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <FolderX size={48} className="mb-4" />
                <p className="text-lg">
                  Aucun fichier disponible pour ce document
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(files.pieces).map(([key, fileArray]) => (
                  <div
                    key={key}
                    className="bg-white rounded-lg overflow-hidden border border-slate-200"
                  >
                    <h4 className="font-medium flex items-center gap-2 text-gray-700 p-3 bg-green-50 border-b border-green-100">
                      <Layers2 className="text-green-600" size={20} />
                      {key}
                    </h4>

                    <div className="p-4 space-y-4">
                      {fileArray.map((fileName, index) => (
                        <div
                          key={index}
                          className="bg-green-50 rounded-lg overflow-hidden border border-green-100"
                        >
                          <object
                            data={`http://localhost:3000/uploads/pieces/${fileName}`}
                            type="application/pdf"
                            width="100%"
                            height="400"
                            className="border-0"
                          >
                            <div className="p-4 text-center">
                              <p className="text-gray-600 mb-2">
                                Aperçu PDF non disponible
                              </p>
                              <a
                                href={`http://localhost:3000/uploads/pieces/${fileName}`}
                                className="text-green-600 hover:underline inline-flex items-center gap-2"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <FileUp size={16} />
                                Télécharger le fichier
                              </a>
                            </div>
                          </object>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
