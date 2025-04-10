import { useState, useEffect } from "react";
import {
  BarChart3,
  Users,
  FileText,
  Clock,
  Activity,
  RefreshCw,
  Calendar,
  Eye,
  LayoutDashboard,
  Cog,
} from "lucide-react";

import axios from "axios";
import SideBar from "../Components/Side_bar";
import TopBar from "../Components/Top_bar";

const Follow_up = () => {
  const [pageStats, setPageStats] = useState({
    today: [],
    lastWeek: [],
    lastMonth: [],
    lastThreeMonths: [],
    allPages: [],
  });

  const [agentStats, setAgentStats] = useState([]);

  const [documentViews, setDocumentViews] = useState({
    views: [],
  });

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pages");
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchPageStats = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/stats/page-stats"
      );
      console.log("Réponse API pages:", response.data);

      // La structure est response.data.pageViewsStats
      setPageStats(response.data.pageViewsStats || {});
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des statistiques de pages:",
        error
      );
    }
  };

  const fetchAgentStats = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/stats/suivi_connections_details"
      );
      setAgentStats(response.data.data || []);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des statistiques des agents:",
        error
      );
    }
  };

  const fetchDocumentViews = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/stats/document-views-by-month"
      );
      setDocumentViews(response.data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des vues de documents:",
        error
      );
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchPageStats(),
        fetchAgentStats(),
        fetchDocumentViews(),
      ]);
      setLoading(false);
    };

    fetchAllData();

    // Rafraîchir les données toutes les 30 secondes
    // Interval pour rafraîchir les données toutes les 30 secondes
    // const interval = setInterval(() => {
    //   fetchAllData();
    //   setLastRefresh(new Date());
    // }, 90000);

    // return () => clearInterval(interval);
  }, []);

  // Fonction pour rafraîchir manuellement les données
  const refreshData = () => {
    setLoading(true);
    Promise.all([
      fetchPageStats(),
      fetchAgentStats(),
      fetchDocumentViews(),
    ]).then(() => {
      setLoading(false);
      setLastRefresh(new Date());
    });
  };

  const renderPagesTab = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-100 rounded-lg border-l-4 border-green-500 mb-6 shadow-lg">
        <h2 className="text-xl font-bold text-green-800">Suivi des Pages</h2>
        <p className="text-gray-600 mt-1">
          Statistiques de consultation des différentes pages de
          l&apos;application
        </p>
      </div>

      {/* Graphique de tendance complètement revu */}
      <div className="bg-white border border-green-100 rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-green-700 mb-4">
          Tendance des consultations
        </h3>
        <div className="h-64 relative mt-4 px-4 bg-green-50 rounded-lg p-4 border border-green-100">
          {/* Lignes horizontales de référence */}
          <div className="absolute w-full h-1/4 border-t border-dashed border-green-200 left-0"></div>
          <div className="absolute w-full h-2/4 border-t border-dashed border-green-200 left-0"></div>
          <div className="absolute w-full h-3/4 border-t border-dashed border-green-200 left-0"></div>

          {/* Barres du graphique */}
          <div className="flex items-end justify-between h-full">
            {pageStats.allPages?.slice(0, 7).map((page, index) => {
              const height = `${Math.max(
                10,
                (page.views || page.vues || 0) * 5
              )}%`;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center w-full h-full justify-end px-1"
                >
                  <div
                    style={{ height }}
                    className="w-full bg-gradient-to-t from-green-600 to-emerald-400 rounded-md relative group shadow-md border border-green-500"
                  >
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-green-600 text-white text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg z-10">
                      <strong>{page.views || page.vues || 0}</strong> vues
                    </div>
                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-white opacity-20 rounded-md"></div>
                  </div>
                  <div
                    className="text-xs text-gray-700 mt-2 truncate w-full text-center font-medium"
                    title={page.page_name}
                  >
                    {page.page_name.length > 10
                      ? page.page_name.substring(0, 10) + "..."
                      : page.page_name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-100 rounded-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold text-green-700">
                Pages vues aujourd&apos;hui
              </p>
              <h3 className="text-3xl font-bold text-green-800 mt-2">
                {pageStats.today?.reduce(
                  (sum, page) => sum + (page.views || page.vues || 0),
                  0
                ) || 0}
              </h3>
              <p className="text-sm text-gray-600 mt-2">Total des vues</p>
            </div>
            <div className="bg-green-500 bg-opacity-20 p-4 rounded-full shadow-inner border border-green-500 border-opacity-30">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-100 rounded-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold text-green-700">
                Pages vues (semaine)
              </p>
              <h3 className="text-3xl font-bold text-green-800 mt-2">
                {pageStats.lastWeek?.reduce(
                  (sum, page) =>
                    sum +
                    parseInt(
                      page.total_views || page.views || page.vues || 0,
                      10
                    ),
                  0
                ) || 0}
              </h3>
              <p className="text-sm text-gray-600 mt-2">7 derniers jours</p>
            </div>
            <div className="bg-green-500 bg-opacity-20 p-4 rounded-full shadow-inner border border-green-500 border-opacity-30">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-100 rounded-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold text-green-700">
                Pages vues (mois)
              </p>
              <h3 className="text-3xl font-bold text-green-800 mt-2">
                {pageStats.lastMonth?.reduce(
                  (sum, page) =>
                    sum +
                    parseInt(page.total_views || page.views || page.vues || 0),
                  0
                ) || 0}
              </h3>
              <p className="text-sm text-gray-600 mt-2">30 derniers jours</p>
            </div>
            <div className="bg-green-500 bg-opacity-20 p-4 rounded-full shadow-inner border border-green-500 border-opacity-30">
              <LayoutDashboard className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-100 rounded-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold text-green-700">
                Pages vues (trimestre)
              </p>
              <h3 className="text-3xl font-bold text-green-800 mt-2">
                {pageStats.lastThreeMonths?.reduce(
                  (sum, page) =>
                    sum +
                    parseInt(page.total_views || page.views || page.vues || 0),
                  0
                ) || 0}
              </h3>
              <p className="text-sm text-gray-600 mt-2">90 derniers jours</p>
            </div>
            <div className="bg-green-500 bg-opacity-20 p-4 rounded-full shadow-inner border border-green-500 border-opacity-30">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-green-100 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-green-700 mb-4 flex items-center">
            <Eye className="h-5 w-5 mr-2 text-green-600" />
            Pages les plus consultées aujourd&apos;hui
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            {pageStats.today?.length > 0 ? (
              pageStats.today.map((page, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-green-50 p-4 rounded-lg hover:bg-green-100 transition-colors duration-200 border-l-4 border-green-500"
                >
                  <div className="flex items-center">
                    <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 font-bold shadow-md">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">
                        {page.page_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        ID: {page.page_id}
                      </p>
                    </div>
                  </div>
                  <span className="text-green-700 font-bold text-lg bg-green-500 bg-opacity-10 px-3 py-1 rounded-full">
                    {page.views || page.vues || 0}
                  </span>
                </div>
              ))
            ) : (
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <p className="text-gray-500">Aucune donnée disponible</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-green-700 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-green-600" />
            Pages les plus consultées (semaine)
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            {pageStats.lastWeek?.length > 0 ? (
              pageStats.lastWeek.map((page, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-green-50 p-4 rounded-lg hover:bg-green-100 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">
                        {page.page_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        ID: {page.page_id}
                      </p>
                    </div>
                  </div>
                  <span className="text-green-700 font-bold text-lg">
                    {page.total_views || page.views || page.vues || 0}
                  </span>
                </div>
              ))
            ) : (
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <p className="text-gray-500">Aucune donnée disponible</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-green-100 rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-green-700 mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-green-600" />
          Historique complet des consultations
        </h3>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs uppercase bg-green-100 text-green-800 rounded-lg">
              <tr>
                <th scope="col" className="px-6 py-3 rounded-tl-lg">
                  Page
                </th>
                <th scope="col" className="px-6 py-3">
                  Identifiant
                </th>
                <th scope="col" className="px-6 py-3">
                  Vues
                </th>
                <th scope="col" className="px-6 py-3 rounded-tr-lg">
                  Dernière consultation
                </th>
              </tr>
            </thead>
            <tbody>
              {pageStats.allPages?.length > 0 ? (
                pageStats.allPages.map((page, index) => (
                  <tr
                    key={index}
                    className={`border-b border-green-50 hover:bg-green-50 transition-colors duration-200 ${
                      index === pageStats.allPages.length - 1
                        ? "border-b-0"
                        : ""
                    }`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {page.page_name}
                    </td>
                    <td className="px-6 py-4">{page.page_id}</td>
                    <td className="px-6 py-4">
                      {page.views || page.vues || 0}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(page.moment).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center">
                    Aucune donnée disponible
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAgentsTab = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-100 rounded-lg border-l-4 border-green-500 mb-6 shadow-lg">
        <h2 className="text-xl font-bold text-green-800">Suivi des Agents</h2>
        <p className="text-gray-600 mt-1">
          Statistiques de connexion et d&apos;activité des agents
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-100 rounded-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold text-green-700">
                Agents actifs
              </p>
              <h3 className="text-3xl font-bold text-green-800 mt-2">
                {agentStats.filter((agent) => agent.statut === "Actif").length}
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Total des agents connectés
              </p>
            </div>
            <div className="bg-green-500 bg-opacity-20 p-4 rounded-full shadow-inner">
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-100 rounded-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold text-green-700">
                Temps moyen de connexion
              </p>
              <h3 className="text-3xl font-bold text-green-800 mt-2">
                {agentStats.length > 0
                  ? Math.round(
                      agentStats.reduce(
                        (sum, agent) =>
                          sum + parseFloat(agent.temps_connexion.moyen.minutes),
                        0
                      ) / agentStats.length
                    )
                  : 0}{" "}
                min
              </h3>
              <p className="text-sm text-gray-600 mt-2">Par session</p>
            </div>
            <div className="bg-green-500 bg-opacity-20 p-4 rounded-full shadow-inner">
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-100 rounded-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold text-green-700">
                Total des connexions
              </p>
              <h3 className="text-3xl font-bold text-green-800 mt-2">
                {agentStats.reduce(
                  (sum, agent) => sum + agent.connexions.total,
                  0
                )}
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Toutes sessions confondues
              </p>
            </div>
            <div className="bg-green-500 bg-opacity-20 p-4 rounded-full shadow-inner">
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-green-100 rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-green-700 mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2 text-green-600" />
          Détails des connexions par agent
        </h3>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs uppercase bg-green-100 text-green-800 rounded-lg">
              <tr>
                <th scope="col" className="px-6 py-3 rounded-tl-lg">
                  Agent
                </th>
                <th scope="col" className="px-6 py-3">
                  Service
                </th>
                <th scope="col" className="px-6 py-3">
                  Statut
                </th>
                <th scope="col" className="px-6 py-3">
                  Connexions
                </th>
                <th scope="col" className="px-6 py-3">
                  Temps moyen
                </th>
                <th scope="col" className="px-6 py-3 rounded-tr-lg">
                  Dernière connexion
                </th>
              </tr>
            </thead>
            <tbody>
              {agentStats.length > 0 ? (
                agentStats.map((agent, index) => (
                  <tr
                    key={index}
                    className={`border-b border-green-50 hover:bg-green-50 transition-colors duration-200 ${
                      index === agentStats.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {agent.nom_complet}
                    </td>
                    <td className="px-6 py-4">
                      {agent.service.nom || "Non assigné"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          agent.statut === "Actif"
                            ? "bg-green-500/20 text-green-700"
                            : "bg-gray-500/20 text-gray-700"
                        }`}
                      >
                        {agent.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4">{agent.connexions.total}</td>
                    <td className="px-6 py-4">
                      {agent.temps_connexion.moyen.format}
                    </td>
                    <td className="px-6 py-4">{agent.connexions.derniere}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    Aucune donnée disponible
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDocumentsTab = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-100 rounded-lg border-l-4 border-green-500 mb-6">
        <h2 className="text-xl font-bold text-green-800">
          Suivi des Documents
        </h2>
        <p className="text-gray-600 mt-1">
          Statistiques de consultation des documents archivés
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-100 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold text-green-700">
                Vues ce mois
              </p>
              <h3 className="text-3xl font-bold text-green-800 mt-2">
                {documentViews.views?.reduce(
                  (sum, doc) => sum + parseInt(doc.vues_ce_mois || 0),
                  0
                ) || 0}
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Total des consultations
              </p>
            </div>
            <div className="bg-green-500 bg-opacity-20 p-4 rounded-full">
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-100 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold text-green-700">
                Vues mois dernier
              </p>
              <h3 className="text-3xl font-bold text-green-800 mt-2">
                {documentViews.views?.reduce(
                  (sum, doc) => sum + parseInt(doc.vues_mois_dernier || 0),
                  0
                ) || 0}
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Total des consultations
              </p>
            </div>
            <div className="bg-green-500 bg-opacity-20 p-4 rounded-full">
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-100 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold text-green-700">
                Vues trimestre
              </p>
              <h3 className="text-3xl font-bold text-green-800 mt-2">
                {documentViews.views?.reduce(
                  (sum, doc) => sum + parseInt(doc.vues_3_derniers_mois || 0),
                  0
                ) || 0}
              </h3>
              <p className="text-sm text-gray-600 mt-2">3 derniers mois</p>
            </div>
            <div className="bg-green-500 bg-opacity-20 p-4 rounded-full">
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-green-100 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-green-700 mb-4">
          Documents les plus consultés
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs uppercase bg-green-100 text-green-800">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 rounded-tl-lg font-semibold text-green-800"
                >
                  Document
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 font-semibold text-green-800"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 font-semibold text-green-800"
                >
                  Service
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 font-semibold text-green-800"
                >
                  Direction
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 font-semibold text-green-800"
                >
                  Ce mois
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 font-semibold text-green-800"
                >
                  Mois dernier
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 rounded-tr-lg font-semibold text-green-800"
                >
                  Trimestre
                </th>
              </tr>
            </thead>
            <tbody>
              {documentViews.views?.length > 0 ? (
                // Trier par nombre de vues (trimestre) décroissant
                [...documentViews.views]
                  .sort(
                    (a, b) =>
                      parseInt(b.vues_3_derniers_mois || 0) -
                      parseInt(a.vues_3_derniers_mois || 0)
                  )
                  .map((doc, index) => (
                    <tr
                      key={index}
                      className="border-b border-green-50 hover:bg-green-50/50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 font-medium text-gray-800 flex items-center">
                        <Cog className="mr-2 text-green-500" />
                        <span className="font-medium">{doc.document_code}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-800">
                        {doc.document_type_name}
                      </td>
                      <td className="px-6 py-4 text-gray-800">
                        {doc.service_name || "Non assigné"}
                      </td>
                      <td className="px-6 py-4 text-gray-800">
                        {doc.directory_name || "Non assigné"}
                      </td>
                      <td className="px-6 py-4 text-gray-800">
                        {doc.vues_ce_mois || 0}
                      </td>
                      <td className="px-6 py-4 text-gray-800">
                        {doc.vues_mois_dernier || 0}
                      </td>
                      <td className="px-6 py-4 text-gray-800">
                        {doc.vues_3_derniers_mois || 0}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500 italic"
                  >
                    Aucune donnée disponible
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <SideBar isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar position="fixed" title="Suivi d'Activité" />
        <div className="container w-full mx-auto px-4 py-8 mt-20">
          <div className="bg-white w-full rounded-xl shadow-xl p-6 border border-green-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h1 className="text-2xl font-bold text-green-800 flex items-center">
                <BarChart3 className="h-8 w-8 text-green-600 mr-2" />
                Suivi d&apos;Activité du Système
              </h1>

              <button
                onClick={refreshData}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-5 py-2.5 rounded-lg flex items-center transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Rafraîchir
              </button>
            </div>

            <div className="text-xs text-gray-600 mb-4">
              Dernière mise à jour: {lastRefresh.toLocaleString()}
            </div>

            <div className="mb-6">
              <div className="flex space-x-2 border-b border-green-100">
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "pages"
                      ? "text-green-600 border-b-2 border-green-600"
                      : "text-gray-500 hover:text-green-700"
                  }`}
                  onClick={() => setActiveTab("pages")}
                >
                  Pages
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "agents"
                      ? "text-green-600 border-b-2 border-green-600"
                      : "text-gray-500 hover:text-green-700"
                  }`}
                  onClick={() => setActiveTab("agents")}
                >
                  Agents
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "documents"
                      ? "text-green-600 border-b-2 border-green-600"
                      : "text-gray-500 hover:text-green-700"
                  }`}
                  onClick={() => setActiveTab("documents")}
                >
                  Documents
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
                <p className="text-gray-600 mt-4">Chargement des données...</p>
              </div>
            ) : (
              <div>
                {activeTab === "pages" && renderPagesTab()}
                {activeTab === "agents" && renderAgentsTab()}
                {activeTab === "documents" && renderDocumentsTab()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles pour l'animation et les scrollbars
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }
  
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f0fdf4;
    border-radius: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #10b981;
    border-radius: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #059669;
  }
`;

// Injecter les styles dans le document
const styleElement = document.createElement("style");
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);

export default Follow_up;
