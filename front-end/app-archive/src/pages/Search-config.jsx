import {
  Building2,
  DatabaseZap,
  Layers2,
  LayoutList,
  Save,
  Undo2,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import TopBar from "../Components/Top_bar"; // Importation de la TopBar
import SideBar from "../Components/Side_bar"; // Importation de la SideBar
import Swal from "sweetalert2"; // Importation de SweetAlert2

export default function SearchConfig() {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState(null);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [metadata, setMetadata] = useState([]);
  const [selectedMetadata, setSelectedMetadata] = useState([]);
  const [clickedMetadata] = useState([]);
  const [metadataDisplayState, setMetadataDisplayState] = useState({});
  const [localServicesData, setServicesData] = useState([]); // Renommage de l'état local
  const navigate = useNavigate(); // Utilisation de useNavigate pour la navigation
  const [isModalOpen, setIsModalOpen] = useState(false); // État pour la modale
  const [, setExistingConfig] = useState(null); // État pour stocker la configuration existante
  const [isLoading, setIsLoading] = useState(false); // État pour le loader

  const fetchServices = async () => {
    const response = await fetch("http://localhost:3000/services/directory");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const structuredData = data.map((directory) => {
      const services = directory.services
        .split("|")
        .map((service) => JSON.parse(service));
      return {
        ...directory,
        services,
      };
    });
    return structuredData;
  };

  const {
    data: servicesData,
    error: servicesError,
    isLoading: servicesLoading,
  } = useQuery("services", fetchServices);

  useEffect(() => {
    if (servicesData) {
      setServicesData(servicesData);
    }
  }, [servicesData]);

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
      `http://localhost:3000/metadata/type/${documentTypeId}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const fetchExistingConfig = async (documentTypeId) => {
    const response = await fetch(
      `http://localhost:3000/search-config/check/${documentTypeId}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  useEffect(() => {
    if (selectedService) {
      fetchDocumentTypes(selectedService.id)
        .then(setDocumentTypes)
        .catch(console.error);
    }
  }, [selectedService]);

  useEffect(() => {
    if (selectedDocumentType) {
      fetchMetadata(selectedDocumentType.id)
        .then(setMetadata)
        .catch(console.error);

      // Appel API pour vérifier les configurations existantes
      fetchExistingConfig(selectedDocumentType.id)
        .then((config) => {
          if (config && config.exists) {
            setExistingConfig(config); // Stocker la configuration existante
            showExistingConfigAlert(); // Afficher l'alerte
          }
        })
        .catch(console.error);
    }
  }, [selectedDocumentType]);

  const handleMetadataSelection = (metaId) => {
    setSelectedMetadata((prev) =>
      prev.includes(metaId)
        ? prev.filter((id) => id !== metaId)
        : [...prev, metaId]
    );
  };

  const handleSwitchChange = (metaId) => {
    setMetadataDisplayState((prev) => ({
      ...prev,
      [metaId]: !prev[metaId], // Assurez-vous que l'état est mis à jour correctement
    }));
  };

  const handleSaveConfig = async () => {
    if (!selectedDocumentType) {
      console.error("No document type selected");
      return;
    }

    // Vérifier si aucune métadonnée n'est sélectionnée
    if (selectedMetadata.length === 0) {
      Swal.fire(
        "Aucune métadonnée sélectionnée",
        "Veuillez sélectionner au moins une métadonnée avant de sauvegarder.",
        "warning"
      ); // Alerte d'avertissement
      return; // Sortir de la fonction si aucune métadonnée n'est sélectionnée
    }

    // Vérifier si aucun switch n'est activé
    const isAnySwitchOn = Object.values(metadataDisplayState).some(
      (state) => state
    );
    if (!isAnySwitchOn) {
      Swal.fire(
        "Aucun interrupteur activé",
        "Veuillez activer au moins un interrupteur avant de sauvegarder.",
        "warning"
      ); // Alerte d'avertissement
      return; // Sortir de la fonction si aucun interrupteur n'est activé
    }

    // Construire l'objet de configuration pour les métadonnées sélectionnées
    const metadataConfig = {
      documentTypeId: selectedDocumentType.id,
      selectedMetadata: selectedMetadata, // Envoyer uniquement les métadonnées sélectionnées
    };

    // Construire l'objet de configuration pour l'état des interrupteurs
    const switchConfig = {
      documentTypeId: selectedDocumentType.id,
      metadataDisplayState: metadataDisplayState, // Envoyer l'état des interrupteurs
    };

    try {
      // Appel API pour enregistrer les métadonnées sélectionnées
      console.log("metadataConfig", metadataConfig);
      const metadataResponse = await fetch(
        "http://localhost:3000/search-config/save-config",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(metadataConfig),
        }
      );

      if (!metadataResponse.ok) {
        throw new Error("Network response was not ok");
      }

      const metadataResult = await metadataResponse.json();
      console.log("Metadata configuration saved:", metadataResult);

      // Appel API pour enregistrer l'état des interrupteurs
      const switchResponse = await fetch(
        "http://localhost:3000/search-result/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(switchConfig),
        }
      );

      if (!switchResponse.ok) {
        throw new Error("Network response was not ok");
      }

      const switchResult = await switchResponse.json();
      console.log("Switch state saved:", switchResult);

      // Afficher une modale de succès après la sauvegarde
      Swal.fire(
        "Configuration enregistrée",
        "La nouvelle configuration a été créée avec succès.",
        "success"
      ); // Alerte de succès
    } catch (error) {
      console.error("Error saving configuration:", error);
      Swal.fire(
        "Erreur",
        "Une erreur est survenue lors de l'enregistrement de la configuration.",
        "error"
      ); // Alerte d'erreur
    }
  };

  const handleBack = () => {
    navigate(-1); // Retourne à la page précédente
  };

  const showExistingConfigAlert = () => {
    Swal.fire({
      title: "Configurations existantes",
      text: "Des configurations existent pour ce type de document. Voulez-vous les écraser ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Effacer les configurations",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteConfig(); // Appeler la fonction pour supprimer les configurations
      }
    });
  };

  const handleDeleteConfig = async () => {
    setIsLoading(true); // Afficher le loader
    try {
      const response = await fetch(
        `http://localhost:3000/search-config/${selectedDocumentType.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log("Existing configuration deleted");
      setExistingConfig(null); // Réinitialiser l'état de la configuration existante
      Swal.fire(
        "Configuration supprimée",
        "Les configurations ont été effacées avec succès.",
        "success"
      ); // Alerte de succès
    } catch (error) {
      console.error("Error deleting configuration:", error);
      Swal.fire(
        "Erreur",
        "Une erreur est survenue lors de la suppression des configurations.",
        "error"
      ); // Alerte d'erreur
    } finally {
      setIsLoading(false); // Masquer le loader
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-300">
      {isLoading && <div className="loader">Chargement...</div>}
      <SideBar isVisible={true} /> {/* Ajout de la SideBar */}
      <div className="flex-1 ml-2 flex flex-col">
        <TopBar /> {/* Ajout de la TopBar */}
        <div className="flex-1 mt-24 container mx-auto p-8 bg-white shadow-xl rounded-lg max-w-full overflow-auto">
          <h1 className="text-3xl flex justify-center items-center font-extrabold mb-10 text-center text-gray-700">
            <LayoutList className="text-gray-700" size={30} />
            Configuration du moteur de recherche
          </h1>

          <div className="flex w-full flex-col md:flex-row gap-8 mb-10">
            <div className="w-full md:w-1/2">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                <Building2 className="text-gray-800" size={20} />
                Sélection du service
              </h2>
              {servicesLoading ? (
                <p className="text-gray-600">Chargement des services...</p>
              ) : servicesError ? (
                <p className="text-red-600">Erreur: {servicesError.message}</p>
              ) : (
                <select
                  className="w-full p-3 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 bg-white"
                  onChange={(e) => {
                    const service = localServicesData
                      .flatMap((directory) => directory.services)
                      .find(
                        (service) => service.id === parseInt(e.target.value)
                      );
                    setSelectedService(service);
                  }}
                >
                  <option value="">Sélection du service</option>
                  {localServicesData.map((directory) => (
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
              )}
            </div>

            {selectedService && (
              <div className="w-full md:w-1/2">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  <Layers2 className="text-gray-800" size={20} />
                  Sélection type document
                </h2>
                <select
                  className="w-full p-3 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 bg-white"
                  onChange={(e) =>
                    setSelectedDocumentType(
                      documentTypes.find(
                        (dt) => dt.id === parseInt(e.target.value)
                      )
                    )
                  }
                >
                  <option value="">Sélectionnez un type de document</option>
                  {documentTypes.map((docType) => (
                    <option key={docType.id} value={docType.id}>
                      {docType.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {selectedDocumentType && (
            <div className="mb-10 w-full">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                <DatabaseZap className="text-gray-800" size={20} />
                Sélection des métadonnées
              </h2>
              <div className="flex flex-col md:flex-row gap-12">
                <div className="bg-gray-50 p-4 rounded-lg w-full border border-indigo-300 max-h-64 overflow-y-auto shadow-sm">
                  <ul className="list-disc pl-5">
                    {metadata.map((meta) => (
                      <li
                        key={meta.id}
                        className="flex w-full bg-gray-200 p-2 rounded-lg items-center mb-2"
                      >
                        <input
                          type="checkbox"
                          id={`meta-${meta.id}`}
                          checked={selectedMetadata.includes(meta.id)}
                          onChange={() => handleMetadataSelection(meta.id)}
                          className="mr-2"
                        />
                        <label htmlFor={`meta-${meta.id}`} className="flex-1">
                          {meta.cle}
                        </label>
                        <label className="switch ml-2">
                          <input
                            type="checkbox"
                            id={`switch-${meta.id}`}
                            checked={metadataDisplayState[meta.id] || false}
                            onChange={() => handleSwitchChange(meta.id)}
                          />
                          <span className="slider round"></span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg w-full border border-indigo-300 max-h-64 overflow-y-auto shadow-sm">
                  <h3 className="text-[17px] font-semibold mb-2 text-gray-800">
                    Métadonnées sélectionnées
                  </h3>
                  {metadata
                    .filter((meta) => selectedMetadata.includes(meta.id))
                    .map((meta) => (
                      <div
                        key={meta.id}
                        className={`mb-2 p-2 flex items-center justify-start gap-2 text-gray-800 rounded ${
                          metadataDisplayState[meta.id]
                            ? "bg-cyan-200"
                            : "bg-gray-300"
                        }`}
                      >
                        <DatabaseZap className="text-indigo-800" size={20} />
                        {meta.cle}
                        {clickedMetadata.includes(meta.id) && (
                          <span
                            className="ml-2 text-indigo-700 cursor-help"
                            title="Les métadonnées cliquées seront affichées"
                          >
                            ℹ️
                          </span>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-between gap-16">
            <button
              onClick={handleBack}
              className="bg-gray-600 flex items-center gap-2 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition duration-300"
            >
              <Undo2 className="text-white" size={20} />
              Retour
            </button>
            <button
              onClick={handleSaveConfig}
              className="bg-indigo-700 flex items-center gap-2 text-white px-8 py-3 rounded-lg hover:bg-indigo-800 transition duration-300"
            >
              <Save className="text-white" size={20} />
              Sauvegarder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
