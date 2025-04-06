import { useState, useEffect } from "react";
import { FileText, BarChart, PieChart, FileSpreadsheet, Bell, ChevronRight, Archive, RefreshCw, Settings } from "lucide-react";
import SideBar_ui from "../components_UI/Sidebar_UI";
import TopBar_ui from "../components_UI/Top_bar_UI";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

const Reports_agents = () => {
  const serviceId = localStorage.getItem("serviceId");
  const [reportData, setReportData] = useState({
    totalReports: 0,
    recentReports: [],
    reportTypes: {},
    optimizationCount: 0,
  });

  const fetchReports = async () => {
    try {
      const [totalReportsRes, recentReportsRes, reportTypesRes, optimizationRes] =
        await Promise.all([
          axios.get(`http://localhost:3000/reports/service/${serviceId}/total`),
          axios.get(`http://localhost:3000/reports/service/${serviceId}/recent`),
          axios.get(`http://localhost:3000/reports/service/${serviceId}/types`),
          axios.get(`http://localhost:3000/reports/service/${serviceId}/optimizations`),
        ]);

      setReportData({
        totalReports: totalReportsRes.data.total || 0,
        recentReports: recentReportsRes.data || [],
        reportTypes: reportTypesRes.data || {},
        optimizationCount: optimizationRes.data.count || 0,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des rapports:", error);
    }
  };

  useEffect(() => {
    fetchReports();
    const interval = setInterval(() => {
      fetchReports();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const pieData = {
    labels: Object.keys(reportData.reportTypes),
    datasets: [
      {
        data: Object.values(reportData.reportTypes),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"],
      },
    ],
  };

  return (
    <div className="flex min-h-screen bg-gray-300">
      <SideBar_ui isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar_ui position="fixed" title="Rapports" />
        
        <div className="container w-full mx-auto px-4 py-8 mt-20">
          <div className="bg-gray-800 w-full rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <FileText className="h-8 w-8 text-[#00B7FF] mr-2" />
                Rapports du Service
              </h1>
              <div className="relative">
                <button className="bg-white hover:bg-gray-700 text-black hover:text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200">
                  <Bell className="h-5 w-5 mr-2" />
                  Optimisations
                  {reportData.optimizationCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      {reportData.optimizationCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-[#3a3a3a] rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="bg-[#2a2a2a] hover:bg-[#404040] p-4 rounded-lg flex items-center justify-between transition-colors duration-200">
                  <div className="flex items-center">
                    <Archive className="h-6 w-6 text-[#00B7FF] mr-2" />
                    <span className="text-white">Optimiser le stockage</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>

                <button className="bg-[#2a2a2a] hover:bg-[#404040] p-4 rounded-lg flex items-center justify-between transition-colors duration-200">
                  <div className="flex items-center">
                    <RefreshCw className="h-6 w-6 text-[#00B7FF] mr-2" />
                    <span className="text-white">Mettre à jour les données</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>

                <button className="bg-[#2a2a2a] hover:bg-[#404040] p-4 rounded-lg flex items-center justify-between transition-colors duration-200">
                  <div className="flex items-center">
                    <Settings className="h-6 w-6 text-[#00B7FF] mr-2" />
                    <span className="text-white">Paramètres avancés</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#2a2a2a] rounded-lg p-6 border border-[#4a4a4a]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">Total Rapports</h3>
                  <FileSpreadsheet className="h-8 w-8 text-[#00B7FF]" />
                </div>
                <p className="text-4xl font-bold text-[#00B7FF]">{reportData.totalReports}</p>
              </div>

              <div className="bg-[#2a2a2a] rounded-lg p-6 border border-[#4a4a4a]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">Types de Rapports</h3>
                  <PieChart className="h-8 w-8 text-[#00B7FF]" />
                </div>
                <Pie data={pieData} />
              </div>

              <div className="bg-[#2a2a2a] rounded-lg p-6 border border-[#4a4a4a]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">Analyses</h3>
                  <BarChart className="h-8 w-8 text-[#00B7FF]" />
                </div>
                <p className="text-gray-400">Graphiques analytiques à venir</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports_agents;
