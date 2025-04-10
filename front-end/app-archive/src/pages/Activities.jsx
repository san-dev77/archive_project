import { useState, useEffect } from "react";
import axios from "axios";
import Side_bar from "../Components/Side_bar"; // Assurez-vous que l'importation est correcte
import Topbar from "../Components/Top_bar";

import { useNavigate } from "react-router-dom";
import Loader_component from "../Components/Loader";
import { ProgressBar } from "primereact/progressbar";

export default function Activities() {
  const [loading, setLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUser2, setCurrentUser2] = useState(null);
  const [currentUser3, setCurrentUser3] = useState(null);
  const [currentUser4, setCurrentUser4] = useState(null);
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
    // Récupérer les informations de l'utilisateur depuis le localStorage
    const userInfo = localStorage.getItem("firstName");
    const userInfo2 = localStorage.getItem("lastName");
    const userInfo3 = localStorage.getItem("profilName");
    const userInfo4 = localStorage.getItem("role");
    setCurrentUser(userInfo);
    setCurrentUser2(userInfo2);
    setCurrentUser3(userInfo3);
    setCurrentUser4(userInfo4);
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
          axios.get("http://localhost:3000/stats/total-directories"),
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

  // Fonction pour obtenir le moment de la journée
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Side_bar isVisible={true} />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <div className="container w-full mx-auto px-4 py-8 mt-20">
          {/* Message d'accueil personnalisé */}
          <div className="bg-gradient-to-r from-green-500 to-teal-800 rounded-xl p-6 mb-8 shadow-lg text-white">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <i className="pi pi-bell text-white text-xl"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {getGreeting()}, {currentUser || "Utilisateur"}!
                </h2>
                <p className="mt-2">
                  Bienvenue sur votre tableau de bord.
                  {currentUser3 && (
                    <span>
                      {" "}
                      En tant que <strong>{currentUser3}</strong>,{" "}
                    </span>
                  )}
                  vous avez accès à toutes les informations essentielles sur vos
                  agences, services et documents. Aujourd&apos;hui, nous avons{" "}
                  {stats.totalConnexions.total_connections} connexions et{" "}
                  {stats.pendingTasks} tâches en attente.
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button className="bg-white/20 hover:bg-white/30 transition-colors duration-300 px-4 py-2 rounded-lg text-sm font-medium flex items-center">
                <i className="pi pi-cog mr-2"></i>
                Personnaliser mon tableau de bord
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-[600px]">
              <Loader_component className="loader" />
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500 hover:translate-y-[-5px] transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider font-medium mb-1">
                        Directions
                      </p>
                      <h3 className="text-3xl font-bold text-gray-800 mt-1">
                        {stats.totalDirectories}
                      </h3>
                      <div className="flex items-center mt-2">
                        <span className="text-green-600 text-sm">
                          {stats.activeDirectories} actives
                        </span>
                        <span className="mx-2 text-gray-300">|</span>
                        <span className="text-blue-600 text-sm">
                          {stats.totalDirectories - stats.activeDirectories}
                          inactives
                        </span>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-full">
                      <i className="pi pi-building text-blue-500 text-2xl"></i>
                    </div>
                  </div>
                  <ProgressBar
                    value={stats.completionRate}
                    className="h-5 mt-4 "
                    style={{ background: "#f0f0f0" }}
                  />
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-teal-500 hover:translate-y-[-5px] transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider font-medium mb-1">
                        Services
                      </p>
                      <h3 className="text-3xl font-bold text-gray-800 mt-1">
                        {stats.totalServices}
                      </h3>
                      <div className="flex items-center mt-2">
                        <span className="text-green-600 text-sm">
                          {Math.round(stats.totalServices * 0.85)} actifs
                        </span>
                        <span className="mx-2 text-gray-300">|</span>
                        <span className="text-blue-600 text-sm">
                          {Math.round(stats.totalServices * 0.15)} inactifs
                        </span>
                      </div>
                    </div>
                    <div className="bg-teal-50 p-4 rounded-full">
                      <i className="pi pi-sitemap text-teal-500 text-2xl"></i>
                    </div>
                  </div>
                  <ProgressBar
                    value={85}
                    className="h-5 mt-4 "
                    style={{ background: "#f0f0f0" }}
                  />
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-amber-500 hover:translate-y-[-5px] transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider font-medium mb-1">
                        Documents
                      </p>
                      <h3 className="text-3xl font-bold text-gray-800 mt-1">
                        {stats.totalDocuments}
                      </h3>
                      <div className="flex items-center mt-2">
                        <span className="text-amber-600 text-sm">
                          {stats.totalDocumentTypes} types
                        </span>
                        <span className="mx-2 text-gray-300">|</span>
                        <span className="text-blue-600 text-sm">
                          {Math.round(
                            stats.totalDocuments / stats.totalDocumentTypes
                          )}{" "}
                          moy/type
                        </span>
                      </div>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-full">
                      <i className="pi pi-file text-amber-500 text-2xl"></i>
                    </div>
                  </div>
                  <ProgressBar
                    value={92}
                    className="h-5 mt-4 "
                    style={{ background: "#f0f0f0" }}
                  />
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500 hover:translate-y-[-5px] transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider font-medium mb-1">
                        Connexions
                      </p>
                      <h3 className="text-3xl font-bold text-gray-800 mt-1">
                        {stats.totalConnexions.total_connections}
                      </h3>
                      <div className="flex items-center mt-2">
                        <span className="text-blue-600 text-sm">
                          Dernière: {stats.totalConnexions.last_time || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-full">
                      <i className="pi pi-users text-green-500 text-2xl"></i>
                    </div>
                  </div>
                  <ProgressBar
                    value={75}
                    className="h-5 mt-4 "
                    style={{ background: "#f0f0f0" }}
                  />
                </div>
              </div>

              {/* <div
                className="bg-gradient-to-r from-teal-800 to-green-500 rounded-2xl p-8 shadow-xl text-white hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01] cursor-pointer"
                onClick={() => navigate("/agences")}
              >
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <div className="bg-white/20 p-3 rounded-full mr-4">
                        <i className="pi pi-building text-white text-xl"></i>
                      </div>
                      <h2 className="text-2xl font-bold">
                        Gestion des Agences
                      </h2>
                    </div>

                    <p className="text-white/90 mb-6">
                      Accédez à la gestion complète de vos {stats.totalAgences}{" "}
                      agences et optimisez leur fonctionnement
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                      <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                        <p className="text-sm text-white/70 mb-1">
                          Agences actives
                        </p>
                        <p className="text-xl font-bold">
                          {stats.activeAgences}/{stats.totalAgences}
                        </p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                        <p className="text-sm text-white/70 mb-1">
                          Tâches en attente
                        </p>
                        <p className="text-xl font-bold">
                          {stats.pendingTasks}
                        </p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                        <p className="text-sm text-white/70 mb-1">
                          Taux de complétion
                        </p>
                        <p className="text-xl font-bold">
                          {stats.completionRate}%
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <div className="relative h-36 w-36">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-3xl font-bold">
                          {stats.completionRate}%
                        </div>
                      </div>
                      <svg
                        className="w-full h-full transform -rotate-90"
                        viewBox="0 0 100 100"
                      >
                        <circle
                          className="text-white/20"
                          strokeWidth="8"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                        <circle
                          className="text-white"
                          strokeWidth="8"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                          strokeDasharray={`${
                            stats.completionRate * 2.51
                          } 251.2`}
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <button className="mt-6 px-6 py-3 bg-white text-teal-600 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center">
                      <span>Accéder</span>
                      <i className="pi pi-arrow-right ml-2"></i>
                    </button>
                  </div>
                </div>
              </div> */}

              <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 divide-x divide-gray-100">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                      <i className="pi pi-users text-blue-500 mr-3"></i>
                      Agents Actifs
                    </h3>
                    <div className="space-y-4">
                      {recentUsers.map((user) => (
                        <div
                          key={user.id}
                          className="group flex items-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-all duration-300"
                        >
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold">
                            {user.prenom[0]}
                            {user.nom[0]}
                          </div>
                          <div className="ml-4 flex-1">
                            <p className="text-gray-800 font-medium flex items-center gap-2">
                              {`${user.prenom} ${user.nom}`}
                              <span className="inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                            </p>
                            <p className="text-blue-500 text-sm">
                              {user.nom_role}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-teal-500 text-sm">
                              12 visites
                            </span>
                            <span className="text-gray-500 text-xs">
                              cette semaine
                            </span>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => navigate("/agents")}
                        className="w-full mt-4 py-2 border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all duration-300 flex items-center justify-center"
                      >
                        <i className="pi pi-users mr-2"></i>
                        Voir tous les agents
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-800 flex items-center">
                        <i className="pi pi-clock text-teal-500 mr-3"></i>
                        Connexions Récentes
                      </h3>
                      <button
                        onClick={() => navigate("/connexions-details")}
                        className="text-teal-500 hover:text-teal-700 transition-colors duration-200"
                      >
                        Voir tout
                      </button>
                    </div>

                    <div className="relative">
                      <div className="absolute h-full w-0.5 bg-gray-200 left-2"></div>
                      <div className="space-y-6 ml-8">
                        {stats.recentConnections.length > 0 ? (
                          stats.recentConnections.map((connection, index) => (
                            <div key={index} className="relative">
                              <div className="absolute -left-[2rem] w-4 h-4 rounded-full bg-teal-500"></div>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-500 text-sm">
                                  {connection.connection_time} -{" "}
                                  {formatDate(connection.connection_date)}
                                </p>
                                <p className="text-gray-800 font-medium">
                                  {connection.prenom} {connection.nom}
                                </p>
                                <p className="text-blue-500">
                                  {connection.service}
                                </p>
                                <span
                                  className={`mt-2 inline-block px-2 py-0.5 rounded-full text-xs ${
                                    connection.role === "admin"
                                      ? "bg-purple-100 text-purple-600"
                                      : "bg-green-100 text-green-600"
                                  }`}
                                >
                                  {connection.role}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <p className="text-gray-500">
                              Aucune connexion récente
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                  className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-all duration-300 border-t-4 border-blue-500"
                  onClick={() => navigate("/stats")}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Directions
                    </h3>
                    <div className="bg-blue-50 p-3 rounded-full">
                      <i className="pi pi-folder text-blue-500"></i>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-2">
                    {stats.totalDirectories}
                  </div>
                  <div className="flex items-center text-sm text-green-600">
                    <i className="pi pi-arrow-up text-green-600 mr-1"></i>
                    <span>+{Math.floor(Math.random() * 5) + 1} ce mois</span>
                  </div>
                </div>

                <div
                  className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-all duration-300 border-t-4 border-teal-500"
                  onClick={() => navigate("/stats")}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Types de Documents
                    </h3>
                    <div className="bg-teal-50 p-3 rounded-full">
                      <i className="pi pi-copy text-teal-500"></i>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-2">
                    {stats.totalDocumentTypes}
                  </div>
                  <div className="flex items-center text-sm text-green-600">
                    <i className="pi pi-arrow-up text-green-600 mr-1"></i>
                    <span>+{Math.floor(Math.random() * 8) + 2} ce mois</span>
                  </div>
                </div>

                <div
                  className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-all duration-300 border-t-4 border-green-500"
                  onClick={() => navigate("/stats")}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Taux d&apos;Activité
                    </h3>
                    <div className="bg-green-50 p-3 rounded-full">
                      <i className="pi pi-chart-line text-green-500"></i>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-2">
                    92%
                  </div>
                  <div className="flex items-center text-sm text-green-600">
                    <i className="pi pi-arrow-up text-green-600 mr-1"></i>
                    <span>+3% depuis le mois dernier</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
