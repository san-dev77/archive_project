import { useState, useEffect } from "react";
import axios from "axios";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Activity,
  Filter,
  Download,
  Users,
  BarChart2,
} from "lucide-react";
import Side_bar from "../Components/Side_bar";
import TopBar from "../Components/Top_bar";
import { Tooltip } from "@mui/material";

const ConnectionLogs = () => {
  const [allConnectionLogs, setAllConnectionLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [stats, setStats] = useState({
    totalConnections: 0,
    uniqueUsers: 0,
    adminConnections: 0,
    agentConnections: 0,
    mostActiveUser: { name: "", count: 0 },
    mostActiveDay: { day: "", count: 0 },
  });
  const [filterRole, setFilterRole] = useState("all");

  useEffect(() => {
    fetchConnectionLogs();
  }, []);

  useEffect(() => {
    if (allConnectionLogs.length > 0) {
      applyFilters();
    }
  }, [allConnectionLogs, currentYear, currentMonth, filterRole]);

  const fetchConnectionLogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/stats/connexions-details"
      );
      console.log(response);

      setAllConnectionLogs(response.data.details);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des logs de connexion:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    // Filtrer par année et mois
    let filtered = allConnectionLogs.filter(
      (log) =>
        parseInt(log.year) === currentYear &&
        parseInt(log.month) === currentMonth
    );

    // Filtrer par rôle si nécessaire
    if (filterRole !== "all") {
      filtered = filtered.filter((log) => log.role === filterRole);
    }

    setFilteredLogs(filtered);
    calculateStats(filtered);
  };

  const calculateStats = (logs) => {
    // Total connections
    const totalConnections = logs.length;

    // Unique users
    const uniqueUsers = new Set(logs.map((log) => `${log.prenom} ${log.nom}`))
      .size;

    // Admin vs Agent connections
    const adminConnections = logs.filter((log) => log.role === "admin").length;
    const agentConnections = logs.filter((log) => log.role === "agent").length;

    // Most active user
    const userCounts = {};
    logs.forEach((log) => {
      const userName = `${log.prenom} ${log.nom}`;
      userCounts[userName] = (userCounts[userName] || 0) + 1;
    });

    let mostActiveUser = { name: "", count: 0 };
    Object.entries(userCounts).forEach(([name, count]) => {
      if (count > mostActiveUser.count) {
        mostActiveUser = { name, count };
      }
    });

    // Most active day
    const dayCounts = {};
    logs.forEach((log) => {
      const dayKey = `${log.day} (${log.day_name})`;
      dayCounts[dayKey] = (dayCounts[dayKey] || 0) + 1;
    });

    let mostActiveDay = { day: "", count: 0 };
    Object.entries(dayCounts).forEach(([day, count]) => {
      if (count > mostActiveDay.count) {
        mostActiveDay = { day, count };
      }
    });

    setStats({
      totalConnections,
      uniqueUsers,
      adminConnections,
      agentConnections,
      mostActiveUser,
      mostActiveDay,
    });
  };

  const navigateToPreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const navigateToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getMonthName = (month) => {
    const monthNames = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ];
    return monthNames[month - 1];
  };

  // Grouper les connexions par jour
  const groupByDay = (logs) => {
    const grouped = {};
    logs.forEach((log) => {
      const day = log.day;
      if (!grouped[day]) {
        grouped[day] = [];
      }
      grouped[day].push(log);
    });
    return grouped;
  };

  const groupedLogs = groupByDay(filteredLogs);

  const exportToCSV = () => {
    // Créer les en-têtes CSV
    let csvContent = "Date,Heure,Prénom,Nom,Service,Rôle\n";

    // Ajouter les données
    filteredLogs.forEach((log) => {
      const row = [
        log.connection_date,
        log.connection_time,
        log.prenom,
        log.nom,
        log.service,
        log.role,
      ]
        .map((cell) => `"${cell}"`)
        .join(",");

      csvContent += row + "\n";
    });

    // Créer un blob et télécharger
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `connexions_${currentYear}_${currentMonth}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen bg-gray-300">
      <Side_bar isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar position="fixed" title="Historique des Connexions" />
        <div className="container w-full mx-auto px-4 py-8 mt-20">
          <div className="bg-gray-800 w-full rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <Activity className="h-8 w-8 text-[#00B7FF] mr-2" />
                Historique des Connexions
              </h1>
              <div className="flex space-x-2">
                <Tooltip title="Exporter en CSV">
                  <button
                    onClick={exportToCSV}
                    className="bg-[#2185ac] hover:bg-[#1a6985] text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Exporter
                  </button>
                </Tooltip>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#2a2a2a] p-4 rounded-lg shadow border border-[#3a3a3a]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Connexions</p>
                    <h3 className="text-2xl font-bold text-white">
                      {stats.totalConnections}
                    </h3>
                  </div>
                  <div className="bg-[#00B7FF]/20 p-3 rounded-full">
                    <Activity className="h-6 w-6 text-[#00B7FF]" />
                  </div>
                </div>
              </div>

              <div className="bg-[#2a2a2a] p-4 rounded-lg shadow border border-[#3a3a3a]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">
                      Utilisateurs Uniques
                    </p>
                    <h3 className="text-2xl font-bold text-white">
                      {stats.uniqueUsers}
                    </h3>
                  </div>
                  <div className="bg-[#00B7FF]/20 p-3 rounded-full">
                    <Users className="h-6 w-6 text-[#00B7FF]" />
                  </div>
                </div>
              </div>

              <div className="bg-[#2a2a2a] p-4 rounded-lg shadow border border-[#3a3a3a]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Connexions Admin</p>
                    <h3 className="text-2xl font-bold text-white">
                      {stats.adminConnections}
                    </h3>
                  </div>
                  <div className="bg-purple-500/20 p-3 rounded-full">
                    <User className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
              </div>

              <div className="bg-[#2a2a2a] p-4 rounded-lg shadow border border-[#3a3a3a]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Connexions Agent</p>
                    <h3 className="text-2xl font-bold text-white">
                      {stats.agentConnections}
                    </h3>
                  </div>
                  <div className="bg-green-500/20 p-3 rounded-full">
                    <User className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-[#2a2a2a] p-4 rounded-lg shadow border border-[#3a3a3a]">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Utilisateur le plus actif
                </h3>
                {stats.mostActiveUser.name ? (
                  <div className="flex items-center">
                    <div className="bg-[#00B7FF]/20 p-3 rounded-full mr-3">
                      <User className="h-6 w-6 text-[#00B7FF]" />
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {stats.mostActiveUser.name}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {stats.mostActiveUser.count} connexions
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400">Aucune donnée disponible</p>
                )}
              </div>

              <div className="bg-[#2a2a2a] p-4 rounded-lg shadow border border-[#3a3a3a]">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Jour le plus actif
                </h3>
                {stats.mostActiveDay.day ? (
                  <div className="flex items-center">
                    <div className="bg-[#00B7FF]/20 p-3 rounded-full mr-3">
                      <Calendar className="h-6 w-6 text-[#00B7FF]" />
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {stats.mostActiveDay.day}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {stats.mostActiveDay.count} connexions
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400">Aucune donnée disponible</p>
                )}
              </div>
            </div>

            {/* Filtres et navigation */}
            <div className="bg-[#3a3a3a] rounded-lg p-4 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={navigateToPreviousMonth}
                    className="bg-[#2a2a2a] hover:bg-[#404040] text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
                  >
                    <ChevronLeft size={18} />
                    <span>Mois précédent</span>
                  </button>

                  <div className="text-xl font-semibold text-white bg-[#2a2a2a] px-4 py-2 rounded-lg">
                    {getMonthName(currentMonth)} {currentYear}
                  </div>

                  <button
                    onClick={navigateToNextMonth}
                    className="bg-[#2a2a2a] hover:bg-[#404040] text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
                  >
                    <span>Mois suivant</span>
                    <ChevronRight size={18} />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Filter size={18} className="text-[#00B7FF]" />
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="bg-[#2a2a2a] text-white border border-[#4a4a4a] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00B7FF]"
                  >
                    <option value="all">Tous les rôles</option>
                    <option value="admin">Admin uniquement</option>
                    <option value="agent">Agent uniquement</option>
                  </select>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64 bg-[#3a3a3a] rounded-lg">
                <div className="loading loading-spinner loading-lg text-[#00B7FF]"></div>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-10 text-gray-400 bg-[#3a3a3a] rounded-lg">
                <BarChart2 size={48} className="mx-auto mb-4 text-gray-500" />
                <p className="text-xl font-semibold">
                  Aucune connexion enregistrée pour cette période
                </p>
                <p className="text-sm mt-2">
                  Essayez de changer de mois ou de modifier vos filtres
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.keys(groupedLogs)
                  .sort((a, b) => b - a) // Trier par jour décroissant
                  .map((day) => (
                    <div
                      key={day}
                      className="border border-[#4a4a4a] rounded-lg overflow-hidden"
                    >
                      <div className="bg-[#2a2a2a] p-3 font-semibold flex items-center gap-2 text-white">
                        <Calendar size={18} className="text-[#00B7FF]" />
                        <span>
                          {day} {getMonthName(currentMonth)} {currentYear} (
                          {groupedLogs[day][0].day_name})
                        </span>
                        <span className="ml-auto text-sm text-gray-400 bg-[#404040] px-2 py-1 rounded-full">
                          {groupedLogs[day].length} connexion(s)
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-[#404040] text-white">
                            <tr>
                              <th className="text-left p-3 rounded-tl-lg">
                                Heure
                              </th>
                              <th className="text-left p-3">Utilisateur</th>
                              <th className="text-left p-3">Service</th>
                              <th className="text-left p-3 rounded-tr-lg">
                                Rôle
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {groupedLogs[day]
                              .sort((a, b) =>
                                b.connection_time.localeCompare(
                                  a.connection_time
                                )
                              )
                              .map((log, index) => (
                                <tr
                                  key={index}
                                  className="hover:bg-[#404040] bg-[#2a2a2a] transition duration-200 border-b border-[#3a3a3a] last:border-b-0"
                                >
                                  <td className="p-3 text-white">
                                    <div className="flex items-center gap-2">
                                      <Clock
                                        size={16}
                                        className="text-[#00B7FF]"
                                      />
                                      {log.connection_time}
                                    </div>
                                  </td>
                                  <td className="p-3 text-white">
                                    <div className="flex items-center gap-2">
                                      <User
                                        size={16}
                                        className="text-[#00B7FF]"
                                      />
                                      <div>
                                        <p>
                                          {log.prenom} {log.nom}
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-3 text-white">
                                    <div
                                      className="max-w-xs truncate"
                                      title={log.service}
                                    >
                                      {log.service}
                                    </div>
                                  </td>
                                  <td className="p-3">
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        log.role === "admin"
                                          ? "bg-purple-500/20 text-purple-400"
                                          : "bg-green-500/20 text-green-400"
                                      }`}
                                    >
                                      {log.role}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionLogs;
