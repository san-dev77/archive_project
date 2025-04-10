import { useState, useEffect, useRef } from "react";
import {
  BarChart3,
  Database,
  Calendar,
  FileText,
  Users,
  AlertTriangle,
  ArrowUpDown,
  Clock,
  Server,
  Activity,
  Download,
  FileDown,
  RefreshCw,
  ChevronDown,
} from "lucide-react";

import axios from "axios";
import SideBar from "../Components/Side_bar";
import TopBar from "../Components/Top_bar";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Repports = () => {
  const [systemStats, setSystemStats] = useState({
    databaseSize: "0 MB",
    agenceDatabaseSize: "0 MB",
    documentsLastMonth: { current: 0, previous: 0 },
    documentsLastWeek: { current: 0, previous: 0 },
    topDocumentTypes: [],
    documentViews: { current: 0, previous: 0, last3Months: 0 },
    agentsByService: [],
    whitespaceIssues: [],
    duplicateIssues: [],
  });

  const [generalStats, setGeneralStats] = useState({
    totalServices: 0,
    totalActiveServices: 0,
    totalServicesNoDocType: 0,
    totalDirectories: 0,
    totalDirectoriesWithoutServices: 0,
    totalDocumentTypes: 0,
    totalPieces: 0,
    totalDocuments: 0,
    totalConnexions: 0,
  });

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showIssues, setShowIssues] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const reportRef = useRef(null);

  const fetchSystemStats = async () => {
    try {
      const [
        databaseSizeRes,
        agenceDatabaseSizeRes,
        documentsLastMonthRes,
        documentsLastWeekRes,
        topDocumentTypesRes,
        documentViewsRes,
        agentsByServiceRes,
        whitespaceRes,
        duplicatesRes,
      ] = await Promise.all([
        axios.get("http://localhost:3000/stats/database-size"),
        axios.get("http://localhost:3000/stats/agence-database-size"),
        axios.get("http://localhost:3000/stats/documents-last-month"),
        axios.get("http://localhost:3000/stats/documents-last-week"),
        axios.get("http://localhost:3000/stats/top-document-types"),
        axios.get("http://localhost:3000/stats/document-views-by-month"),
        axios.get("http://localhost:3000/stats/agents-count-by-service"),
        axios.get("http://localhost:3000/stats/check-whitespace"),
        axios.get("http://localhost:3000/stats/check-duplicates"),
      ]);
      console.log(documentsLastMonthRes);

      // Traitement des données pour documentsLastMonth
      const currentMonthDoc =
        documentsLastMonthRes.data.documents?.[0]?.total || 0;
      const previousMonthDoc =
        documentsLastMonthRes.data.documents?.[1]?.total || 0;

      // Traitement des données pour documentsLastWeek
      const currentWeekDoc =
        documentsLastWeekRes.data.documents?.[0]?.total || 0;
      const previousWeekDoc =
        documentsLastWeekRes.data.documents?.[1]?.total || 0;

      // Traitement des données pour les vues de documents
      // Calculer le total des vues pour le mois en cours, le mois précédent et les 3 derniers mois
      let currentMonthViews = 0;
      let previousMonthViews = 0;
      let last3MonthsViews = 0;

      if (documentViewsRes.data && documentViewsRes.data.views) {
        documentViewsRes.data.views.forEach((view) => {
          currentMonthViews += parseInt(view.vues_ce_mois || 0);
          previousMonthViews += parseInt(view.vues_mois_dernier || 0);
          last3MonthsViews += parseInt(view.vues_3_derniers_mois || 0);
        });
      }

      setSystemStats({
        databaseSize: databaseSizeRes.data.size || "0 MB",
        agenceDatabaseSize: agenceDatabaseSizeRes.data.size || "0 MB",
        documentsLastMonth: {
          current: currentMonthDoc,
          previous: previousMonthDoc,
        },
        documentsLastWeek: {
          current: currentWeekDoc,
          previous: previousWeekDoc,
        },
        topDocumentTypes: topDocumentTypesRes.data.topTypes || [],
        documentViews: {
          current: currentMonthViews,
          previous: previousMonthViews,
          last3Months: last3MonthsViews,
        },
        agentsByService: agentsByServiceRes.data.agentCounts || [],
        whitespaceIssues: whitespaceRes.data.whitespaceResults || [],
        duplicateIssues: duplicatesRes.data.duplicateResults || [],
      });
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des statistiques système:",
        error
      );
    }
  };

  const fetchGeneralStats = async () => {
    try {
      const [
        totalServicesRes,
        totalActiveServicesRes,
        totalServicesNoDocTypeRes,
        totalDirectoriesRes,
        totalDirectoriesWithoutServicesRes,
        totalDocumentTypesRes,
        totalPiecesRes,
        totalDocumentsRes,
        totalConnexionsRes,
      ] = await Promise.all([
        axios.get("http://localhost:3000/stats/total-services"),
        axios.get("http://localhost:3000/stats/total-servicesActif"),
        axios.get("http://localhost:3000/stats/total-servicesNoDocType"),
        axios.get("http://localhost:3000/stats/total-directories"),
        axios.get(
          "http://localhost:3000/stats/total-directories-without-services"
        ),
        axios.get("http://localhost:3000/stats/total-document-types"),
        axios.get("http://localhost:3000/stats/total-pieces"),
        axios.get("http://localhost:3000/stats/total-documents"),
        axios.get("http://localhost:3000/stats/total-connexions"),
      ]);

      // Extraire correctement le nombre total de connexions
      const connexionsTotal =
        totalConnexionsRes.data.total &&
        totalConnexionsRes.data.total[0] &&
        totalConnexionsRes.data.total[0].total_connections
          ? totalConnexionsRes.data.total[0].total_connections
          : 0;

      console.log();

      setGeneralStats({
        totalServices: totalServicesRes.data.total || 0,
        totalActiveServices: totalActiveServicesRes.data.total || 0,
        totalServicesNoDocType: totalServicesNoDocTypeRes.data.total || 0,
        totalDirectories: totalDirectoriesRes.data.total || 0,
        totalDirectoriesWithoutServices:
          totalDirectoriesWithoutServicesRes.data.total || 0,
        totalDocumentTypes: totalDocumentTypesRes.data.total || 0,
        totalPieces: totalPiecesRes.data.total || 0,
        totalDocuments: totalDocumentsRes.data.total || 0,
        totalConnexions: connexionsTotal,
      });

      setLoading(false);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des statistiques générales:",
        error
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemStats();
    fetchGeneralStats();

    // Rafraîchir les données toutes les 30 secondes
    const interval = setInterval(() => {
      fetchSystemStats();
      fetchGeneralStats();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const calculatePercentChange = (current, previous) => {
    console.log("test", current, previous);

    if (previous === 0) return current > 0 ? 100 : 0;

    // Limiter les pourcentages extrêmes pour une meilleure lisibilité
    const percent = Math.round(((current - previous) / previous) * 100);

    // Si le pourcentage est inférieur à -100%, afficher -100%
    if (percent < -100) return -100;

    return percent;
  };

  const getPercentChangeColor = (percent) => {
    if (percent > 0) return "text-green-400";
    if (percent < 0) return "text-red-400";
    return "text-gray-400";
  };

  // Ajouter une fonction pour obtenir un texte explicatif du changement
  const getPercentChangeExplanation = (current, previous) => {
    if (previous === 0 && current > 0) return "Nouvelle activité";
    if (previous > 0 && current === 0) return "Aucune activité";
    if (previous === 0 && current === 0) return "Aucun changement";

    const percent = Math.round(((current - previous) / previous) * 100);

    if (percent <= -100) return "Baisse significative";
    if (percent <= -50) return "Forte diminution";
    if (percent <= -20) return "Diminution";
    if (percent < 0) return "Légère baisse";
    if (percent === 0) return "Stable";
    if (percent < 20) return "Légère hausse";
    if (percent < 50) return "Augmentation";
    if (percent < 100) return "Forte augmentation";
    return "Croissance significative";
  };

  // Fonction pour exporter en PDF
  const exportToPDF = async () => {
    setExportLoading(true);
    try {
      // Créer une copie du contenu pour l'exportation
      const contentElement = reportRef.current;
      const contentClone = contentElement.cloneNode(true);

      // Créer un conteneur temporaire avec un fond blanc
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.backgroundColor = "#1f1f1f";
      tempContainer.style.width = "1200px"; // Largeur fixe pour une meilleure qualité
      tempContainer.style.padding = "20px";
      tempContainer.appendChild(contentClone);
      document.body.appendChild(tempContainer);

      // Capturer l'image avec html2canvas
      const canvas = await html2canvas(tempContainer, {
        scale: 1,
        useCORS: true,
        logging: false,
        backgroundColor: "#1f1f1f",
      });

      // Nettoyer le DOM
      document.body.removeChild(tempContainer);

      // Créer le PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Calculer les dimensions pour ajuster l'image à la page A4
      const imgWidth = 210; // Largeur A4 en mm
      const pageHeight = 295; // Hauteur A4 en mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Ajouter l'image au PDF
      let heightLeft = imgHeight;
      let position = 0;

      // Première page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Pages supplémentaires si nécessaire
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Enregistrer le PDF
      pdf.save("rapport-systeme-archivage.pdf");
    } catch (error) {
      console.error("Erreur lors de l'exportation en PDF:", error);
      alert(
        "Une erreur est survenue lors de la génération du PDF. Veuillez réessayer."
      );
    }
    setExportLoading(false);
  };

  // Fonction pour exporter en HTML
  const exportToHTML = () => {
    setExportLoading(true);
    try {
      const content = reportRef.current.innerHTML;
      const styles = Array.from(document.styleSheets)
        .map((sheet) => {
          try {
            return Array.from(sheet.cssRules)
              .map((rule) => rule.cssText)
              .join("\n");
          } catch (e) {
            return "";
          }
        })
        .join("\n");

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Rapport Système d'Archivage</title>
          <style>${styles}</style>
        </head>
        <body style="background-color: #1f1f1f; color: white;">
          ${content}
        </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "rapport-systeme-archivage.html";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors de l'exportation en HTML:", error);
    }
    setExportLoading(false);
  };

  // Fonction pour rafraîchir manuellement les données
  const refreshData = () => {
    setLoading(true);
    fetchGeneralStats();
    fetchSystemStats();
    setLastRefresh(new Date());
  };

  const renderOverviewTab = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="p-4 bg-gradient-to-r from-green-600 to-emerald-700 rounded-lg border-l-4 border-emerald-400 mb-6">
        <h2 className="text-xl font-bold text-white">
          Vue d&apos;ensemble du système
        </h2>
        <p className="text-green-100 mt-1">
          Ce tableau de bord présente les statistiques clés et les indicateurs
          de performance du système d&apos;archivage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500 hover:translate-y-[-5px] transition-all duration-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold text-green-700">
                Taille Base de Données
              </p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">
                {typeof systemStats.databaseSize === "object" &&
                systemStats.databaseSize[0]
                  ? `${systemStats.databaseSize[0].size_mb} MB`
                  : systemStats.databaseSize}
              </h3>
              <p className="text-sm text-gray-500 mt-2">Espace total utilisé</p>
            </div>
            <div className="bg-green-100 p-4 rounded-full">
              <Database className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500 hover:translate-y-[-5px] transition-all duration-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold text-blue-700">
                Documents (Mois)
              </p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">
                {systemStats.documentsLastMonth.current}
              </h3>
              <p className="text-sm mt-2">
                <span
                  className={getPercentChangeColor(
                    calculatePercentChange(
                      systemStats.documentsLastMonth.current,
                      systemStats.documentsLastMonth.previous
                    )
                  )}
                >
                  {calculatePercentChange(
                    systemStats.documentsLastMonth.current,
                    systemStats.documentsLastMonth.previous
                  )}
                  %
                </span>
                <span className="text-gray-500"> vs mois précédent</span>
                <span className="block text-xs text-green-600 w-full font-bold mt-1">
                  {getPercentChangeExplanation(
                    systemStats.documentsLastMonth.current,
                    systemStats.documentsLastMonth.previous
                  )}
                </span>
              </p>
            </div>
            <div className="bg-blue-100 p-4 rounded-full">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-yellow-500 hover:translate-y-[-5px] transition-all duration-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold text-yellow-700">
                Documents (Semaine)
              </p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">
                {systemStats.documentsLastWeek.current}
              </h3>
              <p className="text-sm mt-2">
                <span
                  className={getPercentChangeColor(
                    calculatePercentChange(
                      systemStats.documentsLastWeek.current,
                      systemStats.documentsLastWeek.previous
                    )
                  )}
                >
                  {calculatePercentChange(
                    systemStats.documentsLastWeek.current,
                    systemStats.documentsLastWeek.previous
                  )}
                  %
                </span>
                <span className="text-gray-500"> vs semaine précédente</span>
                <span className="block text-xs text-green-600 w-full font-bold mt-1">
                  {getPercentChangeExplanation(
                    systemStats.documentsLastWeek.current,
                    systemStats.documentsLastWeek.previous
                  )}
                </span>
              </p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-full">
              <FileText className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-red-500 hover:translate-y-[-5px] transition-all duration-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold text-red-700">
                Consultations
              </p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">
                {systemStats.documentViews.current}
              </h3>
              <p className="text-sm mt-2">
                {systemStats.documentViews.previous === 0 &&
                systemStats.documentViews.current === 0 ? (
                  <span className="text-gray-500">Aucune activité</span>
                ) : (
                  <>
                    <span
                      className={getPercentChangeColor(
                        calculatePercentChange(
                          systemStats.documentViews.current,
                          systemStats.documentViews.previous
                        )
                      )}
                    >
                      {calculatePercentChange(
                        systemStats.documentViews.current,
                        systemStats.documentViews.previous
                      )}
                      %
                    </span>
                    <span className="text-gray-500"> vs mois précédent</span>
                  </>
                )}
                <span className="block text-xs text-green-600 w-full font-bold mt-1">
                  {getPercentChangeExplanation(
                    systemStats.documentViews.current,
                    systemStats.documentViews.previous
                  )}
                </span>
              </p>
            </div>
            <div className="bg-red-100 p-4 rounded-full">
              <Activity className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
        <h3 className="text-xl font-semibold text-green-700 mb-4 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
          Problèmes Potentiels
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-2 rounded-full mr-3">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
              </div>
              <span className="text-gray-800">
                Services sans types de documents
              </span>
            </div>
            <span className="text-xl font-bold text-yellow-400">
              {generalStats.totalServicesNoDocType}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-2 rounded-full mr-3">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
              </div>
              <span className="text-gray-800">Répertoires sans services</span>
            </div>
            <span className="text-xl font-bold text-yellow-400">
              {generalStats.totalDirectoriesWithoutServices}
            </span>
          </div>

          <button
            onClick={() => setShowIssues(!showIssues)}
            className="mt-2 text-green-700 hover:underline flex items-center"
          >
            {showIssues ? "Masquer" : "Afficher"} les problèmes de données
            <ArrowUpDown className="h-4 w-4 ml-1" />
          </button>

          {showIssues && (
            <div className="mt-4 space-y-4">
              <div className="bg-yellow-100 rounded-lg p-4">
                <h4 className="text-gray-800 font-medium mb-2">
                  Problèmes d&apos;espaces blancs (
                  {systemStats.whitespaceIssues.length})
                </h4>
                {systemStats.whitespaceIssues.length > 0 ? (
                  <div className="max-h-40 overflow-y-auto">
                    {systemStats.whitespaceIssues.map((issue, index) => (
                      <div key={index} className="text-sm text-gray-500 mb-1">
                        {issue.table}: {issue.whitespace_count} entrées
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-green-400">
                    Aucun problème détecté
                  </p>
                )}
              </div>

              <div className="bg-yellow-100 rounded-lg p-4">
                <h4 className="text-gray-800 font-medium mb-2">
                  Doublons détectés ({systemStats.duplicateIssues.length})
                </h4>
                {systemStats.duplicateIssues.length > 0 ? (
                  <div className="max-h-40 overflow-y-auto">
                    {systemStats.duplicateIssues.map((issue, index) => (
                      <div key={index} className="text-sm text-gray-500 mb-1">
                        {issue.table}: {issue.duplicate_count} doublons
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-green-400">
                    Aucun doublon détecté
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
          <h3 className="text-xl font-semibold text-green-700 mb-4">
            Types de Documents les Plus Utilisés
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {systemStats.topDocumentTypes.slice(0, 10).map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-green-100 p-3 rounded-lg"
              >
                <div>
                  <p className="text-gray-800 font-medium">
                    {item.document_type_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.service_name} - {item.directory_name}
                  </p>
                </div>
                <span className="text-green-700 font-bold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
          <h3 className="text-xl font-semibold text-green-700 mb-4">
            Agents par Service
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {systemStats.agentsByService.slice(0, 10).map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-green-100 p-3 rounded-lg"
              >
                <div>
                  <p className="text-gray-800 font-medium">
                    {item.service_name}
                  </p>
                  <p className="text-sm text-gray-500">{item.directory_name}</p>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-green-700 mr-2" />
                  <span className="text-green-700 font-bold">
                    {item.agent_count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemTab = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="p-4 bg-gradient-to-r from-green-600 to-emerald-700 rounded-lg border-l-4 border-emerald-400 mb-6">
        <h2 className="text-xl font-bold text-white">
          Informations techniques du système
        </h2>
        <p className="text-green-100 mt-1">
          Cette section présente les détails techniques et l&apos;état de santé
          de l&apos;infrastructure du système d&apos;archivage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold text-green-700">
                Base de Données Archive
              </p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">
                {typeof systemStats.databaseSize === "object" &&
                systemStats.databaseSize[0]
                  ? `${systemStats.databaseSize[0].size_mb} MB`
                  : systemStats.databaseSize}
              </h3>
              <p className="text-sm text-gray-500 mt-2">Taille totale</p>
            </div>
            <div className="bg-green-100 p-4 rounded-full">
              <Database className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Utilisation</span>
              <span>42%</span>
            </div>
            <div className="w-full bg-green-100 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                style={{ width: "42%" }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold text-green-700">
                Base Agence
              </p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">
                {console.log("test", systemStats.agenceDatabaseSize)}
                {typeof systemStats.agenceDatabaseSize === "object" &&
                systemStats.agenceDatabaseSize[0]
                  ? `${systemStats.agenceDatabaseSize[0].size_mb} MB`
                  : systemStats.agenceDatabaseSize}
              </h3>
              <p className="text-sm text-gray-500 mt-2">Taille totale</p>
            </div>
            <div className="bg-green-100 p-4 rounded-full">
              <Server className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Utilisation</span>
              <span>28%</span>
            </div>
            <div className="w-full bg-green-100 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                style={{ width: "28%" }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold text-green-700">Connexions</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">
                {typeof generalStats.totalConnexions === "object"
                  ? generalStats.totalConnexions.total_connections || 0
                  : generalStats.totalConnexions}
              </h3>
              <p className="text-sm text-gray-500 mt-2">Total des connexions</p>
            </div>
            <div className="bg-green-100 p-4 rounded-full">
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="mt-4 flex items-center">
            <div className="bg-green-500/20 text-green-500 px-2 py-1 rounded text-xs font-medium flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
              +12% cette semaine
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
          <h3 className="text-xl font-semibold text-green-700 mb-4">
            Répartition des Services
          </h3>
          <div className="flex items-center justify-center h-64">
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 rounded-full border-8 border-green-100"></div>

              <div
                className="absolute inset-0 rounded-full border-8 border-transparent border-t-[#00B7FF] border-r-[#00B7FF] border-b-[#00B7FF]"
                style={{ transform: "rotate(45deg)" }}
              ></div>

              <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-800">
                    {generalStats.totalActiveServices}
                  </p>
                  <p className="text-xs text-gray-500">services actifs</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-600 mr-2"></div>
              <span className="text-sm text-gray-500">
                Services actifs ({generalStats.totalActiveServices})
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-100 mr-2"></div>
              <span className="text-sm text-gray-500">
                Services inactifs (
                {generalStats.totalServices - generalStats.totalActiveServices})
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
          <h3 className="text-xl font-semibold text-green-700 mb-4">
            Santé du Système
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-500">
                  Services sans types de documents
                </span>
                <span className="text-sm text-yellow-400 font-medium">
                  {generalStats.totalServicesNoDocType} /{" "}
                  {generalStats.totalServices}
                </span>
              </div>
              <div className="w-full bg-yellow-100 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400"
                  style={{
                    width: `${
                      (generalStats.totalServicesNoDocType /
                        generalStats.totalServices) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-500">
                  Directions sans services
                </span>
                <span className="text-sm text-yellow-400 font-medium">
                  {generalStats.totalDirectoriesWithoutServices} /{" "}
                  {generalStats.totalDirectories}
                </span>
              </div>
              <div className="w-full bg-yellow-100 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400"
                  style={{
                    width: `${
                      (generalStats.totalDirectoriesWithoutServices /
                        generalStats.totalDirectories) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-500">
                  Problèmes d&apos;espaces blancs
                </span>
                <span className="text-sm text-yellow-400 font-medium">
                  {systemStats.whitespaceIssues.length} tables
                </span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-500">
                  Problèmes de doublons
                </span>
                <span className="text-sm text-yellow-400 font-medium">
                  {systemStats.duplicateIssues.length} tables
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
        <h3 className="text-xl font-semibold text-green-700 mb-4">
          Structure du Système
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-green-100 p-4 rounded-lg">
            <p className="text-green-700 font-medium">Services</p>
            <p className="text-2xl font-bold text-green-800 mt-1">
              {generalStats.totalServices}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              dont {generalStats.totalActiveServices} actifs (
              {Math.round(
                (generalStats.totalActiveServices /
                  generalStats.totalServices) *
                  100
              )}
              %)
            </p>
          </div>

          <div className="bg-green-100 p-4 rounded-lg">
            <p className="text-green-700 font-medium">Directions</p>
            <p className="text-2xl font-bold text-green-800 mt-1">
              {generalStats.totalDirectories}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              dont {generalStats.totalDirectoriesWithoutServices} sans services
            </p>
          </div>

          <div className="bg-green-100 p-4 rounded-lg">
            <p className="text-green-700 font-medium">Types de Documents</p>
            <p className="text-2xl font-bold text-green-800 mt-1">
              {generalStats.totalDocumentTypes}
            </p>
          </div>

          <div className="bg-green-100 p-4 rounded-lg">
            <p className="text-green-700 font-medium">Pièces</p>
            <p className="text-2xl font-bold text-green-800 mt-1">
              {generalStats.totalPieces}
            </p>
          </div>

          <div className="bg-green-100 p-4 rounded-lg">
            <p className="text-green-700 font-medium">Documents</p>
            <p className="text-2xl font-bold text-green-800 mt-1">
              {generalStats.totalDocuments}
            </p>
          </div>

          <div className="bg-green-100 p-4 rounded-lg">
            <p className="text-green-700 font-medium">Ratio Documents/Pièces</p>
            <p className="text-2xl font-bold text-green-800 mt-1">
              {generalStats.totalPieces > 0
                ? (
                    generalStats.totalDocuments / generalStats.totalPieces
                  ).toFixed(2)
                : "0"}
            </p>
            <p className="text-sm text-gray-500 mt-1">documents par pièce</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <SideBar isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar position="fixed" title="Rapports Système" />
        <div className="container w-full mx-auto px-4 py-8 mt-20">
          <div className="bg-white w-full rounded-xl shadow-xl p-6 border border-green-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h1 className="text-2xl font-bold text-green-800 flex items-center">
                <BarChart3 className="h-8 w-8 text-green-600 mr-2" />
                Rapports Système d&apos;Archivage
              </h1>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={refreshData}
                  className="flex items-center justify-center px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors duration-200"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Rafraîchir
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowExportOptions(!showExportOptions)}
                    className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto"
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    Exporter le rapport
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </button>

                  {showExportOptions && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-green-100 overflow-hidden">
                      <button
                        onClick={exportToPDF}
                        disabled={exportLoading}
                        className="flex items-center w-full px-4 py-2 text-green-700 hover:bg-green-50 transition-colors duration-200"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Exporter en PDF
                      </button>
                      <button
                        onClick={exportToHTML}
                        disabled={exportLoading}
                        className="flex items-center w-full px-4 py-2 text-green-700 hover:bg-green-50 transition-colors duration-200"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Exporter en HTML
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-500 mb-4">
              Dernière mise à jour: {lastRefresh.toLocaleString()}
            </div>

            <div className="mb-6">
              <div className="flex space-x-2 border-b border-green-100">
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "overview"
                      ? "text-green-600 border-b-2 border-green-600"
                      : "text-gray-500 hover:text-green-700"
                  }`}
                  onClick={() => setActiveTab("overview")}
                >
                  Vue d&apos;ensemble
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "system"
                      ? "text-green-600 border-b-2 border-green-600"
                      : "text-gray-500 hover:text-green-700"
                  }`}
                  onClick={() => setActiveTab("system")}
                >
                  Système
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
                <p className="text-gray-500 mt-4">Chargement des données...</p>
              </div>
            ) : (
              <div ref={reportRef}>
                {activeTab === "overview" && renderOverviewTab()}
                {activeTab === "system" && renderSystemTab()}
              </div>
            )}
          </div>

          {/* Indicateur de chargement pendant l'exportation */}
          {exportLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                <div className="flex justify-center mb-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
                </div>
                <p className="text-center text-gray-700">
                  Génération du rapport en cours...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Amélioration du style des onglets
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }
`;

// Injecter les styles dans le document
const styleElement = document.createElement("style");
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);

export default Repports;
