import { useState, useEffect } from "react";
import {
  LayoutList,
  FolderTree,
  Database,
  BarChart3,
  GlobeLock,
  FolderArchive,
  StretchHorizontal,
  Layers3,
} from "lucide-react";
import SideBar from "../Components/Side_bar";
import TopBar from "../Components/Top_bar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Stats = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalServices: 0,
    activeServices: 0,
    totalDirectories: 0,
    totalDocumentTypes: 0,
    totalPieces: 0,
    totalLinkedPieces: 0,
    totalDocuments: 0,
    totalMetadata: 0,
    totalConnexions: {
      total_connections: 0,
      connection_date: "",
      hour: "",
      minute: "",
    },
    directoriesWithoutServices: 0,
    documentTypesWithoutMetadata: 0,
    documentTypesWithMetadata: 0,
    directoriesWithoutDocumentTypes: 0,
    servicesWithoutDocTypes: 0,
    documentsLastWeek: [],
    documentsLastMonth: [],
    topServices: [],
    topDocumentTypes: [],
    averageMetadataPerDocument: 0,
    databaseSize: 0,
  });

  const [, setLoading] = useState(true);
  const [refreshAnimation, setRefreshAnimation] = useState(false);

  const handleChangePage = (path) => {
    navigate(path);
  };

  const fetchStats = async () => {
    setRefreshAnimation(true);
    try {
      const [
        servicesRes,
        activeServicesRes,
        directoriesRes,
        dirWithoutServicesRes,
        docTypesRes,
        docTypesNoMetadataRes,
        docTypesWithMetadataRes,
        piecesRes,
        LinkedpiecesRes,
        documentsRes,
        metadataRes,
        connexionsRes,
        dirWithoutDocTypesRes,
        servicesNoDocTypeRes,
        documentsLastWeekRes,
        documentsLastMonthRes,
        topDocumentTypesRes,
        databaseSizeRes,
      ] = await Promise.all([
        axios.get("http://localhost:3000/stats/total-services"),
        axios.get("http://localhost:3000/stats/total-servicesActif"),
        axios.get("http://localhost:3000/stats/total-directories"),
        axios.get(
          "http://localhost:3000/stats/total-directories-without-services"
        ),
        axios.get("http://localhost:3000/stats/total-document-types"),
        axios.get(
          "http://localhost:3000/stats/total-document-types-without-metadata"
        ),
        axios.get(
          "http://localhost:3000/stats/total-document-types-with-metadata"
        ),
        axios.get("http://localhost:3000/stats/total-pieces"),
        axios.get("http://localhost:3000/stats/total-pieces-in-document-type"),
        axios.get("http://localhost:3000/stats/total-documents"),
        axios.get("http://localhost:3000/stats/total-metadata"),
        axios.get("http://localhost:3000/stats/total-connexions"),
        axios.get(
          "http://localhost:3000/stats/total-directories-without-document-types"
        ),
        axios.get("http://localhost:3000/stats/total-servicesNoDocType"),
        axios.get("http://localhost:3000/stats/documents-last-week"),
        axios.get("http://localhost:3000/stats/documents-last-month"),
        axios.get("http://localhost:3000/stats/top-document-types"),
        axios.get("http://localhost:3000/stats/database-size"),
      ]);

      const connexionData = connexionsRes.data.total[0];
      console.log(databaseSizeRes.data.size);

      const newStats = {
        totalServices: servicesRes.data.total || 0,
        activeServices: activeServicesRes.data.total || 0,
        totalDirectories: directoriesRes.data.total || 0,
        totalDocumentTypes: docTypesRes.data.total || 0,
        totalPieces: piecesRes.data.total || 0,
        totalLinkedPieces: LinkedpiecesRes.data.total || 0,
        totalDocuments: documentsRes.data.total || 0,
        totalMetadata: metadataRes.data.total || 0,
        totalConnexions: {
          total_connections: connexionData?.total_connections || 0,
          connection_date: connexionData?.connection_date || "",
          last_time: connexionData?.last_time || "",
        },
        directoriesWithoutServices: dirWithoutServicesRes.data.total || 0,
        documentTypesWithoutMetadata: docTypesNoMetadataRes.data.total || 0,
        documentTypesWithMetadata: docTypesWithMetadataRes.data || 0,
        directoriesWithoutDocumentTypes: dirWithoutDocTypesRes.data.total || 0,
        servicesWithoutDocTypes: servicesNoDocTypeRes.data.total || 0,
        documentsLastWeek: documentsLastWeekRes.data.documents || 0,
        documentsLastMonth: documentsLastMonthRes.data.documents || 0,
        topServices: topDocumentTypesRes.data.topTypes || [],
        topDocumentTypes: topDocumentTypesRes.data.topTypes || [],
        averageMetadataPerDocument: (
          stats.totalMetadata / (stats.totalDocuments || 1)
        ).toFixed(2),
        databaseSize: databaseSizeRes.data.size || 0,
      };

      setStats(newStats);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      setLoading(false);
    } finally {
      setTimeout(() => setRefreshAnimation(false), 500);
    }
  };

  useEffect(() => {
    fetchStats();

    const interval = setInterval(() => {
      fetchStats();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-300">
      <SideBar isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar position="fixed" title="Statistiques" />
        <div className="container w-full mx-auto px-4 py-8 mt-20">
          <div className="bg-gray-800 w-full rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <BarChart3
                  className={`h-8 w-8 text-[#00B7FF] mr-2 ${
                    refreshAnimation ? "animate-pulse" : ""
                  }`}
                />
                Tableau de Bord Analytics
              </h1>
              <div className="flex items-center">
                <div className="text-sm text-gray-400 mr-3">
                  Dernière mise à jour: {new Date().toLocaleTimeString()}
                </div>
                <button
                  onClick={fetchStats}
                  className={`bg-[#3a3a3a] p-2 rounded-full hover:bg-[#4a4a4a] transition-all duration-300 ${
                    refreshAnimation ? "animate-spin" : ""
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[#00B7FF]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="bg-[#2a2a2a] border border-[#4a4a4a] rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-[#00B7FF] flex items-center mb-4">
                <div className="bg-[#3a3a3a] p-2 rounded-full mr-3">
                  <BarChart3 className="h-5 w-5 text-[#00B7FF]" />
                </div>
                Tendances et Activité
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#3a3a3a] rounded-lg p-4 transform hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Documents</p>
                      <div className="flex items-center">
                        <p className="text-2xl font-bold text-green-400 mt-1">
                          {stats.documentsLastWeek[0]?.total || 0}
                        </p>
                        <div className="ml-2 text-xs bg-green-900 text-green-300 px-2 py-1 rounded-full">
                          +
                          {(
                            (stats.documentsLastWeek[0]?.total /
                              (stats.totalDocuments -
                                stats.documentsLastWeek[0]?.total || 1)) *
                            100
                          ).toFixed(1)}
                          %
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        {stats.documentsLastWeek[0]?.periode || "récemment"}
                      </p>
                    </div>
                    <div className="bg-[#2a2a2a] p-3 rounded-full">
                      <FolderArchive className="h-5 w-5 text-green-400" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="w-full h-1 bg-[#2a2a2a] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-green-300 animate-pulse"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#3a3a3a] rounded-lg p-4 transform hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Activité</p>
                      <div className="flex items-center">
                        <p className="text-2xl font-bold text-blue-400 mt-1">
                          {stats.totalConnexions.total_connections}
                        </p>
                        <div className="ml-2 text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded-full">
                          Actif
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">connexions</p>
                    </div>
                    <div className="bg-[#2a2a2a] p-3 rounded-full">
                      <GlobeLock className="h-5 w-5 text-blue-400" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="w-full h-1 bg-[#2a2a2a] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-300 animate-pulse"
                        style={{ width: "60%" }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#3a3a3a] rounded-lg p-4 transform hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Base de données</p>
                      <div className="flex items-center">
                        <p className="text-xl font-bold text-purple-400 mt-1">
                          <span className="text-purple-300">
                            {stats.databaseSize[0]?.database_name}
                          </span>{" "}
                          <span className="text-purple-300">
                            {stats.databaseSize[0]?.size_mb} MB
                          </span>
                        </p>
                        <div className="ml-2 text-xs bg-purple-900 text-purple-300 px-2 py-1 rounded-full">
                          Taille
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        espace utilisé
                      </p>
                    </div>
                    <div className="bg-[#2a2a2a] p-3 rounded-full">
                      <Database className="h-5 w-5 text-purple-400" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="w-full h-1 bg-[#2a2a2a] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-300 animate-pulse"
                        style={{ width: "90%" }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#3a3a3a] rounded-lg p-4 transform hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Métadonnées</p>
                      <div className="flex items-center">
                        <p className="text-2xl font-bold text-amber-400 mt-1">
                          {stats.averageMetadataPerDocument}
                        </p>
                        <div className="ml-2 text-xs bg-amber-900 text-amber-300 px-2 py-1 rounded-full">
                          Moyenne
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">par document</p>
                    </div>
                    <div className="bg-[#2a2a2a] p-3 rounded-full">
                      <Database className="h-5 w-5 text-amber-400" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="w-full h-1 bg-[#2a2a2a] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-300 animate-pulse"
                        style={{ width: "65%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#2a2a2a] border border-[#4a4a4a] rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#00B7FF] flex items-center mb-4">
                    <div className="bg-[#3a3a3a] p-2 rounded-full mr-3">
                      <BarChart3 className="h-5 w-5 text-[#00B7FF]" />
                    </div>
                    Points d&apos;attention
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#3a3a3a] rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">Directions</p>
                          <p className="text-2xl font-bold text-yellow-400 mt-1">
                            {stats.directoriesWithoutServices}
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            sans services
                          </p>
                        </div>
                        <div className="bg-[#2a2a2a] p-3 rounded-full">
                          <FolderTree className="h-5 w-5 text-yellow-400" />
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-gray-400">
                        {stats.directoriesWithoutServices > 0
                          ? `${(
                              (stats.directoriesWithoutServices /
                                stats.totalDirectories) *
                              100
                            ).toFixed(
                              1
                            )}% des directions n'ont pas de services associés`
                          : "Toutes les directions ont des services associés"}
                      </div>
                    </div>

                    <div className="bg-[#3a3a3a] rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">
                            Types de documents
                          </p>
                          <p className="text-2xl font-bold text-yellow-400 mt-1">
                            {stats.documentTypesWithoutMetadata}
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            sans métadonnées
                          </p>
                        </div>
                        <div className="bg-[#2a2a2a] p-3 rounded-full">
                          <Layers3 className="h-5 w-5 text-yellow-400" />
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-gray-400">
                        {stats.documentTypesWithoutMetadata > 0
                          ? `${(
                              (stats.documentTypesWithoutMetadata /
                                stats.totalDocumentTypes) *
                              100
                            ).toFixed(
                              1
                            )}% des types de documents n'ont pas de métadonnées`
                          : "Tous les types de documents ont des métadonnées"}
                      </div>
                    </div>

                    <div className="bg-[#3a3a3a] rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">Services</p>
                          <p className="text-2xl font-bold text-yellow-400 mt-1">
                            {stats.servicesWithoutDocTypes}
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            sans types de documents
                          </p>
                        </div>
                        <div className="bg-[#2a2a2a] p-3 rounded-full">
                          <LayoutList className="h-5 w-5 text-yellow-400" />
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-gray-400">
                        {stats.servicesWithoutDocTypes > 0
                          ? `${(
                              (stats.servicesWithoutDocTypes /
                                stats.totalServices) *
                              100
                            ).toFixed(
                              1
                            )}% des services n'ont pas de types de documents`
                          : "Tous les services ont des types de documents"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-[#2a2a2a] border border-[#4a4a4a] rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold text-[#00B7FF]">
                      Services
                    </p>
                    <h3 className="text-4xl font-bold text-white mt-2">
                      {stats.totalServices}
                    </h3>
                    <div className="mt-3 space-y-1">
                      <p className="text-sm text-gray-400 flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        {stats.activeServices} services actifs
                      </p>
                      <p className="text-sm text-gray-400 flex items-center">
                        <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                        {stats.totalServices - stats.activeServices} services
                        inactifs
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-[#4a4a4a]">
                      <div className="w-full bg-[#3a3a3a] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-green-400 h-full"
                          style={{
                            width: `${
                              (stats.activeServices / stats.totalServices) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {(
                          (stats.activeServices / stats.totalServices) *
                          100
                        ).toFixed(1)}
                        % actifs
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#3a3a3a] p-4 rounded-full">
                    <LayoutList className="h-8 w-8 text-[#00B7FF]" />
                  </div>
                </div>
              </div>

              <div className="bg-[#2a2a2a] border border-[#4a4a4a] rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold text-[#00B7FF]">
                      Directions
                    </p>
                    <h3 className="text-4xl font-bold text-white mt-2">
                      {stats.totalDirectories}
                    </h3>
                    <div className="mt-3 space-y-1">
                      <p className="text-sm text-gray-400 flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        {stats.totalDirectories -
                          stats.directoriesWithoutServices}{" "}
                        avec services
                      </p>
                      <p className="text-sm text-gray-400 flex items-center">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                        {stats.directoriesWithoutServices} sans services
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-[#4a4a4a]">
                      <div className="w-full bg-[#3a3a3a] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-green-400 h-full"
                          style={{
                            width: `${
                              ((stats.totalDirectories -
                                stats.directoriesWithoutServices) /
                                stats.totalDirectories) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {(
                          ((stats.totalDirectories -
                            stats.directoriesWithoutServices) /
                            stats.totalDirectories) *
                          100
                        ).toFixed(1)}
                        % avec services
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#3a3a3a] p-4 rounded-full">
                    <FolderTree className="h-8 w-8 text-[#00B7FF]" />
                  </div>
                </div>
              </div>

              <div className="bg-[#2a2a2a] border border-[#4a4a4a] rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold text-[#00B7FF]">
                      Types de Documents
                    </p>
                    <h3 className="text-4xl font-bold text-white mt-2">
                      {stats.totalDocumentTypes}
                    </h3>
                    <div className="mt-3 space-y-1">
                      <p className="text-sm text-gray-400 flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        {stats.documentTypesWithMetadata} avec métadonnées
                      </p>
                      <p className="text-sm text-gray-400 flex items-center">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                        {stats.documentTypesWithoutMetadata} sans métadonnées
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-[#4a4a4a]">
                      <div className="w-full bg-[#3a3a3a] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-green-400 h-full"
                          style={{
                            width: `${
                              (stats.documentTypesWithMetadata /
                                stats.totalDocumentTypes) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {(
                          (stats.documentTypesWithMetadata /
                            stats.totalDocumentTypes) *
                          100
                        ).toFixed(1)}
                        % avec métadonnées
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#3a3a3a] p-4 rounded-full">
                    <Layers3 className="h-8 w-8 text-[#00B7FF]" />
                  </div>
                </div>
              </div>

              <div className="bg-[#2a2a2a] border border-[#4a4a4a] rounded-lg p-6 hover:shadow-md transition-shadow duration-200 col-span-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold text-[#00B7FF]">
                          Pièces
                        </p>
                        <h3 className="text-3xl font-bold text-white">
                          {stats.totalPieces}
                        </h3>
                        <p className="text-sm text-gray-400">
                          dont {stats.totalLinkedPieces} configurées
                        </p>
                      </div>
                      <div className="bg-[#3a3a3a] p-3 rounded-full">
                        <StretchHorizontal className="h-6 w-6 text-[#00B7FF]" />
                      </div>
                    </div>
                    <div className="w-full bg-[#3a3a3a] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-green-400 h-full"
                        style={{
                          width: `${
                            (stats.totalLinkedPieces / stats.totalPieces) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400">
                      {(
                        (stats.totalLinkedPieces / stats.totalPieces) *
                        100
                      ).toFixed(1)}
                      % des pièces sont configurées
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold text-[#00B7FF]">
                          Documents
                        </p>
                        <h3 className="text-3xl font-bold text-white">
                          {stats.totalDocuments}
                        </h3>
                        <p className="text-sm text-gray-400">
                          archivés au total
                        </p>
                      </div>
                      <div className="bg-[#3a3a3a] p-3 rounded-full">
                        <FolderArchive className="h-6 w-6 text-[#00B7FF]" />
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                      <p>
                        Moyenne de{" "}
                        {(
                          stats.totalDocuments / (stats.totalServices || 1)
                        ).toFixed(1)}{" "}
                        documents par service
                      </p>
                      <p className="mt-1">
                        Ratio documents/types:{" "}
                        {(
                          stats.totalDocuments / (stats.totalDocumentTypes || 1)
                        ).toFixed(1)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold text-[#00B7FF]">
                          Métadonnées
                        </p>
                        <h3 className="text-3xl font-bold text-white">
                          {stats.totalMetadata}
                        </h3>
                        <p className="text-sm text-gray-400">enregistrées</p>
                      </div>
                      <div className="bg-[#3a3a3a] p-3 rounded-full">
                        <Database className="h-6 w-6 text-[#00B7FF]" />
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                      <p>
                        Moyenne de{" "}
                        {(
                          stats.totalMetadata / (stats.totalDocumentTypes || 1)
                        ).toFixed(1)}{" "}
                        métadonnées par type de document
                      </p>
                      <p className="mt-1">
                        Ratio métadonnées/documents:{" "}
                        {(
                          stats.totalMetadata / (stats.totalDocuments || 1)
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[#4a4a4a]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold text-[#00B7FF] flex items-center">
                        <GlobeLock className="h-5 w-5 mr-2" />
                        Statistiques de connexion
                      </p>
                      <h3 className="text-3xl font-bold text-white mt-2">
                        {stats.totalConnexions.total_connections}
                      </h3>
                      <div className="flex flex-col md:flex-row md:items-center gap-2 mt-1">
                        <p className="text-2xl text-gray-100 font-bold">
                          Dernière connexion{" "}
                          {stats.totalConnexions.last_time || "N/A"}
                        </p>
                        <p className="text-sm text-gray-100">
                          Date :{" "}
                          {stats.totalConnexions.connection_date
                            ? new Date(
                                stats.totalConnexions.connection_date
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                        <p className="text-sm text-gray-400"></p>
                      </div>
                    </div>
                    <button
                      className="bg-[#00B7FF] hover:bg-[#0099cc] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
                      onClick={() =>
                        (window.location.href = "/connexions-details")
                      }
                    >
                      <GlobeLock className="h-4 w-4 mr-2" />
                      Voir les détails
                    </button>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[#4a4a4a] grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <p className="text-lg font-semibold text-[#00B7FF] flex items-center">
                      <LayoutList className="h-5 w-5 mr-2" />
                      Top Services par Activité
                    </p>

                    <div className="space-y-3">
                      {stats.topServices.length > 0 ? (
                        stats.topServices.map((service, index) => (
                          <div
                            key={index}
                            className="bg-[#3a3a3a] rounded-lg p-3 group hover:bg-[#444] transition-colors duration-300"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    index === 0
                                      ? "bg-yellow-800"
                                      : index === 1
                                      ? "bg-gray-700"
                                      : index === 2
                                      ? "bg-amber-700"
                                      : "bg-gray-600"
                                  }`}
                                >
                                  {index + 1}
                                </div>
                                <div className="ml-3">
                                  <p className="text-white font-medium">
                                    {service.service_name}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {service.documents_per_service} documents
                                  </p>
                                </div>
                              </div>
                              <div className="text-[#00B7FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                  />
                                </svg>
                              </div>
                            </div>
                            <div className="mt-2 w-full bg-[#2a2a2a] h-1.5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#00B7FF] to-[#00D7FF]"
                                style={{
                                  width: `${
                                    (service.count /
                                      (stats.topServices[0]?.usage_count ||
                                        1)) *
                                    100
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="bg-[#3a3a3a] rounded-lg p-4 text-center text-gray-400">
                          Aucune donnée disponible
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleChangePage("/services")}
                      className="w-full bg-[#3a3a3a] hover:bg-[#444] text-[#00B7FF] py-2 rounded-lg transition-colors duration-300 text-sm font-medium"
                    >
                      Voir tous les services
                    </button>
                  </div>

                  <div className="space-y-4">
                    <p className="text-lg font-semibold text-[#00B7FF] flex items-center">
                      <Layers3 className="h-5 w-5 mr-2" />
                      Types de Documents Populaires
                    </p>

                    <div className="space-y-3">
                      {stats.topDocumentTypes.length > 0 ? (
                        stats.topDocumentTypes.map((type, index) => (
                          <div
                            key={index}
                            className="bg-[#3a3a3a] rounded-lg p-3 group hover:bg-[#444] transition-colors duration-300"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    index === 0
                                      ? "bg-yellow-700"
                                      : index === 1
                                      ? "bg-gray-800"
                                      : index === 2
                                      ? "bg-amber-700"
                                      : "bg-gray-800"
                                  }`}
                                >
                                  {index + 1}
                                </div>
                                <div className="ml-3">
                                  <p className="text-white font-medium">
                                    {type.document_type_name}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {type.usage_count} utilisations
                                  </p>
                                </div>
                              </div>
                              <div className="text-[#00B7FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                  />
                                </svg>
                              </div>
                            </div>

                            <div className="mt-2 w-full bg-[#2a2a2a] h-1.5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#00B7FF] to-[#00D7FF]"
                                style={{
                                  width: `${
                                    (type.usage_count /
                                      (stats.topDocumentTypes[0]?.usage_count ||
                                        1)) *
                                    100
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="bg-[#3a3a3a] rounded-lg p-4 text-center text-gray-400">
                          Aucune donnée disponible
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleChangePage("/document-types")}
                      className="w-full bg-[#3a3a3a] hover:bg-[#444] text-[#00B7FF] py-2 rounded-lg transition-colors duration-300 text-sm font-medium"
                    >
                      Voir tous les types de documents
                    </button>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[#4a4a4a]">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-lg font-semibold text-[#00B7FF] flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                        />
                      </svg>
                      État du Système
                    </p>
                    <div className="bg-green-900 text-green-300 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                      Opérationnel
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#3a3a3a] rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-gray-400">Temps de fonctionnement</p>
                        <div className="bg-[#2a2a2a] p-2 rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-[#00B7FF]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                      </div>
                      <p className="text-xl font-bold text-white mt-2">
                        {stats.systemPerformance?.uptime || "177"} jours
                      </p>
                    </div>

                    <div className="bg-[#3a3a3a] rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-gray-400">Dernière sauvegarde</p>
                        <div className="bg-[#2a2a2a] p-2 rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-[#00B7FF]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                            />
                          </svg>
                        </div>
                      </div>
                      <p className="text-xl font-bold text-white mt-2">
                        {stats.systemPerformance?.lastBackup ||
                          "Il y a Six mois"}{" "}
                        <br />
                        <span className="text-sm font-normal">
                          (Encore trois mois avant la prochaine)
                        </span>
                      </p>
                    </div>

                    <div className="bg-[#3a3a3a] rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-gray-400">Utilisation stockage</p>
                        <div className="bg-[#2a2a2a] p-2 rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-[#00B7FF]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>42.3 GB / 100 GB</span>
                          <span>42.3%</span>
                        </div>
                        <div className="w-full bg-[#2a2a2a] h-2 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-[#00B7FF]"
                            style={{ width: "42.3%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
