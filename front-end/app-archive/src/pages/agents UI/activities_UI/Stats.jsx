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
import SideBar_ui from "../components_UI/Sidebar_UI";
import TopBar_ui from "../components_UI/Top_bar_UI";
import axios from "axios";

const Stats_agents = () => {
  const serviceId = localStorage.getItem("serviceId");
  const service = localStorage.getItem("service");
  const [stats, setStats] = useState({
    totalDocumentTypes: 0,
    totalPieces: 0,
    totalLinkedPieces: 0, 
    totalDocuments: 0,
    totalMetadata: 0,

    documentTypesWithoutMetadata: 0,
    documentTypesWithMetadata: 0
  });

  const fetchStats = async () => {
    try {
      const [
        docTypesRes,
        docTypesNoMetadataRes,
        docTypesWithMetadataRes,
        piecesRes,
        LinkedpiecesRes,
        documentsRes,
        metadataRes
      ] = await Promise.all([
        axios.get(`http://localhost:3000/stats/service/${serviceId}/document-types`),
        axios.get(`http://localhost:3000/stats/service/${serviceId}/document-types-without-metadata`),
        axios.get(`http://localhost:3000/stats/service/${serviceId}/document-types-with-metadata`),
        axios.get(`http://localhost:3000/stats/service/${serviceId}/pieces`),
        axios.get(`http://localhost:3000/stats/service/${serviceId}/pieces-in-document-type`),
        axios.get(`http://localhost:3000/stats/service/${serviceId}/documents`),
        axios.get(`http://localhost:3000/stats/service/${serviceId}/metadata`)
      ]);

      const newStats = {
        totalDocumentTypes: docTypesRes.data.total || 0,
        totalPieces: piecesRes.data.total || 0,
        totalLinkedPieces: LinkedpiecesRes.data.total || 0,
        totalDocuments: documentsRes.data.total || 0,
        totalMetadata: metadataRes.data.total || 0,
        documentTypesWithoutMetadata: docTypesNoMetadataRes.data.total || 0,
        documentTypesWithMetadata: docTypesWithMetadataRes.data || 0
      };

      setStats(newStats);
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
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
      <SideBar_ui isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar_ui position="fixed" title="Statistiques" />
        <div className="container w-full mx-auto px-4 py-8 mt-20">
          <div className="bg-gray-800 w-full rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <BarChart3 className="h-8 w-8 text-[#00B7FF] mr-2" />
                Tableau de Bord Analytics - {service}
              </h1>
            </div>


            <div className="bg-[#2a2a2a] border border-[#4a4a4a] rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#00B7FF] flex items-center mb-4">
                    <div className="bg-[#3a3a3a] p-2 rounded-full mr-3">
                      <BarChart3 className="h-5 w-5 text-[#00B7FF]" />
                    </div>
                    Points d'attention
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#3a3a3a] rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">Types de documents</p>
                          <p className="text-2xl font-bold text-yellow-400 mt-1">
                            {stats.documentTypesWithoutMetadata}
                          </p>
                          <p className="text-sm text-gray-400 mt-1">sans métadonnées</p>
                        </div>
                        <div className="bg-[#2a2a2a] p-3 rounded-full">
                          <Layers3 className="h-5 w-5 text-yellow-400" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#3a3a3a] rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">Pièces</p>
                          <p className="text-2xl font-bold text-yellow-400 mt-1">
                            {stats.totalPieces - stats.totalLinkedPieces}
                          </p>
                          <p className="text-sm text-gray-400 mt-1">non configurées</p>
                        </div>
                        <div className="bg-[#2a2a2a] p-3 rounded-full">
                          <StretchHorizontal className="h-5 w-5 text-yellow-400" />
                        </div>
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
                    <p className="text-lg font-semibold text-[#00B7FF]">Types de Documents</p>
                    <h3 className="text-4xl font-bold text-white mt-2">{stats.totalDocumentTypes}</h3>
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
                  </div>
                  <div className="bg-[#3a3a3a] p-4 rounded-full">
                    <Layers3 className="h-8 w-8 text-[#00B7FF]" />
                  </div>
                </div>
              </div>

              <div className="bg-[#2a2a2a] border border-[#4a4a4a] rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold text-[#00B7FF]">Pièces</p>
                    <h3 className="text-4xl font-bold text-white mt-2">{stats.totalPieces}</h3>
                    <div className="mt-3 space-y-1">
                      <p className="text-sm text-gray-400 flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        {stats.totalLinkedPieces} configurées
                      </p>
                      <p className="text-sm text-gray-400 flex items-center">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                        {stats.totalPieces - stats.totalLinkedPieces} non configurées
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#3a3a3a] p-4 rounded-full">
                    <StretchHorizontal className="h-8 w-8 text-[#00B7FF]" />
                  </div>
                </div>
              </div>

              <div className="bg-[#2a2a2a] border border-[#4a4a4a] rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold text-[#00B7FF]">Documents</p>
                    <h3 className="text-4xl font-bold text-white mt-2">{stats.totalDocuments}</h3>
                    <p className="text-sm text-gray-400 mt-2">documents archivés</p>
                  </div>
                  <div className="bg-[#3a3a3a] p-4 rounded-full">
                    <FolderArchive className="h-8 w-8 text-[#00B7FF]" />
                  </div>
                </div>
              </div>

              <div className="bg-[#2a2a2a] border border-[#4a4a4a] rounded-lg p-6 hover:shadow-md transition-shadow duration-200 col-span-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold text-[#00B7FF]">Métadonnées</p>
                        <h3 className="text-3xl font-bold text-white">{stats.totalMetadata}</h3>
                        <p className="text-sm text-gray-400">métadonnées configurées</p>
                      </div>
                      <div className="bg-[#3a3a3a] p-3 rounded-full">
                        <Database className="h-6 w-6 text-[#00B7FF]" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold text-[#00B7FF]">Taux de configuration</p>
                        <h3 className="text-3xl font-bold text-white">
                          {Math.round((stats.totalLinkedPieces / stats.totalPieces) * 100)}%
                        </h3>
                        <p className="text-sm text-gray-400">des pièces sont configurées</p>
                      </div>
                      <div className="bg-[#3a3a3a] p-3 rounded-full">
                        <BarChart3 className="h-6 w-6 text-[#00B7FF]" />
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

export default Stats_agents;
