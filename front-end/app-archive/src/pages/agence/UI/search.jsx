import { useState, useEffect } from "react";
import Select from "react-select";
import { CircleHelp, FolderX, Upload } from "lucide-react";
import TopBar from "../../../Components/Top_bar";
import Loader_component from "../../../Components/Loader";
import { DataGrid } from "@mui/x-data-grid";
import SideBar_agence from "../../../Components/Sidebar_agence";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const Search_agence = () => {
  const [selectedDocType, setSelectedDocType] = useState(null);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [recordCount, setRecordCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    codeCaisse: null,
    caissier: null,
    agence: null,
    year: null,
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAttachedFiles, setNewAttachedFiles] = useState([]);
  const [isFilesModalOpen, setIsFilesModalOpen] = useState(false);
  const [originalData, setOriginalData] = useState([]);
  const [currentFiles, setCurrentFiles] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);

  // Charger les types de documents au montage du composant
  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/agence/document-type"
        );
        const data = await response.json();
        // Transformer les données pour le format react-select
        const options = data.map((type) => ({
          value: type.id,
          label: type.nom_document_type.trim(),
        }));
        setDocumentTypes(options);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des types de documents:",
          error
        );
      }
    };

    fetchDocumentTypes();
  }, []);

  // Nouvelle fonction pour récupérer les fichiers joints
  const fetchAttachedFiles = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/agence/dossiers/caisse/files"
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des fichiers:", error);
      return [];
    }
  };

  // Utiliser useEffect pour surveiller les changements de newAttachedFiles
  // useEffect(() => {}, [newAttachedFiles]);

  const fetchMetadata = async (documentType) => {
    try {
      const response = await fetch(
        `http://localhost:3000/agence/metadata/nom-type/${documentType}`
      );
      const metadata = await response.json();
      console.log(metadata);
      // Définir les colonnes basées sur la structure de données
      const gridColumns = [
        {
          field: "code_caisse_nom",
          headerName: "Code Caisse",
          flex: 1,
          minWidth: 80,
        },
        {
          field: "code_definitif",
          headerName: "Code Définitif",
          flex: 1,
          minWidth: 90,
        },
        { field: "dates", headerName: "Date", flex: 1, minWidth: 120 },
        { field: "nom_agence", headerName: "Agence", flex: 1, minWidth: 200 },

        {
          field: "nom_prenom_caissier",
          headerName: "Caissier",
          flex: 1,
          minWidth: 200,
        },
        {
          field: "files",
          headerName: "Fichiers Joints",
          flex: 1,
          minWidth: 150,
          renderCell: (params) => {
            return (
              <button
                onClick={() => handleViewFiles(params.row.id)}
                className="btn rounded-lg mt-1 bg-gray-100 text-black hover:bg-gray-700 hover:text-white px-3 py-1"
              >
                <Upload />({params.row.attachedFiles?.length || 0})
              </button>
            );
          },
        },
      ];
      setColumns(gridColumns);
    } catch (error) {
      console.error("Erreur lors de la récupération des métadonnées:", error);
    }
  };

  const handleDocTypeChange = async (selectedOption) => {
    console.log("🔄 Début handleDocTypeChange");
    setSelectedDocType(selectedOption);
    setLoading(true);

    try {
      await fetchMetadata(selectedOption.value);
      const filesData = await fetchAttachedFiles();
      // console.log("📂 Fichiers dans handleDocTypeChange:", filesData);

      let response;
      switch (selectedOption.label) {
        case "journée de caisse":
          response = await fetch(
            "http://localhost:3000/agence/dossiers/transaction-caisse"
          );
          break;
        case "journée de guichet":
          response = await fetch(
            "http://localhost:3000/agence/dossiers/transaction-caisse"
          );
          break;
        case 3:
          response = await fetch(
            "http://localhost:3000/agence/dossiers/transaction-caisse"
          );
          break;
        default:
          response = await fetch(
            "http://localhost:3000/agence/dossiers/transaction-caisse"
          );
      }

      const data = await response.json();

      // console.log("📊 Données avant transformation:", data);
      const rowsWithIds = data.map((row) => ({
        id: row.id,
        ...row,
        attachedFiles: filesData,
      }));
      console.log("📊 Données après transformation:", rowsWithIds);

      setOriginalData(rowsWithIds);
      setGridData(rowsWithIds);
      setRecordCount(data.length);
      setNewAttachedFiles(filesData);
    } catch (error) {
      console.error("❌ Erreur handleDocTypeChange:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewFiles = async () => {
    try {
      const files = await fetchAttachedFiles();
      setCurrentFiles(files);
      setIsFilesModalOpen(true);
    } catch (error) {
      console.error("Erreur lors de l'affichage des fichiers:", error);
    }
  };

  // Modifier la fonction fetchFilterData pour accepter des paramètres dynamiques
  const fetchFilterData = async (endpoint, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    const response = await fetch(url);

    return response.json();
  };

  // Appels API pour les filtres
  const [codeCaisseOptions, setCodeCaisseOptions] = useState([]);
  const [caissierOptions, setCaissierOptions] = useState([]);
  const [agenceOptions, setAgenceOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const codes = await fetchFilterData(
        "http://localhost:3000/caisse/unique-codes"
      );
      const caissiers = await fetchFilterData(
        "http://localhost:3000/agence/dossiers/caissiers"
      );
      const agences = await fetchFilterData("http://localhost:3000/agences");

      setCodeCaisseOptions(
        codes.map((code) => ({ value: code.id, label: code.code_caisse }))
      );
      setCaissierOptions(
        caissiers.map((caissier) => ({
          value: caissier.id,
          label: caissier.nom_prenom_caissier,
        }))
      );
      setAgenceOptions(
        agences.map((agence) => ({
          value: agence.id,
          label: agence.nom_agence,
        }))
      );
    };

    fetchData();
  }, []);

  // Ajouter la fonction pour récupérer les années
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/dates_caisse");
        const years = await response.json();

        // Transformer les années pour le format react-select
        const yearOptions = years.annees.map((year) => ({
          value: year.annee, // Accéder à la propriété 'annee'
          label: year.annee.toString(), // Convertir en chaîne
        }));

        setYearOptions(yearOptions);
      } catch (error) {
        console.error("Erreur lors de la récupération des années:", error);
      }
    };

    fetchYears();
  }, []);

  // Modifier le gestionnaire de changement d'agence
  const handleFilterChange = async (filterType, selectedOption) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev, [filterType]: selectedOption };

      // Si on change d'agence, mettre à jour la liste des caissiers et des caisses
      if (filterType === "agence" && selectedOption) {
        // Réinitialiser le caissier et la caisse sélectionnés
        newFilters.caissier = null;
        newFilters.codeCaisse = null;

        // Charger les nouveaux caissiers pour cette agence
        fetchFilterData(
          `http://localhost:3000/api/caissiers/agence/${selectedOption.value}`
        ).then((caissiers) => {
          setCaissierOptions(
            caissiers.caissiers.map((caissier) => ({
              value: caissier.id,
              label: caissier.nom_prenom_caissier,
            }))
          );
        });

        // Charger les nouvelles caisses pour cette agence
        fetchFilterData(
          `http://localhost:3000/api/caisses/agence/${selectedOption.value}`
        ).then((caisses) => {
          setCodeCaisseOptions(
            caisses.caisses.map((caisse) => ({
              value: caisse.id,
              label: caisse.code_caisse,
            }))
          );
        });
      }

      // Commencer avec les données originales
      let filteredData = [...originalData];

      // Appliquer tous les filtres actifs
      Object.entries(newFilters).forEach(([key, filter]) => {
        if (filter) {
          switch (key) {
            case "codeCaisse":
              filteredData = filteredData.filter(
                (row) => row.code_caisse_nom === filter.label
              );
              break;
            case "caissier":
              filteredData = filteredData.filter(
                (row) => row.nom_prenom_caissier === filter.label
              );
              break;
            case "agence":
              filteredData = filteredData.filter(
                (row) => row.nom_agence === filter.label
              );
              break;
            case "year":
              filteredData = filteredData.filter((row) => {
                const rowDate = new Date(row.dates);
                const rowYear = rowDate.getFullYear();
                const filterYear = parseInt(filter.label);

                // Ajouter des logs pour déboguer

                return rowYear === filterYear;
              });
              break;
          }
        }
      });

      // Mettre à jour le compteur et les données filtrées
      setRecordCount(filteredData.length);
      setGridData(filteredData);

      return newFilters;
    });
  };

  // Modifier handleDateFilter pour mettre à jour le compteur
  const handleDateFilter = () => {
    if (startDate && endDate) {
      let filteredData = [...originalData];

      // Appliquer d'abord les filtres de sélection
      Object.entries(selectedFilters).forEach(([key, filter]) => {
        if (filter) {
          switch (key) {
            case "codeCaisse":
              filteredData = filteredData.filter(
                (row) => row.code_caisse_nom === filter.label
              );
              break;
            case "caissier":
              filteredData = filteredData.filter(
                (row) => row.nom_prenom_caissier === filter.label
              );
              break;
            case "agence":
              filteredData = filteredData.filter(
                (row) => row.nom_agence === filter.label
              );
              break;
          }
        }
      });

      // Puis appliquer le filtre de date
      filteredData = filteredData.filter((row) => {
        const rowDate = new Date(row.dates);
        return rowDate >= startDate && rowDate <= endDate;
      });

      // Mettre à jour le compteur avec le nombre de résultats filtrés
      setRecordCount(filteredData.length);
      setGridData(filteredData);
    }
    setIsModalOpen(false);
  };

  // Modifier resetFilters pour inclure la réinitialisation de l'année
  const resetFilters = () => {
    setSelectedFilters({
      codeCaisse: null,
      caissier: null,
      agence: null,
      year: null,
    });
    setStartDate(null);
    setEndDate(null);

    // Restaurer les données originales
    setGridData(originalData);
    setRecordCount(originalData.length);
  };

  useEffect(() => {}, [isModalOpen]);

  useEffect(() => {
    // Appliquer les filtres si nécessaire
    if (gridData.length > 0) {
      const filteredData = gridData.filter((row) => {
        const matchesCodeCaisse = selectedFilters.codeCaisse
          ? row.code_caisse_nom === selectedFilters.codeCaisse.label
          : true;
        const matchesCaissier = selectedFilters.caissier
          ? row.nom_prenom_caissier === selectedFilters.caissier.label
          : true;
        const matchesAgence = selectedFilters.agence
          ? row.nom_agence === selectedFilters.agence.label
          : true;

        return matchesCodeCaisse && matchesCaissier && matchesAgence;
      });

      setGridData(
        filteredData.map((row) => ({
          ...row,
          attachedFiles: newAttachedFiles,
        }))
      );
    }
  }, [selectedFilters, newAttachedFiles]);

  useEffect(() => {
    if (startDate && endDate) {
      const filteredData = gridData
        .filter((row) => {
          const rowDate = new Date(row.dates);
          return rowDate >= startDate && rowDate <= endDate;
        })
        .map((row) => ({
          ...row,
          attachedFiles: newAttachedFiles,
        }));

      setGridData(filteredData);
    }
  }, [startDate, endDate, newAttachedFiles]);

  useEffect(() => {
    console.log("🔄 État global mis à jour:");
    console.log("📁 newAttachedFiles:", newAttachedFiles);
    console.log("📊 gridData:", gridData);
    console.log("🎯 selectedDocType:", selectedDocType);
    console.log("🔍 isFilesModalOpen:", isFilesModalOpen);
  }, [newAttachedFiles, gridData, selectedDocType, isFilesModalOpen]);

  const renderFilesModal = () => {
    if (!isFilesModalOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="modal-content bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-white font-semibold flex items-center">
              <Upload className="h-6 w-6 text-[#00B7FF] mr-2" />
              Fichiers joints
            </h2>
            <button
              onClick={() => setIsFilesModalOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="max-h-[70vh]  overflow-y-auto">
            {currentFiles && currentFiles.length > 0 ? (
              <ul className="space-y-4 w-full">
                {currentFiles.map((file, index) => (
                  <li
                    key={index}
                    className="p-4 w-full bg-[#3a3a3a] rounded-lg border border-gray-700"
                  >
                    <div className="flex items-center mb-3">
                      <span className="text-white font-medium">
                        {file.nom_piece}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {file.file_paths.map((path, pathIndex) => (
                        <div
                          key={pathIndex}
                          className="bg-[#2a2a2a] rounded-lg p-4"
                        >
                          <object
                            data={path}
                            type="application/pdf"
                            className="w-full h-[500px] rounded"
                          >
                            <div className="text-center p-4">
                              <p className="text-gray-400 mb-2">
                                Votre navigateur ne supporte pas
                                l&apos;affichage des PDF.
                              </p>
                              <a
                                href={path}
                                download
                                className="inline-flex items-center px-4 py-2 bg-[#00B7FF] text-white rounded-lg hover:bg-[#0096FF] transition-colors"
                              >
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                  />
                                </svg>
                                Télécharger le fichier
                              </a>
                            </div>
                          </object>
                        </div>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center py-8">
                <FolderX className="h-16 w-16 text-red-500 mb-4" />
                <p className="text-gray-400 text-center">
                  Aucun fichier disponible
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-300">
      <SideBar_agence isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <div className="container w-full mx-auto px-4 py-8 mt-20">
          <div className="bg-gray-800 w-full rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <CircleHelp className="h-8 w-8 text-[#00B7FF] mr-2" />
                Recherche de documents
              </h1>
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-white mb-1">
                    Type de document
                  </label>
                  <Select
                    options={documentTypes}
                    value={selectedDocType}
                    onChange={handleDocTypeChange}
                    placeholder="Sélectionnez un type de document"
                    className="text-sm"
                    isLoading={documentTypes.length === 0}
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: "#3a3a3a",
                        borderColor: "#4a4a4a",
                        color: "white",
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: "#3a3a3a",
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isFocused
                          ? "#4a4a4a"
                          : "#3a3a3a",
                        color: "white",
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: "white",
                      }),
                    }}
                  />
                </div>
              </div>
            </div>

            {selectedDocType && (
              <div className="bg-[#3a3a3a] rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      Code Caisse
                    </label>
                    <Select
                      options={codeCaisseOptions}
                      value={selectedFilters.codeCaisse}
                      onChange={(option) =>
                        handleFilterChange("codeCaisse", option)
                      }
                      placeholder="Sélectionnez un code caisse"
                      className="text-sm"
                      styles={{
                        control: (base) => ({
                          ...base,
                          backgroundColor: "#2a2a2a",
                          borderColor: "#4a4a4a",
                        }),
                        menu: (base) => ({
                          ...base,
                          backgroundColor: "#2a2a2a",
                        }),
                        option: (base, state) => ({
                          ...base,
                          backgroundColor: state.isFocused
                            ? "#4a4a4a"
                            : "#2a2a2a",
                          color: "white",
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: "white",
                        }),
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      Caissier
                    </label>
                    <Select
                      options={caissierOptions}
                      value={selectedFilters.caissier}
                      onChange={(option) =>
                        handleFilterChange("caissier", option)
                      }
                      placeholder="Sélectionnez un caissier"
                      className="text-sm"
                      styles={{
                        control: (base) => ({
                          ...base,
                          backgroundColor: "#2a2a2a",
                          borderColor: "#4a4a4a",
                        }),
                        menu: (base) => ({
                          ...base,
                          backgroundColor: "#2a2a2a",
                        }),
                        option: (base, state) => ({
                          ...base,
                          backgroundColor: state.isFocused
                            ? "#4a4a4a"
                            : "#2a2a2a",
                          color: "white",
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: "white",
                        }),
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      Agence
                    </label>
                    <Select
                      options={agenceOptions}
                      value={selectedFilters.agence}
                      onChange={(option) =>
                        handleFilterChange("agence", option)
                      }
                      placeholder="Sélectionnez une agence"
                      className="text-sm"
                      styles={{
                        control: (base) => ({
                          ...base,
                          backgroundColor: "#2a2a2a",
                          borderColor: "#4a4a4a",
                        }),
                        menu: (base) => ({
                          ...base,
                          backgroundColor: "#2a2a2a",
                        }),
                        option: (base, state) => ({
                          ...base,
                          backgroundColor: state.isFocused
                            ? "#4a4a4a"
                            : "#2a2a2a",
                          color: "white",
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: "white",
                        }),
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      Année
                    </label>
                    <Select
                      options={yearOptions}
                      value={selectedFilters.year}
                      onChange={(option) => handleFilterChange("year", option)}
                      placeholder="Sélectionnez une année"
                      className="text-sm"
                      styles={{
                        control: (base) => ({
                          ...base,
                          backgroundColor: "#2a2a2a",
                          borderColor: "#4a4a4a",
                        }),
                        menu: (base) => ({
                          ...base,
                          backgroundColor: "#2a2a2a",
                        }),
                        option: (base, state) => ({
                          ...base,
                          backgroundColor: state.isFocused
                            ? "#4a4a4a"
                            : "#2a2a2a",
                          color: "white",
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: "white",
                        }),
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4 space-x-4">
                  <button
                    onClick={resetFilters}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Réinitialiser les filtres
                  </button>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#00B7FF] hover:bg-[#0096FF] text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Filtrer par date
                  </button>
                </div>
              </div>
            )}

            {loading && <Loader_component />}

            {recordCount !== null && !loading && (
              <div className="bg-[#3a3a3a] rounded-lg p-4 mb-6">
                {recordCount > 0 ? (
                  <p className="text-xl text-white">
                    Nombre d&apos;enregistrements trouvés : {recordCount} lignes
                  </p>
                ) : (
                  <div className="flex flex-col items-center py-8">
                    <FolderX className="h-16 w-16 text-red-500 mb-4" />
                    <p className="text-xl text-white">
                      Aucun enregistrement trouvé
                    </p>
                  </div>
                )}
              </div>
            )}

            {gridData.length > 0 && columns.length > 0 && (
              <div className="bg-[#3a3a3a] rounded-lg p-4">
                <div style={{ height: 400, width: "100%" }}>
                  <DataGrid
                    rows={gridData}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    disableSelectionOnClick
                    sx={{
                      color: "white",
                      ".MuiDataGrid-cell": {
                        color: "white",
                      },
                      ".MuiDataGrid-columnHeaders": {
                        backgroundColor: "#2a2a2a",
                        color: "#111",
                      },
                      ".MuiDataGrid-virtualScroller": {
                        backgroundColor: "#2a2a2a",
                      },
                      ".MuiCheckbox-root": {
                        color: "white",
                      },
                      ".MuiTablePagination-root": {
                        color: "white",
                      },
                    }}
                  />
                </div>
              </div>
            )}

            {isModalOpen && (
              <>
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                  <div className="modal-content bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl text-black font-semibold mb-4">
                      Filtrer par date
                    </h2>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      placeholderText="Date de début"
                      className="border border-gray-300 text-black rounded p-2 mb-4 w-full"
                    />
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate}
                      placeholderText="Date de fin"
                      className="border text-black border-gray-300 rounded p-2 mb-4 w-full"
                    />
                    <div className="flex justify-between">
                      <button
                        onClick={handleDateFilter}
                        className="bg-gray-600 text-white p-2 rounded hover:bg-blue-600 transition"
                      >
                        Appliquer
                      </button>
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="bg-gray-600 text-white p-2 rounded hover:bg-red-600 transition"
                      >
                        Fermer
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
            {renderFilesModal()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search_agence;
