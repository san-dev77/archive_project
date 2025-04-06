import { useState, useEffect } from "react";
import Topbar from "../../Components/Top_bar";
import { Card } from "primereact/card";
import SideBar_agence from "../../Components/Sidebar_agence";
import {
  School,
  Building2,
  History,
  ChartLine,
  Share2,
  BarChart3,
} from "lucide-react";
import { Chart } from "primereact/chart";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader_component from "../../Components/Loader";

export default function Main_activities() {
  const [loading, setLoading] = useState(true);
  const [recentAgences, setRecentAgences] = useState([]);
  const [activitiesData] = useState([
    { mois: "Janvier", traites: 245, enAttente: 45 },
    { mois: "Février", traites: 320, enAttente: 28 },
    { mois: "Mars", traites: 280, enAttente: 32 },
    { mois: "Avril", traites: 350, enAttente: 15 },
    { mois: "Mai", traites: 400, enAttente: 20 },
    { mois: "Juin", traites: 290, enAttente: 25 },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const agencesResponse = await axios.get(
          "http://localhost:3000/agences/"
        );
        setRecentAgences(agencesResponse.data.slice(0, 3));
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"],
    datasets: [
      {
        label: "Activités des agences",
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: "#42A5F5",
        tension: 0.4,
      },
      {
        label: "Documents traités",
        data: [28, 48, 40, 19, 86, 27],
        fill: false,
        borderColor: "#66BB6A",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    aspectRatio: 1,
    plugins: {
      legend: {
        labels: {
          color: "#495057",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#495057",
        },
        grid: {
          color: "#ebedef",
        },
      },
      y: {
        ticks: {
          color: "#495057",
        },
        grid: {
          color: "#ebedef",
        },
      },
    },
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader_component className="loader" />
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <SideBar_agence isVisible={true} />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <div className="container w-full mx-auto px-4 py-8 mt-20">
          <div className="bg-gray-800/50 backdrop-blur-sm w-full rounded-lg shadow-2xl p-6 border border-gray-700/30">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-white flex items-center">
                <BarChart3 className="h-8 w-8 text-[#00B7FF] mr-3" />
                Tableau de Bord des Agences
                <span className="ml-3 text-sm font-normal text-gray-400">
                  {new Date().toLocaleDateString()}
                </span>
              </h1>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-[#00B7FF]/10 hover:bg-[#00B7FF]/20 text-[#00B7FF] rounded-lg transition-all duration-300 flex items-center">
                  <ChartLine className="h-5 w-5 mr-2" />
                  Exporter
                </button>
              </div>
            </div>

            {/* Activity Summary Card */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#00B7FF] to-[#0091ff] p-1 transition-all duration-300 hover:scale-[1.02] mb-6">
              <div className="bg-gray-900/90 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Aperçu Global
                    </h2>
                    <p className="text-gray-300">
                      {recentAgences.length} nouvelles agences enregistrées
                    </p>
                  </div>
                  <Building2 size={48} className="text-[#00B7FF]" />
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {[
                {
                  title: "Agences",
                  value: "152",
                  icon: <Building2 size={40} />,
                  subtext: "200 nouvelles agences",
                },
                {
                  title: "Historique",
                  value: "520",
                  icon: <History size={40} />,
                  subtext: "520 historiques récents",
                },
                {
                  title: "Suivis",
                  value: "28,441",
                  icon: <ChartLine size={40} />,
                  subtext: "520 suivis depuis la dernière visite",
                },
                {
                  title: "Dossiers partagés",
                  value: "20",
                  icon: <Share2 size={40} />,
                  subtext: "0 dossiers récents partagés",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 hover:bg-gray-700/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {item.title}
                      </h3>
                      <p className="text-3xl font-bold text-[#00B7FF] mt-2">
                        {item.value}
                      </p>
                    </div>
                    <div className="text-[#00B7FF]">{item.icon}</div>
                  </div>
                  <p className="text-gray-400">{item.subtext}</p>
                </div>
              ))}
            </div>

            {/* New Activities Section replacing Chart */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <ChartLine className="text-[#00B7FF]" />
                Activités par Mois
              </h3>
              <div className="space-y-4">
                {activitiesData.map((month, index) => (
                  <div
                    key={index}
                    className="bg-gray-700/30 rounded-lg p-4 hover:bg-gray-700/40 transition-all"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium">
                        {month.mois}
                      </span>
                      <div className="flex gap-4">
                        <span className="text-[#00B7FF]">
                          {month.traites} traités
                        </span>
                        <span className="text-orange-400">
                          {month.enAttente} en attente
                        </span>
                      </div>
                    </div>
                    <div className="relative h-2 bg-gray-600 rounded-full overflow-hidden">
                      <div
                        className="absolute left-0 top-0 h-full bg-[#00B7FF] rounded-full"
                        style={{
                          width: `${
                            (month.traites /
                              (month.traites + month.enAttente)) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#00B7FF]"></div>
                    <span className="text-gray-300">Dossiers traités</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                    <span className="text-gray-300">
                      En attente de traitement
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
