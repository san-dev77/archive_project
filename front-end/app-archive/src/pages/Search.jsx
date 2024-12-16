import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import {
  Building2,
  CircleHelp,
  DatabaseZap,
  FolderX,
  Layers2,
  SearchCheck,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import TopBar from "../Components/Top_bar";
import SideBar from "../Components/Side_bar";
import Loader_component from "../Components/Loader";

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
    if (servicesData) {
      setServicesData(servicesData); // Utilisation de setServicesData pour mettre à jour l'état local
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
      fetchMetadata(selectedDocumentType.id)
        .then((response) => {
          if (response.success) {
            setMetadata(response.data); // Utilisez response.data pour mettre à jour l'état
          } else {
            console.error(
              "Erreur lors de la récupération des métadonnées:",
              response.message
            );
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
    setLoading(true); // Affiche le loader

    try {
      const response = await fetch("http://localhost:3000/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ metadata: selectedMetadata }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
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

  const groupedResults = {};

  if (Array.isArray(searchResults) && searchResults.length > 0) {
    // searchResults.forEach((result) => {
    //   console.log("result", result);

    // });

    const metadataArray = searchResults[1]; // Récupérer le tableau de métadonnées

    metadataArray.forEach((meta) => {
      groupedResults[meta.metadata_name] = meta.value;
    });
  }

  return (
    <div className="flex w-full min-h-screen bg-gray-300">
      <SideBar isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <div className="flex-1 container mx-auto flex flex-col items-center p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="bg-white mt-10 p-8 rounded-lg shadow-lg w-full max-w-3xl overflow-x-auto">
            <h3 className="text-3xl mb-4 text-center text-gray-500">
              <CircleHelp size={30} />
              Que recherchez-vous ?
            </h3>
            <div className="mb-4 w-full">
              <label className="block mb-2 text-gray-700">
                <Building2 size={20} />
                Sélectionnez un service:
              </label>
              <select
                className="input input-bordered w-full bg-white border-gray-300 text-gray-800"
                onChange={(e) => {
                  const service = servicesData
                    .flatMap((directory) => directory.services)
                    .find((service) => service.id === parseInt(e.target.value));
                  console.log("Service selected:", service);
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
            {selectedService && (
              <div className="mb-4 w-full">
                <label className="block mb-2 text-gray-700">
                  <Layers2 size={20} />
                  Sélectionnez un type de document:
                </label>
                <select
                  className="input input-bordered w-full bg-white border-gray-300 text-gray-800"
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
            {selectedDocumentType && (
              <div className="mb-4 w-full">
                <label className="block mb-2 text-gray-700">
                  <DatabaseZap size={20} />
                  Sélectionnez un ou plusieurs critères de recherche:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                            className="mr-2"
                            onChange={(e) =>
                              handleMetadataChange(
                                meta.id,
                                e.target.checked ? "" : undefined
                              )
                            }
                          />
                          <label
                            htmlFor={`meta-${meta.id}`}
                            className="text-gray-800"
                          >
                            {meta.name}
                          </label>
                        </div>
                        {metadataValues[meta.id] !== undefined && (
                          <input
                            type="text"
                            className="input input-bordered w-full mt-2 bg-white border-gray-300 text-gray-800"
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
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              className="btn btn-primary w-full bg-gray-700 text-white hover:bg-gray-800 transition duration-300 ease-in-out transform hover:scale-105"
              onClick={handleSearch}
            >
              <SearchCheck size={30} />
            </button>
            {loading && <Loader_component />}
            {servicesLoading && (
              <p className="text-gray-700">Chargement des services...</p>
            )}
            {servicesError && (
              <p className="text-red-500">Erreur: {servicesError.message}</p>
            )}
            {searchPerformed && (
              <>
                {Object.keys(groupedResults).length > 0 ? (
                  <div className="mt-4 overflow-x-auto">
                    <h4 className="text-xl mb-2 text-gray-800">
                      Résultats de la recherche:
                    </h4>
                    <table className="table-auto w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          {columnNames.map((column) => (
                            <th
                              key={column.id}
                              className="px-4 py-2 border-b-2 border-gray-300 text-left text-gray-800"
                            >
                              {column.meta_key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="hover:bg-gray-50">
                          {columnNames.map((column) => {
                            const value = groupedResults[column.meta_key] || "";
                            return (
                              <td
                                key={column.id}
                                className="border px-4 py-2 text-gray-800"
                              >
                                {value}
                              </td>
                            );
                          })}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center mt-4">
                    <FolderX
                      color="red"
                      size={100}
                      className="text-6xl text-gray-400"
                    />
                    <p className="text-xl text-gray-600 mt-2">
                      Aucune réponse pour votre recherche...
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
          {/* Boutons flottants */}
          <div className="fixed bottom-4 right-4 flex flex-col space-y-2">
            <button
              className="bg-gray-700 flex items-center justify-center w-16 h-16 text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition transform hover:scale-110"
              onClick={() => navigate("/search-config")}
            >
              <Settings size={25} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
