import { useState, useEffect } from "react";
import axios from "axios";
import Side_bar from "../Components/Side_bar"; // Assurez-vous que l'importation est correcte
import Topbar from "../Components/Top_bar";

import { useNavigate } from "react-router-dom";
import Loader_component from "../Components/Loader";
import { ProgressBar } from "primereact/progressbar";
import { Badge } from "primereact/badge";

export default function Activities() {
  const [loading, setLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState([]);
  const [stats, setStats] = useState({
    totalAgences: 0,
    activeAgences: 20,
    completionRate: 100,
    pendingTasks: 12,
    totalServices: 0,
    totalDirectories: 0,
    totalDocumentTypes: 0,
    totalDocuments: 0,
    totalConnexions: {
      total_connections: 0,
      connection_date: "",
      last_time: "",
    },
    recentConnections: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupération des agents
        const usersResponse = await axios.get("http://localhost:3000/agents/");
        const activeUsers = usersResponse.data.slice(0, 3);
        setRecentUsers(activeUsers);

        // Récupération des statistiques
        const [
          servicesRes,
          directoriesRes,
          docTypesRes,
          documentsRes,
          connexionsRes,
          recentConnectionsRes,
          totalAgencesRes,
        ] = await Promise.all([
          axios.get("http://localhost:3000/stats/total-services"),
          axios.get("http://localhost:3000/stats/total-directories"),
          axios.get("http://localhost:3000/stats/total-document-types"),
          axios.get("http://localhost:3000/stats/total-documents"),
          axios.get("http://localhost:3000/stats/total-connexions"),
          axios.get("http://localhost:3000/stats/connexions-details"),
          axios.get("http://localhost:3000/stats_agences/total-agences"),
        ]);

        const connexionData = connexionsRes.data.total[0];

        // Limiter les connexions récentes au même nombre que les utilisateurs actifs
        const recentConnections =
          recentConnectionsRes.data.details?.slice(0, activeUsers.length) || [];

        setStats((prev) => ({
          ...prev,
          totalServices: servicesRes.data.total || 0,
          totalDirectories: directoriesRes.data.total || 0,
          totalDocumentTypes: docTypesRes.data.total || 0,
          totalDocuments: documentsRes.data.total || 0,
          totalAgences: totalAgencesRes?.data?.total || -1,
          totalConnexions: {
            total_connections: connexionData?.total_connections || 0,
            connection_date: connexionData?.connection_date || "",
            last_time: connexionData?.last_time || "",
          },
          recentConnections: recentConnections,
        }));
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  return (
    <div className="flex min-h-screen bg-gray-800">
      <Side_bar isVisible={true} />
      <div className="flex-1 flex flex-col ">
        <Topbar />
        <div className="container w-full mx-auto px-4 py-8 mt-20">
          <div className="bg-slate-800/70 backdrop-blur-sm w-full rounded-lg shadow-2xl p-6 border border-slate-700/30">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl w-full font-bold text-white flex justify-between items-center">
                <span className="text-3xl font-bold text-white flex items-center">
                  <i
                    className="pi pi-chart-line text-[#00B7FF] mr-3"
                    style={{ fontSize: "1.8em" }}
                  ></i>
                  Tableau de bord
                </span>
                <span className="ml-3 text-sm font-normal text-gray-100">
                  Dernière mise à jour: {new Date().toLocaleDateString()}
                </span>
              </h1>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-[600px]">
                <Loader_component className="loader" />
              </div>
            ) : (
              <div className="space-y-8">
                {/* Statistiques principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-500/40 to-blue-600/40 rounded-xl p-6 border border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-300 text-sm">Agences</p>
                        <h3 className="text-3xl font-bold text-white mt-1">
                          {stats.totalAgences}
                        </h3>
                        <div className="flex items-center mt-2">
                          <span className="text-green-400 text-sm">
                            {stats.activeAgences} actives
                          </span>
                          <span className="mx-2 text-gray-500">|</span>
                          <span className="text-yellow-400 font-bold text-sm">
                            {stats.totalAgences - stats.activeAgences} inactives
                          </span>
                        </div>
                      </div>
                      <div className="bg-blue-500/20 p-4 rounded-full">
                        <i className="pi pi-building text-blue-400 text-2xl"></i>
                      </div>
                    </div>
                    <ProgressBar
                      value={stats.completionRate}
                      className="h-4 w-full mt-4"
                    />
                  </div>

                  <div className="bg-gradient-to-br from-emerald-500/40 to-emerald-600/40 rounded-xl p-6 border border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-300 text-sm">Services</p>
                        <h3 className="text-3xl font-bold text-white mt-1">
                          {stats.totalServices}
                        </h3>
                        <div className="flex items-center mt-2">
                          <span className="text-green-400 text-sm">
                            {Math.round(stats.totalServices * 0.85)} actifs
                          </span>
                          <span className="mx-2 text-gray-500">|</span>
                          <span className="text-yellow-400 font-bold text-sm">
                            {Math.round(stats.totalServices * 0.15)} inactifs
                          </span>
                        </div>
                      </div>
                      <div className="bg-emerald-500/20 p-4 rounded-full">
                        <i className="pi pi-sitemap text-emerald-400 text-2xl"></i>
                      </div>
                    </div>
                    <ProgressBar value={85} className="h-4 w-full mt-4" />
                  </div>

                  <div className="bg-gradient-to-br from-amber-500/40 to-amber-600/40 rounded-xl p-6 border border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-300 text-sm">Documents</p>
                        <h3 className="text-3xl font-bold text-white mt-1">
                          {stats.totalDocuments}
                        </h3>
                        <div className="flex items-center mt-2">
                          <span className="text-amber-400 text-sm">
                            {stats.totalDocumentTypes} types
                          </span>
                          <span className="mx-2 text-gray-500">|</span>
                          <span className="text-blue-100 font-bold text-sm">
                            {Math.round(
                              stats.totalDocuments / stats.totalDocumentTypes
                            )}{" "}
                            moy/type
                          </span>
                        </div>
                      </div>
                      <div className="bg-amber-500/20 p-4 rounded-full">
                        <i className="pi pi-file text-amber-400 text-2xl"></i>
                      </div>
                    </div>
                    <ProgressBar value={92} className="h-4 w-full mt-4" />
                  </div>

                  <div className="bg-gradient-to-br from-indigo-500/40 to-indigo-600/50 rounded-xl p-6 border border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-300 text-sm">Connexions</p>
                        <h3 className="text-3xl font-bold text-white mt-1">
                          {stats.totalConnexions.total_connections}
                        </h3>
                        <div className="flex items-center mt-2">
                          <span className="text-indigo-100 font-bold text-sm">
                            Dernière: {stats.totalConnexions.last_time || "N/A"}
                          </span>
                        </div>
                      </div>
                      <div className="bg-indigo-500/20 p-4 rounded-full">
                        <i className="pi pi-users text-indigo-400 text-2xl"></i>
                      </div>
                    </div>
                    <ProgressBar value={75} className="h-4 w-full mt-4" />
                  </div>
                </div>

                {/* Carte principale - Gestion des Agences */}
                <div
                  className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#00B7FF]/80 to-[#0091ff]/80 p-1 transition-all duration-300 hover:scale-[1.01] cursor-pointer shadow-xl"
                  onClick={() => navigate("/agences")}
                >
                  <div className="bg-slate-800/90 rounded-lg p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className="bg-[#00B7FF]/20 p-3 rounded-full mr-3">
                            <i className="pi pi-building text-[#00B7FF] text-xl"></i>
                          </div>
                          <h2 className="text-2xl font-bold text-white">
                            Gestion des Agences
                          </h2>
                        </div>

                        <p className="text-gray-300 mt-3 ml-12">
                          Accédez à la gestion complète de vos{" "}
                          {stats.totalAgences} agences et optimisez leur
                          fonctionnement
                        </p>

                        <div className="mt-6 ml-12 space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">
                              Agences actives
                            </span>
                            <span className="text-white font-semibold">
                              {stats.activeAgences}/{stats.totalAgences}
                            </span>
                          </div>
                          <ProgressBar
                            value={stats.completionRate}
                            className="h-4"
                          />

                          <div className="flex flex-wrap gap-3 mt-4">
                            <div className="bg-slate-700/50 px-3 py-1.5 rounded-lg flex items-center">
                              <i className="pi pi-check-circle text-green-400 mr-2"></i>
                              <span className="text-gray-300 text-sm">
                                {stats.activeAgences} agences actives
                              </span>
                            </div>
                            <div className="bg-slate-700/50 px-3 py-1.5 rounded-lg flex items-center">
                              <i className="pi pi-exclamation-circle text-yellow-400 mr-2"></i>
                              <span className="text-gray-300 text-sm">
                                {stats.pendingTasks} tâches en attente
                              </span>
                            </div>
                            <div className="bg-slate-700/50 px-3 py-1.5 rounded-lg flex items-center">
                              <i className="pi pi-clock text-blue-400 mr-2"></i>
                              <span className="text-gray-300 text-sm">
                                Mise à jour il y a 2h
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-4 bg-slate-700/30 p-6 rounded-xl">
                        <div className="text-5xl  font-bold text-[#00B9FF]">
                          {stats.completionRate}%
                        </div>
                        <div className="text-gray-300 text-center">
                          Taux de complétion
                        </div>
                        <Badge
                          value={`${stats.pendingTasks} tâches en attente`}
                          severity="warning"
                        />
                        <button className="mt-2 px-5 py-2.5 bg-[#00B7FF] hover:bg-[#0091ff] text-white rounded-lg transition-all duration-300 flex items-center">
                          <span>Accéder</span>
                          <i className="pi pi-arrow-right ml-2"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Agents Actifs */}
                  <div className="bg-slate-800/70 rounded-xl p-6 border border-slate-700/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                      <i className="pi pi-users text-[#00B7FF] mr-3"></i>
                      Agents Actifs
                    </h3>
                    <div className="space-y-4">
                      {recentUsers.map((user) => (
                        <div
                          key={user.id}
                          className="group flex items-center p-4 bg-slate-700/30 rounded-xl hover:bg-[#00B7FF]/10 transition-all duration-300"
                        >
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00B7FF] to-[#0091ff] flex items-center justify-center text-white font-bold">
                            {user.prenom[0]}
                            {user.nom[0]}
                          </div>
                          <div className="ml-4 flex-1">
                            <p className="text-white font-medium flex items-center gap-2">
                              {`${user.prenom} ${user.nom}`}
                              <span className="inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                            </p>
                            <p className="text-gray-400 text-sm">
                              {user.nom_role}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-[#00B7FF] text-sm">
                              12 visites
                            </span>
                            <span className="text-gray-400 text-xs">
                              cette semaine
                            </span>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => navigate("/agents")}
                        className="w-full mt-2 py-2 bg-slate-700/30 hover:bg-[#00B7FF]/10 text-[#00B7FF] rounded-lg transition-all duration-300 flex items-center justify-center"
                      >
                        <i className="pi pi-users mr-2"></i>
                        Voir tous les agents
                      </button>
                    </div>
                  </div>

                  {/* Connexions Récentes */}
                  <div className="bg-slate-800/70 rounded-xl p-6 border border-slate-700/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-white flex items-center">
                        <i className="pi pi-clock text-[#00B7FF] mr-3"></i>
                        Connexions Récentes
                      </h3>
                      <button
                        onClick={() => navigate("/connexions-details")}
                        className="text-[#00B7FF] hover:text-[#0091ff] transition-colors duration-200"
                      >
                        Voir tout
                      </button>
                    </div>

                    <div className="relative">
                      <div className="absolute h-full w-0.5 bg-slate-700 left-2"></div>
                      <div className="space-y-6 ml-8">
                        {stats.recentConnections.length > 0 ? (
                          stats.recentConnections.map((connection, index) => (
                            <div key={index} className="relative">
                              <div className="absolute -left-[2rem] w-4 h-4 rounded-full bg-[#00B7FF]"></div>
                              <div className="bg-slate-700/30 p-4 rounded-lg">
                                <p className="text-gray-400 text-sm">
                                  {connection.connection_time} -{" "}
                                  {formatDate(connection.connection_date)}
                                </p>
                                <p className="text-white font-medium">
                                  {connection.prenom} {connection.nom}
                                </p>
                                <p className="text-[#00B7FF]">
                                  {connection.service}
                                </p>
                                <span
                                  className={`mt-2 inline-block px-2 py-0.5 rounded-full text-xs ${
                                    connection.role === "admin"
                                      ? "bg-purple-500/20 text-purple-300"
                                      : "bg-green-500/20 text-green-300"
                                  }`}
                                >
                                  {connection.role}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="bg-slate-700/30 p-4 rounded-lg text-center">
                            <p className="text-gray-400">
                              Aucune connexion récente
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistiques supplémentaires */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div
                    className="bg-slate-800/70 rounded-xl p-6 border border-slate-700/30 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer"
                    onClick={() => navigate("/stats")}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">
                        Directions
                      </h3>
                      <div className="bg-indigo-500/20 p-3 rounded-full">
                        <i className="pi pi-folder text-indigo-400"></i>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">
                      {stats.totalDirectories}
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <i className="pi pi-arrow-up text-green-400 mr-1"></i>
                      <span>+{Math.floor(Math.random() * 5) + 1} ce mois</span>
                    </div>
                  </div>

                  <div
                    className="bg-slate-800/70 rounded-xl p-6 border border-slate-700/30 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer"
                    onClick={() => navigate("/stats")}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">
                        Types de Documents
                      </h3>
                      <div className="bg-amber-500/20 p-3 rounded-full">
                        <i className="pi pi-copy text-amber-400"></i>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">
                      {stats.totalDocumentTypes}
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <i className="pi pi-arrow-up text-green-400 mr-1"></i>
                      <span>+{Math.floor(Math.random() * 8) + 2} ce mois</span>
                    </div>
                  </div>

                  <div
                    className="bg-slate-800/70 rounded-xl p-6 border border-slate-700/30 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer"
                    onClick={() => navigate("/stats")}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">
                        Taux d&apos;Activité
                      </h3>
                      <div className="bg-green-500/20 p-3 rounded-full">
                        <i className="pi pi-chart-line text-green-400"></i>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">
                      92%
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <i className="pi pi-arrow-up text-green-400 mr-1"></i>
                      <span>+3% depuis le mois dernier</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
